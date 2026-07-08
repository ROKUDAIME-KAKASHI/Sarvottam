import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "./ProfileForm";
import { redirect } from "next/navigation";

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
      skills: true,
      portfolioUrl: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  return <ProfileForm user={user} />;
}
