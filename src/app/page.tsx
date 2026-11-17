import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { SystemHero } from "@/components/home/system-hero";
import {
  SystemExplorer,
  type SerializedProblem,
  type SerializedProject,
} from "@/components/home/system-explorer";
import { SystemPipeline } from "@/components/home/system-pipeline";
import { RoleWorkspaces } from "@/components/home/role-workspaces";
import { FastIntakeWidget } from "@/components/home/fast-intake-widget";
import { QualityFrameworks } from "@/components/home/quality-frameworks";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Cpu } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const session = await auth();

  // Fetch real platform data with safe fallbacks
  let problemsRaw: any[] = [];
  let projectsRaw: any[] = [];
  let stats = {
    problemsCount: 4,
    projectsCount: 4,
    departmentsCount: 2,
    usersCount: 8,
  };

  try {
    const [pList, prList, probCount, projCount, deptCount, uCount] = await Promise.all([
      prisma.problem.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
        include: { submitter: true, assignee: true },
      }),
      prisma.project.findMany({
        take: 6,
        orderBy: { createdAt: "desc" },
        include: {
          mentor: { include: { user: true } },
          partner: { include: { user: true } },
          department: true,
        },
      }),
      prisma.problem.count(),
      prisma.project.count(),
      prisma.department.count(),
      prisma.user.count(),
    ]);

    problemsRaw = pList;
    projectsRaw = prList;
    stats = {
      problemsCount: probCount,
      projectsCount: projCount,
      departmentsCount: deptCount,
      usersCount: uCount,
    };
  } catch (error) {
    console.error("Home page DB fetch error, using fallback telemetry:", error);
  }

  // Safely serialize database records for client components
  const serializedProblems: SerializedProblem[] = problemsRaw.map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    type: p.type,
    area: p.area || "PROCESS",
    status: p.status || "OPEN",
    level: p.level || "MEDIUM",
    adminApproved: !!p.adminApproved,
    facultyApproved: !!p.facultyApproved,
    industryApproved: !!p.industryApproved,
    createdAt: p.createdAt ? new Date(p.createdAt).toISOString() : new Date().toISOString(),
    submitter: p.submitter
      ? {
          name: p.submitter.name,
          email: p.submitter.email,
          role: p.submitter.role,
        }
      : null,
  }));

  const serializedProjects: SerializedProject[] = projectsRaw.map((pr) => ({
    id: pr.id,
    title: pr.title,
    description: pr.description,
    difficultyLevel: pr.difficultyLevel,
    duration: pr.duration,
    status: pr.status || "OPEN",
    type: pr.type,
    createdAt: pr.createdAt ? new Date(pr.createdAt).toISOString() : new Date().toISOString(),
    department: pr.department ? { name: pr.department.name } : null,
    mentor: pr.mentor?.user ? { user: { name: pr.mentor.user.name } } : null,
    partner: pr.partner ? { companyName: pr.partner.companyName } : null,
  }));

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. System Command Center & Live Telemetry Hero */}
      <SystemHero stats={stats} isLoggedIn={!!session?.user} />

      {/* 2. Interactive Live Challenge & Research Explorer */}
      <SystemExplorer
        problems={serializedProblems}
        projects={serializedProjects}
        isLoggedIn={!!session?.user}
      />

      {/* 3. 4-Stage Operational Quality Pipeline */}
      <SystemPipeline />

      {/* 4. Role Workspaces (Student, Faculty, Industry, Admin) */}
      <RoleWorkspaces isLoggedIn={!!session?.user} />

      {/* 5. Fast Challenge Intake Console */}
      <FastIntakeWidget isLoggedIn={!!session?.user} />

      {/* 6. Grounded Quality & Research Methodologies */}
      <QualityFrameworks />

      {/* 7. Institutional Final Action Banner */}
      <section className="py-20 bg-background relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-mono">
              <Cpu className="h-3.5 w-3.5" />
              ECOSYSTEM GOVERNANCE READY
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Ready to Connect Industry Challenges to Academic Excellence?
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Join Indian Foundation for Quality Management (IFQM) and JAIN University in pioneering
              practical, audited quality engineering.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link
                href={session?.user ? "/dashboard" : "/login"}
                className={buttonVariants({
                  size: "lg",
                  className: "h-12 px-7 rounded-xl font-semibold shadow-xs",
                })}
              >
                {session?.user ? "Enter Your Dashboard" : "Access Workspace Portal"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/framework"
                className={buttonVariants({
                  variant: "outline",
                  size: "lg",
                  className: "h-12 px-7 rounded-xl border-border/60",
                })}
              >
                Inspect Methodology
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
