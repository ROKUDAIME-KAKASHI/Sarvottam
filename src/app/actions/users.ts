"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function getUsers() {
  const session = await auth();

  // Only SUPERADMIN can see all users
  if (session?.user?.role !== "SUPERADMIN") {
    return [];
  }

  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
    return users;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return [];
  }
}

export async function updateUserRole(userId: string, newRole: string) {
  const session = await auth();

  if (session?.user?.role !== "SUPERADMIN") {
    return { error: "Unauthorized" };
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });

    return { success: true };
  } catch (error) {
    console.error("Failed to update user role:", error);
    return { error: "Failed to update role" };
  }
}
