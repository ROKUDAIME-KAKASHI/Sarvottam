import { NextResponse } from "next/server";
import {
  getStudentRecommendations,
  getFacultyRecommendations,
  getIndustryRecommendations,
  getAdminInsights,
} from "@/lib/ai/engine";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { role, userId } = body;

    if (!role) {
      return NextResponse.json({ error: "Missing 'role' parameter." }, { status: 400 });
    }

    let data;
    switch (role) {
      case "STUDENT":
        data = await getStudentRecommendations(userId || "anonymous");
        break;
      case "FACULTY":
        data = await getFacultyRecommendations(userId || "anonymous");
        break;
      case "INDUSTRY_PARTNER":
        data = await getIndustryRecommendations(userId || "anonymous");
        break;
      case "SUPERADMIN":
        data = await getAdminInsights();
        break;
      default:
        return NextResponse.json({ error: "Invalid role specified." }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("AI API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
