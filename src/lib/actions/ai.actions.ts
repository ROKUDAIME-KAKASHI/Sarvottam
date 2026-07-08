"use server";

import { auth } from "@/auth";
import {
  getStudentRecommendations,
  getFacultyRecommendations,
  getIndustryRecommendations,
  getAdminInsights,
} from "@/lib/ai/engine";

export async function getDashboardAI() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const role = session.user.role;
  const userId = session.user.id as string;

  if (role === "STUDENT") {
    return await getStudentRecommendations(userId);
  }
  if (role === "FACULTY") {
    return await getFacultyRecommendations(userId);
  }
  if (role === "INDUSTRY_PARTNER") {
    return await getIndustryRecommendations(userId);
  }
  if (role === "SUPERADMIN") {
    return await getAdminInsights();
  }

  return { message: "No AI insights available for your role." };
}
