"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function applyForProject(formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    return { error: "You must be logged in to apply for a project." };
  }

  const projectId = formData.get("projectId") as string;

  if (!projectId) {
    return { error: "Project ID is required." };
  }

  try {
    // Check if user already applied
    const existing = await prisma.application.findFirst({
      where: {
        projectId,
        userId: session.user.id,
      }
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

    revalidatePath("/research");
    revalidatePath("/dashboard/applications");
    return { success: true, application };
  } catch (error) {
    console.error("Failed to apply for project:", error);
    return { error: "Failed to apply. Please try again." };
  }
}

export async function getApplications() {
  const session = await auth();
  if (!session?.user) return [];

  try {
    if (session.user.role === "STUDENT") {
      return await prisma.application.findMany({
        where: { 
          OR: [
            { userId: session.user.id },
            { project: { creatorId: session.user.id } }
          ]
        },
        include: { project: true, user: true },
        orderBy: { createdAt: "desc" }
      });
    }
    
    if (session.user.role === "FACULTY") {
      return await prisma.application.findMany({
        where: { 
          OR: [
            { project: { mentorId: session.user.id } },
            { project: { creatorId: session.user.id } }
          ]
        },
        include: { project: true, user: true },
        orderBy: { createdAt: "desc" }
      });
    }

    if (session.user.role === "INDUSTRY_PARTNER") {
      return await prisma.application.findMany({
        where: { 
          OR: [
            { project: { partnerId: session.user.id } },
            { project: { creatorId: session.user.id } }
          ]
        },
        include: { project: true, user: true },
        orderBy: { createdAt: "desc" }
      });
    }

    // Superadmin sees all
    return await prisma.application.findMany({
      include: { project: true, user: true },
      orderBy: { createdAt: "desc" }
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
      include: { project: true }
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
