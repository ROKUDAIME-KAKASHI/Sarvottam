"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, BarChart2, ShieldCheck, AlertTriangle, CheckCircle2 } from "lucide-react";

export function QualityCalculator() {
  const [usl, setUsl] = useState<number>(20.5); // Upper spec limit
  const [lsl, setLsl] = useState<number>(19.5); // Lower spec limit
  const [mean, setMean] = useState<number>(20.02); // Process mean
  const [stdDev, setStdDev] = useState<number>(0.12); // Standard deviation

  const stats = useMemo(() => {
    if (stdDev <= 0 || usl <= lsl) {
      return {
        cp: 0,
        cpk: 0,
        sigmaLevel: 0,
        ppm: 0,
        status: "INVALID",
        statusColor: "text-destructive",
        recommendation: "Check specification limits and standard deviation.",
      };
    }

    const cp = (usl - lsl) / (6 * stdDev);
    const cpu = (usl - mean) / (3 * stdDev);
    const cpl = (mean - lsl) / (3 * stdDev);
    const cpk = Math.min(cpu, cpl);
    const sigmaLevel = cpk * 3;

    // Estimate defect parts per million
    let ppm = 0;
    if (cpk >= 2.0)
      ppm = 3.4; // 6 Sigma
    else if (cpk >= 1.67)
      ppm = 54; // 5 Sigma
    else if (cpk >= 1.33)
      ppm = 63; // 4 Sigma
    else if (cpk >= 1.0)
      ppm = 2700; // 3 Sigma
    else if (cpk >= 0.67)
      ppm = 45500; // 2 Sigma
    else ppm = 308537; // <2 Sigma

    let status = "Capable";
    let statusColor = "text-emerald-500";
    let recommendation = "Process meets industrial standards.";

    if (cpk >= 2.0) {
      status = "World-Class Six Sigma";
      statusColor = "text-emerald-600 dark:text-emerald-400";
      recommendation = "Near-zero defect production (Benchmark Quality).";
    } else if (cpk >= 1.33) {
      status = "Industrially Capable (4-5 Sigma)";
      statusColor = "text-blue-600 dark:text-blue-400";
      recommendation = "Stable production under IFQM quality threshold.";
    } else if (cpk >= 1.0) {
      status = "Marginally Capable (3 Sigma)";
      statusColor = "text-amber-500";
      recommendation =
        "Moderate risk of defect spill. Recommended for Sarvottam Academic Node triage.";
    } else {
      status = "Incapable / High Rejection Rate";
      statusColor = "text-destructive";
      recommendation = "Urgent: Deploy DMAIC root-cause analysis and student engineering sprint.";
    }

    return {
      cp: Number(cp.toFixed(2)),
      cpk: Number(cpk.toFixed(2)),
      sigmaLevel: Number(sigmaLevel.toFixed(1)),
      ppm,
      status,
      statusColor,
      recommendation,
    };
  }, [usl, lsl, mean, stdDev]);

  return (
    <Card className="rounded-3xl border-border/60 bg-card shadow-sm p-6 sm:p-10">
      <CardHeader className="p-0 pb-6 border-b border-border/40">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-xs font-mono">
                LABORATORY BENCHMARK // SIX SIGMA & TQM
              </Badge>
            </div>
            <CardTitle className="text-xl sm:text-2xl font-bold">
              Process Capability (Cp / Cpk) Engine
            </CardTitle>
            <CardDescription className="text-xs sm:text-sm text-muted-foreground mt-1">
              Simulate industrial manufacturing tolerances to calculate statistical process
              capability, sigma levels, and estimated defect PPM.
            </CardDescription>
          </div>
          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <Calculator className="h-5 w-5" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 pt-6 space-y-6">
        {/* Input Parameters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs font-mono font-semibold uppercase text-muted-foreground">
              Upper Limit (USL)
            </Label>
            <Input
              type="number"
              step="0.01"
              value={usl}
              onChange={(e) => setUsl(parseFloat(e.target.value) || 0)}
              className="h-10 rounded-xl bg-muted/30 border-border/60 text-sm font-mono font-bold"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-mono font-semibold uppercase text-muted-foreground">
              Lower Limit (LSL)
            </Label>
            <Input
              type="number"
              step="0.01"
              value={lsl}
              onChange={(e) => setLsl(parseFloat(e.target.value) || 0)}
              className="h-10 rounded-xl bg-muted/30 border-border/60 text-sm font-mono font-bold"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-mono font-semibold uppercase text-muted-foreground">
              Process Mean (μ)
            </Label>
            <Input
              type="number"
              step="0.01"
              value={mean}
              onChange={(e) => setMean(parseFloat(e.target.value) || 0)}
              className="h-10 rounded-xl bg-muted/30 border-border/60 text-sm font-mono font-bold"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs font-mono font-semibold uppercase text-muted-foreground">
              Std Deviation (σ)
            </Label>
            <Input
              type="number"
              step="0.01"
              value={stdDev}
              onChange={(e) => setStdDev(parseFloat(e.target.value) || 0)}
              className="h-10 rounded-xl bg-muted/30 border-border/60 text-sm font-mono font-bold"
            />
          </div>
        </div>

        {/* Calculated Results Panel */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-5 rounded-2xl border border-border/60 bg-muted/20">
          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
              Potential (Cp)
            </span>
            <div className="text-2xl font-black text-foreground font-mono">{stats.cp}</div>
            <span className="text-[10px] text-muted-foreground">Tolerance / 6σ</span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
              Actual (Cpk)
            </span>
            <div className={`text-2xl font-black font-mono ${stats.statusColor}`}>{stats.cpk}</div>
            <span className="text-[10px] text-muted-foreground">Centered Capability</span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
              Sigma Level
            </span>
            <div className="text-2xl font-black text-foreground font-mono">{stats.sigmaLevel}σ</div>
            <span className="text-[10px] text-muted-foreground">Quality Precision</span>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block">
              Estimated Rejection
            </span>
            <div className="text-2xl font-black text-foreground font-mono">
              {stats.ppm.toLocaleString()}
            </div>
            <span className="text-[10px] text-muted-foreground">Parts Per Million (PPM)</span>
          </div>
        </div>

        {/* Status Interpretation */}
        <div className="p-4 rounded-xl border border-border/40 bg-background flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-1">
            <span className="font-mono text-muted-foreground uppercase text-[10px]">
              TQM Quality Assessment:
            </span>
            <div className="font-bold text-foreground flex items-center gap-1.5">
              <span
                className={`h-2 w-2 rounded-full ${stats.cpk >= 1.33 ? "bg-emerald-500" : "bg-amber-500"}`}
              />
              <span className={stats.statusColor}>{stats.status}</span>
            </div>
            <p className="text-muted-foreground text-[11px] leading-relaxed">
              {stats.recommendation}
            </p>
          </div>

          <div className="shrink-0 font-mono text-[11px] text-muted-foreground bg-muted px-3 py-1.5 rounded-lg border border-border/40">
            AUDITED BY IFQM PROTOCOL
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
