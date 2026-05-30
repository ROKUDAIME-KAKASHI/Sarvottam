"use client";

import { motion } from "framer-motion";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRight, CheckCircle, Target, Users, Lightbulb, Activity, BarChart, Database, Zap } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen pt-24">
      {/* HERO SECTION */}
      <section className="relative w-full py-20 lg:py-32 overflow-hidden flex flex-col items-center justify-center min-h-[85vh]">
        
        {/* Background gradient orb */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] -z-10 opacity-70" />
        
        <div className="container px-4 md:px-6 relative z-10 text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center max-w-4xl"
          >
            <Badge variant="outline" className="mb-8 px-4 py-1.5 text-sm font-medium rounded-full bg-background/50 backdrop-blur-md border-primary/20 text-primary">
              <Zap className="w-3.5 h-3.5 mr-2 fill-primary/20" />
              JAIN University & IFQM Collaboration
            </Badge>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter mb-6 leading-[1.1]">
              A New Era in <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-foreground via-foreground/80 to-primary/50">
                Quality Excellence.
              </span>
            </h1>
            
            <p className="text-lg md:text-2xl text-muted-foreground/80 font-medium max-w-2xl leading-relaxed mb-10">
              Bridging the gap between academia and industry. Transforming complex challenges into research-driven solutions.
            </p>
          </motion.div>
          
          <motion.div
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link href="/research" className={buttonVariants({ size: "lg", className: "h-14 px-8 text-base rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all" })}>
              Explore Projects <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link href="/problems" className={buttonVariants({ variant: "outline", size: "lg", className: "h-14 px-8 text-base rounded-full border-muted-foreground/20 hover:bg-muted/50 transition-all" })}>
              Become a Partner
            </Link>
          </motion.div>
        </div>
      </section>

      {/* METRICS SECTION */}
      <section className="relative z-20 -mt-12 mb-24 container mx-auto px-4 md:px-6">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-1 bg-background/60 backdrop-blur-xl border border-white/10 dark:border-white/5 rounded-3xl p-2 shadow-2xl shadow-black/5"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {[
            { value: "85%", label: "Industry Alignment" },
            { value: "92%", label: "Student Engagement" },
            { value: "78%", label: "Partner Satisfaction" }
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center justify-center py-10 px-6 rounded-2xl hover:bg-muted/30 transition-colors">
              <h3 className="text-5xl font-bold tracking-tight mb-2 text-foreground">{stat.value}</h3>
              <p className="text-sm font-medium text-muted-foreground tracking-wide">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </section>

      {/* DEPARTMENT NODES SECTION */}
      <section className="py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Department Nodes</h2>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl">
              Specialized research centers designed to tackle highly specific industry problems.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "MBA Quality",
                icon: <Users className="h-5 w-5" />,
                desc: "Leadership and management research.",
                topics: ["Quality Management", "Process Improvement"]
              },
              {
                title: "Data Analytics",
                icon: <BarChart className="h-5 w-5" />,
                desc: "Predictive insights from raw data.",
                topics: ["Machine Learning", "Root Cause Analysis"]
              },
              {
                title: "Engineering",
                icon: <Activity className="h-5 w-5" />,
                desc: "Physical process optimization.",
                topics: ["Six Sigma", "DfQ"]
              },
              {
                title: "Digital Solutions",
                icon: <Database className="h-5 w-5" />,
                desc: "Software and hardware tech.",
                topics: ["AI Defect Detection", "Digital Twins"]
              }
            ].map((node, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: i * 0.1, ease: "easeOut" }}
              >
                <Card className="h-full bg-background/50 backdrop-blur-sm border-muted-foreground/10 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 rounded-2xl overflow-hidden group">
                  <CardContent className="p-6">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                      {node.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{node.title}</h3>
                    <p className="text-sm text-muted-foreground mb-6 line-clamp-2">{node.desc}</p>
                    <ul className="space-y-3">
                      {node.topics.map((topic, j) => (
                        <li key={j} className="flex items-center text-sm font-medium">
                          <CheckCircle className="h-4 w-4 mr-3 text-primary/50" />
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-32 relative">
        <div className="absolute inset-0 bg-primary/5 border-y border-primary/10" />
        <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
              Ready to solve your quality challenges?
            </h2>
            <p className="text-muted-foreground text-lg mb-10">
              Join the Sarvotam ecosystem today as an industry partner to submit your problems, or as a student to start researching solutions.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/problems" className={buttonVariants({ size: "lg", className: "h-14 px-8 text-base rounded-full shadow-lg" })}>
                Submit a Problem
              </Link>
              <Link href="/research" className={buttonVariants({ variant: "secondary", size: "lg", className: "h-14 px-8 text-base rounded-full" })}>
                View Research Marketplace
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
