"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Clock, ArrowUpRight, Filter, Search } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useState } from "react";

export type ProjectItem = {
  id: string;
  title: string;
  description: string;
  status: string;
  createdAt: Date | string;
  type?: string | null;
};

const BENCHMARK_PROJECTS: ProjectItem[] = [
  {
    id: "proj-cathode-dmaic",
    title: "Lithium-Ion Cathode Micro-Crack Mitigation (DMAIC)",
    description:
      "Investigating defect formation in high-nickel cathode slurries using statistical process capability models and thermal impedance spectroscopy in partnership with EV OEMs.",
    status: "IN_PROGRESS",
    createdAt: new Date().toISOString(),
    type: "Hardware",
  },
  {
    id: "proj-vision-defect",
    title: "Autonomous Edge AI Defect Classification for Precision Stamping",
    description:
      "Deploying high-speed edge computer vision algorithms for real-time scratch and weld porosity detection with sub-millimeter precision and automated SPC feedback.",
    status: "OPEN",
    createdAt: new Date().toISOString(),
    type: "Software",
  },
  {
    id: "proj-h2-pem",
    title: "Green Hydrogen Electrolyzer PEM Degradation Modeling",
    description:
      "Quantifying membrane thinning and fluoride emission rates under variable renewable power inputs in compliance with ISO 22734 industrial standards.",
    status: "IN_PROGRESS",
    createdAt: new Date().toISOString(),
    type: "Research",
  },
  {
    id: "proj-cleanroom-spc",
    title: "Cleanroom Airborne Particle Control & HVAC Yield Optimization",
    description:
      "Application of ISO 14644-1 Class 5 laminar airflow simulation and automated optical particle counter telemetry to reduce semiconductor contamination.",
    status: "COMPLETED",
    createdAt: new Date().toISOString(),
    type: "Technical",
  },
];

export default function ProjectList({ projects }: { projects: ProjectItem[] }) {
  const [filterType, setFilterType] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const types = ["All", "Software", "Hardware", "Technical", "Business", "Design", "Research"];

  const sourceProjects = projects.length > 0 ? projects : BENCHMARK_PROJECTS;

  const filteredProjects = sourceProjects.filter((p) => {
    const matchesType =
      filterType === "All" || (p.type && p.type.toLowerCase() === filterType.toLowerCase());

    const matchesSearch =
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesType && matchesSearch;
  });

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects, technologies, or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9.5 h-10 rounded-xl bg-card border-border/70 text-sm shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="h-10 px-3 rounded-xl border border-border/70 bg-card text-sm focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
          >
            {types.map((t) => (
              <option key={t} value={t}>
                {t === "All" ? "All Disciplines" : t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredProjects.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-2xl border border-dashed border-border/70">
          No projects match your search criteria.
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5"
        >
          {filteredProjects.map((project) => (
            <motion.div key={project.id} variants={item}>
              <Card className="group h-full rounded-2xl border-border/60 bg-card hover:border-primary/40 hover:shadow-sm transition-all duration-300 flex flex-col justify-between">
                <CardHeader className="p-5 pb-3">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <Badge
                      variant="outline"
                      className={`rounded-md px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                        project.status === "OPEN"
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                          : project.status === "IN_PROGRESS"
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                            : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30"
                      }`}
                    >
                      {project.status.replace(/_/g, " ")}
                    </Badge>

                    {project.type && (
                      <span className="text-[11px] font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-md">
                        {project.type}
                      </span>
                    )}
                  </div>

                  <CardTitle className="text-base font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                    {project.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-5 pt-0 space-y-4 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                    {project.description}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-border/40 mt-auto">
                    <div
                      suppressHydrationWarning
                      className="flex items-center text-[11px] font-medium text-muted-foreground"
                    >
                      <Clock className="h-3 w-3 mr-1 opacity-60" />
                      {new Date(project.createdAt).toLocaleDateString()}
                    </div>
                    <Link
                      href={`/dashboard/projects/${project.id}`}
                      className={buttonVariants({
                        variant: "ghost",
                        size: "sm",
                        className:
                          "h-7 px-2.5 text-xs rounded-lg group-hover:bg-primary/10 group-hover:text-primary transition-all font-semibold",
                      })}
                    >
                      Workspace
                      <ArrowUpRight className="ml-1 h-3 w-3" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
