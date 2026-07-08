"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, ArrowRight, CheckCircle2, Filter } from "lucide-react";
import { applyForProject } from "@/app/actions/applications";
import { approveProblem } from "@/app/actions/problems";
import { useState, useTransition } from "react";
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
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [applyingProject, setApplyingProject] = useState<{ id: string; title: string } | null>(
    null
  );
  const [skills, setSkills] = useState("");
  const [filterType, setFilterType] = useState<string>("All");

  const types = [
    "All",
    "Software",
    "Hardware",
    "Technical",
    "Business",
    "Design",
    "Research",
    "Other",
    "Uncategorized",
  ];

  // Combine and sort by createdAt
  const combined = [
    ...projects.map((p) => ({ ...p, category: "project" as const })),
    ...(problems || []).map((p) => ({ ...p, category: "problem" as const })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const filteredCombined =
    filterType === "All"
      ? combined
      : combined.filter((p) => (filterType === "Uncategorized" ? !p.type : p.type === filterType));

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

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } as const },
  };

  if (combined.length === 0) {
    return (
      <div className="text-center py-24 text-muted-foreground">
        No projects or problems are currently available in the marketplace.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="p-2.5 rounded-xl border border-border/50 bg-background/50 text-sm focus:ring-2 focus:ring-primary/20 outline-none min-w-[200px]"
          >
            {types.map((t) => (
              <option key={t} value={t}>
                {t === "All" ? "All Types" : t}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredCombined.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-3xl border border-border/50">
          No items found for the selected type.
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredCombined.map((item) => {
            const itemId = `${item.category}-${item.id}`;
            const isExpanded = expandedId === itemId;
            return (
              <motion.div layout key={itemId} variants={itemAnimation} className="h-full">
                <Card className="flex flex-col h-full rounded-[2rem] border-border/50 bg-background/60 backdrop-blur-xl hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 group overflow-hidden relative border-t-primary/10">
                  <div
                    className={`absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-700`}
                  />

                  <CardHeader className="p-8 pb-4 relative z-10">
                    <div className="flex justify-between items-start mb-6">
                      <Badge
                        variant="secondary"
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${item.category === "project" ? "bg-primary/5 text-primary border-primary/10" : "bg-amber-500/10 text-amber-600 border-amber-500/20"}`}
                      >
                        {item.category === "project" ? "Research" : "Project / Problem"}
                      </Badge>
                      {item.category === "project" && (
                        <Badge
                          variant="outline"
                          className="border-border/50 text-[10px] font-black uppercase px-2 py-0.5 rounded-md"
                        >
                          {item.difficultyLevel || "Unspecified"}
                        </Badge>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <CardTitle className="text-xl font-bold leading-tight group-hover:text-primary transition-colors duration-300">
                        {item.title}
                      </CardTitle>
                      {item.type && (
                        <span className="text-xs font-bold text-primary bg-primary/10 w-fit px-2 py-0.5 rounded-md mt-2">
                          {item.type}
                        </span>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="p-8 pt-4 flex-1 space-y-6 relative z-10">
                    <div className="grid grid-cols-2 gap-4">
                      <div
                        suppressHydrationWarning
                        className="flex items-center text-sm font-medium text-muted-foreground"
                      >
                        <Calendar className="h-4 w-4 mr-2 text-primary/60" />
                        {item.category === "project"
                          ? item.duration || "Ongoing"
                          : new Date(item.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-sm font-medium text-muted-foreground">
                        <User className="h-4 w-4 mr-2 text-primary/60" />
                        {item.category === "project"
                          ? item.mentor?.user?.name ||
                            item.partner?.companyName ||
                            item.creator?.name ||
                            item.creator?.email ||
                            "Multiple"
                          : item.submitter?.name || item.submitter?.email || "Anonymous"}
                      </div>
                    </div>
                    <motion.div
                      layout="position"
                      className={`text-muted-foreground leading-relaxed font-medium ${isExpanded ? "" : "line-clamp-3 whitespace-pre-wrap"}`}
                    >
                      {item.description}
                    </motion.div>

                    {item.category === "problem" && (
                      <div className="flex flex-wrap gap-2 pt-4 border-t border-border/50">
                        <Badge
                          variant="outline"
                          className={`text-[10px] uppercase font-bold ${item.facultyApproved ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : "bg-red-500/10 text-red-600 border-red-500/20"}`}
                        >
                          {item.facultyApproved && (
                            <CheckCircle2 className="w-3 h-3 mr-1 inline-block" />
                          )}
                          Faculty: {item.facultyApproved ? "Approved" : "Pending"}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={`text-[10px] uppercase font-bold ${item.adminApproved ? "bg-blue-500/10 text-blue-600 border-blue-500/20" : "bg-red-500/10 text-red-600 border-red-500/20"}`}
                        >
                          {item.adminApproved && (
                            <CheckCircle2 className="w-3 h-3 mr-1 inline-block" />
                          )}
                          Admin: {item.adminApproved ? "Approved" : "Pending"}
                        </Badge>
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="p-8 pt-0 relative z-10 flex flex-col gap-2">
                    {item.category === "project" ? (
                      <Button
                        onClick={() => setApplyingProject({ id: item.id, title: item.title })}
                        className="w-full h-12 rounded-xl font-bold text-base shadow-lg shadow-primary/5 group-hover:shadow-primary/20 group-hover:scale-[1.02] active:scale-[0.98] transition-all"
                      >
                        Apply to Node{" "}
                        <ArrowRight className="ml-2 h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    ) : (
                      <>
                        {currentUserRole === "FACULTY" &&
                          item.submitter?.role === "STUDENT" &&
                          !item.facultyApproved && (
                            <Button
                              onClick={() =>
                                startTransition(async () => {
                                  const res = await approveProblem(item.id, "FACULTY", true);
                                  if (res.success) toast.success("Problem approved (Faculty)");
                                  else toast.error(res.error || "Failed to approve");
                                })
                              }
                              disabled={isPending}
                              className="w-full h-12 rounded-xl font-bold text-base bg-emerald-600 hover:bg-emerald-700 text-white transition-all"
                            >
                              Approve (Faculty)
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
                            className="w-full h-12 rounded-xl font-bold text-base bg-blue-600 hover:bg-blue-700 text-white transition-all"
                          >
                            Final Approval (Admin)
                          </Button>
                        )}
                        <Button
                          onClick={() => setExpandedId(isExpanded ? null : itemId)}
                          variant="outline"
                          className="w-full h-12 rounded-xl font-bold text-base border-primary/20 hover:bg-primary/5 transition-all"
                        >
                          {isExpanded ? "Show Less" : "View Problem Details"}
                        </Button>
                      </>
                    )}
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {applyingProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-background border border-border p-8 rounded-[2rem] shadow-2xl w-full max-w-lg relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary/40 via-primary to-primary/40" />

            <h3 className="text-2xl font-black mb-2">Apply for Project</h3>
            <p className="text-muted-foreground font-medium mb-6">
              Project: <span className="text-foreground font-bold">{applyingProject.title}</span>
            </p>

            <form onSubmit={handleApply} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-muted-foreground uppercase tracking-widest pl-1">
                  Confirm Your Skills
                </label>
                <textarea
                  required
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="e.g. React, Python, Quality Control, Data Analysis..."
                  rows={4}
                  className="w-full p-4 rounded-2xl bg-muted/30 border border-border/50 text-foreground focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all outline-none font-medium"
                />
                <p className="text-[10px] text-muted-foreground pl-1 font-bold italic">
                  * These skills will be updated in your profile and sent to the evaluators.
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setApplyingProject(null)}
                  className="rounded-xl h-12 px-6 font-bold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="rounded-xl h-12 px-8 font-black shadow-lg shadow-primary/20"
                >
                  {isPending ? "Submitting..." : "Submit Application"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
