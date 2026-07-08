import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding gamification data...");

  // Create a default program if none exists
  let program = await prisma.certificationProgram.findFirst();
  if (!program) {
    program = await prisma.certificationProgram.create({
      data: {
        name: "Sarvottam Core Program",
        description: "Default certification program for the ecosystem",
      },
    });
  }

  // Create some Badges
  const badgesData = [
    {
      name: "First Login",
      description: "Welcome to Sarvottam! You have successfully logged in for the first time.",
      imageUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=firstlogin&backgroundColor=c0aede",
      programId: program.id,
    },
    {
      name: "Problem Solver",
      description: "You have submitted a solution or applied to a challenging project.",
      imageUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=problemsolver&backgroundColor=ffdfbf",
      programId: program.id,
    },
    {
      name: "Top Innovator",
      description: "Awarded to students who show exceptional innovation in their projects.",
      imageUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=topinnovator&backgroundColor=b6e3f4",
      programId: program.id,
    },
    {
      name: "Team Player",
      description: "Collaborated effectively with industry partners and faculty.",
      imageUrl: "https://api.dicebear.com/7.x/bottts/svg?seed=teamplayer&backgroundColor=c0aede",
      programId: program.id,
    },
  ];

  for (const b of badgesData) {
    // Upsert or just create
    const existing = await prisma.badge.findFirst({ where: { name: b.name } });
    if (!existing) {
      await prisma.badge.create({ data: b });
      console.log(`Created badge: ${b.name}`);
    } else {
      console.log(`Badge ${b.name} already exists.`);
    }
  }

  console.log("Gamification seeding completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
