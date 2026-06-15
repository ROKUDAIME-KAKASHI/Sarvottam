"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function applyToJob(jobId: string, formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const resumeUrl = formData.get("resumeUrl") as string | null;
  const coverLetter = formData.get("coverLetter") as string | null;

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
  } catch (error: any) {
    console.error("Error applying to job:", error);
    return { success: false, error: error.message || "Failed to apply to job" };
  }
}

export async function createJob(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const role = session.user.role;
  if (!["FACULTY", "INDUSTRY_PARTNER", "SUPERADMIN"].includes(role)) {
    throw new Error("You do not have permission to post jobs.");
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const company = formData.get("company") as string;
  const location = formData.get("location") as string;
  const type = formData.get("type") as string;

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
  } catch (error: any) {
    console.error("Error creating job:", error);
    return { success: false, error: error.message || "Failed to create job" };
  }
}
