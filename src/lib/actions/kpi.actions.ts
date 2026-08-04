"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
});

const createKPISchema = z.object({
  metricName: z.string().min(1, "Metric name is required"),
  categoryId: z.string().min(1, "Category ID is required"),
  departmentId: z.string().optional(),
  unit: z.string().optional(),
  description: z.string().optional(),
});

const updateKPIValueSchema = z.object({
  kpiId: z.string().min(1, "KPI ID is required"),
  value: z.number(),
  notes: z.string().optional(),
});

const setKPITargetSchema = z.object({
  kpiId: z.string().min(1, "KPI ID is required"),
  targetValue: z.number(),
  deadline: z.date().optional(),
  period: z.string().optional(),
});

export async function getKPICategories() {
  return await prisma.kPICategory.findMany({
    include: {
      kpis: { include: { targets: true, history: { orderBy: { date: "desc" }, take: 1 } } },
    },
  });
}

export async function createKPICategory(name: string, description?: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "SUPERADMIN") throw new Error("Unauthorized");

  const parsed = createCategorySchema.parse({ name, description });

  const category = await prisma.kPICategory.create({ data: parsed });
  revalidatePath("/dashboard/kpis");
  return category;
}

export async function getDashboardKPIs(departmentId?: string) {
  const where = departmentId ? { departmentId } : {};
  return await prisma.kPI.findMany({
    where,
    include: {
      category: true,
      department: true,
      targets: { orderBy: { createdAt: "desc" }, take: 1 },
      history: { orderBy: { date: "desc" }, take: 12 },
      alerts: { where: { isResolved: false } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createKPI(data: {
  metricName: string;
  categoryId: string;
  departmentId?: string;
  unit?: string;
  description?: string;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "SUPERADMIN") throw new Error("Unauthorized");

  const parsed = createKPISchema.parse(data);

  const kpi = await prisma.kPI.create({ data: parsed });
  revalidatePath("/dashboard/kpis");
  return kpi;
}

export async function updateKPIValue(kpiId: string, value: number, notes?: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const parsed = updateKPIValueSchema.parse({ kpiId, value, notes });

  // Record history
  await prisma.kPIHistory.create({
    data: parsed,
  });

  // Update current value
  const kpi = await prisma.kPI.update({
    where: { id: parsed.kpiId },
    data: { currentValue: parsed.value },
    include: { targets: { orderBy: { createdAt: "desc" }, take: 1 } },
  });

  // Basic check for target achievement or alerts
  if (kpi.targets.length > 0) {
    const target = kpi.targets[0];
    if (parsed.value >= target.targetValue && !target.isAchieved) {
      await prisma.kPITarget.update({ where: { id: target.id }, data: { isAchieved: true } });
    } else if (parsed.value < target.targetValue * 0.8) {
      // if 20% below target
      await prisma.kPIAlert.create({
        data: {
          kpiId: parsed.kpiId,
          severity: "HIGH",
          message: `KPI ${kpi.metricName} is significantly below target (${parsed.value} vs ${target.targetValue}).`,
        },
      });
    }
  }

  revalidatePath("/dashboard/kpis");
  return kpi;
}

export async function setKPITarget(data: {
  kpiId: string;
  targetValue: number;
  deadline?: Date;
  period?: string;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "SUPERADMIN") throw new Error("Unauthorized");

  const parsed = setKPITargetSchema.parse(data);

  const target = await prisma.kPITarget.create({ data: parsed as any });
  revalidatePath("/dashboard/kpis");
  return target;
}

export async function resolveAlert(alertId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const alert = await prisma.kPIAlert.update({
    where: { id: alertId },
    data: { isResolved: true, resolvedAt: new Date() },
  });
  revalidatePath("/dashboard/kpis");
  return alert;
}
