import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Excellence Framework...");

  // Create default Framework
  const framework = await prisma.excellenceFramework.create({
    data: {
      name: "Sarvottam Excellence Model",
      description: "Default framework based on organizational excellence principles.",
      version: "1.0",
      dimensions: {
        create: [
          { name: "Leadership", weightage: 15, orderIndex: 1 },
          { name: "People", weightage: 15, orderIndex: 2 },
          { name: "Process", weightage: 15, orderIndex: 3 },
          { name: "Innovation", weightage: 20, orderIndex: 4 },
          { name: "Sustainability", weightage: 15, orderIndex: 5 },
          { name: "Results", weightage: 20, orderIndex: 6 },
        ],
      },
      maturityLevels: {
        create: [
          { level: 1, name: "Initial", minScore: 0, maxScore: 200 },
          { level: 2, name: "Managed", minScore: 201, maxScore: 400 },
          { level: 3, name: "Defined", minScore: 401, maxScore: 600 },
          { level: 4, name: "Quantitatively Managed", minScore: 601, maxScore: 800 },
          { level: 5, name: "Optimizing", minScore: 801, maxScore: 1000 },
        ],
      },
    },
    include: { dimensions: true },
  });

  // Create a default Assessment Template
  await prisma.assessmentTemplate.create({
    data: {
      name: "Annual Performance Assessment",
      description: "Comprehensive annual check based on the 6 key dimensions.",
      frameworkId: framework.id,
      questions: {
        create: framework.dimensions.map((d) => ({
          dimensionId: d.id,
          text: `Evaluate our maturity in ${d.name}.`,
          guidance: "Rate on a scale of 1-5 where 5 is world-class.",
          type: "SCALE",
          maxValue: 5,
        })),
      },
    },
  });

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
