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
  
  return { success: true, message: "Profile updated successfully" };
}
