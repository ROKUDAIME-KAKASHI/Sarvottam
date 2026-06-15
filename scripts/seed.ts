import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Cleaning up existing data...');
  await prisma.problem.deleteMany({});
  await prisma.application.deleteMany({});
  await prisma.project.deleteMany({});
  await prisma.department.deleteMany({});
  await prisma.user.deleteMany({});
  
  const defaultPassword = await bcrypt.hash('password123', 10);

  console.log('Creating Users...');
  const admin = await prisma.user.create({
    data: {
      email: 'admin@jain.edu',
      name: 'Super Admin',
      role: 'SUPERADMIN',
      password: defaultPassword,
    },
  });

  const faculty1 = await prisma.user.create({
    data: {
      email: 'dr.smith@jain.edu',
      name: 'Dr. Alan Smith',
      role: 'FACULTY',
      password: defaultPassword,
    },
  });

  const faculty2 = await prisma.user.create({
    data: {
      email: 'dr.jones@jain.edu',
      name: 'Dr. Sarah Jones',
      role: 'FACULTY',
      password: defaultPassword,
    },
  });

  const industry1 = await prisma.user.create({
    data: {
      email: 'tech@corp.com',
      name: 'TechCorp Solutions',
      role: 'INDUSTRY_PARTNER',
      password: defaultPassword,
    },
  });

  const student1 = await prisma.user.create({
    data: {
      email: 'student1@jain.edu',
      name: 'Alice Johnson',
      role: 'STUDENT',
      password: defaultPassword,
    },
  });

  const student2 = await prisma.user.create({
    data: {
      email: 'student2@jain.edu',
      name: 'Bob Williams',
      role: 'STUDENT',
      password: defaultPassword,
    },
  });

  console.log('Creating Departments...');
  const csDept = await prisma.department.create({
    data: {
      name: 'Computer Science & Engineering',
      description: 'Focuses on computing, AI, and software systems.',
    }
  });

  const mechDept = await prisma.department.create({
    data: {
      name: 'Mechanical Engineering',
      description: 'Focuses on robotics, manufacturing, and thermodynamics.',
    }
  });

  console.log("Seeding realistic projects...");
  const projects = [
    {
      title: "AI-Driven Predictive Maintenance for Manufacturing",
      description: "Developing machine learning models to predict equipment failure in automotive manufacturing plants, using real-time IoT sensor data to minimize downtime and maintenance costs.",
      difficultyLevel: "Advanced",
      duration: "6 months",
      status: "OPEN",
      creatorId: industry1.id,
      departmentId: csDept.id,
      mentorId: faculty1.id,
    },
    {
      title: "Sustainable Packaging Materials for E-commerce",
      description: "Researching and developing biodegradable, plant-based packaging alternatives that offer the same durability as traditional plastics while meeting industry supply chain requirements.",
      difficultyLevel: "Intermediate",
      duration: "4 months",
      status: "OPEN",
      creatorId: faculty2.id,
      departmentId: mechDept.id,
    },
    {
      title: "Optimizing Last-Mile Delivery Logistics using Graph Neural Networks",
      description: "Building an algorithmic approach to route optimization that adapts to real-time traffic, weather, and package priority, aiming to reduce delivery times and carbon emissions.",
      difficultyLevel: "Advanced",
      duration: "8 months",
      status: "IN_PROGRESS",
      creatorId: industry1.id,
      mentorId: faculty1.id,
      departmentId: csDept.id,
    }
  ];

  for (const p of projects) {
    await prisma.project.create({ data: p });
    console.log(`Created project: ${p.title}`);
  }

  console.log("Seeding realistic problems...");
  const problems = [
    {
      title: "High Latency in IoT Edge Data Sync",
      description: "Our edge devices are experiencing high latency when synchronizing state with the central cloud server under poor network conditions. We need an optimized lightweight sync protocol.",
      area: "TECHNOLOGY",
      level: "HIGH",
      submitterId: industry1.id,
      industryApproved: false,
      facultyApproved: false,
    },
    {
      title: "Outdated Manufacturing Process Workflows",
      description: "The current assembly line workflow relies on manual paper checks which introduces errors. We need to digitize the verification process.",
      area: "PROCESS",
      level: "MEDIUM",
      submitterId: industry1.id,
      industryApproved: true,
      facultyApproved: false,
    },
    {
      title: "Campus Wi-Fi Blind Spots",
      description: "Several areas in the new engineering block have complete Wi-Fi dead zones, impacting students' ability to work on cloud-based assignments.",
      area: "TECHNOLOGY",
      level: "LOW",
      submitterId: student1.id,
      industryApproved: false,
      facultyApproved: false,
    },
    {
      title: "Library Resource Tracking Inefficiency",
      description: "The library's physical book tracking system is slow and frequently inaccurate. We propose implementing an RFID-based automated checkout and return system.",
      area: "PROCESS",
      level: "MEDIUM",
      submitterId: student2.id,
      industryApproved: false,
      facultyApproved: true,
    }
  ];

  for (const prob of problems) {
    await prisma.problem.create({ data: prob });
    console.log(`Created problem: ${prob.title}`);
  }

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
