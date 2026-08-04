import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import SettingsClient from "./SettingsClient";
import { redirect } from "next/navigation";
import { formatUserSkills } from "@/lib/actions/skills.actions";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { userSkills: { include: { skill: true } } },
  });

  if (!user) return <div>Not signed in</div>;

  const formattedUser = {
    ...user,
    role: user.role.toString(),
    skills: formatUserSkills(user.userSkills),
  };

  return <SettingsClient user={formattedUser} />;
}
