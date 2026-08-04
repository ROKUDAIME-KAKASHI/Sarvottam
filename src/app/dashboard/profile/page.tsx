import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "./ProfileForm";
import { redirect } from "next/navigation";
import { formatUserSkills } from "@/lib/actions/skills.actions";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Fetch fresh user data from DB to ensure name and other details are up-to-date
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      userSkills: { select: { skill: { select: { name: true } } } },
      portfolioUrl: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  const formattedUser = {
    ...user,
    role: user.role.toString(),
    skills: formatUserSkills(user.userSkills),
  };

  return <ProfileForm user={formattedUser} />;
}
