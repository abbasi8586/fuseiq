"use client";

interface ProgressBarProps {
  value: number;
  color?: string;
  height?: number;
  animated?: boolean;
}

export function ProgressBar({ value, color = "#00D4FF", height = 4, animated = true }: ProgressBarProps) {
  return (
    <div
      className="w-full rounded-full overflow-hidden"
      style={{ backgroundColor: "rgba(255,255,255,0.06)", height }}
    >
      <div
        className="h-full rounded-full transition-all duration-700 ease-out"
        style={{
          width: `${value}%`,
          background: `linear-gradient(to right, ${color}, ${color}88)`,
        }}
      />
    </div>
  );
}
