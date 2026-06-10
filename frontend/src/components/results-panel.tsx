
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import type { AnalysisResult } from "./analysis-form";

const MONO = "'Geist Mono', monospace";

const LEVEL_CFG = {
  Critical: { color: "#f87171", bg: "#f8717110", ring: "#f8717140", label: "CRITICAL" },
  High: { color: "#f59e0b", bg: "#f59e0b10", ring: "#f59e0b40", label: "HIGH" },
  Medium: { color: "#fbbf24", bg: "#fbbf2410", ring: "#fbbf2440", label: "MEDIUM" },
  Low: { color: "#34d399", bg: "#34d39910", ring: "#34d39940", label: "LOW" },
};

function ScoreArc({ score, color }: { score: number; color: string }) {
  const r = 80;
  const cx = 100;
  const cy = 100;

  const circumference = Math.PI * r;
  const dash = (score / 100) * circumference;

  return (
    <svg width={200} height={120} viewBox="0 0 200 120">
      {/* background */}
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none"
        stroke="rgba(255,255,255,0.06)"
        strokeWidth={14}
        strokeLinecap="round"
      />

      {/* active */}
      <path
        d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
        fill="none"
        stroke={color}
        strokeWidth={14}
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circumference}`}
        style={{ transition: "stroke-dasharray 0.7s ease" }}
      />

      {/* score */}
      <text
        x={cx}
        y={cy - 10}
        textAnchor="middle"
        fill={color}
        style={{
          fontFamily: MONO,
          fontSize: 36,
          fontWeight: 700,
        }}
      >
        {score.toFixed(0)}
      </text>

      <text
        x={cx}
        y={cy + 18}
        textAnchor="middle"
        fill="rgba(255,255,255,0.35)"
        style={{
          fontFamily: MONO,
          fontSize: 12,
        }}
      >
        RISK SCORE
      </text>
    </svg>
  );
}

function FeatureBar({ data }: { data: Record<string, number> }) {
  const entries = Object.entries(data)
    .sort((a, b) => b[1] - a[1])
    .map(([name, value]) => ({ name: name.replace(/_/g, " "), value: Math.round(value * 100) }));

  return (
    <ResponsiveContainer width="100%" height={130}>
      <BarChart data={entries} layout="vertical" margin={{ top: 0, right: 8, bottom: 0, left: 0 }}>
        <XAxis type="number" domain={[0, 40]} tick={{ fontFamily: MONO, fontSize: 9, fill: "#4e5f74" }} axisLine={false} tickLine={false} />
        <YAxis type="category" dataKey="name" width={120} tick={{ fontFamily: MONO, fontSize: 9, fill: "#7a8a9e" }} axisLine={false} tickLine={false} />
        <Tooltip
          cursor={{ fill: "rgba(255,255,255,0.03)" }}
          contentStyle={{ background: "#0b1120", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 2, fontFamily: MONO, fontSize: 11 }}
          formatter={(v: number) => [`${v}%`, "importance"]}
        />
        <Bar dataKey="value" radius={[0, 2, 2, 0]} maxBarSize={10}>
          {entries.map((_, i) => (
            <Cell key={i} fill={i === 0 ? "#f59e0b" : `rgba(245,158,11,${0.55 - i * 0.08})`} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function ResultsPanel({ result }: { result: AnalysisResult | null }) {
  if (!result) {
    return (
      <div className="h-full flex flex-col items-center justify-center py-16 select-none">
        <div
          className="w-14 h-14 flex items-center justify-center mb-4"
          style={{ border: "1px solid rgba(255,255,255,0.06)", borderRadius: "var(--radius)", background: "rgba(255,255,255,0.02)" }}
        >
          <span style={{ fontFamily: MONO, fontSize: "1.4rem", color: "rgba(255,255,255,0.12)" }}>—</span>
        </div>
        <p className="text-muted-foreground text-center" style={{ fontFamily: MONO, fontSize: "0.72rem", maxWidth: 220, lineHeight: 1.7 }}>
          No analysis run yet.<br />Configure parameters and run the model.
        </p>
      </div>
    );
  }

  const cfg = LEVEL_CFG[result.risk_level] ?? LEVEL_CFG.Medium;

  return (
    <div className="space-y-4">
      {/* risk badge + score */}
      <div
        className="flex flex-col gap-8 items-center p-6"
        style={{ background: cfg.bg, border: `1px solid ${cfg.ring}`, borderRadius: "var(--radius)" }}
      >
        <div className="flex-shrink-0">
          <ScoreArc score={result.risk_score} color={cfg.color} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-center gap-2 mb-1.5">
            <span
              className="px-2 py-0.5 text-xs "
              style={{ fontFamily: MONO, background: cfg.color, color: "#05080f", fontWeight: 600, borderRadius: 2 }}
            >
              {cfg.label}
            </span>
            {/* <span className="text-muted-foreground" style={{ fontFamily: MONO, fontSize: "0.65rem" }}>
              {result.confidence}% confidence
            </span> */}
          </div>

          {/* <p className="mt-5 text-muted-foreground" style={{ fontFamily: MONO, fontSize: "1rem" }}>
            production impact <br /><span style={{ color: cfg.color }}>{result.production_impact_pct}</span>
          </p>
          <p className="mt-1.5 text-muted-foreground" style={{ fontFamily: MONO, fontSize: "1rem" }}>
            Est. full recovery <br /><span style={{ color: cfg.color }}>{result.full_recovery_days} days</span>
          </p> */}
        </div>
      </div>

      {/* confidence bar */}
      {/* <div>
        <div className="flex justify-between mb-1.5">
          <span className="text-muted-foreground uppercase" style={{ fontFamily: MONO, fontSize: "0.6rem", letterSpacing: "0.1em" }}>Model Confidence</span>
          <span style={{ fontFamily: MONO, fontSize: "0.7rem", color: "#38bdf8" }}>{result.confidence}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
          <div
            className="h-1.5 rounded-full transition-all duration-700"
            style={{ width: `${result.confidence}%`, background: "linear-gradient(90deg, #38bdf8, #a78bfa)" }}
          />
        </div>
      </div> */}

      {/* recommendation */}
      {/* <div className="p-4" style={{ background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.15)", borderRadius: "var(--radius)" }}>
        <p className="text-muted-foreground uppercase mb-1.5" style={{ fontFamily: MONO, fontSize: "0.6rem", letterSpacing: "0.1em" }}>
          Recommendation
        </p>
        <p className="text-foreground leading-relaxed" style={{ fontSize: "0.82rem" }}>
          {result.recommendation}
        </p>
      </div> */}

      {/* feature importance */}
      {/* {result.feature_importance && (
        <div>
          <p className="text-muted-foreground uppercase mb-3" style={{ fontFamily: MONO, fontSize: "0.6rem", letterSpacing: "0.1em" }}>
            Feature Importance
          </p>
          <FeatureBar data={result.feature_importance} />
        </div>
      )} */}
    </div>
  );
}
