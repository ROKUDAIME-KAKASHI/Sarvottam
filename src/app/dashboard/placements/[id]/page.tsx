import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Building, MapPin, Briefcase, UserCircle, ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { ApplyForm } from "./ApplyForm";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const BENCHMARK_JOB_DETAILS: Record<string, any> = {
  "job-tata-01": {
    id: "job-tata-01",
    title: "Quality Engineering Fellow (Six Sigma DMAIC)",
    company: "Tata Motors Passenger Vehicles",
    location: "Pune / Bengaluru",
    type: "RESEARCH_FELLOWSHIP",
    description:
      "Join the Advanced Manufacturing & Quality Engineering division to analyze body-in-white dimensional variance, apply statistical process control, and implement real-time Cp/Cpk optimization protocols.\n\nKey Responsibilities:\n- Execute Gage R&R studies on robotic welding coordinate measuring machines (CMM).\n- Develop Ishikawa root cause models for sheet metal spring-back variance.\n- Track scrap reduction KPIs and calculate COPQ savings for quarterly executive review.\n\nPreferred Qualifications:\n- Coursework or certification in Lean Six Sigma (Green Belt preferred).\n- Familiarity with Minitab, Python, or statistical quality engineering software.",
    createdAt: new Date().toISOString(),
    poster: { name: "Dr. Arvind Swaminathan", role: "INDUSTRY_PARTNER" },
    applications: [],
  },
  "job-ola-02": {
    id: "job-ola-02",
    title: "Battery Cell Reliability & Yield Engineer",
    company: "Ola Electric Futurefactory",
    location: "Krishnagiri / Bengaluru",
    type: "FULL_TIME",
    description:
      "Lead continuous improvement sprints reducing cylindrical cell cathode coating thickness variability. Responsible for Gage R&R studies, defect root cause analysis, and yield optimization.\n\nScope of Work:\n- SPC monitoring of slurry viscosity and slot-die coating thickness across 24/7 lines.\n- Thermal runaway stress testing and impedance spectroscopy correlation.\n- Automated defect logging in compliance with AIS-156 safety standards.",
    createdAt: new Date().toISOString(),
    poster: { name: "IFQM Quality Council", role: "SUPERADMIN" },
    applications: [],
  },
  "job-titan-03": {
    id: "job-titan-03",
    title: "Precision Metrology & Lean Process Intern",
    company: "Titan Company Ltd (Precision Engineering)",
    location: "Hosur, Tamil Nadu",
    type: "INTERNSHIP",
    description:
      "Hands-on internship focusing on micro-machining tolerances (< 3 microns), automated optical inspection calibration, and Lean waste reduction across assembly cells.\n\nActivities:\n- 5S audit and Kaizen event facilitation on micro-gear CNC lines.\n- Optical comparator calibration and gauge uncertainty analysis.",
    createdAt: new Date().toISOString(),
    poster: { name: "Prof. S. R. Narasimhan", role: "FACULTY" },
    applications: [],
  },
  "job-infosys-04": {
    id: "job-infosys-04",
    title: "Enterprise ESG & Carbon Auditing Analyst",
    company: "Infosys Sustainability Labs",
    location: "Bengaluru, Karnataka",
    type: "FULL_TIME",
    description:
      "Conduct operational audits assessing Scope 1-3 greenhouse gas emissions, ISO 14001 compliance, and circular economy tracking for enterprise supply chain partners.\n\nDeliverables:\n- Supply chain carbon footprint telemetry model.\n- Audit preparation for SEBI Business Responsibility and Sustainability Reporting (BRSR).",
    createdAt: new Date().toISOString(),
    poster: { name: "K. R. Venkatraman", role: "INDUSTRY_PARTNER" },
    applications: [],
  },
};

export default async function JobDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session) redirect("/login");

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let job: any = null;
  try {
    job = await prisma.job.findUnique({
      where: { id },
      include: {
        poster: { select: { name: true, role: true } },
        applications: {
          where: { applicantId: session.user?.id },
        },
      },
    });
  } catch (error) {
    console.warn("Database lookup failed for job details, checking benchmark registry:", error);
  }

  if (!job) {
    job = BENCHMARK_JOB_DETAILS[id];
  }

  if (!job) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <h2 className="text-2xl font-bold">Position Not Found</h2>
        <Link href="/dashboard/placements" className={buttonVariants({ variant: "outline" })}>
          Back to Placements
        </Link>
      </div>
    );
  }

  const hasApplied = job.applications && job.applications.length > 0;
  const isStudent = session.user?.role === "STUDENT";

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <Link
        href="/dashboard/placements"
        className="inline-flex items-center text-sm font-semibold text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Placement Directory
      </Link>

      <div className="bg-card rounded-2xl border border-border/60 shadow-sm overflow-hidden">
        <div className="p-6 md:p-8 space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3">
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-0 font-semibold text-xs">
                {job.type.replace(/_/g, " ")}
              </Badge>
              <span className="text-xs font-medium text-muted-foreground flex items-center">
                <Clock className="w-3.5 h-3.5 mr-1" />
                Posted on {new Date(job.createdAt).toLocaleDateString()}
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
              {job.title}
            </h1>

            <div className="flex flex-wrap items-center gap-5 text-muted-foreground text-sm font-medium pt-1">
              <span className="flex items-center text-foreground font-semibold">
                <Building className="w-4 h-4 text-primary mr-2 shrink-0" />
                {job.company}
              </span>
              {job.location && (
                <span className="flex items-center text-foreground/80">
                  <MapPin className="w-4 h-4 text-primary mr-1.5 shrink-0" />
                  {job.location}
                </span>
              )}
              <span className="flex items-center text-foreground/80">
                <UserCircle className="w-4 h-4 text-primary mr-1.5 shrink-0" />
                Posted by {job.poster?.name || "Corporate Quality Partner"}
              </span>
            </div>
          </div>

          <div className="pt-6 border-t border-border/50">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-3">
              Position Overview & Competency Requirements
            </h3>
            <div className="prose prose-sm dark:prose-invert max-w-none text-foreground leading-relaxed">
              <p className="whitespace-pre-wrap">{job.description}</p>
            </div>
          </div>
        </div>

        <div className="bg-muted/20 border-t border-border/50 p-6 md:p-8">
          {isStudent ? (
            hasApplied ? (
              <div className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 p-4 rounded-xl border border-emerald-500/20 text-center font-semibold text-sm">
                Application Submitted & Verified — Under Review by Sponsor
              </div>
            ) : (
              <div className="bg-card rounded-xl border border-border/60 p-6 shadow-sm">
                <h3 className="text-lg font-bold mb-3 flex items-center">
                  <Briefcase className="w-4 h-4 mr-2 text-primary" />
                  Submit Candidate Expression of Interest
                </h3>
                <ApplyForm jobId={job.id} />
              </div>
            )
          ) : (
            <div className="text-center py-3 text-muted-foreground text-sm font-medium">
              You are viewing this job listing in review/mentor mode.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
