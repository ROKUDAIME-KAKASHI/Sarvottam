"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function getCertificationPrograms() {
  return await prisma.certificationProgram.findMany({
    include: {
      tracks: { include: { assessments: true } },
      badges: true,
      certificates: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function createCertificationProgram(data: { name: string; description?: string }) {
  const session = await auth();
  if (!session?.user || session.user.role !== "SUPERADMIN") throw new Error("Unauthorized");

  const program = await prisma.certificationProgram.create({
    data: {
      ...data,
      tracks: {
        create: [
          { name: "Foundations", level: "BEGINNER" },
          { name: "Advanced Applications", level: "ADVANCED" },
        ],
      },
    },
  });

  revalidatePath("/dashboard/certifications");
  return program;
}

export async function getUserCertifications(userId: string) {
  return await prisma.user.findUnique({
    where: { id: userId },
    include: {
      badges: { include: { badge: true } },
      microCredentials: { include: { track: { include: { program: true } } } },
      certificates: { include: { program: true, track: true, verification: true } },
    },
  });
}

export async function issueCertificate(data: {
  title: string;
  userId: string;
  programId: string;
  trackId: string;
  description?: string;
}) {
  const session = await auth();
  if (!session?.user || !["SUPERADMIN", "FACULTY"].includes(session.user.role as string)) {
    throw new Error("Unauthorized");
  }

  // Generate unique verification code
  const verificationCode = `CERT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

  const cert = await prisma.certificate.create({
    data: {
      title: data.title,
      description: data.description,
      userId: data.userId,
      programId: data.programId,
      trackId: data.trackId,
      verification: {
        create: {
          verificationCode,
        },
      },
    },
    include: { verification: true },
  });

  revalidatePath("/dashboard/certifications");
  return cert;
}

export async function verifyCertificate(code: string) {
  const verification = await prisma.certificateVerification.findUnique({
    where: { verificationCode: code },
    include: {
      certificate: { include: { user: true, program: true, track: true } },
    },
  });

  if (!verification) {
    return { valid: false, message: "Certificate not found." };
  }

  if (verification.isRevoked) {
    return { valid: false, message: "Certificate has been revoked." };
  }

  return { valid: true, data: verification.certificate };
}

export async function awardBadge(userId: string, badgeId: string) {
  const session = await auth();
  if (!session?.user || !["SUPERADMIN", "FACULTY"].includes(session.user.role as string)) {
    throw new Error("Unauthorized");
  }

  const userBadge = await prisma.userBadge.create({
    data: { userId, badgeId },
  });

  revalidatePath("/dashboard/certifications");
  return userBadge;
}
