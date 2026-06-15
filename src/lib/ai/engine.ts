import { prisma } from "@/lib/prisma";

/**
 * AI Engine Mock for Sarvottam Platform
 * Simulates Vector Search, LLM Summarization, and Matchmaking using DB heuristics.
 */

export async function getStudentRecommendations(userId: string) {
  // In a real system, this would embed the user's skills and do a cosine similarity search against projects.
  const projects = await prisma.project.findMany({ take: 3, orderBy: { createdAt: 'desc' } });
  const faculty = await prisma.user.findMany({ where: { role: "FACULTY" }, take: 2 });
  
  return {
    recommendedProjects: projects.map(p => ({
      ...p,
      matchScore: Math.floor(Math.random() * 20) + 80 // Simulated 80-99%
    })),
    recommendedFaculty: faculty.map(f => ({
      ...f,
      matchScore: Math.floor(Math.random() * 20) + 75
    })),
    skillGap: {
      missingSkills: ["Cloud Architecture", "Advanced React Patterns", "Kubernetes"],
      suggestion: "Consider enrolling in the 'Advanced Applications' certification track to close this gap."
    }
  };
}

export async function getFacultyRecommendations(userId: string) {
  const problems = await prisma.problem.findMany({ take: 3, orderBy: { createdAt: 'desc' } });
  const peers = await prisma.user.findMany({ 
    where: { role: "FACULTY", NOT: { id: userId } },
    take: 2 
  });

  return {
    researchOpportunities: problems.map(p => ({
      ...p,
      aiInsight: "High relevance to your recent publications."
    })),
    collaborationSuggestions: peers.map(p => ({
      ...p,
      reason: "Complementary skills in Machine Learning and Data Science."
    }))
  };
}

export async function getIndustryRecommendations(userId: string) {
  const topStudents = await prisma.user.findMany({ where: { role: "STUDENT" }, take: 3 });
  const research = await prisma.researchPaper.findMany({ take: 2, orderBy: { createdAt: 'desc' } });

  return {
    talentMatches: topStudents.map(s => ({
      ...s,
      alignment: Math.floor(Math.random() * 15) + 85 + "% Match for SWE roles"
    })),
    researchMatches: research.map(r => ({
      ...r,
      commercializationPotential: "High"
    }))
  };
}

export async function getAdminInsights() {
  const kpis = await prisma.kPIHistory.findMany({ take: 10, orderBy: { date: 'desc' } });
  const usersCount = await prisma.user.count();
  
  return {
    systemHealth: "Optimal",
    predictions: [
      "Student engagement in the Excellence Framework is projected to rise 15% next quarter.",
      "A potential bottleneck in Certification review times detected.",
      "High demand for AI-related research matching observed."
    ],
    anomalies: [
      "Unusual spike in ESG Metric logging on 2026-06-14."
    ],
    summary: `Based on the latest data across ${usersCount} users, the platform ecosystem is highly active. Projects are converting to research papers at an increased rate.`
  };
}
