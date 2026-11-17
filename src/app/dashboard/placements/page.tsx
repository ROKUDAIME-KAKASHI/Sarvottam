import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Plus, Video, FileCode, Sparkles, GraduationCap } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import { PlacementList, PlacementJob } from "./PlacementList";

export default async function PlacementsPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const userRole = session.user?.role || "STUDENT";
  const userId = session.user?.id;

  let jobs: PlacementJob[] = [];
  try {
    const rawJobs = await prisma.job.findMany({
      where: { status: "OPEN" },
      include: {
        poster: { select: { name: true, role: true } },
        applications: {
          where: { applicantId: userId },
        },
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    jobs = rawJobs as unknown as PlacementJob[];
  } catch (error) {
    console.warn("Failed to fetch jobs from database, rendering verified benchmark roles:", error);
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-400">
      <PageHeader
        title="Placements & Industry Fellowships"
        description="Direct recruitment pipeline connecting certified student researchers with IFQM corporate sponsors."
        icon={Briefcase}
      >
        {["FACULTY", "INDUSTRY_PARTNER", "SUPERADMIN"].includes(userRole) && (
          <Link
            href="/dashboard/placements/new"
            className={buttonVariants({
              className: "rounded-xl font-semibold shadow-sm transition-all",
              size: "default",
            })}
          >
            <Plus className="w-4 h-4 mr-1.5" />
            Post Position
          </Link>
        )}
      </PageHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Feed: Live search & filterable jobs */}
        <div className="lg:col-span-2">
          <PlacementList initialJobs={jobs} userRole={userRole} userId={userId} />
        </div>

        {/* Sidebar: Accelerated Career Tools */}
        <div className="space-y-6">
          <Card className="border-border/60 bg-card shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2 text-primary font-bold text-sm">
                <Sparkles className="w-4 h-4" /> Quality Career Acceleration
              </div>
              <CardTitle className="text-base font-bold">Fast-Track Protocols</CardTitle>
              <CardDescription className="text-xs">
                Tools to accelerate placement conversion with corporate partners.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {[
                {
                  title: "1-on-1 Mock Interviews",
                  desc: "Practice with industry assessors & quality directors",
                  href: "/dashboard/placements/mock-interviews",
                  icon: Video,
                },
                {
                  title: "Research Portfolio Review",
                  desc: "Submit project case studies for expert evaluation",
                  href: "/dashboard/placements/portfolio-review",
                  icon: FileCode,
                },
                {
                  title: "Verifiable Credential Ledger",
                  desc: "Authenticate Six Sigma and TQM certifications",
                  href: "/dashboard/certifications/verify",
                  icon: GraduationCap,
                },
              ].map((res, i) => (
                <Link
                  key={i}
                  href={res.href}
                  className="flex items-start gap-3 p-3 rounded-xl border border-border/60 hover:border-primary/40 hover:bg-muted/40 transition-all group"
                >
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:scale-105 transition-transform">
                    <res.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                      {res.title}
                    </h4>
                    <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">
                      {res.desc}
                    </p>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>

          {/* Institutional Partner Benchmark */}
          <div className="p-4 rounded-xl border border-border/60 bg-muted/20 space-y-2 text-xs">
            <span className="font-semibold text-foreground uppercase tracking-wider block text-[10px]">
              IFQM Hiring Standards
            </span>
            <p className="text-muted-foreground leading-relaxed">
              Corporate partners prioritize candidates with verifiable DMAIC milestones and Level 2+
              competency badges.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
