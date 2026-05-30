"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Send, Upload, Building2, Factory, HelpCircle } from "lucide-react";

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

export default function ProblemsPortal() {
  return (
    <div className="flex flex-col min-h-screen relative overflow-x-hidden bg-background">
      {/* PREMIUM BACKGROUND ELEMENTS */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden flex justify-center">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[150px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/10 blur-[150px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080801a_1px,transparent_1px),linear-gradient(to_bottom,#8080801a_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-70" />
      </div>

      <div className="container relative z-10 mx-auto px-4 py-24 max-w-4xl">
        <div className="text-center mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
          >
            <Badge variant="outline" className="mb-4 px-4 py-1.5 text-sm font-medium border-primary/30 bg-primary/10 text-primary backdrop-blur-md shadow-sm rounded-full">
              <Factory className="w-4 h-4 mr-2 inline-block animate-pulse" />
              Industry Node
            </Badge>
          </motion.div>
          
          <FadeUpText 
            text="Industry Problem Portal" 
            className="text-4xl md:text-6xl font-black tracking-tight text-foreground"
          />
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto"
          >
            Submit your quality challenges and let our specialized academic nodes develop research-driven solutions.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, type: "spring", bounce: 0.1 }}
        >
          <Card className="rounded-[2rem] border-border/50 bg-background/60 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
            
            <CardHeader className="p-8 md:p-12 pb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-primary/10 rounded-lg text-primary">
                  <HelpCircle className="h-6 w-6" />
                </div>
                <CardTitle className="text-3xl font-bold">Submit a Challenge</CardTitle>
              </div>
              <CardDescription className="text-base font-medium">
                Provide comprehensive details about your process or quality issue to begin the research workflow.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="p-8 md:p-12 pt-0">
              <form className="space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="company" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Company Name</Label>
                    <div className="relative group">
                      <Building2 className="absolute left-3 top-3 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <Input 
                        id="company" 
                        placeholder="e.g. BuildIt Steel Ltd." 
                        className="pl-10 bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all h-11 rounded-xl"
                      />
                    </div>
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="sector" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Industry Sector</Label>
                    <Input 
                      id="sector" 
                      placeholder="e.g. Advanced Manufacturing" 
                      className="bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all h-11 rounded-xl"
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="problem" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Problem Statement</Label>
                  <Textarea 
                    id="problem" 
                    placeholder="Describe the quality issue, its current impact, and any data points you have already collected..." 
                    className="min-h-[160px] bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all rounded-2xl p-4 leading-relaxed"
                  />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="outcome" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Expected Outcome</Label>
                  <Textarea 
                    id="outcome" 
                    placeholder="What does a successful resolution look like for your team?" 
                    className="min-h-[100px] bg-background/50 border-border/50 focus:border-primary/50 focus:ring-primary/20 transition-all rounded-2xl p-4 leading-relaxed"
                  />
                </div>
                
                <div className="space-y-3">
                  <Label htmlFor="file" className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Supporting Documents (Optional)</Label>
                  <div className="relative group">
                    <div className="absolute inset-0 bg-primary/5 rounded-2xl border-2 border-dashed border-border/50 group-hover:border-primary/50 transition-colors pointer-events-none" />
                    <div className="flex flex-col items-center justify-center py-8 text-center px-6 relative z-10">
                      <Upload className="h-8 w-8 text-muted-foreground group-hover:text-primary transition-colors mb-2" />
                      <p className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-muted-foreground/60 mt-1">PDF, DOCX, or Excel files up to 10MB</p>
                    </div>
                    <Input id="file" type="file" className="opacity-0 absolute inset-0 cursor-pointer h-full w-full" />
                  </div>
                </div>

                <Button type="button" className="w-full h-14 text-lg font-bold rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all group">
                  Submit to Sarvottam Workflow
                  <Send className="ml-2 h-5 w-5 opacity-70 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
