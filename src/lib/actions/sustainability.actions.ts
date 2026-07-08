"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function seedSDGs() {
  const count = await prisma.sDG.count();
  if (count > 0) return;

  const sdgs = [
    { sdgNumber: 1, title: "No Poverty", color: "#e5243b" },
    { sdgNumber: 2, title: "Zero Hunger", color: "#dda63a" },
    { sdgNumber: 3, title: "Good Health and Well-being", color: "#4c9f38" },
    { sdgNumber: 4, title: "Quality Education", color: "#c5192d" },
    { sdgNumber: 5, title: "Gender Equality", color: "#ff3a21" },
    { sdgNumber: 6, title: "Clean Water and Sanitation", color: "#26bde2" },
    { sdgNumber: 7, title: "Affordable and Clean Energy", color: "#fcc30b" },
    { sdgNumber: 8, title: "Decent Work and Economic Growth", color: "#a21942" },
    { sdgNumber: 9, title: "Industry, Innovation and Infrastructure", color: "#fd6925" },
    { sdgNumber: 10, title: "Reduced Inequality", color: "#dd1367" },
    { sdgNumber: 11, title: "Sustainable Cities and Communities", color: "#fd9d24" },
    { sdgNumber: 12, title: "Responsible Consumption and Production", color: "#bf8b2e" },
    { sdgNumber: 13, title: "Climate Action", color: "#3f7e44" },
    { sdgNumber: 14, title: "Life Below Water", color: "#0a97d9" },
    { sdgNumber: 15, title: "Life on Land", color: "#56c02b" },
    { sdgNumber: 16, title: "Peace and Justice Strong Institutions", color: "#00689d" },
    { sdgNumber: 17, title: "Partnerships to achieve the Goal", color: "#19486a" },
  ];

  await prisma.sDG.createMany({ data: sdgs });
}

export async function getSustainabilityDashboardData() {
  await seedSDGs(); // ensure seeded

  const [projects, esgMetrics, carbonMetrics, reports, sdgs] = await Promise.all([
    prisma.sustainabilityProject.findMany({ include: { sdgs: true, manager: true } }),
    prisma.eSGMetric.findMany({ orderBy: { measuredAt: "desc" } }),
    prisma.carbonMetric.findMany({ orderBy: { measuredAt: "desc" } }),
    prisma.impactReport.findMany({ include: { author: true } }),
    prisma.sDG.findMany({ orderBy: { sdgNumber: "asc" } }),
  ]);

  return { projects, esgMetrics, carbonMetrics, reports, sdgs };
}

export async function createProject(data: {
  title: string;
  description: string;
  sdgIds: string[];
}) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const project = await prisma.sustainabilityProject.create({
    data: {
      title: data.title,
      description: data.description,
      managerId: session.user.id as string,
      sdgs: {
        connect: data.sdgIds.map((id) => ({ id })),
      },
    },
  });

  revalidatePath("/dashboard/sustainability");
  return project;
}

export async function logESGMetric(data: {
  category: string;
  name: string;
  value: number;
  unit: string;
}) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const metric = await prisma.eSGMetric.create({
    data: {
      ...data,
      recordedById: session.user.id as string,
    },
  });

  revalidatePath("/dashboard/sustainability");
  return metric;
}

export async function logCarbonMetric(data: { scope: string; source: string; emissions: number }) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const metric = await prisma.carbonMetric.create({
    data: {
      ...data,
      recordedById: session.user.id as string,
    },
  });

  revalidatePath("/dashboard/sustainability");
  return metric;
}
