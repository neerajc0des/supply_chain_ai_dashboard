"use client";

import { useState } from "react";
import { Search, Loader2 } from "lucide-react";

const MONO = "'Geist Mono', monospace";

interface Recommendation {
  supplier_id: string;
  country: string;
  region: string;
  supplier_rating: number;
  lead_time_days: number;
  quality_score: number;
  score: number;
  backup_capability: string;
  tags: string[];
}

const REGIONS = [
  "East Asia",
  "South Asia",
  "South East Asia",
  "Europe",
  "North America",
  "South America",
  "Oceania",
];

const TIERS = ["Tier 1", "Tier 2", "Tier 3", "Tier 4"];

const RISKS = ["Low", "Medium", "High", "Critical"];

export function RecommendationsPanel() {
  const [region, setRegion] = useState("East Asia");
  const [tier, setTier] = useState("Tier 2");
  const [risk, setRisk] = useState("High");

  const [loading, setLoading] = useState(false);

  const [results, setResults] = useState<Recommendation[] | null>(null);

  const run = async () => {
    setLoading(true);

    try {
      const res = await fetch(
        `http://localhost:8080/api/recommend?region=${encodeURIComponent(
          region
        )}&tier=${encodeURIComponent(
          tier
        )}&risk_level=${encodeURIComponent(risk)}`,
        {
          signal: AbortSignal.timeout(5000),
        }
      );

      if (!res.ok) {
        throw new Error("Failed request");
      }

      const data = await res.json();

      setResults(data.recommendations || []);
    } catch (err) {
      console.error(err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const fieldCls = `
    bg-background
    border
    border-border
    px-3
    py-2
    text-foreground
    text-sm
    focus:outline-none
    focus:border-amber-500/40
    transition-colors
    appearance-none
    w-full
  `;

  return (
    <div className="space-y-5">
      {/* filters */}
      <div className="grid grid-cols-4 gap-3 items-end">
        {[
          {
            label: "Region",
            value: region,
            setter: setRegion,
            options: REGIONS,
          },
          {
            label: "Tier",
            value: tier,
            setter: setTier,
            options: TIERS,
          },
          {
            label: "Risk Level",
            value: risk,
            setter: setRisk,
            options: RISKS,
          },
        ].map(({ label, value, setter, options }) => (
          <div key={label}>
            <p
              className="text-muted-foreground uppercase mb-1.5"
              style={{
                fontFamily: MONO,
                fontSize: "0.6rem",
                letterSpacing: "0.1em",
              }}
            >
              {label}
            </p>

            <select
              className={fieldCls}
              style={{
                fontFamily: MONO,
                fontSize: "0.78rem",
                borderRadius: "var(--radius)",
              }}
              value={value}
              onChange={(e) => setter(e.target.value)}
            >
              {options.map((opt) => (
                <option
                  key={opt}
                  value={opt}
                  className="bg-background text-foreground"
                >
                  {opt}
                </option>
              ))}
            </select>
          </div>
        ))}

        <button
          onClick={run}
          disabled={loading}
          className="
            flex
            items-center
            justify-center
            gap-2
            border
            transition-all
            disabled:opacity-40
            h-9.5
          "
          style={{
            background: loading
              ? "transparent"
              : "#f59e0b1a",

            borderColor: "#f59e0b50",

            color: "#f59e0b",

            fontFamily: MONO,
            fontSize: "0.72rem",
            fontWeight: 600,
            letterSpacing: "0.08em",
            borderRadius: "var(--radius)",
          }}
        >
          {loading ? (
            <Loader2
              size={12}
              className="animate-spin"
            />
          ) : (
            <Search size={12} />
          )}

          {loading ? "FETCHING" : "FETCH"}
        </button>
      </div>

      {/* results */}
      {results && results.length > 0 && (
        <div className="grid gap-3">
          {results.map((rec, i) => {
            const scoreColor =
              rec.score >= 78
                ? "#34d399"
                : rec.score >= 72
                  ? "#f59e0b"
                  : "#f87171";

            return (
              <div
                key={i}
                className="
                  border
                  p-4
                  bg-card
                "
                style={{
                  borderColor: "var(--border)",
                  borderRadius: "var(--radius)",
                }}
              >
                {/* top row */}
                <div className="flex items-start justify-between gap-4 mb-5">
                  <div>
                    <p
                      className="text-foreground"
                      style={{
                        fontFamily: MONO,
                        fontSize: "1rem",
                        fontWeight: 700,
                      }}
                    >
                      {rec.supplier_id}
                    </p>

                    <p
                      className="text-muted-foreground"
                      style={{
                        fontFamily: MONO,
                        fontSize: "0.72rem",
                      }}
                    >
                      {rec.country} · {rec.region}
                    </p>
                  </div>

                  <div className="text-right">
                    <p
                      className="text-muted-foreground"
                      style={{
                        fontFamily: MONO,
                        fontSize: "0.58rem",
                        letterSpacing: "0.08em",
                      }}
                    >
                      MATCH SCORE
                    </p>

                    <p
                      style={{
                        fontFamily: MONO,
                        fontSize: "1.6rem",
                        fontWeight: 700,
                        color: scoreColor,
                        lineHeight: 1,
                      }}
                    >
                      {rec.score.toFixed(1)}
                    </p>
                  </div>
                </div>

                {/* metrics */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[
                    {
                      label: "SUPPLIER RATING",
                      value: rec.supplier_rating.toFixed(1),
                    },
                    {
                      label: "LEAD TIME",
                      value: `${rec.lead_time_days}d`,
                    },
                    {
                      label: "QUALITY SCORE",
                      value: `${rec.quality_score}%`,
                    },
                  ].map((metric) => (
                    <div
                      key={metric.label}
                      className="
                        p-3
                        bg-muted/30
                        border
                        border-border
                      "
                      style={{
                        borderRadius: "var(--radius)",
                      }}
                    >
                      <p
                        className="
                          text-muted-foreground
                          mb-1
                        "
                        style={{
                          fontFamily: MONO,
                          fontSize: "0.62rem",
                          letterSpacing: "0.06em",
                        }}
                      >
                        {metric.label}
                      </p>

                      <p
                        className="text-foreground"
                        style={{
                          fontFamily: MONO,
                          fontSize: "1rem",
                          fontWeight: 600,
                        }}
                      >
                        {metric.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* backup capability */}
                <div className="mb-4">
                  <span
                    className="px-2 py-1"
                    style={{
                      fontFamily: MONO,
                      fontSize: "0.65rem",
                      borderRadius: 2,

                      background:
                        rec.backup_capability === "Yes"
                          ? "#34d39920"
                          : "#f8717120",

                      color:
                        rec.backup_capability === "Yes"
                          ? "#34d399"
                          : "#f87171",

                      border:
                        rec.backup_capability === "Yes"
                          ? "1px solid #34d39950"
                          : "1px solid #f8717150",
                    }}
                  >
                    {rec.backup_capability === "Yes"
                      ? "BACKUP CAPABLE"
                      : "NO BACKUP"}
                  </span>
                </div>

                {/* tags */}
                <div className="flex flex-wrap gap-2">
                  {rec.tags.map((tag, j) => (
                    <span
                      key={j}
                      className="
                        px-2
                        py-1
                        border
                        border-border
                        bg-muted/30
                        text-muted-foreground
                      "
                      style={{
                        fontFamily: MONO,
                        fontSize: "0.65rem",
                        borderRadius: 2,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* empty state */}
      {!results && !loading && (
        <p
          className="
            text-muted-foreground
            text-center
            py-6
          "
          style={{
            fontFamily: MONO,
            fontSize: "0.72rem",
          }}
        >
          Configure filters and click FETCH to load supplier
          recommendations.
        </p>
      )}

      {/* no results */}
      {results && results.length === 0 && !loading && (
        <p
          className="text-center py-6"
          style={{
            fontFamily: MONO,
            fontSize: "0.72rem",
            color: "#f87171",
          }}
        >
          No supplier recommendations found.
        </p>
      )}
    </div>
  );
}