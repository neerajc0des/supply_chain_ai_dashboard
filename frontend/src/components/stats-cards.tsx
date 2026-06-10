import { type LucideIcon } from "lucide-react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";

interface StatsCardProps {
  label: string;
  value: string;
  delta?: string;
  deltaUp?: boolean;
  sublabel: string;
  icon: LucideIcon;
  accentColor: string;
  sparkData?: { v: number }[];
}

export function StatsCard({
  label, value, delta, deltaUp, sublabel, icon: Icon, accentColor, sparkData,
}: StatsCardProps) {
  return (
    <div
      className="relative bg-card border border-border flex flex-col justify-between overflow-hidden"
      style={{ borderRadius: "var(--radius)", minHeight: 128 }}
    >
      {/* top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-[1px]" style={{ background: accentColor, opacity: 0.6 }} />

      <div className="px-5 pt-5 pb-3 flex items-start justify-between">
        <div>
          <p
            className="text-muted-foreground uppercase tracking-widest"
            style={{ fontFamily: "'Geist Mono', monospace", fontSize: "0.65rem", letterSpacing: "0.12em" }}
          >
            {label}
          </p>
          <p
            className="mt-2 text-foreground"
            style={{ fontFamily: "'Geist Mono', monospace", fontSize: "2.1rem", fontWeight: 500, lineHeight: 1, letterSpacing: "-0.02em" }}
          >
            {value}
          </p>
          <div className="mt-2 flex items-center gap-2">
            {delta && (
              <span
                className="inline-flex items-center gap-0.5"
                style={{
                  fontFamily: "'Geist Mono', monospace",
                  fontSize: "0.7rem",
                  color: deltaUp ? "#34d399" : "#f87171",
                }}
              >
                {deltaUp ? "↑" : "↓"} {delta}
              </span>
            )}
            <span className="text-muted-foreground" style={{ fontSize: "0.72rem" }}>{sublabel}</span>
          </div>
        </div>
        <div
          className="w-9 h-9 flex items-center justify-center flex-shrink-0"
          style={{ background: `${accentColor}16`, border: `1px solid ${accentColor}28`, borderRadius: "var(--radius)" }}
        >
          <Icon size={15} style={{ color: accentColor }} strokeWidth={1.8} />
        </div>
      </div>

      {/* sparkline */}
      {/* {sparkData && (
        <div className="h-10 w-full px-0">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sparkData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id={`sg-${label}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={accentColor} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={accentColor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="v"
                stroke={accentColor}
                strokeWidth={1.5}
                fill={`url(#sg-${label})`}
                dot={false}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )} */}
    </div>
  );
}
