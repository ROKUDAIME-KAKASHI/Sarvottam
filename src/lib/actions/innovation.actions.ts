"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function getStartups() {
  return await prisma.startup.findMany({
    include: {
      founders: { include: { user: true } },
      programs: true,
      pitches: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createStartup(data: {
  name: string;
  industry?: string;
  description?: string;
  stage: string;
  website?: string;
}) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const startup = await prisma.startup.create({
    data: {
      ...data,
      founders: {
        create: [{ userId: session.user.id as string, role: "Founder" }],
      },
    },
  });

  revalidatePath("/dashboard/innovation");
  return startup;
}

export async function getIncubationPrograms() {
  return await prisma.incubationProgram.findMany({
    include: { startups: true },
    orderBy: { startDate: "desc" },
  });
}

export async function getInnovationChallenges() {
  return await prisma.innovationChallenge.findMany({
    include: { pitches: true },
    orderBy: { deadline: "asc" },
  });
}

export async function submitPitch(data: {
  title: string;
  description: string;
  deckUrl?: string;
  challengeId?: string;
  startupId?: string;
}) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const pitch = await prisma.pitchSubmission.create({
    data: {
      ...data,
      submitterId: session.user.id as string,
    },
  });

  revalidatePath("/dashboard/innovation");
  return pitch;
}

export async function getMentors() {
  return await prisma.mentor.findMany({
    include: { user: true },
  });
}
