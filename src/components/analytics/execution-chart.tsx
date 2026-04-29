"use client";

import { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";

interface ExecutionChartProps {
  data: Array<{
    date: string;
    executions: number;
    success: number;
    failed: number;
  }>;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card p-3 rounded-lg border border-primary-cyan/30">
        <p className="text-text-body text-sm font-medium mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-text-muted capitalize">
              {entry.name}:
            </span>
            <span className="text-text-hero font-semibold">
              {entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function ExecutionChart({ data }: ExecutionChartProps) {
  const [hoveredLine, setHoveredLine] = useState<string | null>(null);

  return (
    <div className="w-full h-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          onMouseMove={(e: any) => {
            if (e && e.activePayload) {
              setHoveredLine("executions");
            }
          }}
          onMouseLeave={() => setHoveredLine(null)}
        >
          <defs>
            <linearGradient id="executionsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00D4FF" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#00D4FF" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="successGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00E5A0" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#00E5A0" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="failedGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FF4757" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#FF4757" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(0, 212, 255, 0.08)"
            vertical={false}
          />
          <XAxis
            dataKey="date"
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
            tickFormatter={(value) => value.toLocaleString()}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="executions"
            stroke="#00D4FF"
            strokeWidth={hoveredLine === "executions" ? 3 : 2}
            fill="url(#executionsGradient)"
            dot={{ fill: "#00D4FF", strokeWidth: 0, r: 3 }}
            activeDot={{ r: 6, fill: "#00D4FF", stroke: "#06070A", strokeWidth: 2 }}
          />
          <Area
            type="monotone"
            dataKey="success"
            stroke="#00E5A0"
            strokeWidth={2}
            fill="url(#successGradient)"
            dot={{ fill: "#00E5A0", strokeWidth: 0, r: 2 }}
            activeDot={{ r: 5, fill: "#00E5A0", stroke: "#06070A", strokeWidth: 2 }}
          />
          <Area
            type="monotone"
            dataKey="failed"
            stroke="#FF4757"
            strokeWidth={2}
            fill="url(#failedGradient)"
            dot={{ fill: "#FF4757", strokeWidth: 0, r: 2 }}
            activeDot={{ r: 5, fill: "#FF4757", stroke: "#06070A", strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
