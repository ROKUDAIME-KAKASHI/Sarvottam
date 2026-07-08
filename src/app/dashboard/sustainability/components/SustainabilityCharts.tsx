"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";

type CarbonMetric = {
  id: string;
  scope: string;
  source: string;
  emissions: number;
  measuredAt: Date;
};

type ESGMetric = {
  id: string;
  category: string;
  name: string;
  value: number;
  unit: string;
  measuredAt: Date;
};

export function CarbonChart({ metrics }: { metrics: CarbonMetric[] }) {
  if (!metrics || metrics.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-muted-foreground">
        No carbon data available
      </div>
    );
  }

  // Aggregate by scope
  const dataMap = metrics.reduce(
    (acc, curr) => {
      acc[curr.scope] = (acc[curr.scope] || 0) + curr.emissions;
      return acc;
    },
    {} as Record<string, number>
  );

  const data = Object.keys(dataMap).map((key) => ({
    name: key.replace("SCOPE_", "Scope "),
    emissions: parseFloat(dataMap[key].toFixed(2)),
  }));

  const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444"];

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="emissions"
            label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => `${value} tCO2e`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ESGChart({ metrics }: { metrics: ESGMetric[] }) {
  if (!metrics || metrics.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-muted-foreground">
        No ESG data available
      </div>
    );
  }

  // Count by category for a simple overview
  const dataMap = metrics.reduce(
    (acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const data = Object.keys(dataMap).map((key) => ({
    name: key,
    count: dataMap[key],
  }));

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} name="Metrics Logged" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function CarbonTrendChart({ metrics }: { metrics: CarbonMetric[] }) {
  if (!metrics || metrics.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-muted-foreground">
        No trend data available
      </div>
    );
  }

  // Group by date (simplified to local date string)
  const sortedMetrics = [...metrics].sort(
    (a, b) => new Date(a.measuredAt).getTime() - new Date(b.measuredAt).getTime()
  );

  const trendMap = sortedMetrics.reduce(
    (acc, curr) => {
      const date = new Date(curr.measuredAt).toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      });
      acc[date] = (acc[date] || 0) + curr.emissions;
      return acc;
    },
    {} as Record<string, number>
  );

  const data = Object.keys(trendMap).map((date) => ({
    date,
    emissions: parseFloat(trendMap[date].toFixed(2)),
  }));

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip formatter={(value) => `${value} tCO2e`} />
          <Line
            type="monotone"
            dataKey="emissions"
            stroke="#10b981"
            strokeWidth={2}
            name="Total Emissions"
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
