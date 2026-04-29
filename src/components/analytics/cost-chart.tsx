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

interface CostChartProps {
  data: Array<{
    provider: string;
    cost: number;
    color: string;
  }>;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 rounded-lg border border-primary-cyan/30">
        <p className="text-text-body text-sm font-medium mb-1">{label}</p>
        <p className="text-text-hero font-semibold text-lg">
          ${payload[0].value.toFixed(2)}
        </p>
      </div>
    );
  }
  return null;
};

export function CostChart({ data }: CostChartProps) {
  return (
    <div className="w-full h-full min-h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          barSize={40}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(0, 212, 255, 0.08)"
            vertical={false}
          />
          <XAxis
            dataKey="provider"
            stroke="rgba(107, 114, 144, 0.5)"
            tick={{ fill: "#6B7290", fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: "rgba(0, 212, 255, 0.1)" }}
          />
          <YAxis
            stroke="rgba(107, 114, 144, 0.5)"
            tick={{ fill: "#6B7290", fontSize: 12 }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="cost" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
