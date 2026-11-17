"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Building2,
  GraduationCap,
  Sparkles,
  AlertCircle,
  ShieldCheck,
  Tag,
  Briefcase,
  X,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export interface SerializedProblem {
  id: string;
  title: string;
  description: string | null;
  type: string | null;
  area: string;
  status: string;
  level: string;
  adminApproved: boolean;
  facultyApproved: boolean;
  industryApproved: boolean;
  createdAt: string;
  submitter?: {
    name: string | null;
    email: string | null;
    role: string;
  } | null;
}

export interface SerializedProject {
  id: string;
  title: string;
  description: string;
  difficultyLevel?: string | null;
  duration?: string | null;
  status: string;
  type?: string | null;
  createdAt: string;
  department?: {
    name: string;
  } | null;
  mentor?: {
    user: {
      name: string | null;
    } | null;
  } | null;
  partner?: {
    companyName: string;
  } | null;
}

interface SystemExplorerProps {
  problems: SerializedProblem[];
  projects: SerializedProject[];
  isLoggedIn: boolean;
}

export function SystemExplorer({ problems, projects, isLoggedIn }: SystemExplorerProps) {
  const [activeTab, setActiveTab] = useState<"ALL" | "PROBLEMS" | "PROJECTS">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedArea, setSelectedArea] = useState<string>("ALL");
  const [activeInspectItem, setActiveInspectItem] = useState<{
    type: "problem" | "project";
    data: any;
  } | null>(null);

  // Extract distinct areas/sectors
  const areas = useMemo(() => {
    const set = new Set<string>();
    problems.forEach((p) => p.area && set.add(p.area));
    projects.forEach((pr) => pr.department?.name && set.add(pr.department.name));
    return Array.from(set);
  }, [problems, projects]);

  // Filter items
  const filteredProblems = useMemo(() => {
    return problems.filter((p) => {
      const matchesSearch =
        searchQuery === "" ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.submitter?.name && p.submitter.name.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesArea =
        selectedArea === "ALL" || p.area.toLowerCase() === selectedArea.toLowerCase();

      return matchesSearch && matchesArea;
    });
  }, [problems, searchQuery, selectedArea]);

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch =
        searchQuery === "" ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.department?.name &&
          p.department.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.partner?.companyName &&
          p.partner.companyName.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesArea =
        selectedArea === "ALL" ||
        (p.department?.name && p.department.name.toLowerCase() === selectedArea.toLowerCase());

      return matchesSearch && matchesArea;
    });
  }, [projects, searchQuery, selectedArea]);

  const totalResults =
    activeTab === "ALL"
      ? filteredProblems.length + filteredProjects.length
      : activeTab === "PROBLEMS"
        ? filteredProblems.length
        : filteredProjects.length;

  return (
    <section
      id="explorer"
      className="py-20 md:py-28 bg-muted/20 border-b border-border/40 relative"
    >
      <div className="container mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-mono mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              LIVE REPOSITORY TELEMETRY
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Live Challenge & Research Explorer
            </h2>
            <p className="text-muted-foreground mt-2 text-base max-w-2xl">
              Inspect active manufacturing bottlenecks submitted by industry partners and ongoing
              engineering research workspaces supervised by faculty.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/problems"
              className={buttonVariants({
                variant: "outline",
                size: "sm",
                className: "rounded-xl text-xs font-medium border-border/60",
              })}
            >
              All Problems <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
            <Link
              href="/research"
              className={buttonVariants({
                size: "sm",
                className: "rounded-xl text-xs font-medium shadow-xs",
              })}
            >
              Research Marketplace <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="p-4 rounded-2xl border border-border/60 bg-background/80 backdrop-blur-md shadow-xs mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            {/* View Switcher Tabs */}
            <div className="flex items-center p-1 rounded-xl bg-muted/60 border border-border/40 text-xs font-medium self-start sm:self-auto">
              <button
                onClick={() => setActiveTab("ALL")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === "ALL"
                    ? "bg-background text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                All Entities ({filteredProblems.length + filteredProjects.length})
              </button>
              <button
                onClick={() => setActiveTab("PROBLEMS")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === "PROBLEMS"
                    ? "bg-background text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Industry Challenges ({filteredProblems.length})
              </button>
              <button
                onClick={() => setActiveTab("PROJECTS")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  activeTab === "PROJECTS"
                    ? "bg-background text-foreground shadow-xs font-semibold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Research Workspaces ({filteredProjects.length})
              </button>
            </div>

            {/* Keyword Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search challenges, keywords, mentors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-8 h-10 rounded-xl bg-muted/30 border-border/60 text-sm focus-visible:ring-primary/20"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Area / Category Filter Chips */}
          <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-border/40 text-xs">
            <span className="text-muted-foreground font-mono flex items-center gap-1 mr-1">
              <Filter className="h-3 w-3" /> Filter Area:
            </span>
            <button
              onClick={() => setSelectedArea("ALL")}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                selectedArea === "ALL"
                  ? "bg-primary text-primary-foreground font-medium"
                  : "bg-muted/50 hover:bg-muted text-muted-foreground"
              }`}
            >
              All Sectors
            </button>
            {areas.map((area) => (
              <button
                key={area}
                onClick={() => setSelectedArea(area)}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  selectedArea === area
                    ? "bg-primary text-primary-foreground font-medium"
                    : "bg-muted/50 hover:bg-muted text-muted-foreground"
                }`}
              >
                {area}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between text-xs text-muted-foreground font-mono mb-4 px-1">
          <span>SHOWING {totalResults} RECORD(S)</span>
          <span>SYNCED WITH JAIN-IFQM CLOUD DB</span>
        </div>

        {/* Live Grid of Problems & Projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Render Industry Problems */}
          {(activeTab === "ALL" || activeTab === "PROBLEMS") &&
            filteredProblems.map((prob) => (
              <Card
                key={prob.id}
                className="flex flex-col justify-between rounded-2xl border-border/60 bg-card hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
              >
                <CardHeader className="p-5 pb-3">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Badge
                      variant="outline"
                      className="font-mono text-[10px] tracking-wider uppercase bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
                    >
                      CHALLENGE // {prob.area}
                    </Badge>
                    <Badge
                      variant={prob.status === "OPEN" ? "default" : "secondary"}
                      className="text-[10px] font-semibold"
                    >
                      {prob.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {prob.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-5 pt-0 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-muted-foreground line-clamp-3 mb-4 leading-relaxed">
                    {prob.description?.replace(/\*\*/g, "") || "No statement description provided."}
                  </p>

                  <div className="space-y-3 pt-3 border-t border-border/40">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                        {prob.submitter?.name || "Industry Partner"}
                      </span>
                      <span className="font-mono text-[11px] text-muted-foreground">
                        Priority:{" "}
                        <strong
                          className={
                            prob.level === "HIGH"
                              ? "text-red-500"
                              : prob.level === "MEDIUM"
                                ? "text-amber-500"
                                : "text-emerald-500"
                          }
                        >
                          {prob.level}
                        </strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground font-mono">
                      <span>Approvals:</span>
                      <span
                        className={
                          prob.industryApproved
                            ? "text-emerald-500 font-bold"
                            : "text-muted-foreground/50"
                        }
                      >
                        IND✓
                      </span>
                      <span>·</span>
                      <span
                        className={
                          prob.facultyApproved
                            ? "text-emerald-500 font-bold"
                            : "text-muted-foreground/50"
                        }
                      >
                        FAC✓
                      </span>
                      <span>·</span>
                      <span
                        className={
                          prob.adminApproved
                            ? "text-emerald-500 font-bold"
                            : "text-muted-foreground/50"
                        }
                      >
                        ADM✓
                      </span>
                    </div>

                    <button
                      onClick={() => setActiveInspectItem({ type: "problem", data: prob })}
                      className="w-full mt-2 py-2 px-3 rounded-xl border border-border/60 hover:bg-muted text-xs font-semibold text-foreground flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      Inspect Problem Scope <ArrowUpRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}

          {/* Render Research Projects */}
          {(activeTab === "ALL" || activeTab === "PROJECTS") &&
            filteredProjects.map((proj) => (
              <Card
                key={proj.id}
                className="flex flex-col justify-between rounded-2xl border-border/60 bg-card hover:border-indigo-500/40 hover:shadow-md transition-all duration-200 group"
              >
                <CardHeader className="p-5 pb-3">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <Badge
                      variant="outline"
                      className="font-mono text-[10px] tracking-wider uppercase bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20"
                    >
                      WORKSPACE // {proj.department?.name || "ENGINEERING"}
                    </Badge>
                    <Badge
                      variant={proj.status === "OPEN" ? "default" : "secondary"}
                      className="text-[10px] font-semibold"
                    >
                      {proj.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                    {proj.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-5 pt-0 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-muted-foreground line-clamp-3 mb-4 leading-relaxed">
                    {proj.description}
                  </p>

                  <div className="space-y-3 pt-3 border-t border-border/40">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground flex items-center gap-1.5">
                        <GraduationCap className="h-3.5 w-3.5 text-indigo-500" />
                        {proj.mentor?.user?.name || "Assigned Faculty"}
                      </span>
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {proj.duration || "4-6 Months"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Tag className="h-3 w-3 text-muted-foreground" />
                        Level:{" "}
                        <strong className="text-foreground">
                          {proj.difficultyLevel || "Advanced"}
                        </strong>
                      </span>
                      <span>
                        Partner:{" "}
                        <strong className="text-foreground">
                          {proj.partner?.companyName || "Industry Partner"}
                        </strong>
                      </span>
                    </div>

                    <button
                      onClick={() => setActiveInspectItem({ type: "project", data: proj })}
                      className="w-full mt-2 py-2 px-3 rounded-xl border border-border/60 hover:bg-muted text-xs font-semibold text-foreground flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      Inspect Research Workspace <ArrowUpRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>

        {/* Empty State */}
        {totalResults === 0 && (
          <div className="text-center py-16 px-4 rounded-2xl border border-dashed border-border/80 bg-background/50">
            <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <h3 className="text-base font-bold text-foreground">No matching records found</h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-md mx-auto">
              No live challenges or research workspaces match &ldquo;{searchQuery}&rdquo;. Try
              clearing your filters.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedArea("ALL");
                setActiveTab("ALL");
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-medium cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Inspection Modal Dialog */}
        <Dialog
          open={!!activeInspectItem}
          onOpenChange={(open) => !open && setActiveInspectItem(null)}
        >
          <DialogContent className="max-w-2xl bg-card text-card-foreground border-border rounded-2xl p-6 sm:p-8">
            {activeInspectItem && (
              <>
                <DialogHeader className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant="outline" className="text-xs font-mono">
                      {activeInspectItem.type === "problem"
                        ? `INDUSTRY CHALLENGE // ${activeInspectItem.data.area}`
                        : `RESEARCH WORKSPACE // ${
                            activeInspectItem.data.department?.name || "ENGINEERING"
                          }`}
                    </Badge>
                    <Badge variant="default" className="text-xs">
                      {activeInspectItem.data.status}
                    </Badge>
                  </div>
                  <DialogTitle className="text-xl sm:text-2xl font-bold tracking-tight">
                    {activeInspectItem.data.title}
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 my-4 text-sm">
                  {/* Detailed Description */}
                  <div>
                    <h4 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
                      Statement & Technical Scope
                    </h4>
                    <div className="p-4 rounded-xl bg-muted/40 border border-border/40 text-foreground whitespace-pre-wrap leading-relaxed">
                      {activeInspectItem.data.description || "No description details provided."}
                    </div>
                  </div>

                  {/* Metadata Grid */}
                  <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                    <div className="p-3 rounded-lg border border-border/40 bg-muted/20">
                      <span className="text-muted-foreground block mb-1">
                        {activeInspectItem.type === "problem" ? "SUBMITTED BY" : "MENTOR FACULTY"}
                      </span>
                      <span className="font-semibold text-foreground text-sm">
                        {activeInspectItem.type === "problem"
                          ? activeInspectItem.data.submitter?.name || "Industry Partner"
                          : activeInspectItem.data.mentor?.user?.name || "Assigned Faculty"}
                      </span>
                    </div>

                    <div className="p-3 rounded-lg border border-border/40 bg-muted/20">
                      <span className="text-muted-foreground block mb-1">
                        {activeInspectItem.type === "problem" ? "PRIORITY SEVERITY" : "DURATION"}
                      </span>
                      <span className="font-semibold text-foreground text-sm">
                        {activeInspectItem.type === "problem"
                          ? activeInspectItem.data.level
                          : activeInspectItem.data.duration || "4-6 Months"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Modal Footer Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-border/40">
                  <button
                    onClick={() => setActiveInspectItem(null)}
                    className={buttonVariants({
                      variant: "ghost",
                      size: "sm",
                      className: "w-full sm:w-auto rounded-xl",
                    })}
                  >
                    Close
                  </button>

                  {isLoggedIn ? (
                    <Link
                      href={
                        activeInspectItem.type === "problem"
                          ? "/dashboard/problems"
                          : "/dashboard/projects"
                      }
                      className={buttonVariants({
                        size: "sm",
                        className: "w-full sm:w-auto rounded-xl font-medium",
                      })}
                    >
                      Open in Operational Dashboard <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" />
                    </Link>
                  ) : (
                    <Link
                      href="/login"
                      className={buttonVariants({
                        size: "sm",
                        className: "w-full sm:w-auto rounded-xl font-medium",
                      })}
                    >
                      Log in to Engage / Apply <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" />
                    </Link>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
