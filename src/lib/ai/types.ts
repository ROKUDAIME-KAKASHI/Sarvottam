export interface AIStudentRecommendation {
  recommendedProjects: {
    id: string;
    title: string;
    description: string;
    matchScore: number;
  }[];
  recommendedFaculty: {
    id: string;
    name: string;
    email: string;
    matchScore: number;
  }[];
  skillGap: {
    missingSkills: string[];
    suggestion: string;
  };
}

export interface AIFacultyRecommendation {
  researchOpportunities: {
    id: string;
    title: string;
    description: string;
    aiInsight: string;
  }[];
  collaborationSuggestions: {
    id: string;
    name: string;
    email: string;
    reason: string;
  }[];
}

export interface AIIndustryRecommendation {
  talentMatches: {
    id: string;
    name: string;
    email: string;
    alignment: string;
  }[];
  researchMatches: {
    id: string;
    title: string;
    commercializationPotential: string;
  }[];
}

export interface AIAdminInsight {
  systemHealth: string;
  predictions: string[];
  anomalies: string[];
  summary: string;
}

export type AIDashboardData =
  | AIStudentRecommendation
  | AIFacultyRecommendation
  | AIIndustryRecommendation
  | AIAdminInsight
  | { message: string };
