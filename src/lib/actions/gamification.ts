import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// Define how much XP is needed for each level
export function getXPForLevel(level: number): number {
  if (level <= 1) return 0;
  // A simple curve: level 2 is 100, level 3 is 250, level 4 is 450, etc.
  return (level - 1) * 100 + Math.pow(level - 1, 2) * 50;
}

export function getLevelFromXP(xp: number): number {
  let level = 1;
  while (getXPForLevel(level + 1) <= xp) {
    level++;
  }
  return level;
}

export async function addXP(userId: string, amount: number) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");

  const newXP = user.xp + amount;
  const newLevel = getLevelFromXP(newXP);

  await prisma.user.update({
    where: { id: userId },
    data: { xp: newXP, level: newLevel },
  });

  revalidatePath("/dashboard");
  return { newXP, newLevel, leveledUp: newLevel > user.level };
}

export async function awardBadge(userId: string, badgeId: string) {
  // Check if badge exists
  const badge = await prisma.badge.findUnique({ where: { id: badgeId } });
  if (!badge) throw new Error("Badge not found");

  // Check if user already has it
  const existing = await prisma.userBadge.findUnique({
    where: { userId_badgeId: { userId, badgeId } },
  });
  if (existing) return { success: true, message: "Badge already earned" };

  await prisma.userBadge.create({
    data: {
      userId,
      badgeId,
    },
  });

  revalidatePath("/dashboard");
  return { success: true, message: "Badge awarded" };
}

export async function awardBadgeByName(userId: string, badgeName: string) {
  const badge = await prisma.badge.findFirst({ where: { name: badgeName } });
  if (!badge) return { success: false, message: "Badge not found" };

  const existing = await prisma.userBadge.findUnique({
    where: { userId_badgeId: { userId, badgeId: badge.id } },
  });
  if (existing) return { success: true, message: "Badge already earned" };

  await prisma.userBadge.create({
    data: {
      userId,
      badgeId: badge.id,
    },
  });

  revalidatePath("/dashboard");
  return { success: true, message: "Badge awarded" };
}

export async function getLeaderboard(limit = 10) {
  return await prisma.user.findMany({
    where: { role: "STUDENT" },
    orderBy: { xp: "desc" },
    take: limit,
    select: {
      id: true,
      name: true,
      image: true,
      xp: true,
      level: true,
    },
  });
}
