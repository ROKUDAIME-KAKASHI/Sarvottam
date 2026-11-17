"use client";

import { useState, useMemo, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Calendar,
  User,
  ArrowRight,
  CheckCircle2,
  Filter,
  Search,
  X,
  Building2,
  GraduationCap,
  Sparkles,
  Layers,
  AlertCircle,
} from "lucide-react";
import { applyForProject } from "@/app/actions/applications";
import { approveProblem } from "@/app/actions/problems";
import { toast } from "sonner";

export default function ResearchList({
  projects,
  problems = [],
  currentUserRole,
}: {
  projects: {
    id: string;
    title: string;
    description: string;
    difficultyLevel?: string;
    duration?: string;
    type?: string | null;
    mentor?: { user?: { name: string | null } };
    partner?: { companyName: string };
    creator?: { name: string | null; email: string | null };
    createdAt: Date | string;
  }[];
  problems?: {
    id: string;
    title: string;
    description: string;
    type?: string | null;
    submitter?: { name: string | null; email: string | null; role: string };
    facultyApproved: boolean;
    industryApproved: boolean;
    adminApproved: boolean;
    createdAt: Date | string;
  }[];
  currentUserRole?: string;
}) {
  const [isPending, startTransition] = useTransition();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<"ALL" | "PROJECT" | "PROBLEM">("ALL");
  const [filterType, setFilterType] = useState<string>("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [applyingProject, setApplyingProject] = useState<{ id: string; title: string } | null>(
    null
  );
  const [skills, setSkills] = useState("");

  const types = ["All", "Software", "Hardware", "Technical", "Process", "Quality", "Research"];

  // Combine and normalize
  const combined = useMemo(() => {
    const list = [
      ...projects.map((p) => ({ ...p, category: "project" as const })),
      ...problems.map((p) => ({ ...p, category: "problem" as const })),
    ];
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [projects, problems]);

  // Filter based on search, category, and type
  const filteredList = useMemo(() => {
    return combined.filter((item) => {
      // Category filter
      if (activeCategory === "PROJECT" && item.category !== "project") return false;
      if (activeCategory === "PROBLEM" && item.category !== "problem") return false;

      // Type filter
      if (filterType !== "All") {
        if (!item.type || !item.type.toLowerCase().includes(filterType.toLowerCase())) {
          return false;
        }
      }

      // Keyword search
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesDesc = item.description?.toLowerCase().includes(query);
        const matchesCreator =
          item.category === "project"
            ? (item.mentor?.user?.name || item.partner?.companyName || "")
                .toLowerCase()
                .includes(query)
            : (item.submitter?.name || "").toLowerCase().includes(query);

        return matchesTitle || matchesDesc || matchesCreator;
      }

      return true;
    });
  }, [combined, activeCategory, filterType, searchQuery]);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!applyingProject) return;

    const formData = new FormData();
    formData.append("projectId", applyingProject.id);
    formData.append("skills", skills);

    startTransition(async () => {
      const res = await applyForProject(formData);
      if (res.success) {
        toast.success("Application submitted!", {
          description: `You have successfully applied for "${applyingProject.title}".`,
        });
        setApplyingProject(null);
        setSkills("");
      } else {
        toast.error("Application failed", {
          description: res.error || "Something went wrong.",
        });
      }
    });
  };

  return (
    <div className="space-y-8">
      {/* Search & Filtering Toolbar */}
      <div className="p-4 rounded-2xl border border-border/60 bg-card/80 backdrop-blur-md shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Category Switcher */}
          <div className="flex items-center p-1 rounded-xl bg-muted/60 border border-border/40 text-xs font-semibold self-start sm:self-auto">
            <button
              onClick={() => setActiveCategory("ALL")}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeCategory === "ALL"
                  ? "bg-background text-foreground shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All Entities ({combined.length})
            </button>
            <button
              onClick={() => setActiveCategory("PROJECT")}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeCategory === "PROJECT"
                  ? "bg-background text-foreground shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Research Workspaces ({projects.length})
            </button>
            <button
              onClick={() => setActiveCategory("PROBLEM")}
              className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeCategory === "PROBLEM"
                  ? "bg-background text-foreground shadow-xs font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Industry Problems ({problems.length})
            </button>
          </div>

          {/* Connected Keyword Search */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by keyword, mentor, partner..."
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

        {/* Type / Sector Filter Chips */}
        <div className="flex items-center gap-2 flex-wrap pt-2 border-t border-border/40 text-xs">
          <span className="text-muted-foreground font-mono flex items-center gap-1 mr-1">
            <Filter className="h-3 w-3" /> Discipline:
          </span>
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                filterType === t
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "All" ? "All Disciplines" : t}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count Bar */}
      <div className="flex items-center justify-between text-xs font-mono text-muted-foreground px-1">
        <span>SHOWING {filteredList.length} RECORD(S)</span>
        <span>CONNECTED TO JAIN-IFQM ACADEMIC CLOUD</span>
      </div>

      {/* Grid of Results */}
      {filteredList.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground bg-muted/20 rounded-2xl border border-dashed border-border/60">
          <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
          <h3 className="text-base font-bold text-foreground">No matching items found</h3>
          <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
            Try adjusting your search query or reset your category and discipline filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setActiveCategory("ALL");
              setFilterType("All");
            }}
            className="mt-4 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredList.map((item) => {
            const itemId = `${item.category}-${item.id}`;
            const isExpanded = expandedId === itemId;

            return (
              <Card
                key={itemId}
                className="flex flex-col justify-between rounded-2xl border-border/60 bg-card hover:border-primary/40 hover:shadow-md transition-all duration-200 group"
              >
                <CardHeader className="p-6 pb-3">
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <Badge
                      variant="outline"
                      className={`text-[10px] font-mono font-bold tracking-wider uppercase ${
                        item.category === "project"
                          ? "bg-primary/10 text-primary border-primary/20"
                          : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                      }`}
                    >
                      {item.category === "project" ? "RESEARCH NODE" : "CHALLENGE"}
                    </Badge>

                    {item.category === "project" && (
                      <Badge variant="outline" className="text-[10px] font-semibold">
                        {item.difficultyLevel || "Advanced"}
                      </Badge>
                    )}
                  </div>

                  <CardTitle className="text-base font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2">
                    {item.title}
                  </CardTitle>

                  {item.type && (
                    <span className="text-[11px] font-mono font-bold text-primary bg-primary/10 w-fit px-2 py-0.5 rounded-md mt-1.5">
                      {item.type}
                    </span>
                  )}
                </CardHeader>

                <CardContent className="p-6 pt-2 flex-1 flex flex-col justify-between space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-xs text-muted-foreground border-y border-border/40 py-2.5">
                    <div className="flex items-center truncate">
                      <Calendar className="h-3.5 w-3.5 mr-1.5 text-primary shrink-0" />
                      <span className="truncate">
                        {item.category === "project"
                          ? item.duration || "4-6 Months"
                          : new Date(item.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center truncate">
                      <User className="h-3.5 w-3.5 mr-1.5 text-primary shrink-0" />
                      <span className="truncate">
                        {item.category === "project"
                          ? item.mentor?.user?.name ||
                            item.partner?.companyName ||
                            "Faculty Assigned"
                          : item.submitter?.name || "Industry Partner"}
                      </span>
                    </div>
                  </div>

                  <div
                    className={`text-xs text-muted-foreground leading-relaxed ${
                      isExpanded ? "whitespace-pre-wrap" : "line-clamp-3"
                    }`}
                  >
                    {item.description}
                  </div>

                  {item.category === "problem" && (
                    <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
                      <span
                        className={`px-2 py-0.5 rounded border ${
                          item.facultyApproved
                            ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-bold"
                            : "bg-muted text-muted-foreground border-border/50"
                        }`}
                      >
                        Faculty: {item.facultyApproved ? "Approved ✓" : "Pending"}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded border ${
                          item.adminApproved
                            ? "bg-blue-500/10 text-blue-600 border-blue-500/20 font-bold"
                            : "bg-muted text-muted-foreground border-border/50"
                        }`}
                      >
                        Admin: {item.adminApproved ? "Approved ✓" : "Pending"}
                      </span>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="p-6 pt-0 flex flex-col gap-2">
                  {item.category === "project" ? (
                    <Button
                      onClick={() => setApplyingProject({ id: item.id, title: item.title })}
                      className="w-full h-10 rounded-xl font-semibold text-xs shadow-xs"
                    >
                      Apply to Research Node <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                    </Button>
                  ) : (
                    <>
                      {currentUserRole === "FACULTY" && !item.facultyApproved && (
                        <Button
                          onClick={() =>
                            startTransition(async () => {
                              const res = await approveProblem(item.id, "FACULTY", true);
                              if (res.success) toast.success("Problem approved (Faculty)");
                              else toast.error(res.error || "Failed to approve");
                            })
                          }
                          disabled={isPending}
                          className="w-full h-10 rounded-xl font-semibold text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
                        >
                          Approve (Faculty Triage)
                        </Button>
                      )}
                      {currentUserRole === "SUPERADMIN" && !item.adminApproved && (
                        <Button
                          onClick={() =>
                            startTransition(async () => {
                              const res = await approveProblem(item.id, "ADMIN", true);
                              if (res.success) toast.success("Final approval granted (Admin)");
                              else toast.error(res.error || "Failed to approve");
                            })
                          }
                          disabled={isPending}
                          className="w-full h-10 rounded-xl font-semibold text-xs bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          Final Approval (Admin)
                        </Button>
                      )}
                      <Button
                        onClick={() => setExpandedId(isExpanded ? null : itemId)}
                        variant="outline"
                        className="w-full h-10 rounded-xl text-xs font-semibold border-border/60"
                      >
                        {isExpanded ? "Collapse Details" : "Inspect Problem Statement"}
                      </Button>
                    </>
                  )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Student Application Dialog */}
      {applyingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card text-card-foreground border border-border p-6 sm:p-8 rounded-3xl shadow-xl w-full max-w-lg relative overflow-hidden space-y-5"
          >
            <div>
              <Badge variant="outline" className="text-xs font-mono mb-2">
                APPLICATION SUBMISSION
              </Badge>
              <h3 className="text-xl font-bold">Apply for Research Project</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Workspace:{" "}
                <span className="text-foreground font-semibold">{applyingProject.title}</span>
              </p>
            </div>

            <form onSubmit={handleApply} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase font-bold text-muted-foreground">
                  Your Technical & Research Skills
                </label>
                <textarea
                  required
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="e.g. Python, Machine Learning, Six Sigma, CAD/CAM, Statistical Analysis..."
                  rows={4}
                  className="w-full p-3.5 rounded-xl bg-muted/30 border border-border/60 text-sm focus:ring-1 focus:ring-primary outline-none"
                />
                <p className="text-[11px] text-muted-foreground">
                  These skills will be matched against the node requirements and reviewed by the
                  supervising faculty.
                </p>
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setApplyingProject(null)}
                  className="rounded-xl text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="rounded-xl text-xs font-semibold shadow-xs"
                >
                  {isPending ? "Submitting Application..." : "Submit Application"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
