"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const createProjectSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters long"),
  description: z.string().min(20, "Description must be at least 20 characters long"),
  difficultyLevel: z.string().optional(),
  duration: z.string().optional(),
  type: z.string().optional(),
});

type ActionState = {
  success?: boolean;
  error?: string;
  fieldErrors?: Record<string, string[]>;
  project?: any;
};

export async function createProject(prevState: ActionState | null, formData: FormData): Promise<ActionState> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be logged in to create a project." };
  }

  const rawData = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
    difficultyLevel: formData.get("difficultyLevel") as string,
    duration: formData.get("duration") as string,
    type: formData.get("type") as string,
  };

  const validatedFields = createProjectSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      error: "Invalid fields provided.",
      fieldErrors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { title, description, difficultyLevel, duration, type } = validatedFields.data;

  try {
    let mentorId = null;
    let partnerId = null;

    // Correctly resolve Profile IDs from User ID
    if (session.user.role === "FACULTY") {
      const facultyProfile = await prisma.faculty.findUnique({
        where: { userId: session.user.id },
      });
      if (facultyProfile) mentorId = facultyProfile.id;
    } else if (session.user.role === "INDUSTRY_PARTNER") {
      const partnerProfile = await prisma.industryPartner.findUnique({
        where: { userId: session.user.id },
      });
      if (partnerProfile) partnerId = partnerProfile.id;
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        type,
        difficultyLevel,
        duration,
        status: "OPEN",
        creatorId: session.user.id,
        mentorId,
        partnerId,
      },
    });

    revalidatePath("/dashboard/projects");
    revalidatePath("/research");
    
    return { success: true, project };
  } catch (error) {
    console.error("Failed to create project:", error);
    return { error: "Failed to create project due to a server error. Please try again." };
  }
}

export async function getProjects() {
  try {
    return await prisma.project.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        mentor: { include: { user: true } },
        partner: { include: { user: true } },
        creator: true,
      },
    });
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return [];
  }
}
