"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, ArrowRight, CheckCircle2 } from "lucide-react";
import { applyForProject } from "@/app/actions/applications";
import { approveProblem } from "@/app/actions/problems";
import Link from "next/link";
import { useState, useTransition } from "react";

export default function ResearchList({ 
  projects, 
  problems = [], 
  currentUserRole,
  currentUserId
}: { 
  projects: any[], 
  problems?: any[],
  currentUserRole?: string,
  currentUserId?: string
}) {
  const [isPending, startTransition] = useTransition();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  // Combine and sort by createdAt
  const combined = [
    ...projects.map(p => ({ ...p, type: 'project' as const })),
    ...problems.map(p => ({ ...p, type: 'problem' as const }))
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } as const }
  };

  if (combined.length === 0) {
    return (
      <div className="text-center py-24 text-muted-foreground">
        No projects or problems are currently available in the marketplace.
      </div>
    );
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
    >
      {combined.map((item) => {
        const itemId = `${item.type}-${item.id}`;
        const isExpanded = expandedId === itemId;
        return (
        <motion.div layout key={itemId} variants={itemAnimation} className="h-full">
          <Card className="flex flex-col h-full rounded-[2rem] border-border/50 bg-background/60 backdrop-blur-xl hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 group overflow-hidden relative border-t-primary/10">
            <div className={`absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
            
            <CardHeader className="p-8 pb-4 relative z-10">
              <div className="flex justify-between items-start mb-6">
                <Badge variant="secondary" className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${item.type === 'project' ? 'bg-primary/5 text-primary border-primary/10' : 'bg-amber-500/10 text-amber-600 border-amber-500/20'}`}>
                  {item.type === 'project' ? 'Project' : 'Problem'}
                </Badge>
                {item.type === 'project' && (
                  <Badge variant="outline" className="border-border/50 text-[10px] font-black uppercase px-2 py-0.5 rounded-md">
                    {item.difficultyLevel || "Unspecified"}
                  </Badge>
                )}
              </div>
              <CardTitle className="text-xl font-bold leading-tight group-hover:text-primary transition-colors duration-300">
                {item.title}
              </CardTitle>
            </CardHeader>
            
            <CardContent className="p-8 pt-4 flex-1 space-y-6 relative z-10">
              <div className="grid grid-cols-2 gap-4">
                <div suppressHydrationWarning className="flex items-center text-sm font-medium text-muted-foreground">
                  <Calendar className="h-4 w-4 mr-2 text-primary/60" />
                  {item.type === 'project' ? (item.duration || "Ongoing") : new Date(item.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center text-sm font-medium text-muted-foreground">
                  <User className="h-4 w-4 mr-2 text-primary/60" />
                  {item.type === 'project' 
                    ? (item.mentor?.user?.name || item.partner?.companyName || item.creator?.name || item.creator?.email || "Multiple")
                    : (item.submitter?.name || item.submitter?.email || "Anonymous")}
                </div>
              </div>
              <motion.div layout="position" className={`text-muted-foreground leading-relaxed font-medium ${isExpanded ? '' : 'line-clamp-3 whitespace-pre-wrap'}`}>
                {item.description}
              </motion.div>

              {item.type === 'problem' && (
                <div className="flex flex-wrap gap-2 pt-4 border-t border-border/50">
                  <Badge variant="outline" className={`text-[10px] uppercase font-bold ${item.facultyApproved ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-red-500/10 text-red-600 border-red-500/20'}`}>
                    {item.facultyApproved && <CheckCircle2 className="w-3 h-3 mr-1 inline-block" />}
                    Faculty: {item.facultyApproved ? 'Approved' : 'Not Approved'}
                  </Badge>
                  <Badge variant="outline" className={`text-[10px] uppercase font-bold ${item.industryApproved ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' : 'bg-red-500/10 text-red-600 border-red-500/20'}`}>
                    {item.industryApproved && <CheckCircle2 className="w-3 h-3 mr-1 inline-block" />}
                    Admin: {item.industryApproved ? 'Approved' : 'Not Approved'}
                  </Badge>
                </div>
              )}
            </CardContent>
            
            <CardFooter className="p-8 pt-0 relative z-10 flex flex-col gap-2">
              {item.type === 'project' ? (
                <form action={applyForProject} className="w-full">
                  <input type="hidden" name="projectId" value={item.id} />
                  <Button type="submit" className="w-full h-12 rounded-xl font-bold text-base shadow-lg shadow-primary/5 group-hover:shadow-primary/20 group-hover:scale-[1.02] active:scale-[0.98] transition-all">
                    Apply to Node <ArrowRight className="ml-2 h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </form>
              ) : (
                <>
                  {currentUserRole === 'FACULTY' && item.submitter?.role === 'STUDENT' && !item.facultyApproved && (
                    <Button 
                      onClick={() => startTransition(() => approveProblem(item.id, "FACULTY", true))}
                      disabled={isPending}
                      className="w-full h-12 rounded-xl font-bold text-base bg-emerald-600 hover:bg-emerald-700 text-white transition-all"
                    >
                      Approve (Faculty)
                    </Button>
                  )}
                  {currentUserRole === 'SUPERADMIN' && item.submitter?.role === 'INDUSTRY_PARTNER' && !item.industryApproved && (
                    <Button 
                      onClick={() => startTransition(() => approveProblem(item.id, "INDUSTRY", true))}
                      disabled={isPending}
                      className="w-full h-12 rounded-xl font-bold text-base bg-blue-600 hover:bg-blue-700 text-white transition-all"
                    >
                      Approve (Admin)
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
      )})}
    </motion.div>
  );
}
