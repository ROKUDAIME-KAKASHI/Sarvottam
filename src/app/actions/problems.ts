"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createProblemSchema = z.object({
  company: z.string().min(2, "Company name must be at least 2 characters"),
  sector: z.string().min(2, "Sector is required"),
  problem: z.string().min(10, "Problem statement must be at least 10 characters"),
  outcome: z.string().min(10, "Expected outcome must be at least 10 characters"),
  type: z.string().min(2, "Type is required"),
});

export async function createProblem(data: {
  company: string;
  sector: string;
  problem: string;
  outcome: string;
  type: string;
}) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return { error: "You must be logged in to submit a problem. Please log in first." };
  }

  const validatedFields = createProblemSchema.safeParse(data);

  if (!validatedFields.success) {
    return {
      error: "Invalid fields provided.",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { company, sector, problem: problemStatement, outcome, type } = validatedFields.data;

  try {
    const title = `${company} - ${sector}`;
    const description = `**Problem Statement:**\n${problemStatement}\n\n**Expected Outcome:**\n${outcome}`;

    const problem = await prisma.problem.create({
      data: {
        title,
        description,
        type,
        submitterId: session.user.id,
        status: "OPEN",
      },
    });

    revalidatePath("/dashboard/problems");
    return { success: true, problemId: problem.id };
  } catch (error) {
    console.error("Failed to create problem:", error);
    return { error: "Failed to submit the problem. Please try again." };
  }
}

export async function getProblems() {
  const session = await auth();
  
  if (!session?.user) {
    return [];
  }

  try {
    if (session.user.role === "STUDENT") {
      return await prisma.problem.findMany({
        where: {
          OR: [
            { status: "OPEN" },
            { assigneeId: session.user.id }
          ]
        },
        include: { submitter: true, assignee: true },
        orderBy: { createdAt: "desc" }
      });
    }

    if (session.user.role === "INDUSTRY_PARTNER") {
      return await prisma.problem.findMany({
        where: { submitterId: session.user.id },
        include: { submitter: true, assignee: true },
        orderBy: { createdAt: "desc" }
      });
    }

    return await prisma.problem.findMany({
      include: { submitter: true, assignee: true },
      orderBy: { createdAt: "desc" }
    });
    
  } catch (error) {
    console.error("Failed to fetch problems:", error);
    return [];
  }
}

export async function getMarketplaceProblems() {
  try {
    return await prisma.problem.findMany({
      where: { status: "OPEN" },
      include: { submitter: true, assignee: true },
      orderBy: { createdAt: "desc" }
    });
  } catch (error) {
    console.error("Failed to fetch marketplace problems:", error);
    return [];
  }
}

export async function approveProblem(problemId: string, approvalType: "FACULTY" | "INDUSTRY" | "ADMIN", isApproved: boolean) {
  const session = await auth();
  
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  try {
    if (approvalType === "FACULTY" && session.user.role !== "FACULTY" && session.user.role !== "SUPERADMIN") {
      return { error: "Only faculty or admins can approve student problems" };
    }
    
    if (approvalType === "INDUSTRY" && session.user.role !== "SUPERADMIN" && session.user.role !== "INDUSTRY_PARTNER") {
      return { error: "Unauthorized to approve industry problems" };
    }

    if (approvalType === "ADMIN" && session.user.role !== "SUPERADMIN") {
      return { error: "Only super admins can provide final admin approval" };
    }

    const dataToUpdate: any = {};
    if (approvalType === "FACULTY") dataToUpdate.facultyApproved = isApproved;
    if (approvalType === "INDUSTRY") dataToUpdate.industryApproved = isApproved;
    if (approvalType === "ADMIN") dataToUpdate.adminApproved = isApproved;

    const currentProblem = await prisma.problem.findUnique({ where: { id: problemId } });
    if (!currentProblem) return { error: "Problem not found" };

    const willBeAdminApproved = approvalType === "ADMIN" ? isApproved : currentProblem.adminApproved;
    const willBeFacultyApproved = approvalType === "FACULTY" ? isApproved : currentProblem.facultyApproved;
    const willBeIndustryApproved = approvalType === "INDUSTRY" ? isApproved : currentProblem.industryApproved;

    if (willBeAdminApproved || (willBeFacultyApproved && willBeIndustryApproved)) {
      dataToUpdate.status = "APPROVED";
    } else {
      dataToUpdate.status = "PENDING";
    }

    await prisma.problem.update({
      where: { id: problemId },
      data: dataToUpdate
    });

    revalidatePath("/dashboard/problems");
    revalidatePath("/research");
    return { success: true };
  } catch (error) {
    console.error("Failed to approve problem:", error);
    return { error: "Failed to approve problem" };
  }
}
