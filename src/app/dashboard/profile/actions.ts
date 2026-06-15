"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateProfile(data: { name: string, skills?: string, portfolioUrl?: string }) {
  const session = await auth();
  
  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  if (!data.name || data.name.trim().length < 2) {
    throw new Error("Name must be at least 2 characters long");
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { skills: true, role: true }
  });

  await prisma.user.update({
    where: { id: session.user.id },
    data: { 
      name: data.name,
      skills: data.skills || null,
      portfolioUrl: data.portfolioUrl || null
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/profile");
  
  const skillsChanged = currentUser?.skills !== (data.skills || null);
  const isStudent = currentUser?.role === "STUDENT";

  let message = "Profile updated successfully";
  if (isStudent && skillsChanged) {
    message = "Submitted successfully waiting for approval";
  }
  
  return { success: true, message };
}
