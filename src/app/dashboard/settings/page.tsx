import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import SettingsClient from "./SettingsClient";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) return <div>Not signed in</div>;

  return <SettingsClient user={user} />;
}
