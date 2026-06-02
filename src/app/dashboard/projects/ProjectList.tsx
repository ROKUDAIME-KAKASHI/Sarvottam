"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Clock, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProjectList({ projects }: { projects: any[] }) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", bounce: 0.3 } as const }
  };

  if (projects.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No projects found. Create one to get started!
      </div>
    );
  }

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
    >
      {projects.map((project) => (
        <motion.div key={project.id} variants={item}>
          <Card className="group h-full rounded-3xl border-border/50 bg-background/40 backdrop-blur-xl hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 overflow-hidden relative">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            
            <CardHeader className="p-6 pb-4">
              <div className="flex justify-between items-start mb-4">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary ring-1 ring-primary/20">
                  <Briefcase className="h-5 w-5" />
                </div>
                <Badge 
                  variant={project.status === "COMPLETED" ? "default" : "secondary"}
                  className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${
                    project.status === "OPEN" ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20" : 
                    project.status === "IN_PROGRESS" ? "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20" : ""
                  }`}
                >
                  {project.status}
                </Badge>
              </div>
              <CardTitle className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">
                {project.title}
              </CardTitle>
              <CardDescription className="text-xs font-bold text-muted-foreground/60 tracking-widest uppercase mt-1">
                ID: {project.id.slice(-6)}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-6 pt-0 space-y-6">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {project.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center text-xs font-medium text-muted-foreground">
                  <Clock className="h-3.5 w-3.5 mr-1.5 opacity-50" />
                  {new Date(project.createdAt).toLocaleDateString()}
                </div>
                <Button variant="ghost" size="sm" className="h-8 px-2 rounded-lg group-hover:bg-primary/10 group-hover:text-primary transition-all">
                  Details
                  <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}
