"use client"

import { useState } from "react";
import {
  Activity, ShieldAlert, Cpu, BarChart2, Zap,
  GitBranch, Settings, Bell, ChevronRight, DollarSign,
  ShieldIcon
} from "lucide-react";
import { StatsCard } from "@/components/stats-cards";
import { AnalysisForm, type AnalysisResult } from "@/components/analysis-form";
import { ResultsPanel } from "@/components/results-panel";
import { RecommendationsPanel } from "@/components/recommendation-panel";

const MONO = "'Geist Mono', monospace";
const SANS = "Inter, system-ui, sans-serif";

const SPARK_ANALYSES = [
  { v: 88 }, { v: 102 }, { v: 95 }, { v: 130 }, { v: 118 }, { v: 142 }, { v: 155 }, { v: 149 }, { v: 162 }, { v: 174 },
];
const SPARK_ALERTS = [
  { v: 2 }, { v: 4 }, { v: 3 }, { v: 6 }, { v: 5 }, { v: 7 }, { v: 6 }, { v: 8 }, { v: 7 }, { v: 9 },
];
const SPARK_ACC = [
  { v: 90 }, { v: 91 }, { v: 91.5 }, { v: 92 }, { v: 92.8 }, { v: 93.1 }, { v: 93.6 }, { v: 94.0 }, { v: 94.1 }, { v: 94.2 },
];

type Tab = "analyze" | "recommend";

const NAV_ITEMS = [
  { id: "analyze" as Tab, label: "Disruption Analysis", icon: Cpu },
  { id: "recommend" as Tab, label: "Recommendations", icon: GitBranch },
];

export default function App() {
  const [tab, setTab] = useState<Tab>("analyze");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [runCount, setRunCount] = useState(174);

  const handleResult = (r: AnalysisResult) => {
    setResult(r);
    console.log(result)
    setRunCount(c => c + 1);
  };

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "var(--background)", fontFamily: SANS, color: "var(--foreground)" }}
    >
      {/* ── Sidebar ── */}
      <aside
        className="flex flex-col w-[220px] flex-shrink-0 border-r"
        style={{ borderColor: "rgba(255,255,255,0.06)", background: "#060b16" }}
      >
        {/* logo */}
        <div className="px-5 py-5 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 flex items-center justify-center"
              style={{ background: "#f59e0b20", border: "1px solid #f59e0b40", borderRadius: "var(--radius)" }}
            >
              <ShieldIcon size={13} style={{ color: "#f59e0b" }} fill="#f59e0b" />
            </div>
            <div>
              <p style={{ fontFamily: MONO, fontSize: "0.75rem", fontWeight: 600, color: "#d4dbe8", lineHeight: 1.1 }}>
                SupplyShield
              </p>
            </div>
          </div>
        </div>

        {/* nav */}
        <nav className="flex-1 py-4 px-3 space-y-0.5">
          <p
            className="px-2 pb-2 pt-1 uppercase"
            style={{ fontFamily: MONO, fontSize: "0.55rem", color: "#4e5f74", letterSpacing: "0.12em" }}
          >
            Modules
          </p>
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const active = tab === id;
            return (
              <button
                key={id}
                onClick={() => setTab(id)}
                className="w-full flex items-center gap-2.5 px-2.5 py-2 text-left transition-all"
                style={{
                  borderRadius: "var(--radius)",
                  background: active ? "#f59e0b14" : "transparent",
                  color: active ? "#f59e0b" : "#7a8a9e",
                  fontFamily: MONO,
                  fontSize: "0.8rem",
                }}
              >
                <Icon size={13} strokeWidth={active ? 2 : 1.5} />
                <span className="flex-1">{label}</span>
                {active && <ChevronRight size={10} />}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* ── Main ── */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* topbar */}
        <header
          className="flex items-center justify-between px-6 py-3.5 border-b flex-shrink-0"
          style={{ borderColor: "rgba(255,255,255,0.06)", background: "#060b16" }}
        >
          <div>
            <p style={{ fontFamily: MONO, fontSize: "0.68rem", color: "#4e5f74", letterSpacing: "0.08em" }}>
              DASHBOARD
            </p>
            <h1 style={{ fontFamily: MONO, fontSize: "0.95rem", fontWeight: 600, color: "#d4dbe8", lineHeight: 1.2 }}>
              Supply Chain Disruption Intelligence
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 border"
              style={{ borderColor: "rgba(255,255,255,0.07)", borderRadius: "var(--radius)", background: "#0b1120" }}
            >
              <BarChart2 size={11} style={{ color: "#f59e0b" }} />
              <span style={{ fontFamily: MONO, fontSize: "0.62rem", color: "#7a8a9e" }}>
                {runCount} analyses
              </span>
            </div>
            <button
              className="w-8 h-8 flex items-center justify-center border transition-colors hover:border-white/20"
              style={{ borderColor: "rgba(255,255,255,0.07)", borderRadius: "var(--radius)", background: "#0b1120" }}
            >
              <Bell size={13} style={{ color: "#7a8a9e" }} />
            </button>
            <button
              className="w-8 h-8 flex items-center justify-center border transition-colors hover:border-white/20"
              style={{ borderColor: "rgba(255,255,255,0.07)", borderRadius: "var(--radius)", background: "#0b1120" }}
            >
              <Settings size={13} style={{ color: "#7a8a9e" }} />
            </button>
          </div>
        </header>

        {/* scrollable content */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6" style={{ scrollbarWidth: "none" }}>

          {/* ── Row 1: 3 stat cards ── */}
          <div className="grid grid-cols-3 gap-4">
            <StatsCard
              label="Production Impact"
              value={result?.production_impact_pct.toString() || "-"}
              delta=""
              deltaUp={true}
              sublabel=""
              icon={Activity}
              accentColor="#f59e0b"
              sparkData={SPARK_ANALYSES}
            />
            <StatsCard
              label="Full Recovery Days"
              value={Math.round(result?.full_recovery_days || 0)>0? Math.round(result?.full_recovery_days || 0).toString(): "-"}
              delta=""
              deltaUp={false}
              sublabel=""
              icon={ShieldAlert}
              accentColor="#34d399"
              sparkData={SPARK_ALERTS}
            />
            <StatsCard
              label="Revenue Loss (USD)"
              value={result?.revenue_loss_usd.toString() || "-"}
              delta=""
              deltaUp={true}
              sublabel=""
              icon={DollarSign}
              accentColor="#f87171"
              sparkData={SPARK_ACC}
            />
          </div>

          {/* ── Tab content ── */}
          {tab === "analyze" && (
            <div className="grid gap-5" style={{ gridTemplateColumns: "1fr 1fr" }}>
              {/* form */}
              <section className="bg-card border border-border" style={{ borderRadius: "var(--radius)" }}>
                <div
                  className="flex items-center justify-between px-5 py-3.5 border-b"
                  style={{ borderColor: "rgba(255,255,255,0.06)" }}
                >
                  <div className="flex items-center gap-2">
                    <Cpu size={13} style={{ color: "#f59e0b" }} />
                    <span style={{ fontFamily: MONO, fontSize: "0.72rem", color: "#d4dbe8", fontWeight: 500 }}>
                      Disruption Parameters
                    </span>
                  </div>
                  
                </div>
                <div className="p-5">
                  <AnalysisForm
                    onResult={handleResult}
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                  />
                </div>
              </section>

              {/* results */}
              <section className="bg-card border border-border" style={{ borderRadius: "var(--radius)" }}>
                <div
                  className="flex items-center justify-between px-5 py-3.5 border-b"
                  style={{ borderColor: "rgba(255,255,255,0.06)" }}
                >
                  <div className="flex items-center gap-2">
                    <BarChart2 size={13} style={{ color: result ? (
                      result.risk_level === "Critical" ? "#f87171"
                      : result.risk_level === "High" ? "#f59e0b"
                      : result.risk_level === "Low" ? "#34d399"
                      : "#fbbf24"
                    ) : "#4e5f74" }} />
                    <span style={{ fontFamily: MONO, fontSize: "0.72rem", color: "#d4dbe8", fontWeight: 500 }}>
                      Model Output
                    </span>
                  </div>
                  {result && (
                    <span
                      className="px-2 py-0.5"
                      style={{
                        fontFamily: MONO,
                        fontSize: "0.6rem",
                        fontWeight: 600,
                        borderRadius: 2,
                        color: result.risk_level === "Critical" ? "#f87171"
                          : result.risk_level === "High" ? "#f59e0b"
                          : result.risk_level === "Low" ? "#34d399"
                          : "#fbbf24",
                        background: result.risk_level === "Critical" ? "#f8717114"
                          : result.risk_level === "High" ? "#f59e0b14"
                          : result.risk_level === "Low" ? "#34d39914"
                          : "#fbbf2414",
                      }}
                    >
                      {result.risk_level?.toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="p-5">
                  <ResultsPanel result={result} />
                </div>
              </section>
            </div>
          )}

          {tab === "recommend" && (
            <section className="bg-card border border-border" style={{ borderRadius: "var(--radius)" }}>
              <div
                className="flex items-center justify-between px-5 py-3.5 border-b"
                style={{ borderColor: "rgba(255,255,255,0.06)" }}
              >
                <div className="flex items-center gap-2">
                  <GitBranch size={13} style={{ color: "#f59e0b" }} />
                  <span style={{ fontFamily: MONO, fontSize: "0.72rem", color: "#d4dbe8", fontWeight: 500 }}>
                    Strategic Recommendations
                  </span>
                </div>
                
              </div>
              <div className="p-5">
                <RecommendationsPanel />
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}



// "use client"

// import { Button } from "@/components/ui/button";
// import { useTheme } from "next-themes";
// import { useState } from "react";
// import {
//   Settings,
// } from "lucide-react";

// export default function Home() {
//   const { setTheme, resolvedTheme } = useTheme();

//   return (
//     <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
//       heloo worldddd

//       <Button
//         onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
//         className="relative p-2 text-sidebar-foreground/70 hover:bg-sidebar-hover-accent hover:text-sidebar-accent-foreground rounded-lg transition-colors cursor-pointer focus-visible:outline-none"
//       >
//         <Settings className="h-5 w-5" />

//       </Button>
//     </div>
//   );
// }
