"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, TrendingUp, Users, Briefcase, FileText, CheckCircle } from "lucide-react";

export default function KPIsClient({ stats }: { stats: any }) {
  const displayStats = [
    { title: "Total Projects", value: stats.totalProjects, icon: Briefcase },
    { title: "Active Students", value: stats.activeStudents, icon: Users },
    { title: "Completed Projects", value: stats.completedProjects, icon: CheckCircle },
    { title: "Total Users", value: stats.totalUsers, icon: FileText },
  ];

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col justify-between items-start gap-4">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <h2 className="text-3xl font-black tracking-tight text-foreground">Analytics & KPIs</h2>
          <p className="text-muted-foreground font-medium">Track platform performance and metrics based on live database data.</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {displayStats.map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1, type: "spring" }}
          >
            <Card className="rounded-3xl border-border/50 bg-background/40 backdrop-blur-xl shadow-lg relative overflow-hidden group">
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 p-6">
                <CardTitle className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
                  {stat.title}
                </CardTitle>
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <stat.icon className="h-5 w-5" />
                </div>
              </CardHeader>
              <CardContent className="p-6 pt-0">
                <div className="text-4xl font-black">{stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="rounded-3xl border-border/50 bg-background/40 backdrop-blur-xl shadow-lg min-h-[400px] flex items-center justify-center flex-col gap-4">
           <BarChart className="h-16 w-16 text-muted-foreground/30" />
           <p className="text-muted-foreground font-semibold">Live charting will be implemented here as historical data builds up.</p>
        </Card>
      </motion.div>
    </div>
  );
}
