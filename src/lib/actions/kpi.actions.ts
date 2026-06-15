"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function getKPICategories() {
  return await prisma.kPICategory.findMany({
    include: { kpis: { include: { targets: true, history: { orderBy: { date: 'desc' }, take: 1 } } } }
  });
}

export async function createKPICategory(name: string, description?: string) {
  const session = await auth();
  if (!session?.user || session.user.role !== "SUPERADMIN") throw new Error("Unauthorized");
  
  const category = await prisma.kPICategory.create({ data: { name, description } });
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
      targets: { orderBy: { createdAt: 'desc' }, take: 1 },
      history: { orderBy: { date: 'desc' }, take: 12 }, // Last 12 entries for trend charts
      alerts: { where: { isResolved: false } },
    },
    orderBy: { createdAt: "desc" }
  });
}

export async function createKPI(data: { metricName: string; categoryId: string; departmentId?: string; unit?: string; description?: string }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "SUPERADMIN") throw new Error("Unauthorized");

  const kpi = await prisma.kPI.create({ data });
  revalidatePath("/dashboard/kpis");
  return kpi;
}

export async function updateKPIValue(kpiId: string, value: number, notes?: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  // Record history
  await prisma.kPIHistory.create({
    data: { kpiId, value, notes }
  });

  // Update current value
  const kpi = await prisma.kPI.update({
    where: { id: kpiId },
    data: { currentValue: value },
    include: { targets: { orderBy: { createdAt: 'desc' }, take: 1 } }
  });

  // Basic check for target achievement or alerts
  if (kpi.targets.length > 0) {
    const target = kpi.targets[0];
    if (value >= target.targetValue && !target.isAchieved) {
      await prisma.kPITarget.update({ where: { id: target.id }, data: { isAchieved: true } });
    } else if (value < target.targetValue * 0.8) { // if 20% below target
      await prisma.kPIAlert.create({
        data: {
          kpiId,
          severity: "HIGH",
          message: `KPI ${kpi.metricName} is significantly below target (${value} vs ${target.targetValue}).`
        }
      });
    }
  }

  revalidatePath("/dashboard/kpis");
  return kpi;
}

export async function setKPITarget(data: { kpiId: string; targetValue: number; deadline?: Date; period?: string }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "SUPERADMIN") throw new Error("Unauthorized");

  const target = await prisma.kPITarget.create({ data });
  revalidatePath("/dashboard/kpis");
  return target;
}

export async function resolveAlert(alertId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const alert = await prisma.kPIAlert.update({
    where: { id: alertId },
    data: { isResolved: true, resolvedAt: new Date() }
  });
  revalidatePath("/dashboard/kpis");
  return alert;
}
