"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function updateProfileSettings(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const name = formData.get("name") as string;
  const skills = formData.get("skills") as string;
  const portfolioUrl = formData.get("portfolioUrl") as string;

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { name, skills, portfolioUrl }
    });
    revalidatePath("/dashboard/settings");
    revalidatePath("/dashboard/profile");
    return { success: true };
  } catch (error) {
    console.error("Failed to update profile:", error);
    return { error: "Failed to update profile" };
  }
}

export async function updatePassword(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Unauthorized" };

  const currentPassword = formData.get("currentPassword") as string;
  const newPassword = formData.get("newPassword") as string;

  if (!currentPassword || !newPassword) {
    return { error: "Both current and new passwords are required" };
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user?.password) return { error: "User has no password set" };

    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) return { error: "Invalid current password" };

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashedPassword }
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to update password:", error);
    return { error: "Failed to update password" };
  }
}
