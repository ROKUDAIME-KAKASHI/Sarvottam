"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Building, GraduationCap, Briefcase } from "lucide-react";

interface DepartmentKPIChartProps {
  departments: {
    id: string;
    name: string;
    projectCount: number;
    facultyCount: number;
    kpiCount: number;
  }[];
}

export function DepartmentKPIChart({ departments }: DepartmentKPIChartProps) {
  const chartData = departments.map((d) => ({
    name: d.name.replace(" Engineering", "").replace(" & Engineering", ""),
    fullName: d.name,
    Projects: d.projectCount,
    Faculty: d.facultyCount,
    KPIs: d.kpiCount,
  }));

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {departments.map((d) => (
          <div
            key={d.id}
            className="p-3.5 rounded-xl border border-border/50 bg-muted/20 space-y-2"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-foreground truncate">{d.name}</span>
              <Building className="h-3.5 w-3.5 text-primary shrink-0" />
            </div>
            <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
              <div className="p-1.5 rounded-lg bg-background/50 border border-border/30">
                <span className="text-[10px] text-muted-foreground block">Projects</span>
                <span className="font-bold text-foreground">{d.projectCount}</span>
              </div>
              <div className="p-1.5 rounded-lg bg-background/50 border border-border/30">
                <span className="text-[10px] text-muted-foreground block">Faculty</span>
                <span className="font-bold text-foreground">{d.facultyCount}</span>
              </div>
              <div className="p-1.5 rounded-lg bg-background/50 border border-border/30">
                <span className="text-[10px] text-muted-foreground block">KPIs</span>
                <span className="font-bold text-foreground">{d.kpiCount}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Grouped Bar Chart */}
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
                  const data = payload[0].payload;
                  return (
                    <div className="p-3 rounded-xl border border-border bg-popover text-popover-foreground shadow-lg text-xs space-y-1.5">
                      <div className="font-bold">{data.fullName}</div>
                      <div className="space-y-0.5 text-muted-foreground">
                        <div>
                          Projects: <strong className="text-foreground">{data.Projects}</strong>
                        </div>
                        <div>
                          Faculty Supervisors:{" "}
                          <strong className="text-foreground">{data.Faculty}</strong>
                        </div>
                        <div>
                          Tracked KPIs: <strong className="text-foreground">{data.KPIs}</strong>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: 11, paddingTop: 10 }}
              iconType="circle"
              iconSize={8}
            />
            <Bar dataKey="Projects" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            <Bar dataKey="Faculty" fill="#10b981" radius={[6, 6, 0, 0]} />
            <Bar dataKey="KPIs" fill="#f59e0b" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
