import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding jobs...");

  // Find an industry partner or faculty to be the poster
  let poster = await prisma.user.findFirst({
    where: { role: "INDUSTRY_PARTNER" },
  });

  if (!poster) {
    poster = await prisma.user.findFirst({
      where: { role: "FACULTY" },
    });
  }

  if (!poster) {
    poster = await prisma.user.create({
      data: {
        name: "Tech Corp Admin",
        email: "admin@techcorp.com",
        role: "INDUSTRY_PARTNER",
      },
    });
    console.log("Created dummy poster user.");
  }

  const jobsData = [
    {
      title: "Junior Frontend Developer",
      description:
        "We are looking for an enthusiastic junior frontend developer with experience in React and Next.js. You will be working on our core web application delivering high-quality user interfaces.",
      company: "TechFlow Innovations",
      location: "Bangalore, India (Hybrid)",
      type: "FULL_TIME",
      status: "OPEN",
      posterId: poster.id,
    },
    {
      title: "Data Science Intern",
      description:
        "Join our AI research team as a Data Science intern. You will be analyzing large datasets to help us train our next generation of machine learning models. Proficiency in Python and PyTorch is a must.",
      company: "Neural Dynamics",
      location: "Remote",
      type: "INTERNSHIP",
      status: "OPEN",
      posterId: poster.id,
    },
    {
      title: "Senior Product Manager",
      description:
        "Lead cross-functional teams to deliver impactful products. Ideal candidates have 5+ years of experience in agile methodologies and a strong technical background.",
      company: "Global Enterprises Ltd.",
      location: "Mumbai, India",
      type: "FULL_TIME",
      status: "OPEN",
      posterId: poster.id,
    },
  ];

  for (const job of jobsData) {
    await prisma.job.create({
      data: job,
    });
  }

  console.log("Successfully seeded 3 jobs!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
