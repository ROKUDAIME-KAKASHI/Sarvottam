import { prisma } from "@/lib/prisma";
import KPIsClient from "./KpisClient";

export default async function KPIsPage() {
  const [totalProjects, activeStudents, completedProjects, totalUsers] = await Promise.all([
    prisma.project.count(),
    prisma.application.count({ where: { status: "ACCEPTED" } }),
    prisma.project.count({ where: { status: "COMPLETED" } }),
    prisma.user.count()
  ]);

  const stats = {
    totalProjects,
    activeStudents,
    completedProjects,
    totalUsers
  };

  return <KPIsClient stats={stats} />;
}
