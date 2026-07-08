"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function getCourses() {
  return await prisma.course.findMany({
    include: {
      modules: { include: { lessons: true } },
      sessions: { include: { trainer: { include: { user: true } } } },
      enrollments: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createCourse(data: {
  title: string;
  description?: string;
  type: string;
  level: string;
}) {
  const session = await auth();
  if (!session?.user || session.user.role !== "SUPERADMIN") throw new Error("Unauthorized");

  const course = await prisma.course.create({
    data: {
      ...data,
      modules: {
        create: [{ title: "Introduction", description: "Getting started" }],
      },
    },
  });

  revalidatePath("/dashboard/lms");
  return course;
}

export async function enrollUser(courseId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const enrollment = await prisma.enrollment.create({
    data: {
      courseId,
      userId: session.user.id as string,
    },
  });

  revalidatePath("/dashboard/lms");
  revalidatePath(`/dashboard/lms/courses/${courseId}`);
  return enrollment;
}

export async function getTrainerSessions(trainerId: string) {
  return await prisma.session.findMany({
    where: { trainerId },
    include: {
      course: true,
      attendance: true,
      feedbacks: true,
    },
    orderBy: { startDate: "asc" },
  });
}

export async function markAttendance(sessionId: string, userId: string, status: string) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  // In a real app, verify that session.user is the trainer of the session or an admin.

  const attendance = await prisma.attendance.upsert({
    where: {
      sessionId_userId: { sessionId, userId },
    },
    update: { status },
    create: {
      sessionId,
      userId,
      status,
    },
  });

  revalidatePath(`/dashboard/lms/sessions/${sessionId}`);
  return attendance;
}
