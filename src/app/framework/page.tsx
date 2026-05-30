"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Workflow, Settings, Zap, ArrowRight, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import Link from "next/link";

const FadeUpText = ({ text, className }: { text: string; className?: string }) => {
  return (
    <motion.h2
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {text}
    </motion.h2>
  );
};

export default function FrameworkPage() {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden bg-background selection:bg-primary/30">
      {/* BACKGROUND ELEMENTS */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden flex justify-center">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[150px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080801a_1px,transparent_1px),linear-gradient(to_bottom,#8080801a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-70" />
      </div>

      {/* HEADER SECTION */}
      <section className="relative w-full pt-32 pb-20 z-10">
        <div className="container px-4 md:px-6 mx-auto flex flex-col items-center text-center space-y-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.15 }}
          >
            <Badge variant="outline" className="mb-6 px-4 py-1.5 text-sm font-medium border-primary/30 bg-primary/10 text-primary backdrop-blur-md shadow-sm rounded-full">
              <Workflow className="w-4 h-4 mr-2 inline-block animate-pulse" />
              Methodology
            </Badge>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-6xl font-black tracking-tight mb-4 text-balance text-foreground"
          >
            The Sarvottam Framework
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-xl text-muted-foreground mt-4 max-w-2xl mx-auto text-balance font-medium leading-relaxed"
          >
            A structured, collaborative approach to solving industry-scale quality challenges through targeted academic research.
          </motion.p>
        </div>
      </section>

      {/* STAGES SECTION */}
      <section className="relative z-10 py-16 mb-20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-1/2 left-10 right-10 h-0.5 bg-border -translate-y-1/2 -z-10" />

            {[
              {
                step: "01",
                title: "Identify",
                icon: <Target className="h-6 w-6" />,
                desc: "Industry partners submit real-world quality and process challenges into the ecosystem.",
                color: "text-blue-500",
                bg: "bg-blue-500/10"
              },
              {
                step: "02",
                title: "Research",
                icon: <Settings className="h-6 w-6" />,
                desc: "Academic faculty and students form specialized nodes to analyze root causes and design models.",
                color: "text-primary",
                bg: "bg-primary/10"
              },
              {
                step: "03",
                title: "Implement",
                icon: <Zap className="h-6 w-6" />,
                desc: "Prototypes and frameworks are deployed back to the industry partner for measurable validation.",
                color: "text-emerald-500",
                bg: "bg-emerald-500/10"
              }
            ].map((stage, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.7, delay: i * 0.2, type: "spring", bounce: 0.3 }}
                className="relative group h-full"
              >
                <Card className="h-full rounded-3xl border-border/50 bg-background/60 backdrop-blur-xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col group overflow-hidden relative">
                  <div className={`absolute top-0 right-0 w-32 h-32 ${stage.bg} rounded-full blur-3xl -mr-10 -mt-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                  <CardHeader className="p-8 pb-4 relative z-10 flex flex-row items-center justify-between">
                    <div className={`h-14 w-14 rounded-2xl ${stage.bg} flex items-center justify-center ${stage.color} ring-1 ring-border/50 group-hover:scale-110 transition-transform duration-500`}>
                      {stage.icon}
                    </div>
                    <span className="text-4xl font-black text-muted-foreground/30 group-hover:text-muted-foreground/60 transition-colors">
                      {stage.step}
                    </span>
                  </CardHeader>
                  <CardContent className="p-8 pt-4 flex-1 relative z-10">
                    <CardTitle className="text-2xl font-bold mb-4">{stage.title}</CardTitle>
                    <p className="text-[15px] font-medium text-muted-foreground leading-relaxed">
                      {stage.desc}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="relative z-10 py-24 bg-muted/20 border-t border-border/40 backdrop-blur-sm">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <FadeUpText text="Ready to experience the framework?" className="text-3xl md:text-4xl font-black tracking-tight mb-8" />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link href="/login" className={buttonVariants({ size: "lg", className: "h-14 px-8 text-base rounded-full shadow-xl shadow-primary/20 hover:scale-105 transition-all duration-300" })}>
              Join the Ecosystem <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}