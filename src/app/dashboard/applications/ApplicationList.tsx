"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Inbox, Clock, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateApplicationStatus } from "@/app/actions/applications";
import { useTransition } from "react";

export default function ApplicationList({ applications, currentUserId }: { applications: any[], currentUserId?: string }) {
  const [isPending, startTransition] = useTransition();

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
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-border/50">
                <div className="flex items-center text-xs font-medium text-muted-foreground">
                  <Clock className="h-3.5 w-3.5 mr-1.5 opacity-50" />
                  {new Date(app.createdAt).toLocaleDateString()}
                </div>
                
                {currentUserId && 
                 app.userId !== currentUserId && 
                 (app.project.creatorId === currentUserId || app.project.mentorId === currentUserId || app.project.partnerId === currentUserId) && 
                 app.status === "PENDING" && (
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleUpdate(app.id, "REJECTED")}
                      disabled={isPending}
                      className="h-8 px-2 rounded-lg text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleUpdate(app.id, "ACCEPTED")}
                      disabled={isPending}
                      className="h-8 px-2 rounded-lg text-emerald-500 hover:text-emerald-600 hover:bg-emerald-50"
                    >
                      <CheckCircle2 className="h-4 w-4" />
                    </Button>
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
