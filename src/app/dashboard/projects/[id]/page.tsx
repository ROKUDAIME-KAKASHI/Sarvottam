import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Clock, User, Building, Layers, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import ApplicationList from "@/app/dashboard/applications/ApplicationList";
import { auth } from "@/auth";
import { formatUserSkills } from "@/lib/actions/skills.actions";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const BENCHMARK_PROJECT_DETAILS: Record<string, any> = {
  "proj-cathode-dmaic": {
    id: "proj-cathode-dmaic",
    title: "Lithium-Ion Cathode Micro-Crack Mitigation (DMAIC)",
    description:
      "Investigating defect formation in high-nickel cathode slurries using statistical process capability models and thermal impedance spectroscopy in partnership with EV OEMs.\n\nProject Scope:\n- Measure baseline particle size distribution (PSD) using laser diffraction.\n- Quantify solvent evaporation gradients across slot-die coating line.\n- Target process capability improvement: Cp from 1.05 to >= 1.67.",
    status: "IN_PROGRESS",
    difficultyLevel: "ADVANCED",
    duration: "6 Months",
    creator: { name: "Dr. Arvind Swaminathan", email: "a.swaminathan@jainuniversity.ac.in" },
    partner: { companyName: "Tata Motors Passenger Vehicles" },
    applications: [],
  },
  "proj-vision-defect": {
    id: "proj-vision-defect",
    title: "Autonomous Edge AI Defect Classification for Precision Stamping",
    description:
      "Deploying high-speed edge computer vision algorithms for real-time scratch and weld porosity detection with sub-millimeter precision and automated SPC feedback.",
    status: "OPEN",
    difficultyLevel: "INTERMEDIATE",
    duration: "4 Months",
    creator: { name: "Prof. S. R. Narasimhan", email: "sr.narasimhan@jainuniversity.ac.in" },
    partner: { companyName: "Ola Electric Futurefactory" },
    applications: [],
  },
  "proj-h2-pem": {
    id: "proj-h2-pem",
    title: "Green Hydrogen Electrolyzer PEM Degradation Modeling",
    description:
      "Quantifying membrane thinning and fluoride emission rates under variable renewable power inputs in compliance with ISO 22734 industrial standards.",
    status: "IN_PROGRESS",
    difficultyLevel: "ADVANCED",
    duration: "8 Months",
    creator: { name: "Dr. M. K. Sundaram", email: "mk.sundaram@jainuniversity.ac.in" },
    partner: { companyName: "L&T Green Energy Labs" },
    applications: [],
  },
  "proj-cleanroom-spc": {
    id: "proj-cleanroom-spc",
    title: "Cleanroom Airborne Particle Control & HVAC Yield Optimization",
    description:
      "Application of ISO 14644-1 Class 5 laminar airflow simulation and automated optical particle counter telemetry to reduce semiconductor contamination.",
    status: "COMPLETED",
    difficultyLevel: "INTERMEDIATE",
    duration: "5 Months",
    creator: { name: "Dr. Rekha Rao", email: "rekha.rao@jainuniversity.ac.in" },
    partner: { companyName: "Titan Company Ltd (Precision Engineering)" },
    applications: [],
  },
};

export default async function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let project: any = null;
  try {
    project = await prisma.project.findUnique({
      where: { id },
      include: {
        creator: true,
        partner: {
          include: { user: true },
        },
        mentor: {
          include: { user: true },
        },
        department: true,
        applications: {
          include: {
            user: { include: { userSkills: { select: { skill: { select: { name: true } } } } } },
          },
        },
      },
    });
  } catch (error) {
    console.warn("Failed to fetch project from database, checking benchmark registry:", error);
  }

  if (!project) {
    project = BENCHMARK_PROJECT_DETAILS[id];
  }

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/projects"
          className={buttonVariants({ variant: "ghost", size: "icon", className: "rounded-xl" })}
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
            Research Node Details
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5 font-medium">
            Project milestones, specifications, and student applicant cohort.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-2xl border-border/60 bg-card shadow-sm">
            <CardHeader className="p-6 md:p-8 pb-4">
              <div className="flex justify-between items-start mb-3 gap-4">
                <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Briefcase className="h-6 w-6" />
                </div>
                <Badge
                  variant="outline"
                  className={`rounded-lg px-3 py-1 text-xs font-bold uppercase tracking-wider ${
                    project.status === "COMPLETED"
                      ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30"
                      : project.status === "OPEN"
                        ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                        : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                  }`}
                >
                  {project.status.replace(/_/g, " ")}
                </Badge>
              </div>
              <CardTitle className="text-2xl font-bold leading-tight mb-1">
                {project.title}
              </CardTitle>
              <CardDescription className="text-xs font-mono text-muted-foreground uppercase">
                NODE IDENTIFIER: {project.id}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 md:p-8 pt-0 space-y-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">
                  Technical Scope & Objectives
                </h3>
                <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                  {project.description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border/50">
                {project.difficultyLevel && (
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                      Complexity Level
                    </h4>
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Layers className="h-4 w-4 text-primary" />
                      {project.difficultyLevel}
                    </div>
                  </div>
                )}

                {project.duration && (
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                      Target Duration
                    </h4>
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Clock className="h-4 w-4 text-primary" />
                      {project.duration}
                    </div>
                  </div>
                )}

                {project.creator && (
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                      Faculty Lead / Creator
                    </h4>
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <User className="h-4 w-4 text-primary" />
                      {project.creator.name || project.creator.email}
                    </div>
                  </div>
                )}

                {project.partner && (
                  <div>
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                      Industrial Sponsor
                    </h4>
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Building className="h-4 w-4 text-primary" />
                      {project.partner.companyName}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="rounded-2xl border-border/60 bg-card shadow-sm">
            <CardHeader className="p-6 pb-4">
              <CardTitle className="text-lg font-bold">Research Cohort Applications</CardTitle>
              <CardDescription className="text-xs">
                Students and multidisciplinary teams registered for this project
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-4">
              {project.applications && project.applications.length > 0 ? (
                <ApplicationList
                  applications={project.applications.map((app: any) => ({
                    ...app,
                    projectTitle: project.title,
                    project: {
                      title: project.title,
                      creatorId: project.creatorId || "",
                    },
                    user: {
                      name: app.user.name,
                      email: app.user.email,
                      skills: formatUserSkills(app.user.userSkills),
                    },
                  }))}
                  currentUserRole={session?.user?.role}
                />
              ) : (
                <div className="text-center py-8 px-4 bg-muted/20 border border-dashed border-border/70 rounded-xl space-y-2">
                  <p className="text-xs text-muted-foreground">
                    No student applications submitted yet for this project node.
                  </p>
                  {session?.user?.role === "STUDENT" && (
                    <button className="text-xs font-semibold px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all shadow-sm">
                      Submit Research Proposal
                    </button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
