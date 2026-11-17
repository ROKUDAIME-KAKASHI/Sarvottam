"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Briefcase,
  Building,
  MapPin,
  UserCircle,
  Search,
  Clock,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export type PlacementJob = {
  id: string;
  title: string;
  company: string;
  location?: string | null;
  type: string;
  description: string;
  createdAt: Date | string;
  poster?: { name: string | null; role: string } | null;
  applications?: { id: string }[];
  _count?: { applications: number };
};

const BENCHMARK_JOBS: PlacementJob[] = [
  {
    id: "job-tata-01",
    title: "Quality Engineering Fellow (Six Sigma DMAIC)",
    company: "Tata Motors Passenger Vehicles",
    location: "Pune / Bengaluru",
    type: "RESEARCH_FELLOWSHIP",
    description:
      "Join the Advanced Manufacturing & Quality Engineering division to analyze body-in-white dimensional variance, apply statistical process control, and implement real-time Cp/Cpk optimization protocols.",
    createdAt: new Date().toISOString(),
    poster: { name: "Dr. Arvind Swaminathan", role: "INDUSTRY_PARTNER" },
    _count: { applications: 7 },
  },
  {
    id: "job-ola-02",
    title: "Battery Cell Reliability & Yield Engineer",
    company: "Ola Electric Futurefactory",
    location: "Krishnagiri / Bengaluru",
    type: "FULL_TIME",
    description:
      "Lead continuous improvement sprints reducing cylindrical cell cathode coating thickness variability. Responsible for Gage R&R studies, defect root cause analysis, and yield optimization.",
    createdAt: new Date().toISOString(),
    poster: { name: "IFQM Quality Council", role: "SUPERADMIN" },
    _count: { applications: 12 },
  },
  {
    id: "job-titan-03",
    title: "Precision Metrology & Lean Process Intern",
    company: "Titan Company Ltd (Precision Engineering)",
    location: "Hosur, Tamil Nadu",
    type: "INTERNSHIP",
    description:
      "Hands-on internship focusing on micro-machining tolerances (< 3 microns), automated optical inspection calibration, and Lean waste reduction across assembly cells.",
    createdAt: new Date().toISOString(),
    poster: { name: "Prof. S. R. Narasimhan", role: "FACULTY" },
    _count: { applications: 9 },
  },
  {
    id: "job-infosys-04",
    title: "Enterprise ESG & Carbon Auditing Analyst",
    company: "Infosys Sustainability Labs",
    location: "Bengaluru, Karnataka",
    type: "FULL_TIME",
    description:
      "Conduct operational audits assessing Scope 1-3 greenhouse gas emissions, ISO 14001 compliance, and circular economy tracking for enterprise supply chain partners.",
    createdAt: new Date().toISOString(),
    poster: { name: "K. R. Venkatraman", role: "INDUSTRY_PARTNER" },
    _count: { applications: 5 },
  },
];

export function PlacementList({
  initialJobs,
  userRole,
  userId,
}: {
  initialJobs: PlacementJob[];
  userRole: string;
  userId?: string;
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [appliedJobs, setAppliedJobs] = useState<Record<string, boolean>>({});

  const displayJobs = initialJobs.length > 0 ? initialJobs : BENCHMARK_JOBS;

  const filteredJobs = displayJobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (job.location && job.location.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesType =
      typeFilter === "ALL" ||
      job.type.toUpperCase() === typeFilter.toUpperCase() ||
      job.type.replace("_", "").toUpperCase() === typeFilter.replace("_", "").toUpperCase();

    return matchesSearch && matchesType;
  });

  const handleApply = (jobId: string) => {
    setAppliedJobs((prev) => ({ ...prev, [jobId]: true }));
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search roles, companies, technical skills, or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-11 rounded-xl bg-card border-border/70 text-sm shadow-sm"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-muted/50 rounded-xl border border-border/50">
          {["ALL", "FULL_TIME", "INTERNSHIP", "RESEARCH_FELLOWSHIP"].map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                typeFilter === t
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "ALL"
                ? "All Positions"
                : t === "FULL_TIME"
                  ? "Full Time"
                  : t === "INTERNSHIP"
                    ? "Internship"
                    : "Research Fellowship"}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs Feed */}
      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-2xl border border-dashed border-border/80">
            <Briefcase className="w-10 h-10 text-muted-foreground/30 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-foreground">No matching positions found</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Try adjusting your search keywords or filter category.
            </p>
          </div>
        ) : (
          filteredJobs.map((job) => {
            const hasAppliedDB = job.applications && job.applications.length > 0;
            const isApplied = hasAppliedDB || appliedJobs[job.id];

            return (
              <Card
                key={job.id}
                className="border-border/60 bg-card hover:border-primary/40 transition-all hover:shadow-sm"
              >
                <CardHeader className="pb-3 flex flex-col md:flex-row md:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <Badge
                        variant="outline"
                        className="bg-primary/5 text-primary border-primary/20 text-xs font-medium"
                      >
                        {job.type.replace(/_/g, " ")}
                      </Badge>
                      <span className="text-xs font-medium text-muted-foreground flex items-center">
                        <Clock className="w-3 h-3 mr-1" />
                        {new Date(job.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <CardTitle className="text-lg font-bold">{job.title}</CardTitle>
                    <CardDescription className="flex flex-wrap items-center gap-2 text-foreground/80 font-medium pt-0.5">
                      <span className="flex items-center gap-1.5 text-primary font-semibold">
                        <Building className="w-4 h-4 text-primary" /> {job.company}
                      </span>
                      {job.location && (
                        <>
                          <span className="text-muted-foreground/40">•</span>
                          <span className="flex items-center gap-1 text-muted-foreground text-xs">
                            <MapPin className="w-3.5 h-3.5 text-muted-foreground" /> {job.location}
                          </span>
                        </>
                      )}
                    </CardDescription>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    {userRole === "STUDENT" &&
                      (isApplied ? (
                        <div className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-4 py-2 rounded-xl text-xs font-semibold">
                          <CheckCircle2 className="w-4 h-4" /> Application Under Review
                        </div>
                      ) : (
                        <Button
                          onClick={() => handleApply(job.id)}
                          className="rounded-xl px-5 h-9 text-xs font-semibold shadow-sm"
                        >
                          Express Interest
                        </Button>
                      ))}
                    {userRole !== "STUDENT" && (
                      <div className="text-xs font-semibold text-primary bg-primary/10 px-3 py-1.5 rounded-lg">
                        {job._count?.applications || 0} Candidates
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="pb-3 text-xs md:text-sm text-muted-foreground leading-relaxed">
                  {job.description}
                </CardContent>

                <CardFooter className="pt-2 flex justify-between items-center bg-muted/20 border-t border-border/40 py-2.5 px-6 rounded-b-xl">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <UserCircle className="w-3.5 h-3.5" />
                    <span>Posted by {job.poster?.name || "Corporate Quality Partner"}</span>
                    <span className="bg-foreground/5 px-2 py-0.5 rounded text-[10px] uppercase font-mono">
                      {job.poster?.role || "INDUSTRY"}
                    </span>
                  </div>

                  <Link
                    href={`/dashboard/placements/${job.id}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                  >
                    View Full Brief <ArrowRight className="w-3 h-3" />
                  </Link>
                </CardFooter>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
