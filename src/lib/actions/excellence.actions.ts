"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function getFrameworks() {
  return await prisma.excellenceFramework.findMany({
    include: {
      dimensions: true,
      maturityLevels: true,
    },
  });
}

export async function createFramework(data: { name: string; description?: string; version?: string }) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  if (session.user.role !== "SUPERADMIN") throw new Error("Forbidden");

  const framework = await prisma.excellenceFramework.create({
    data,
  });
  revalidatePath("/dashboard/excellence/frameworks");
  return framework;
}

export async function getAssessmentTemplates() {
  return await prisma.assessmentTemplate.findMany({
    include: {
      framework: true,
      questions: {
        include: {
          dimension: true,
        },
      },
    },
  });
}

export async function createAssessmentTemplate(data: { name: string; description?: string; frameworkId: string }) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  if (session.user.role !== "SUPERADMIN") throw new Error("Forbidden");

  const template = await prisma.assessmentTemplate.create({
    data,
  });
  revalidatePath("/dashboard/excellence/frameworks");
  return template;
}

export async function submitAssessment(resultId: string, responses: { questionId: string; numericValue?: number; textValue?: string; notes?: string }[]) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const result = await prisma.assessmentResult.update({
    where: { id: resultId },
    data: {
      status: "SUBMITTED",
      responses: {
        create: responses.map((r) => ({
          questionId: r.questionId,
          numericValue: r.numericValue,
          textValue: r.textValue,
          notes: r.notes,
        })),
      },
    },
    include: { responses: true },
  });

  // Simple scoring engine
  let totalScore = 0;
  for (const r of responses) {
    if (r.numericValue) {
      totalScore += r.numericValue;
    }
  }

  // Find maturity level based on score (simplified)
  const updatedResult = await prisma.assessmentResult.update({
    where: { id: resultId },
    data: {
      totalScore,
      normalizedScore: totalScore * 10, // Example normalization
    },
  });

  revalidatePath("/dashboard/excellence/assessments");
  return updatedResult;
}

export async function getResults() {
  return await prisma.assessmentResult.findMany({
    include: {
      template: {
        include: { framework: true },
      },
      assessor: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getImprovementPlans() {
  return await prisma.improvementPlan.findMany({
    include: {
      owner: true,
      result: {
        include: {
          template: true,
        },
      },
    },
    orderBy: { dueDate: "asc" },
  });
}
