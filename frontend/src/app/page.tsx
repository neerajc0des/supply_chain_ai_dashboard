"use client";

import { useState } from "react";
import {
  Activity,
  ShieldAlert,
  Cpu,
  BarChart2,
  GitBranch,
  ChevronRight,
  DollarSign,
  ShieldIcon,
  Sun,
  Moon,
} from "lucide-react";

import { useTheme } from "next-themes";

import { StatsCard } from "@/components/stats-cards";
import {
  AnalysisForm,
  type AnalysisResult,
} from "@/components/analysis-form";

import { ResultsPanel } from "@/components/results-panel";
import { RecommendationsPanel } from "@/components/recommendation-panel";

const MONO = "'Geist Mono', monospace";
const SANS = "Inter, system-ui, sans-serif";

const SPARK_ANALYSES = [
  { v: 88 },
  { v: 102 },
  { v: 95 },
  { v: 130 },
  { v: 118 },
  { v: 142 },
  { v: 155 },
  { v: 149 },
  { v: 162 },
  { v: 174 },
];

const SPARK_ALERTS = [
  { v: 2 },
  { v: 4 },
  { v: 3 },
  { v: 6 },
  { v: 5 },
  { v: 7 },
  { v: 6 },
  { v: 8 },
  { v: 7 },
  { v: 9 },
];

const SPARK_ACC = [
  { v: 90 },
  { v: 91 },
  { v: 91.5 },
  { v: 92 },
  { v: 92.8 },
  { v: 93.1 },
  { v: 93.6 },
  { v: 94.0 },
  { v: 94.1 },
  { v: 94.2 },
];

type Tab = "analyze" | "recommend";

const NAV_ITEMS = [
  {
    id: "analyze" as Tab,
    label: "Disruption Analysis",
    icon: Cpu,
  },
  {
    id: "recommend" as Tab,
    label: "Recommendations",
    icon: GitBranch,
  },
];

export default function App() {
  const [tab, setTab] =
    useState<Tab>("analyze");

  const [result, setResult] =
    useState<AnalysisResult | null>(null);

  const [isLoading, setIsLoading] =
    useState(false);

  const [runCount, setRunCount] =
    useState(174);

  const { resolvedTheme, setTheme } =
    useTheme();

  const handleResult = (
    r: AnalysisResult
  ) => {
    setResult(r);
    setRunCount((c) => c + 1);
  };

  return (
    <div
      className="
        flex
        h-screen
        overflow-hidden
        bg-background
        text-foreground
        transition-colors
      "
      style={{
        fontFamily: SANS,
      }}
    >
      {/* ───────── Sidebar ───────── */}
      <aside
        className="
          flex
          flex-col
          w-[220px]
          flex-shrink-0
          border-r
          bg-card
          transition-colors
        "
        style={{
          borderColor: "var(--border)",
        }}
      >
        {/* logo */}
        <div
          className="px-5 py-5 border-b"
          style={{
            borderColor: "var(--border)",
          }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="
                w-8
                h-8
                flex
                items-center
                justify-center
              "
              style={{
                background:
                  "rgba(245,158,11,0.12)",

                border:
                  "1px solid rgba(245,158,11,0.25)",

                borderRadius:
                  "var(--radius)",
              }}
            >
              <ShieldIcon
                size={14}
                className="text-amber-500"
                fill="currentColor"
              />
            </div>

            <div>
              <p
                style={{
                  fontFamily: MONO,
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  color:
                    "var(--foreground)",
                  lineHeight: 1.1,
                }}
              >
                SupplyShield
              </p>

              <p
                style={{
                  fontFamily: MONO,
                  fontSize: "0.58rem",
                  color:
                    "var(--muted-foreground)",
                  marginTop: 2,
                }}
              >
                AI Risk Intelligence
              </p>
            </div>
          </div>
        </div>

        {/* nav */}
        <nav className="flex-1 py-4 px-3 space-y-1">
          <p
            className="px-2 pb-2 pt-1 uppercase"
            style={{
              fontFamily: MONO,
              fontSize: "0.55rem",
              color:
                "var(--muted-foreground)",
              letterSpacing: "0.12em",
            }}
          >
            Modules
          </p>

          {NAV_ITEMS.map(
            ({
              id,
              label,
              icon: Icon,
            }) => {
              const active =
                tab === id;

              return (
                <button
                  key={id}
                  onClick={() =>
                    setTab(id)
                  }
                  className="
                    w-full
                    flex
                    items-center
                    gap-2.5
                    px-3
                    py-2.5
                    text-left
                    transition-all
                    hover:bg-muted/40
                  "
                  style={{
                    borderRadius:
                      "var(--radius)",

                    background: active
                      ? "rgba(245,158,11,0.12)"
                      : "transparent",

                    color: active
                      ? "#f59e0b"
                      : "var(--muted-foreground)",

                    fontFamily: MONO,
                    fontSize: "0.8rem",
                  }}
                >
                  <Icon
                    size={14}
                    strokeWidth={
                      active ? 2 : 1.7
                    }
                  />

                  <span className="flex-1">
                    {label}
                  </span>

                  {active && (
                    <ChevronRight
                      size={11}
                    />
                  )}
                </button>
              );
            }
          )}
        </nav>
      </aside>

      {/* ───────── Main ───────── */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* topbar */}
        <header
          className="
            flex
            items-center
            justify-between
            px-6
            py-4
            border-b
            bg-card
            transition-colors
            flex-shrink-0
          "
          style={{
            borderColor:
              "var(--border)",
          }}
        >
          <div>
            <p
              style={{
                fontFamily: MONO,
                fontSize: "0.66rem",
                color:
                  "var(--muted-foreground)",
                letterSpacing: "0.08em",
              }}
            >
              DASHBOARD
            </p>

            <h1
              style={{
                fontFamily: MONO,
                fontSize: "1rem",
                fontWeight: 700,
                color:
                  "var(--foreground)",
                lineHeight: 1.2,
              }}
            >
              Supply Chain Disruption
              Intelligence
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* analyses count */}
            

            {/* theme toggle */}
            <button
              onClick={() =>
                setTheme(
                  resolvedTheme ===
                    "dark"
                    ? "light"
                    : "dark"
                )
              }
              className="
                w-9
                h-9
                flex
                items-center
                justify-center
                border
                bg-background
                hover:bg-muted
                transition-all
              "
              style={{
                borderColor:
                  "var(--border)",

                borderRadius:
                  "var(--radius)",
              }}
            >
              {resolvedTheme ===
                "dark" ? (
                <Sun
                  size={15}
                  className="text-amber-500"
                />
              ) : (
                <Moon
                  size={15}
                  className="text-slate-600"
                />
              )}
            </button>
          </div>
        </header>

        {/* content */}
        <div
          className="
            flex-1
            overflow-y-auto
            px-6
            py-6
            space-y-6
            bg-background
          "
          style={{
            scrollbarWidth: "none",
          }}
        >
          {/* stats */}
          <div className="grid grid-cols-3 gap-4">
            <StatsCard
              label="Production Impact"
              value={
                result?.production_impact_pct.toString() ||
                "-"
              }
              delta=""
              deltaUp={true}
              sublabel=""
              icon={Activity}
              accentColor="#f59e0b"
              sparkData={
                SPARK_ANALYSES
              }
            />

            <StatsCard
              label="Full Recovery Days"
              value={
                Math.round(
                  result?.full_recovery_days ||
                  0
                ) > 0
                  ? Math.round(
                    result?.full_recovery_days ||
                    0
                  ).toString()
                  : "-"
              }
              delta=""
              deltaUp={false}
              sublabel=""
              icon={ShieldAlert}
              accentColor="#34d399"
              sparkData={SPARK_ALERTS}
            />

            <StatsCard
              label="Revenue Loss (USD)"
              value={
                result?.revenue_loss_usd.toString() ||
                "-"
              }
              delta=""
              deltaUp={true}
              sublabel=""
              icon={DollarSign}
              accentColor="#f87171"
              sparkData={SPARK_ACC}
            />
          </div>

          {/* analyze */}
          {tab === "analyze" && (
            <div
              className="grid gap-5"
              style={{
                gridTemplateColumns:
                  "1fr 1fr",
              }}
            >
              {/* form */}
              <section
                className="
                  bg-card
                  border
                  border-border
                  shadow-sm
                "
                style={{
                  borderRadius:
                    "var(--radius)",
                }}
              >
                <div
                  className="
                    flex
                    items-center
                    justify-between
                    px-5
                    py-4
                    border-b
                  "
                  style={{
                    borderColor:
                      "var(--border)",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Cpu
                      size={14}
                      className="text-amber-500"
                    />

                    <span
                      style={{
                        fontFamily:
                          MONO,
                        fontSize:
                          "0.72rem",
                        color:
                          "var(--foreground)",
                        fontWeight: 600,
                      }}
                    >
                      Disruption
                      Parameters
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <AnalysisForm
                    onResult={
                      handleResult
                    }
                    isLoading={
                      isLoading
                    }
                    setIsLoading={
                      setIsLoading
                    }
                  />
                </div>
              </section>

              {/* results */}
              <section
                className="
                  bg-card
                  border
                  border-border
                  shadow-sm
                "
                style={{
                  borderRadius:
                    "var(--radius)",
                }}
              >
                <div
                  className="
                    flex
                    items-center
                    justify-between
                    px-5
                    py-4
                    border-b
                  "
                  style={{
                    borderColor:
                      "var(--border)",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <BarChart2
                      size={14}
                      style={{
                        color:
                          result
                            ? result.risk_level ===
                              "Critical"
                              ? "#f87171"
                              : result.risk_level ===
                                "High"
                                ? "#f59e0b"
                                : result.risk_level ===
                                  "Low"
                                  ? "#34d399"
                                  : "#fbbf24"
                            : "var(--muted-foreground)",
                      }}
                    />

                    <span
                      style={{
                        fontFamily:
                          MONO,
                        fontSize:
                          "0.72rem",
                        color:
                          "var(--foreground)",
                        fontWeight: 600,
                      }}
                    >
                      Model Output
                    </span>
                  </div>

                  {result && (
                    <span
                      className="
                        px-2
                        py-1
                      "
                      style={{
                        fontFamily:
                          MONO,

                        fontSize:
                          "0.6rem",

                        fontWeight: 700,

                        borderRadius: 4,

                        color:
                          result.risk_level ===
                            "Critical"
                            ? "#f87171"
                            : result.risk_level ===
                              "High"
                              ? "#f59e0b"
                              : result.risk_level ===
                                "Low"
                                ? "#34d399"
                                : "#fbbf24",

                        background:
                          result.risk_level ===
                            "Critical"
                            ? "#f8717114"
                            : result.risk_level ===
                              "High"
                              ? "#f59e0b14"
                              : result.risk_level ===
                                "Low"
                                ? "#34d39914"
                                : "#fbbf2414",
                      }}
                    >
                      {result.risk_level.toUpperCase()}
                    </span>
                  )}
                </div>

                <div className="p-5">
                  <ResultsPanel
                    result={result}
                  />
                </div>
              </section>
            </div>
          )}

          {/* recommend */}
          {tab === "recommend" && (
            <section
              className="
                bg-card
                border
                border-border
                shadow-sm
              "
              style={{
                borderRadius:
                  "var(--radius)",
              }}
            >
              <div
                className="
                  flex
                  items-center
                  justify-between
                  px-5
                  py-4
                  border-b
                "
                style={{
                  borderColor:
                    "var(--border)",
                }}
              >
                <div className="flex items-center gap-2">
                  <GitBranch
                    size={14}
                    className="text-amber-500"
                  />

                  <span
                    style={{
                      fontFamily:
                        MONO,
                      fontSize:
                        "0.72rem",
                      color:
                        "var(--foreground)",
                      fontWeight: 600,
                    }}
                  >
                    Strategic
                    Recommendations
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