"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function createProject(formData: FormData) {
  const session = await auth();
  if (!session?.user) {
    return { error: "You must be logged in to create a project." };
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const difficultyLevel = formData.get("difficultyLevel") as string;
  const duration = formData.get("duration") as string;

  if (!title || !description) {
    return { error: "Title and description are required." };
  }

  try {
    const project = await prisma.project.create({
      data: {
        title,
        description,
        difficultyLevel,
        duration,
        status: "OPEN",
        creatorId: session.user.id,
        // Also keep assigning mentor/partner for backwards compatibility
        ...(session.user.role === "FACULTY" ? { mentorId: session.user.id } : {}),
        ...(session.user.role === "INDUSTRY_PARTNER" ? { partnerId: session.user.id } : {}),
      },
    });

    revalidatePath("/dashboard/projects");
    revalidatePath("/research");
    return { success: true, project };
  } catch (error) {
    console.error("Failed to create project:", error);
    return { error: "Failed to create project. Please try again." };
  }
}

export async function getProjects() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        mentor: { include: { user: true } },
        partner: true,
        creator: true,
      }
    });
    return projects;
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return [];
  }
}
