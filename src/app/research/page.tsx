"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Briefcase, Calendar, User, ArrowRight, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";

const FadeUpText = ({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) => {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {text}
    </motion.h2>
  );
};

export default function ResearchMarketplace() {
  const projects = [
    { title: "Predictive Analytics for CNC Maintenance", dept: "Data Analytics", diff: "Advanced", time: "3 Months", mentor: "Dr. Sharma", color: "text-violet-500", bg: "bg-violet-500/10" },
    { title: "Six Sigma Process in Automotive Assembly", dept: "Engineering Quality", diff: "Intermediate", time: "6 Months", mentor: "Prof. Gupta", color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { title: "IoT Quality Monitoring for Smart Factory", dept: "Digital Solutions", diff: "Advanced", time: "4 Months", mentor: "Dr. Reddy", color: "text-amber-500", bg: "bg-amber-500/10" },
    { title: "Leadership Impact on Total Quality Management", dept: "MBA Quality", diff: "Beginner", time: "2 Months", mentor: "Prof. Patel", color: "text-rose-500", bg: "bg-rose-500/10" },
  ];

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } as const }
  };

  return (
    <div className="flex flex-col min-h-screen relative overflow-x-hidden bg-background">
      {/* PREMIUM BACKGROUND ELEMENTS */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden flex justify-center">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[150px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080801a_1px,transparent_1px),linear-gradient(to_bottom,#8080801a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-70" />
      </div>

      <div className="container relative z-10 mx-auto px-4 py-24">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="space-y-4 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
            >
              <Badge variant="outline" className="px-4 py-1.5 text-sm font-medium border-primary/30 bg-primary/10 text-primary backdrop-blur-md shadow-sm rounded-full">
                <Sparkles className="w-4 h-4 mr-2 inline-block animate-pulse" />
                Live Marketplace
              </Badge>
            </motion.div>
            <FadeUpText 
              text="Research Marketplace" 
              className="text-4xl md:text-6xl font-black tracking-tight text-foreground"
            />
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-muted-foreground font-medium"
            >
              Discover open industry projects and apply to join a specialized research node.
            </motion.p>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative w-full md:w-80 group"
          >
            <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-xl group-focus-within:bg-primary/10 transition-colors" />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors z-10" />
            <Input 
              type="search" 
              placeholder="Search projects..." 
              className="pl-12 h-14 w-full bg-background/60 backdrop-blur-xl border-border/50 rounded-2xl focus:ring-primary/20 focus:border-primary/50 transition-all relative z-10 text-base" 
            />
          </motion.div>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {projects.map((p, i) => (
            <motion.div key={i} variants={item} className="h-full">
              <Card className="flex flex-col h-full rounded-[2rem] border-border/50 bg-background/60 backdrop-blur-xl hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 group overflow-hidden relative border-t-primary/10">
                <div className={`absolute top-0 right-0 w-32 h-32 ${p.bg} rounded-full blur-3xl -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
                
                <CardHeader className="p-8 pb-4 relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/10 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                      {p.dept}
                    </Badge>
                    <Badge variant="outline" className="border-border/50 text-[10px] font-black uppercase px-2 py-0.5 rounded-md">
                      {p.diff}
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl font-bold leading-tight group-hover:text-primary transition-colors duration-300">
                    {p.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="p-8 pt-4 flex-1 space-y-6 relative z-10">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center text-sm font-medium text-muted-foreground">
                      <Calendar className="h-4 w-4 mr-2 text-primary/60" />
                      {p.time}
                    </div>
                    <div className="flex items-center text-sm font-medium text-muted-foreground">
                      <User className="h-4 w-4 mr-2 text-primary/60" />
                      {p.mentor}
                    </div>
                  </div>
                  <p className="text-muted-foreground leading-relaxed font-medium">
                    Industry-sponsored project looking for dedicated research nodes to analyze, optimize, and report on quality improvements.
                  </p>
                </CardContent>
                
                <CardFooter className="p-8 pt-0 relative z-10">
                  <Button className="w-full h-12 rounded-xl font-bold text-base shadow-lg shadow-primary/5 group-hover:shadow-primary/20 group-hover:scale-[1.02] active:scale-[0.98] transition-all">
                    Apply to Node <ArrowRight className="ml-2 h-4 w-4 opacity-70 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
