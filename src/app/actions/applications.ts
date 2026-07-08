"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { addXP } from "@/lib/actions/gamification";

export async function applyForProject(formData: FormData) {
  const session = await auth();
  if (!session?.user || !session.user.id) {
    return { error: "You must be logged in to apply for a project." };
  }

  const projectId = formData.get("projectId") as string;
  const skills = formData.get("skills") as string;

  if (!projectId) {
    return { error: "Project ID is required." };
  }

  try {
    // Save/Update user skills
    if (skills) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { skills },
      });
    }

    // Check if user already applied
    const existing = await prisma.application.findFirst({
      where: {
        projectId,
        userId: session.user.id,
      },
    });

    if (existing) {
      return { error: "You have already applied for this project." };
    }

    const application = await prisma.application.create({
      data: {
        projectId,
        userId: session.user.id,
        status: "PENDING",
      },
    });

    // Gamification Hook: Reward for applying
    await addXP(session.user.id, 20);

    // Notify Admin, Faculty, Industry (simplified for now via a revalidate)
    revalidatePath("/research");
    revalidatePath("/dashboard/applications");
    revalidatePath("/dashboard");
    return { success: true, application };
  } catch (error) {
    console.error("Failed to apply for project:", error);
    return { error: "Failed to apply. Please try again." };
  }
}

export async function approveApplication(
  applicationId: string,
  approvalType: "FACULTY" | "INDUSTRY" | "ADMIN",
  isApproved: boolean
) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  try {
    const app = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { project: true },
    });

    if (!app) return { error: "Application not found" };

    // Check permissions
    if (
      approvalType === "FACULTY" &&
      session.user.role !== "FACULTY" &&
      session.user.role !== "SUPERADMIN"
    ) {
      return { error: "Only faculty can approve" };
    }
    if (
      approvalType === "INDUSTRY" &&
      session.user.role !== "INDUSTRY_PARTNER" &&
      session.user.role !== "SUPERADMIN"
    ) {
      return { error: "Only industry partners can approve" };
    }
    if (approvalType === "ADMIN" && session.user.role !== "SUPERADMIN") {
      return { error: "Only admins can provide final approval" };
    }

    const dataToUpdate: Record<string, boolean | string> = {};
    if (approvalType === "FACULTY") dataToUpdate.facultyApproved = isApproved;
    if (approvalType === "INDUSTRY") dataToUpdate.industryApproved = isApproved;
    if (approvalType === "ADMIN") dataToUpdate.adminApproved = isApproved;

    const willBeAdminApproved = approvalType === "ADMIN" ? isApproved : app.adminApproved;
    const willBeFacultyApproved = approvalType === "FACULTY" ? isApproved : app.facultyApproved;
    const willBeIndustryApproved = approvalType === "INDUSTRY" ? isApproved : app.industryApproved;

    // Logic: Admin override OR (Faculty AND Industry)
    if (willBeAdminApproved || (willBeFacultyApproved && willBeIndustryApproved)) {
      dataToUpdate.status = "ACCEPTED";

      // If accepted, we might want to update the project status if it's full,
      // but for now we just mark the application as accepted.
    } else if (!isApproved) {
      // If any party explicitly rejects? (The user didn't specify rejection logic,
      // but usually if one rejects it might stay pending or be rejected).
      // Let's keep it pending unless it's a "REJECT" status.
    }

    await prisma.application.update({
      where: { id: applicationId },
      data: dataToUpdate,
    });

    revalidatePath("/dashboard/applications");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to approve application:", error);
    return { error: "Failed to approve application" };
  }
}

export async function getApplications() {
  const session = await auth();
  if (!session?.user) return [];

  try {
    if (session.user.role === "STUDENT") {
      return await prisma.application.findMany({
        where: {
          OR: [{ userId: session.user.id }, { project: { creatorId: session.user.id } }],
        },
        include: { project: true, user: true },
        orderBy: { createdAt: "desc" },
      });
    }

    if (session.user.role === "FACULTY") {
      return await prisma.application.findMany({
        where: {
          OR: [
            { project: { mentorId: session.user.id } },
            { project: { creatorId: session.user.id } },
          ],
        },
        include: { project: true, user: true },
        orderBy: { createdAt: "desc" },
      });
    }

    if (session.user.role === "INDUSTRY_PARTNER") {
      return await prisma.application.findMany({
        where: {
          OR: [
            { project: { partnerId: session.user.id } },
            { project: { creatorId: session.user.id } },
          ],
        },
        include: { project: true, user: true },
        orderBy: { createdAt: "desc" },
      });
    }

    // Superadmin sees all
    return await prisma.application.findMany({
      include: { project: true, user: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Failed to fetch applications:", error);
    return [];
  }
}

export async function updateApplicationStatus(applicationId: string, status: string) {
  const session = await auth();
  if (!session?.user) {
    return { error: "Unauthorized" };
  }

  try {
    const app = await prisma.application.findUnique({
      where: { id: applicationId },
      include: { project: true },
    });

    if (!app) return { error: "Application not found" };

    const canUpdate =
      session.user.role === "SUPERADMIN" ||
      app.project.creatorId === session.user.id ||
      app.project.mentorId === session.user.id ||
      app.project.partnerId === session.user.id;

    if (!canUpdate) {
      return { error: "Unauthorized to update this application" };
    }

    await prisma.application.update({
      where: { id: applicationId },
      data: { status },
    });

    revalidatePath("/dashboard/applications");
    return { success: true };
  } catch (error) {
    console.error("Failed to update application:", error);
    return { error: "Failed to update application" };
  }
}
