"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const applyToJobSchema = z.object({
  resumeUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  coverLetter: z.string().max(2000).optional(),
});

const createJobSchema = z.object({
  title: z.string().min(3, "Title too short").max(100),
  description: z.string().min(10).max(5000),
  company: z.string().min(2).max(100),
  location: z.string().max(100).optional(),
  type: z.enum(["FULL_TIME", "PART_TIME", "INTERNSHIP", "CONTRACT"]).default("FULL_TIME"),
});

const portfolioSubmissionSchema = z.object({
  portfolioUrl: z.string().url("Must be a valid URL"),
  feedbackGoal: z.string().max(1000).optional(),
});

export async function applyToJob(jobId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const parsed = applyToJobSchema.safeParse({
    resumeUrl: formData.get("resumeUrl") as string,
    coverLetter: formData.get("coverLetter") as string,
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { resumeUrl, coverLetter } = parsed.data;

  try {
    // Ensure the job exists and is OPEN
    const job = await prisma.job.findUnique({
      where: { id: jobId },
    });

    if (!job || job.status !== "OPEN") {
      throw new Error("Job is not available for applications.");
    }

    // Check if already applied
    const existingApplication = await prisma.jobApplication.findFirst({
      where: {
        jobId,
        applicantId: session.user.id,
      },
    });

    if (existingApplication) {
      throw new Error("You have already applied to this job.");
    }

    // Create the application
    await prisma.jobApplication.create({
      data: {
        jobId,
        applicantId: session.user.id,
        resumeUrl,
        coverLetter,
        status: "PENDING",
      },
    });

    revalidatePath("/dashboard/placements");
    revalidatePath(`/dashboard/placements/${jobId}`);

    return { success: true };
  } catch (error) {
    console.error("Error applying to job:", error);
    const msg = error instanceof Error ? error.message : "Failed to apply to job";
    return { success: false, error: msg };
  }
}

export async function createJob(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const role = session.user.role || "STUDENT";
  if (!["FACULTY", "INDUSTRY_PARTNER", "SUPERADMIN"].includes(role)) {
    throw new Error("You do not have permission to post jobs.");
  }

  const parsed = createJobSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description"),
    company: formData.get("company"),
    location: formData.get("location"),
    type: formData.get("type"),
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message };
  }

  const { title, description, company, location, type } = parsed.data;

  try {
    await prisma.job.create({
      data: {
        title,
        description,
        company,
        location,
        type,
        posterId: session.user.id,
      },
    });

    revalidatePath("/dashboard/placements");
    return { success: true };
  } catch (error) {
    console.error("Error creating job:", error);
    const msg = error instanceof Error ? error.message : "Failed to create job";
    return { success: false, error: msg };
  }
}

export async function getAvailableInterviewSlots() {
  return await prisma.mockInterviewSlot.findMany({
    where: { isBooked: false },
    include: { interviewer: true },
    orderBy: { startTime: "asc" },
  });
}

export async function bookInterviewSlot(slotId: string): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  try {
    const result = await prisma.mockInterviewSlot.updateMany({
      where: {
        id: slotId,
        isBooked: false,
      },
      data: { isBooked: true, studentId: session.user.id },
    });

    if (result.count === 0) throw new Error("Slot unavailable or already booked");

    revalidatePath("/dashboard/placements/mock-interviews");
  } catch (error) {
    console.error("Error booking interview:", error);
  }
}

export async function getTopPortfolios() {
  return await prisma.portfolioSubmission.findMany({
    where: { score: { not: null } },
    include: { student: true },
    orderBy: { score: "desc" },
    take: 5,
  });
}

export async function submitPortfolioReview(formData: FormData): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const parsed = portfolioSubmissionSchema.safeParse({
    portfolioUrl: formData.get("portfolioUrl"),
    feedbackGoal: formData.get("feedbackGoal"),
  });

  if (!parsed.success) {
    console.error("Validation error:", parsed.error.issues[0].message);
    return;
  }

  const { portfolioUrl, feedbackGoal } = parsed.data;

  try {
    await prisma.portfolioSubmission.create({
      data: {
        studentId: session.user.id,
        portfolioUrl,
        feedbackGoal,
      },
    });

    revalidatePath("/dashboard/placements/portfolio-review");
  } catch (error) {
    console.error("Error submitting portfolio:", error);
  }
}

export async function createInterviewSlot(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  const role = session.user.role;
  if (!["FACULTY", "INDUSTRY_PARTNER", "SUPERADMIN"].includes(role as string)) {
    return { success: false, error: "Only mentors can create slots" };
  }

  const startTimeStr = formData.get("startTime") as string;
  if (!startTimeStr) return { success: false, error: "Missing start time" };

  const startTime = new Date(startTimeStr);
  if (isNaN(startTime.getTime()) || startTime < new Date()) {
    return { success: false, error: "Invalid or past date" };
  }

  try {
    await prisma.mockInterviewSlot.create({
      data: {
        interviewerId: session.user.id,
        startTime,
      },
    });

    revalidatePath("/dashboard/placements/mock-interviews");
    return { success: true };
  } catch (error) {
    console.error("Error creating slot:", error);
    return { success: false, error: "Failed to create slot" };
  }
}
