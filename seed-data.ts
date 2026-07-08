import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();

  const findUser = (email: string) => users.find((u) => u.email === email);

  const superAdmin = findUser("admin@jain.edu");
  const faculty = findUser("faculty@jain.edu");
  const industry = findUser("industry@jain.edu");
  const student = findUser("student@jain.edu");
  const jin = findUser("jintojohnsonc@jain.edu");
  const isha = findUser("isha@jain.edu");

  const projects = [];
  const problems = [];

  // --- PROJECTS (Research Ideas) ---

  if (superAdmin) {
    projects.push({
      title: "University-Wide KPI Analytics Dashboard",
      description:
        "Developing a central dashboard to track student placement rates, faculty publications, and cross-departmental collaboration metrics. This project involves aggregating fragmented data sources into a unified data warehouse and creating interactive visualizations.",
      type: "Business",
      difficultyLevel: "Advanced",
      duration: "6 Months",
      status: "IN_PROGRESS",
      creatorId: superAdmin.id,
    });
  }

  if (faculty) {
    projects.push({
      title: "Next-Generation NLP Models for Educational Assessment",
      description:
        "Researching the application of large language models (LLMs) to automatically grade and provide feedback on long-form essay questions. We aim to train a specialized model on past academic essays to reduce grading time while maintaining high evaluation standards.",
      type: "Research",
      difficultyLevel: "Advanced",
      duration: "12 Months",
      status: "OPEN",
      creatorId: faculty.id,
    });
    projects.push({
      title: "Sustainable Material Synthesis Lab",
      description:
        "A collaborative effort to synthesize biodegradable polymers using agricultural waste. This research will catalog various waste materials and test their efficacy as base components for bioplastics.",
      type: "Research",
      difficultyLevel: "Intermediate",
      duration: "9 Months",
      status: "OPEN",
      creatorId: faculty.id,
    });
  }

  if (industry) {
    projects.push({
      title: "Supply Chain Optimization Algorithm",
      description:
        "Creating a predictive algorithm to anticipate supply chain disruptions in the manufacturing sector. The project requires analyzing historical shipment data, weather patterns, and global economic indicators.",
      type: "Software",
      difficultyLevel: "Advanced",
      duration: "4 Months",
      status: "IN_PROGRESS",
      creatorId: industry.id,
    });
  }

  if (student) {
    projects.push({
      title: "Automated Web Scraping for Real Estate Pricing",
      description:
        "Building a Python-based web scraper that periodically extracts real estate pricing from multiple regional websites to build a predictive pricing model for local neighborhoods.",
      type: "Software",
      difficultyLevel: "Beginner",
      duration: "2 Months",
      status: "COMPLETED",
      creatorId: student.id,
    });
    projects.push({
      title: "Python-based Malware Analysis Sandbox",
      description:
        "Developing an isolated, virtualized sandbox environment written in Python to safely execute and analyze behavioral patterns of suspicious executables.",
      type: "Technical",
      difficultyLevel: "Intermediate",
      duration: "3 Months",
      status: "OPEN",
      creatorId: student.id,
    });
  }

  if (jin) {
    projects.push({
      title: "Cross-Platform Mobile App for Campus Navigation",
      description:
        "A React Native application designed to help new students navigate the university campus, including indoor mapping of large lecture halls, library sections, and real-time cafeteria menus.",
      type: "Software",
      difficultyLevel: "Intermediate",
      duration: "4 Months",
      status: "OPEN",
      creatorId: jin.id,
    });
  }

  if (isha) {
    projects.push({
      title: "Quantitative Analysis of Contemporary Literary Tropes",
      description:
        "A research project focusing on the evolution of narrative tropes in 21st-century literature. Using Google Docs for collaborative tagging and Data Analysis tools to chart the frequency and thematic variations across a dataset of 500 modern novels.",
      type: "Research",
      difficultyLevel: "Intermediate",
      duration: "6 Months",
      status: "OPEN",
      creatorId: isha.id,
    });
    projects.push({
      title: "Digitization and Metadata Structuring of Historical Archives",
      description:
        "Working on formatting, transcribing, and assigning metadata to a local historical archive. The goal is to make these physical documents fully searchable online.",
      type: "Design",
      difficultyLevel: "Beginner",
      duration: "3 Months",
      status: "OPEN",
      creatorId: isha.id,
    });
  }

  // --- PROBLEMS (Project Ideas) ---

  if (industry) {
    problems.push({
      title: "TechCorp Logistics - High Last-Mile Delivery Costs",
      description:
        "**Problem Statement:**\nOur last-mile delivery costs have increased by 22% over the past two quarters, primarily due to inefficient routing in dense urban areas and failed delivery attempts.\n\n**Expected Outcome:**\nA software prototype that dynamically adjusts delivery routes based on real-time traffic data and customer availability windows.",
      type: "Business",
      area: "PROCESS",
      submitterId: industry.id,
      status: "OPEN",
    });
    problems.push({
      title: "GreenEnergy Solutions - Inconsistent Solar Panel Output Prediction",
      description:
        "**Problem Statement:**\nWe are struggling to accurately predict the daily energy output of our regional solar farms, leading to grid instability and missed revenue opportunities.\n\n**Expected Outcome:**\nA machine learning model that incorporates micro-climate weather forecasts and historical panel degradation data to predict output with at least 90% accuracy.",
      type: "Technical",
      area: "TECHNOLOGY",
      submitterId: industry.id,
      assigneeId: student ? student.id : undefined,
      status: "IN_PROGRESS",
    });
  }

  if (faculty) {
    problems.push({
      title: "University Library - Outdated Archival Search System",
      description:
        "**Problem Statement:**\nThe current digital archive search system is based on legacy software from 2008. Students and researchers find it difficult to search across different media types (text, audio, video) simultaneously.\n\n**Expected Outcome:**\nA modernized, unified search interface with a robust backend capable of indexing and querying multimedia files effectively.",
      type: "Software",
      area: "TECHNOLOGY",
      submitterId: faculty.id,
      assigneeId: isha ? isha.id : undefined,
      status: "IN_PROGRESS",
    });
  }

  if (student) {
    problems.push({
      title: "Student Council - Inefficient Club Funding Allocation",
      description:
        "**Problem Statement:**\nThe process for clubs to request and receive funding is currently paper-based, leading to lost applications, long wait times, and poor tracking of expenditures.\n\n**Expected Outcome:**\nA centralized digital portal for clubs to submit budgets, track expenses, and receive automated notifications regarding their funding status.",
      type: "Business",
      area: "PROCESS",
      submitterId: student.id,
      status: "OPEN",
    });
  }

  if (isha) {
    problems.push({
      title: "Humanities Dept - Lack of Standardized Formatting Guidelines",
      description:
        "**Problem Statement:**\nFirst-year students consistently struggle with the diverse and often conflicting formatting requirements across different humanities courses, leading to lower grades on initial assignments.\n\n**Expected Outcome:**\nA comprehensive, interactive web guide that standardizes basic formatting and provides downloadable templates (Word, Google Docs) for various essay types.",
      type: "Design",
      area: "PEOPLE",
      submitterId: isha.id,
      status: "OPEN",
    });
  }

  // Execute the insertions
  console.log("Seeding realistic projects...");
  for (const proj of projects) {
    await prisma.project.create({ data: proj });
  }

  console.log("Seeding realistic problems...");
  for (const prob of problems) {
    await prisma.problem.create({ data: prob });
  }

  console.log("Done seeding realistic data!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
