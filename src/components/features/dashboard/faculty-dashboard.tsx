import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { FacultyStatsCards } from "./faculty/FacultyStatsCards";
import { RecentSubmissionsList } from "./faculty/RecentSubmissionsList";
import { StudentProblemsList } from "./faculty/StudentProblemsList";

export async function FacultyDashboard() {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) return null;

  const mentoredProjects = await prisma.project.findMany({
    where: { mentorId: userId },
    include: {
      applications: {
        include: { user: true },
      },
    },
  });

  const pendingApprovalsCount = mentoredProjects.reduce(
    (count, project) =>
      count +
      project.applications.filter((a) => a.status === "PENDING" && !a.facultyApproved).length,
    0
  );

  const studentTeamsCount = new Set(
    mentoredProjects.flatMap((p) =>
      p.applications.filter((a) => a.status === "ACCEPTED").map((a) => a.userId)
    )
  ).size;

  // Gather all applications for the "recent submissions" list
  const recentApplications = mentoredProjects
    .flatMap((p) => p.applications.map((a) => ({ ...a, projectTitle: p.title })))
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  // Fetch student-submitted problems for faculty approval
  const studentProblems = await prisma.problem.findMany({
    where: {
      submitter: { role: "STUDENT" },
    },
    include: { submitter: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Faculty Dashboard</h2>
        <p className="text-muted-foreground">Manage your mentored projects and student teams.</p>
      </div>

      <FacultyStatsCards
        mentoredProjectsCount={mentoredProjects.length}
        studentTeamsCount={studentTeamsCount}
        pendingApprovalsCount={pendingApprovalsCount}
        studentProblemsCount={studentProblems.length}
      />

      <div className="grid gap-6 md:grid-cols-2">
        <RecentSubmissionsList recentApplications={recentApplications} />
        <StudentProblemsList studentProblems={studentProblems} />
      </div>
    </div>
  );
}
