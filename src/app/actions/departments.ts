"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function createDepartment(formData: FormData) {
  const session = await auth();
  if (session?.user?.role !== "SUPERADMIN") {
    return { error: "Unauthorized" };
  }

  const name = formData.get("name") as string;
  const description = formData.get("description") as string;

  if (!name) return { error: "Name is required" };

  try {
    await prisma.department.create({
      data: { name, description },
    });
    revalidatePath("/dashboard/departments");
    return { success: true };
  } catch (error) {
    console.error("Failed to create department:", error);
    return { error: "Failed to create department" };
  }
}

export async function getDepartments() {
  try {
    return await prisma.department.findMany({
      include: {
        _count: {
          select: { faculties: true, projects: true },
        },
      },
    });
  } catch (error) {
    console.error("Failed to fetch departments:", error);
    return [];
  }
}
