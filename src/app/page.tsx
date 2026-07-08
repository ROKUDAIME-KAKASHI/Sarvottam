"use client";

import { motion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  CheckCircle,
  Target,
  ShieldCheck,
  Sprout,
  Network,
  BrainCircuit,
  Rocket,
} from "lucide-react";

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
            <Badge
              variant="outline"
              className="mb-8 px-4 py-1.5 text-sm font-medium rounded-full bg-background/50 backdrop-blur-md border-primary/20 text-primary"
            >
              <BrainCircuit className="w-3.5 h-3.5 mr-2 fill-primary/20" />
              The Next Generation Ecosystem
            </Badge>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter mb-6 leading-[1.1]">
              A Unified Engine for <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-br from-foreground via-foreground/80 to-primary/50">
                Organizational Excellence.
              </span>
            </h1>

            <p className="text-lg md:text-2xl text-muted-foreground/80 font-medium max-w-3xl leading-relaxed mb-10">
              Seamlessly integrate maturity assessments, continuous learning, innovation hubs, and
              ESG sustainability tracking powered by an intelligent Knowledge Graph.
            </p>
          </motion.div>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              href="/dashboard"
              className={buttonVariants({
                size: "lg",
                className:
                  "h-14 px-8 text-base rounded-full shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all",
              })}
            >
              Enter Dashboard <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/login"
              className={buttonVariants({
                variant: "outline",
                size: "lg",
                className:
                  "h-14 px-8 text-base rounded-full border-muted-foreground/20 hover:bg-muted/50 transition-all",
              })}
            >
              Create Account
            </Link>
          </motion.div>

          {/* Partnership Logos */}
          <motion.div
            className="mt-20 flex flex-col items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <p className="text-sm font-semibold tracking-widest text-muted-foreground uppercase mb-6">
              In Official Partnership With
            </p>
            <div className="flex flex-wrap items-center justify-center gap-10 md:gap-16 opacity-80 hover:opacity-100 transition-opacity grayscale hover:grayscale-0">
              <div className="relative h-24 w-64">
                <Image
                  src="/jain-university-logo-png_seeklogo-432784.png"
                  alt="Jain University"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="h-16 w-[2px] bg-border/50 hidden md:block"></div>
              <div className="relative h-24 w-64">
                <Image src="/0_Logo-IFQM.png" alt="IFQM" fill className="object-contain" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PLATFORM MODULES SECTION */}
      <section className="py-24 relative overflow-hidden bg-muted/30">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col mb-16 text-center items-center">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
              A Comprehensive Platform
            </h2>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl">
              Everything your organization needs to assess, train, innovate, and grow sustainably.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Excellence Frameworks",
                icon: <Target className="h-6 w-6" />,
                desc: "Drive organizational maturity through customizable assessment templates covering Leadership, Process, and Results.",
                topics: ["Scoring Engine", "Maturity Levels", "Benchmarking"],
              },
              {
                title: "Certification & LMS",
                icon: <ShieldCheck className="h-6 w-6" />,
                desc: "Deploy corporate training programs with automated credential issuance and verifiable badges.",
                topics: ["Course Workflows", "Micro Credentials", "Verification Portal"],
              },
              {
                title: "Innovation Hub",
                icon: <Rocket className="h-6 w-6" />,
                desc: "Foster internal and external innovation with startup incubation, hackathons, and mentor matching.",
                topics: ["Startup Registry", "Hackathons", "Pitch Submissions"],
              },
              {
                title: "Sustainability Center",
                icon: <Sprout className="h-6 w-6" />,
                desc: "Track and report on SDG mappings, ESG metrics, and carbon impact transparently.",
                topics: ["Carbon Tracking", "ESG Reporting", "SDG Mapping"],
              },
              {
                title: "Semantic Knowledge Graph",
                icon: <Network className="h-6 w-6" />,
                desc: "Connect problems, research papers, patents, and startups through our advanced relationship mapping.",
                topics: ["Knowledge Discovery", "Impact Tracking", "Semantic Search"],
              },
              {
                title: "AI Copilot Layer",
                icon: <BrainCircuit className="h-6 w-6" />,
                desc: "Leverage machine learning to generate real-time recommendations, skill gap analyses, and talent matching.",
                topics: ["Faculty Matching", "Skill Analytics", "Predictive Insights"],
              },
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
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                      {node.icon}
                    </div>
                    <h3 className="text-2xl font-bold mb-3">{node.title}</h3>
                    <p className="text-base text-muted-foreground mb-6 line-clamp-3">{node.desc}</p>
                    <ul className="space-y-3 mt-auto">
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

      {/* METRICS SECTION */}
      <section className="py-24 relative container mx-auto px-4 md:px-6">
        <div className="flex flex-col mb-12 text-center items-center">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Driven by Data</h2>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Track KPIs across your entire organization with real-time analytics.
          </p>
        </div>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-4"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          {[
            { value: "10+", label: "Integrated Modules" },
            { value: "360°", label: "Assessment Coverage" },
            { value: "AI", label: "Powered Matching" },
            { value: "100%", label: "Real-time Auditing" },
          ].map((stat, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center py-10 px-6 rounded-2xl border border-muted-foreground/10 bg-background hover:bg-muted/30 transition-colors shadow-sm"
            >
              <h3 className="text-5xl font-bold tracking-tight mb-2 text-foreground">
                {stat.value}
              </h3>
              <p className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
                {stat.label}
              </p>
            </div>
          ))}
        </motion.div>
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
              Ready to transform your organization?
            </h2>
            <p className="text-muted-foreground text-lg mb-10">
              Join the Sarvottam ecosystem today. Deploy assessments, train your workforce, track
              your environmental footprint, and unleash innovation.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/dashboard"
                className={buttonVariants({
                  size: "lg",
                  className: "h-14 px-8 text-base rounded-full shadow-lg",
                })}
              >
                Access Dashboard
              </Link>
              <Link
                href="/login"
                className={buttonVariants({
                  variant: "secondary",
                  size: "lg",
                  className: "h-14 px-8 text-base rounded-full",
                })}
              >
                Register Now
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
