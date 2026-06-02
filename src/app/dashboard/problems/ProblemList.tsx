"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Clock, Building, User, ChevronDown, ChevronUp, CheckCircle2 } from "lucide-react";
import { useState, useTransition } from "react";
import { approveProblem } from "@/app/actions/problems";

export default function ProblemList({ problems, currentUserId, currentUserRole }: { problems: any[], currentUserId?: string, currentUserRole?: string }) {
  const [isPending, startTransition] = useTransition();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  if (problems.length === 0) {
    return (
      <Card className="rounded-[2rem] border-dashed border-2 bg-transparent shadow-none">
        <CardContent className="flex flex-col items-center justify-center p-12 text-center">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <AlertCircle className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-bold">No problems found</h3>
          <p className="text-muted-foreground mt-2 max-w-sm">
            There are currently no submitted problems in the directory.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
    >
      {problems.map((p) => {
        const isExpanded = expandedId === p.id;
        return (
        <motion.div key={p.id} variants={item} layout>
          <Card className="group h-full rounded-3xl border-border/50 bg-background/40 backdrop-blur-xl hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 overflow-hidden relative flex flex-col">
            <CardHeader className="p-6 pb-4">
              <div className="flex justify-between items-start mb-4">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary ring-1 ring-primary/20">
                  <AlertCircle className="h-5 w-5" />
                </div>
                <Badge 
                  variant="secondary"
                  className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${
                    p.status === "RESOLVED" ? "bg-emerald-500/10 text-emerald-500" : 
                    p.status === "IN_PROGRESS" ? "bg-amber-500/10 text-amber-500" : 
                    "bg-blue-500/10 text-blue-500"
                  }`}
                >
                  {p.status}
                </Badge>
              </div>
              <CardTitle className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">
                {p.title}
              </CardTitle>
              <CardDescription className="text-xs font-bold text-muted-foreground/60 tracking-widest uppercase mt-1">
                ID: {p.id.slice(-6)}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-4 flex-1 flex flex-col relative z-10">
              <div className="flex-1">
                <motion.div layout="position" className={`text-sm text-muted-foreground leading-relaxed font-medium ${isExpanded ? '' : 'line-clamp-4'} whitespace-pre-wrap`}>
                  {p.description}
                </motion.div>
              </div>
              
              <div className="pt-4 border-t border-border/50 space-y-2">
                <div className="flex items-center text-xs font-medium text-muted-foreground">
                  <Building className="h-3.5 w-3.5 mr-2 opacity-70" />
                  Submitter: {p.submitter?.name || p.submitter?.email} 
                  {p.submitterId === currentUserId && " (You)"}
                </div>
                {p.assignee && (
                  <div className="flex items-center text-xs font-medium text-muted-foreground">
                    <User className="h-3.5 w-3.5 mr-2 opacity-70" />
                    Assignee: {p.assignee.name || p.assignee.email}
                  </div>
                )}
                <div suppressHydrationWarning className="flex items-center text-xs font-medium text-muted-foreground">
                  <Clock className="h-3.5 w-3.5 mr-2 opacity-70" />
                  {new Date(p.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="flex flex-wrap gap-2 pt-4 border-t border-border/50">
                <Badge variant="outline" className={`text-[10px] uppercase font-bold ${p.facultyApproved ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-red-500/10 text-red-600 border-red-500/20'}`}>
                  {p.facultyApproved && <CheckCircle2 className="w-3 h-3 mr-1 inline-block" />}
                  Faculty: {p.facultyApproved ? 'Approved' : 'Not Approved'}
                </Badge>
                <Badge variant="outline" className={`text-[10px] uppercase font-bold ${p.industryApproved ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' : 'bg-red-500/10 text-red-600 border-red-500/20'}`}>
                  {p.industryApproved && <CheckCircle2 className="w-3 h-3 mr-1 inline-block" />}
                  Admin: {p.industryApproved ? 'Approved' : 'Not Approved'}
                </Badge>
              </div>
            </CardContent>
            
            <CardFooter className="p-6 pt-0 relative z-10 flex flex-col gap-2">
              {currentUserRole === 'FACULTY' && p.submitter?.role === 'STUDENT' && !p.facultyApproved && (
                <Button 
                  onClick={() => startTransition(() => approveProblem(p.id, "FACULTY", true))}
                  disabled={isPending}
                  className="w-full h-10 rounded-xl font-bold text-sm bg-emerald-600 hover:bg-emerald-700 text-white transition-all"
                >
                  Approve (Faculty)
                </Button>
              )}
              {currentUserRole === 'SUPERADMIN' && p.submitter?.role === 'INDUSTRY_PARTNER' && !p.industryApproved && (
                <Button 
                  onClick={() => startTransition(() => approveProblem(p.id, "INDUSTRY", true))}
                  disabled={isPending}
                  className="w-full h-10 rounded-xl font-bold text-sm bg-blue-600 hover:bg-blue-700 text-white transition-all"
                >
                  Approve (Admin)
                </Button>
              )}
              <Button 
                variant="outline" 
                className="w-full h-10 rounded-xl font-bold text-sm border-primary/20 hover:bg-primary/5 transition-all"
                onClick={() => setExpandedId(isExpanded ? null : p.id)}
              >
                {isExpanded ? (
                  <>Show Less <ChevronUp className="ml-2 h-4 w-4" /></>
                ) : (
                  <>Read Full Problem <ChevronDown className="ml-2 h-4 w-4" /></>
                )}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      )})}
    </motion.div>
  );
}
