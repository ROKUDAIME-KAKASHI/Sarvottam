"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target, BarChart, Cpu, Sprout, ShieldCheck, CheckCircle, Binary } from "lucide-react";

const FRAMEWORKS = [
  {
    title: "Total Quality Management (TQM)",
    tag: "ORGANIZATIONAL EXCELLENCE",
    icon: Target,
    desc: "A holistic methodology prioritizing defect prevention over defect detection through systematic process optimization and cross-departmental accountability.",
    standards: [
      "Customer-Centric Quality Metrics",
      "Continuous PDCA (Plan-Do-Check-Act) Cycles",
      "Process Standardization & Waste Elimination",
    ],
  },
  {
    title: "Six Sigma DMAIC Protocol",
    tag: "STATISTICAL CONTROL",
    icon: BarChart,
    desc: "A disciplined, data-driven approach applying advanced statistical process control (SPC) to eliminate defects and achieve near-zero variance in production.",
    standards: [
      "DMAIC (Define, Measure, Analyze, Improve, Control)",
      "Capability Indices (Cp, Cpk) Benchmarking",
      "Root Cause Failure Analysis (FMEA)",
    ],
  },
  {
    title: "Industry 4.0 & Cyber-Physical Systems",
    tag: "DIGITAL TWINS & IOT",
    icon: Cpu,
    desc: "Integration of edge computing, IoT sensor arrays, and predictive machine learning models to monitor asset health and forecast machine failures before downtime occurs.",
    standards: [
      "Real-Time Telemetry & Edge Synchronization",
      "Predictive Maintenance (PdM) Algorithms",
      "Automated Optical Inspection (AOI) with Computer Vision",
    ],
  },
  {
    title: "ESG & Carbon Lifecycle Accounting",
    tag: "SUSTAINABLE MANUFACTURING",
    icon: Sprout,
    desc: "Comprehensive tracking of Scope 1, 2, and 3 carbon emissions alongside bio-compatible material alternatives aligned with United Nations SDG frameworks.",
    standards: [
      "Life-Cycle Assessment (LCA) Modeling",
      "Biodegradable Materials Verification",
      "Carbon Footprint Benchmarking",
    ],
  },
];

export function QualityFrameworks() {
  return (
    <section className="py-20 md:py-28 bg-muted/20 border-b border-border/40 relative">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-xs font-mono mb-4">
            <ShieldCheck className="h-3.5 w-3.5" />
            METHODOLOGICAL RIGOR & STANDARDS
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Academic Rigor Meets Industrial Precision
          </h2>
          <p className="text-muted-foreground mt-3 text-base sm:text-lg">
            Every challenge solved through Sarvottam is anchored to internationally recognized
            quality standards, statistical controls, and verifiable engineering frameworks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {FRAMEWORKS.map((fw, idx) => {
            const Icon = fw.icon;
            return (
              <Card
                key={idx}
                className="rounded-3xl border-border/60 bg-card p-6 sm:p-8 hover:border-primary/40 transition-colors shadow-xs"
              >
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                    <Icon className="h-6 w-6" />
                  </div>
                  <Badge variant="outline" className="font-mono text-[10px] tracking-wider">
                    {fw.tag}
                  </Badge>
                </div>

                <h3 className="text-xl font-bold text-foreground mb-2">{fw.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6">{fw.desc}</p>

                <div className="space-y-2 pt-4 border-t border-border/40">
                  {fw.standards.map((std, j) => (
                    <div key={j} className="flex items-center text-xs font-medium text-foreground">
                      <CheckCircle className="h-3.5 w-3.5 mr-2 text-primary shrink-0" />
                      <span>{std}</span>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
