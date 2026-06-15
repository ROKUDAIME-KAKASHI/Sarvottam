"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Inbox, Clock, CheckCircle2, XCircle, ShieldCheck, Building, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateApplicationStatus, approveApplication } from "@/app/actions/applications";
import { useTransition } from "react";
import { toast } from "sonner";

export default function ApplicationList({ 
  applications, 
  currentUserId,
  currentUserRole 
}: { 
  applications: { 
    id: string, 
    status: string, 
    userId: string, 
    createdAt: Date | string, 
    adminApproved: boolean,
    facultyApproved: boolean,
    industryApproved: boolean,
    user?: { name: string | null, email: string | null, skills?: string | null }, 
    project: { title: string, creatorId: string, mentorId?: string | null, partnerId?: string | null } 
  }[], 
  currentUserId?: string,
  currentUserRole?: string
}) {
  const [isPending, startTransition] = useTransition();

  const handleApprove = (id: string, type: "FACULTY" | "INDUSTRY" | "ADMIN", approve: boolean) => {
    startTransition(async () => {
      const res = await approveApplication(id, type, approve);
      if (res.success) toast.success(`Stage ${type} approved`);
      else toast.error(res.error || "Approval failed");
    });
  };

  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.3 } as const }
  };

  const handleUpdate = (id: string, status: string) => {
    startTransition(async () => {
      await updateApplicationStatus(id, status);
    });
  };

  if (applications.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No applications found.
      </div>
    );
  }

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {applications.map((app) => (
        <motion.div key={app.id} variants={item}>
          <Card className="group h-full rounded-3xl border-border/50 bg-background/40 backdrop-blur-xl hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 overflow-hidden relative">
            <CardHeader className="p-6 pb-4">
              <div className="flex justify-between items-start mb-4">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary ring-1 ring-primary/20">
                  <Inbox className="h-5 w-5" />
                </div>
                <Badge 
                  variant="secondary"
                  className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${
                    app.status === "ACCEPTED" ? "bg-emerald-500/10 text-emerald-500" : 
                    app.status === "REJECTED" ? "bg-red-500/10 text-red-500" : 
                    "bg-amber-500/10 text-amber-500"
                  }`}
                >
                  {app.status}
                </Badge>
              </div>
              <CardTitle className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">
                {app.userId === currentUserId ? app.project.title : (app.user?.name || app.user?.email || 'Unknown User')}
              </CardTitle>
              <CardDescription className="text-xs font-bold text-muted-foreground/60 tracking-widest uppercase mt-1">
                ID: {app.id.slice(-6)}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">
                  {app.userId === currentUserId ? 'You applied to this project' : `Applied to: ${app.project.title}`}
                </p>
                {app.user?.skills && (
                  <p className="text-xs text-muted-foreground line-clamp-2">
                    <span className="font-bold">Skills:</span> {app.user.skills}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-2 pt-2 border-t border-border/50">
                <Badge variant="outline" className={`text-[9px] uppercase font-bold py-0 h-5 ${app.facultyApproved ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-muted text-muted-foreground border-border'}`}>
                  Faculty: {app.facultyApproved ? 'OK' : '...'}
                </Badge>
                <Badge variant="outline" className={`text-[9px] uppercase font-bold py-0 h-5 ${app.industryApproved ? 'bg-blue-500/10 text-blue-600 border-blue-500/20' : 'bg-muted text-muted-foreground border-border'}`}>
                  Partner: {app.industryApproved ? 'OK' : '...'}
                </Badge>
                <Badge variant="outline" className={`text-[9px] uppercase font-bold py-0 h-5 ${app.adminApproved ? 'bg-purple-500/10 text-purple-600 border-purple-500/20' : 'bg-muted text-muted-foreground border-border'}`}>
                  Admin: {app.adminApproved ? 'OK' : '...'}
                </Badge>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center text-xs font-medium text-muted-foreground">
                  <Clock className="h-3.5 w-3.5 mr-1.5 opacity-50" />
                  {new Date(app.createdAt).toLocaleDateString()}
                </div>
                
                {app.status === "PENDING" && (
                  <div className="flex gap-2">
                    {/* Faculty Approval Button */}
                    {currentUserRole === "FACULTY" && !app.facultyApproved && (
                      <Button 
                        size="sm" 
                        onClick={() => handleApprove(app.id, "FACULTY", true)}
                        disabled={isPending}
                        className="h-8 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
                      >
                        <UserCheck className="h-3.5 w-3.5 mr-1" /> Approve
                      </Button>
                    )}
                    
                    {/* Industry Approval Button */}
                    {currentUserRole === "INDUSTRY_PARTNER" && !app.industryApproved && (
                      <Button 
                        size="sm" 
                        onClick={() => handleApprove(app.id, "INDUSTRY", true)}
                        disabled={isPending}
                        className="h-8 px-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs"
                      >
                        <Building className="h-3.5 w-3.5 mr-1" /> Partner OK
                      </Button>
                    )}

                    {/* Admin Final Approval Button */}
                    {currentUserRole === "SUPERADMIN" && !app.adminApproved && (
                      <Button 
                        size="sm" 
                        onClick={() => handleApprove(app.id, "ADMIN", true)}
                        disabled={isPending}
                        className="h-8 px-3 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs"
                      >
                        <ShieldCheck className="h-3.5 w-3.5 mr-1" /> Admin Final
                      </Button>
                    )}

                    {/* Global Reject for relevant roles */}
                    {(currentUserRole === "SUPERADMIN" || 
                      (currentUserRole === "FACULTY" && app.project.mentorId === currentUserId) ||
                      (currentUserRole === "INDUSTRY_PARTNER" && app.project.partnerId === currentUserId)) && (
                      <Button 
                        variant="ghost"
                        size="sm" 
                        onClick={() => startTransition(async () => { 
                          const res = await updateApplicationStatus(app.id, "REJECTED");
                          if (res.success) toast.success("Application rejected");
                          else toast.error(res.error || "Failed to reject");
                        })}
                        disabled={isPending}
                        className="h-8 px-2 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
