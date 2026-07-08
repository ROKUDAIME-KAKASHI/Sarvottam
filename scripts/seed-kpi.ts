import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding KPI Categories...");

  const categories = [
    { name: "Quality", description: "Metrics measuring standard of outputs." },
    { name: "Innovation", description: "Metrics measuring novel implementations and R&D." },
    {
      name: "Sustainability",
      description: "Metrics measuring environmental and long-term viability.",
    },
    { name: "Research", description: "Metrics measuring academic and applied research impact." },
    {
      name: "Collaboration",
      description: "Metrics measuring inter-departmental and industry partnerships.",
    },
  ];

  for (const cat of categories) {
    await prisma.kPICategory.upsert({
      where: { name: cat.name },
      update: {},
      create: cat,
    });
  }

  // Add sample KPI for Innovation
  const innovationCat = await prisma.kPICategory.findUnique({ where: { name: "Innovation" } });
  if (innovationCat) {
    const kpi = await prisma.kPI.create({
      data: {
        metricName: "Patents Filed",
        categoryId: innovationCat.id,
        currentValue: 5,
        unit: "Count",
        targets: {
          create: [{ targetValue: 10, period: "ANNUAL" }],
        },
      },
    });
    console.log(`Created sample KPI: ${kpi.metricName}`);
  }

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
