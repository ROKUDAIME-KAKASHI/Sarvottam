import { prisma } from "@/lib/prisma";

export async function updateUserSkills(userId: string, skillsString: string) {
  const skillNames = skillsString
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  // Clear existing skills
  await prisma.userSkill.deleteMany({
    where: { userId },
  });

  if (skillNames.length === 0) return;

  // Upsert skills and connect
  for (const name of skillNames) {
    const skill = await prisma.skill.upsert({
      where: { name },
      update: {},
      create: { name, category: "General" },
    });

    await prisma.userSkill.create({
      data: {
        userId,
        skillId: skill.id,
      },
    });
  }
}

export function formatUserSkills(userSkills?: { skill: { name: string } }[]) {
  if (!userSkills || userSkills.length === 0) return "";
  return userSkills.map((us) => us.skill.name).join(", ");
}
