"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

async function logAudit(action: string, entityType: string, entityId: string, details?: string) {
  const session = await auth();
  if (!session?.user) return;

  await prisma.auditLog.create({
    data: {
      action,
      entityType,
      entityId,
      userId: session.user.id as string,
      details,
    },
  });
}

export async function getOrganizations() {
  return await prisma.organization.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function createOrganization(data: {
  name: string;
  type?: string;
  industry?: string;
  size?: string;
}) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  if (session.user.role !== "SUPERADMIN") throw new Error("Forbidden");

  const org = await prisma.organization.create({ data });

  await logAudit("CREATE", "Organization", org.id, `Created organization ${org.name}`);
  revalidatePath("/dashboard/org-assessments/organizations");

  return org;
}

export async function getOrgAssessments(organizationId?: string) {
  const where = organizationId ? { organizationId } : {};
  return await prisma.orgAssessment.findMany({
    where,
    include: {
      organization: true,
      evaluators: { include: { user: true } },
      sections: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createOrgAssessment(data: {
  organizationId: string;
  title: string;
  description?: string;
}) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");
  if (session.user.role !== "SUPERADMIN") throw new Error("Forbidden");

  const assessment = await prisma.orgAssessment.create({
    data: {
      ...data,
      sections: {
        create: [
          { name: "Governance & Strategy", weight: 1 },
          { name: "Financial Health", weight: 1 },
          { name: "Operational Efficiency", weight: 1 },
        ],
      },
    },
  });

  await logAudit(
    "CREATE",
    "OrgAssessment",
    assessment.id,
    `Created assessment ${assessment.title}`
  );
  revalidatePath("/dashboard/org-assessments");

  return assessment;
}

export async function addEvidence(data: {
  sectionId: string;
  title: string;
  url: string;
  description?: string;
}) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const evidence = await prisma.assessmentEvidence.create({
    data: {
      ...data,
      uploadedById: session.user.id as string,
    },
  });

  await logAudit(
    "ADD_EVIDENCE",
    "AssessmentSection",
    data.sectionId,
    `Added evidence ${data.title}`
  );
  revalidatePath("/dashboard/org-assessments/[id]", "page");

  return evidence;
}

export async function submitEvaluationScore(data: {
  sectionId: string;
  assessmentId: string;
  score: number;
  feedback?: string;
}) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  let evaluator = await prisma.evaluator.findFirst({
    where: { assessmentId: data.assessmentId, userId: session.user.id as string },
  });

  if (!evaluator) {
    evaluator = await prisma.evaluator.create({
      data: { assessmentId: data.assessmentId, userId: session.user.id as string },
    });
  }

  const evaluationScore = await prisma.evaluationScore.create({
    data: {
      sectionId: data.sectionId,
      evaluatorId: evaluator.id,
      score: data.score,
      feedback: data.feedback,
    },
  });

  await logAudit("SUBMIT_SCORE", "AssessmentSection", data.sectionId, `Scored ${data.score}`);
  revalidatePath("/dashboard/org-assessments/[id]", "page");

  return evaluationScore;
}
