"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createProblem(data: {
  company: string;
  sector: string;
  problem: string;
  outcome: string;
}) {
  const session = await auth();
  
  if (!session?.user?.id) {
    return { error: "You must be logged in to submit a problem. Please log in first." };
  }

  try {
    const title = `${data.company} - ${data.sector}`;
    const description = `**Problem Statement:**\n${data.problem}\n\n**Expected Outcome:**\n${data.outcome}`;

    const problem = await prisma.problem.create({
      data: {
        title,
        description,
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
    // If student, maybe they can see OPEN problems or assigned problems.
    // Let's just fetch all problems for now so the dashboard is populated.
    // A more refined ACL can be added later.
    
    if (session.user.role === "STUDENT") {
      // Students can see OPEN problems or problems assigned to them
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
      // Industry partners see only the problems they submitted
      return await prisma.problem.findMany({
        where: { submitterId: session.user.id },
        include: { submitter: true, assignee: true },
        orderBy: { createdAt: "desc" }
      });
    }

    // Admins and Faculty can see all problems
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

export async function approveProblem(problemId: string, approvalType: "FACULTY" | "INDUSTRY", isApproved: boolean) {
  const session = await auth();
  
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  try {
    if (approvalType === "FACULTY" && session.user.role !== "FACULTY") {
      return { error: "Only faculty can approve student problems" };
    }
    
    if (approvalType === "INDUSTRY" && session.user.role !== "SUPERADMIN") {
      return { error: "Only super admins can approve industry problems" };
    }

    const dataToUpdate = approvalType === "FACULTY" 
      ? { facultyApproved: isApproved }
      : { industryApproved: isApproved };

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
