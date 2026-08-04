"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { updateUserSkills, formatUserSkills } from "@/lib/actions/skills.actions";

export async function updateProfile(data: {
  name: string;
  skills?: string;
  portfolioUrl?: string;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  if (!data.name || data.name.trim().length < 2) {
    throw new Error("Name must be at least 2 characters long");
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { userSkills: { select: { skill: { select: { name: true } } } }, role: true },
  });

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: data.name,
      portfolioUrl: data.portfolioUrl,
    },
  });

  if (data.skills !== undefined) {
    await updateUserSkills(session.user.id, data.skills || "");
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/profile");

  const skillsChanged = formatUserSkills(currentUser?.userSkills) !== (data.skills || "");
  const isStudent = currentUser?.role === "STUDENT";

  let message = "Profile updated successfully";
  if (
    currentUser &&
    currentUser.role === "STUDENT" &&
    data.skills &&
    (!formatUserSkills(currentUser.userSkills) || formatUserSkills(currentUser.userSkills) === "")
  ) {
    if (isStudent && skillsChanged) {
      message = "Submitted successfully waiting for approval";
    }
  }

  return { success: true, message };
}
