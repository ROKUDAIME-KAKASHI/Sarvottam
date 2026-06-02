"use server";

import { auth, signIn } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function impersonateUser(targetUserId: string) {
  const session = await auth();
  
  if (!session || session.user?.role !== "SUPERADMIN") {
    throw new Error("Unauthorized: Only super admins can impersonate users");
  }

  // Generate a secure one-time token in the database
  const token = await prisma.impersonationToken.create({
    data: {
      userId: targetUserId
    }
  });

  // Call NextAuth signIn with this token
  await signIn("credentials", { 
    impersonationToken: token.id, 
    redirectTo: "/dashboard" 
  });
}

export async function getUsersForImpersonation() {
  const session = await auth();
  
  if (!session || session.user?.role !== "SUPERADMIN") {
    throw new Error("Unauthorized");
  }

  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true
    },
    orderBy: { createdAt: "desc" }
  });
}
