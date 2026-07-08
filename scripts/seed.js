// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require("@prisma/client");
// eslint-disable-next-line @typescript-eslint/no-require-imports
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Cleaning up existing users...");
  await prisma.user.deleteMany({});

  const defaultPassword = await bcrypt.hash("password123", 10);

  console.log("Creating Admin User...");
  await prisma.user.create({
    data: {
      email: "admin@jain.edu",
      name: "Super Admin",
      role: "SUPERADMIN",
      password: defaultPassword,
    },
  });

  console.log("Creating Faculty User...");
  await prisma.user.create({
    data: {
      email: "faculty@jain.edu",
      name: "Dr. Faculty Member",
      role: "FACULTY",
      password: defaultPassword,
    },
  });

  console.log("Creating Industry Partner User...");
  await prisma.user.create({
    data: {
      email: "industry@jain.edu",
      name: "Industry Partner",
      role: "INDUSTRY_PARTNER",
      password: defaultPassword,
    },
  });

  console.log("Creating Student User...");
  await prisma.user.create({
    data: {
      email: "student@jain.edu",
      name: "Student Researcher",
      role: "STUDENT",
      password: defaultPassword,
    },
  });

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
