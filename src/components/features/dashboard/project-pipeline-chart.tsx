"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Briefcase, ArrowUpRight, CheckCircle2, Clock } from "lucide-react";

interface ProjectPipelineChartProps {
  data: {
    openProjects: number;
    inProgressProjects: number;
    completedProjects: number;
    pendingApplications: number;
    acceptedApplications: number;
  };
}

const COLORS = ["#3b82f6", "#6366f1", "#10b981", "#f59e0b", "#06b6d4"];

export function ProjectPipelineChart({ data }: ProjectPipelineChartProps) {
  const chartData = [
    { name: "Open Nodes", count: data.openProjects, stage: "Stage 1", color: "#3b82f6" },
    { name: "Active Sprints", count: data.inProgressProjects, stage: "Stage 2", color: "#6366f1" },
    { name: "Completed", count: data.completedProjects, stage: "Stage 3", color: "#10b981" },
    { name: "Pending Apps", count: data.pendingApplications, stage: "Pipeline", color: "#f59e0b" },
    {
      name: "Allocated Pods",
      count: data.acceptedApplications,
      stage: "Allocated",
      color: "#06b6d4",
    },
  ];

  const total = data.openProjects + data.inProgressProjects + data.completedProjects;

  return (
    <div className="space-y-6">
      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl border border-border/50 bg-muted/20">
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block mb-1">
            Open Nodes
          </span>
          <div className="text-xl font-extrabold text-foreground">{data.openProjects}</div>
          <span className="text-[11px] text-blue-500 font-medium">Seeking Pods</span>
        </div>

        <div className="p-3.5 rounded-xl border border-border/50 bg-muted/20">
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block mb-1">
            Active Sprints
          </span>
          <div className="text-xl font-extrabold text-foreground">{data.inProgressProjects}</div>
          <span className="text-[11px] text-indigo-500 font-medium">In Development</span>
        </div>

        <div className="p-3.5 rounded-xl border border-border/50 bg-muted/20">
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block mb-1">
            Handed Over
          </span>
          <div className="text-xl font-extrabold text-foreground">{data.completedProjects}</div>
          <span className="text-[11px] text-emerald-500 font-medium">Audited & Validated</span>
        </div>

        <div className="p-3.5 rounded-xl border border-border/50 bg-muted/20">
          <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground block mb-1">
            Allocated Students
          </span>
          <div className="text-xl font-extrabold text-foreground">{data.acceptedApplications}</div>
          <span className="text-[11px] text-cyan-500 font-medium">Active Pod Researchers</span>
        </div>
      </div>

      {/* Bar Chart Visualization */}
      <div className="h-[280px] w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.15} vertical={false} />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "currentColor", opacity: 0.7 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
              tick={{ fontSize: 11, fill: "currentColor", opacity: 0.7 }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="p-3 rounded-xl border border-border bg-popover text-popover-foreground shadow-lg text-xs space-y-1">
                      <div className="font-bold">{item.name}</div>
                      <div className="text-muted-foreground">
                        Volume: <strong className="text-foreground">{item.count} units</strong>
                      </div>
                      <div className="text-[10px] font-mono uppercase text-primary">
                        {item.stage}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="count" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground font-mono pt-2 border-t border-border/40">
        <span>TOTAL WORKSPACES: {total}</span>
        <span>TELEMETRY: LIVE SYSTEM FUNNEL</span>
      </div>
    </div>
  );
}
