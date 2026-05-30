"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Clock, CheckCircle2, AlertCircle, ArrowUpRight, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProjectsPage() {
  const projects = [
    { 
      id: "PRJ-001", 
      title: "CNC Predictive Maintenance Model", 
      status: "Active", 
      progress: 65, 
      priority: "High",
      node: "Data Analytics Node",
      updated: "2 hours ago"
    },
    { 
      id: "PRJ-002", 
      title: "Automotive Six Sigma Audit", 
      status: "On Hold", 
      progress: 40, 
      priority: "Medium",
      node: "Engineering Node",
      updated: "1 day ago"
    },
    { 
      id: "PRJ-003", 
      title: "Smart Factory IoT Integration", 
      status: "Completed", 
      progress: 100, 
      priority: "Critical",
      node: "Digital Solutions Node",
      updated: "3 days ago"
    }
  ];

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

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-black tracking-tight text-foreground">Research Projects</h2>
          <p className="text-muted-foreground font-medium">Manage and track your active academic-industry research nodes.</p>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex gap-2"
        >
          <Button variant="outline" size="sm" className="rounded-xl border-border/50 bg-background/50 backdrop-blur-md">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button size="sm" className="rounded-xl shadow-lg shadow-primary/20">
            Submit New Problem
          </Button>
        </motion.div>
      </div>

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
                    variant={project.status === "Completed" ? "default" : "secondary"}
                    className={`rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-wider ${
                      project.status === "Active" ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20" : 
                      project.status === "On Hold" ? "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20" : ""
                    }`}
                  >
                    {project.status}
                  </Badge>
                </div>
                <CardTitle className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">
                  {project.title}
                </CardTitle>
                <CardDescription className="text-xs font-bold text-muted-foreground/60 tracking-widest uppercase mt-1">
                  ID: {project.id} • {project.node}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-6 pt-0 space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-muted-foreground">Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="h-2 w-full bg-muted/30 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${project.progress}%` }}
                      transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                      className={`h-full rounded-full ${
                        project.status === "Completed" ? "bg-emerald-500" : "bg-primary"
                      }`}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center text-xs font-medium text-muted-foreground">
                    <Clock className="h-3.5 w-3.5 mr-1.5 opacity-50" />
                    Updated {project.updated}
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
    </div>
  );
}
