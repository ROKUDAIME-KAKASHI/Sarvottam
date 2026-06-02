"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function getReports() {
  try {
    return await prisma.report.findMany({
      orderBy: { createdAt: "desc" }
    });
  } catch (error) {
    console.error("Failed to fetch reports:", error);
    return [];
  }
}

export async function generateReport(title: string) {
  const session = await auth();
  if (session?.user?.role !== "SUPERADMIN") {
    return { error: "Unauthorized" };
  }

  try {
    const report = await prisma.report.create({
      data: { title }
    });
    revalidatePath("/dashboard/reports");
    return { success: true, report };
  } catch (error) {
    console.error("Failed to generate report:", error);
    return { error: "Failed to generate report" };
  }
}
