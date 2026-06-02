import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const projects = [
  {
    title: "AI-Driven Predictive Maintenance for Manufacturing",
    description: "Developing machine learning models to predict equipment failure in automotive manufacturing plants, using real-time IoT sensor data to minimize downtime and maintenance costs.",
    difficultyLevel: "Advanced",
    duration: "6 months",
    status: "OPEN"
  },
  {
    title: "Sustainable Packaging Materials for E-commerce",
    description: "Researching and developing biodegradable, plant-based packaging alternatives that offer the same durability as traditional plastics while meeting industry supply chain requirements.",
    difficultyLevel: "Intermediate",
    duration: "4 months",
    status: "OPEN"
  },
  {
    title: "Optimizing Last-Mile Delivery Logistics using Graph Neural Networks",
    description: "Building an algorithmic approach to route optimization that adapts to real-time traffic, weather, and package priority, aiming to reduce delivery times and carbon emissions.",
    difficultyLevel: "Advanced",
    duration: "8 months",
    status: "IN_PROGRESS"
  },
  {
    title: "NLP-based Automated Customer Support Triaging",
    description: "Creating a natural language processing system to accurately categorize and route complex customer support tickets to the right department, reducing manual triage effort.",
    difficultyLevel: "Intermediate",
    duration: "3 months",
    status: "OPEN"
  },
  {
    title: "Blockchain for Transparent Agricultural Supply Chains",
    description: "Implementing a distributed ledger system to trace the origin, quality, and transit conditions of organic produce from farm to retail shelves.",
    difficultyLevel: "Advanced",
    duration: "12 months",
    status: "OPEN"
  },
  {
    title: "Automated Accessibility Auditing Tool for Web Applications",
    description: "Developing a comprehensive scanning tool that detects WCAG compliance issues in modern single-page applications dynamically.",
    difficultyLevel: "Beginner",
    duration: "2 months",
    status: "OPEN"
  },
  {
    title: "Energy Consumption Analysis in Edge Computing",
    description: "Investigating power usage patterns of IoT edge devices and proposing lightweight algorithms for data processing that extend battery life without compromising latency.",
    difficultyLevel: "Intermediate",
    duration: "5 months",
    status: "OPEN"
  }
];

async function main() {
  console.log("Seeding realistic projects...");
  
  // Try to find an industry partner or faculty user to assign as creator
  const user = await prisma.user.findFirst({
    where: {
      role: {
        in: ['INDUSTRY_PARTNER', 'FACULTY', 'SUPERADMIN']
      }
    }
  });

  const creatorId = user?.id;

  for (const p of projects) {
    await prisma.project.create({
      data: {
        ...p,
        creatorId: creatorId,
      }
    });
    console.log(`Created project: ${p.title}`);
  }
  
  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
