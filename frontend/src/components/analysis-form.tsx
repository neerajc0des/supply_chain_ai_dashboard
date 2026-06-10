"use client"


import { useState } from "react";
import { Play, Loader2 } from "lucide-react";
import { toast } from "sonner";

export interface AnalysisPayload {
    disruption_type: string;
    industry: string;
    supplier_tier: string;
    supplier_region: string;
    supplier_size: string;
    has_backup_supplier: string;
    disruption_severity: number;
    response_type: string;
    response_time_days: number;
}

export interface AnalysisResult {
    risk_score: number;
    risk_level: "Low" | "Medium" | "High" | "Critical";
    production_impact_pct: number;
    full_recovery_days: number;
    revenue_loss_usd: number;
}

const OPTS = {
    disruption_type: ["Geopolitical", "Natural Disaster", "Pandemic", "Cyber Attack", "Financial", "Regulatory", "Infrastructure"],
    industry: ["Automotive", "Electronics", "Pharmaceuticals", "Aerospace", "Consumer Goods", "Food & Beverage", "Energy"],
    supplier_tier: ["Tier 1", "Tier 2", "Tier 3", "Tier 4"],
    supplier_region: ["East Asia", "South Asia", "Southeast Asia", "Europe", "North America", "South America", "Middle East", "Africa"],
    supplier_size: ["Small", "Medium", "Large", "Enterprise"],
    response_type: ["No Action", "Partial Mitigation", "Full Mitigation", "Emergency Response", "Supply Diversification"],
};

// function mockResult(p: AnalysisPayload): AnalysisResult {
//     const base = p.disruption_severity * 8.5;
//     const noBackup = p.has_backup_supplier === "No" ? 18 : -8;
//     const noAction = p.response_type === "No Action" ? 14 : p.response_type === "Emergency Response" ? -12 : 0;
//     const score = Math.min(100, Math.max(5, Math.round(base + noBackup + noAction)));
//     const level: AnalysisResult["risk_level"] =
//         score >= 75 ? "Critical" : score >= 50 ? "High" : score >= 30 ? "Medium" : "Low";
//     return {
//         risk_score: score,
//         risk_level: level,
//         production_impact_pct:
//         level === "Critical"
//             ? 82.5
//             : level === "High"
//             ? 56.2
//             : level === "Medium"
//             ? 34.8
//             : 12.4,
//         estimated_recovery_days: Math.round(p.response_time_days * (score / 45)),
//         feature_importance: {
//             disruption_severity: 0.31,
//             has_backup_supplier: 0.24,
//             supplier_region: 0.18,
//             response_type: 0.14,
//             supplier_tier: 0.08,
//             response_time_days: 0.05,
//         },
//     };
// }

const MONO = "'Geist Mono', monospace";

interface Props {
    onResult: (r: AnalysisResult) => void;
    isLoading: boolean;
    setIsLoading: (v: boolean) => void;
}

export function AnalysisForm({ onResult, isLoading, setIsLoading }: Props) {
    const [form, setForm] = useState<AnalysisPayload>({
        disruption_type: "Geopolitical",
        industry: "Automotive",
        supplier_tier: "Tier 1",
        supplier_region: "East Asia",
        supplier_size: "Large",
        has_backup_supplier: "No",
        disruption_severity: 5,
        response_type: "No Action",
        response_time_days: 30,
    });

    const set = <K extends keyof AnalysisPayload>(k: K, v: AnalysisPayload[K]) =>
        setForm(f => ({ ...f, [k]: v }));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            let result: AnalysisResult;
            try {
                const res = await fetch("http://localhost:8080/api/analyze", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form),
                    signal: AbortSignal.timeout(5000),
                });
                if (!res.ok) throw new Error("non-2xx");
                const data = await res.json();
                result = data.metrics;
                // console.log(result)
                onResult(result);
            } catch {
                await new Promise(r => setTimeout(r, 800));
                toast.error("Something went wrong.")
            }
        } finally {
            setIsLoading(false);
        }
    };

    const fieldCls =
        "w-full bg-[#060c18] border border-white/[0.07] px-3 py-2 text-foreground text-sm focus:outline-none focus:border-[#f59e0b]/40 transition-colors appearance-none";
    const labelCls = "block mb-1 text-muted-foreground uppercase tracking-widest";

    const fields: Array<{ key: keyof typeof OPTS; title: string }> = [
        { key: "disruption_type", title: "Disruption Type" },
        { key: "industry", title: "Industry" },
        { key: "supplier_tier", title: "Supplier Tier" },
        { key: "supplier_region", title: "Supplier Region" },
        { key: "supplier_size", title: "Supplier Size" },
        { key: "response_type", title: "Response Type" },
    ];

    const sevColor =
        form.disruption_severity >= 8
            ? "#f87171"
            : form.disruption_severity >= 5
                ? "#f59e0b"
                : "#34d399";

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                {fields.map(({ key, title }) => (
                    <div key={key}>
                        <label className={labelCls} style={{ fontFamily: MONO, fontSize: "0.6rem" }}>{title}</label>
                        <select
                            className={fieldCls}
                            style={{ fontFamily: MONO, fontSize: "0.78rem", borderRadius: "var(--radius)" }}
                            value={form[key] as string}
                            onChange={e => set(key, e.target.value)}
                        >
                            {OPTS[key].map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                    </div>
                ))}

                <div>
                    <label className={labelCls} style={{ fontFamily: MONO, fontSize: "0.6rem" }}>Backup Supplier</label>
                    <div className="flex gap-2">
                        {["Yes", "No"].map(opt => (
                            <button
                                key={opt}
                                type="button"
                                onClick={() => set("has_backup_supplier", opt)}
                                className="flex-1 py-2 text-sm border transition-all"
                                style={{
                                    fontFamily: MONO,
                                    fontSize: "0.78rem",
                                    borderRadius: "var(--radius)",
                                    background: form.has_backup_supplier === opt ? (opt === "Yes" ? "#34d39920" : "#f8717120") : "#060c18",
                                    borderColor: form.has_backup_supplier === opt ? (opt === "Yes" ? "#34d399" : "#f87171") : "rgba(255,255,255,0.07)",
                                    color: form.has_backup_supplier === opt ? (opt === "Yes" ? "#34d399" : "#f87171") : "var(--muted-foreground)",
                                }}
                            >
                                {opt}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className={labelCls} style={{ fontFamily: MONO, fontSize: "0.6rem" }}>Response Time (days)</label>
                    <input
                        type="number"
                        min={1}
                        max={365}
                        value={form.response_time_days}
                        onChange={e => set("response_time_days", Number(e.target.value))}
                        className={fieldCls}
                        style={{ fontFamily: MONO, fontSize: "0.78rem", borderRadius: "var(--radius)" }}
                    />
                </div>
            </div>

            {/* Severity slider */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <label className={labelCls} style={{ fontFamily: MONO, fontSize: "0.6rem" }}>Disruption Severity</label>
                    <span style={{ fontFamily: MONO, fontSize: "0.85rem", color: sevColor, fontWeight: 600 }}>
                        {form.disruption_severity}<span className="text-muted-foreground" style={{ fontWeight: 400 }}>/5</span>
                    </span>
                </div>
                <div className="relative">
                    <div className="flex gap-0.5 mb-1.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div
                                key={i}
                                className="flex-1 h-1 cursor-pointer transition-all"
                                style={{
                                    borderRadius: 2,
                                    background: i < form.disruption_severity
                                        ? (i >= 4 ? "#f87171" : i >= 2 ? "#f59e0b" : "#34d399")
                                        : "rgba(255,255,255,0.08)",
                                }}
                                onClick={() => set("disruption_severity", i + 1)}
                            />
                        ))}
                    </div>
                    <div className="flex justify-between text-muted-foreground" style={{ fontFamily: MONO, fontSize: "0.58rem" }}>
                        <span>Minimal</span>
                        <span>Catastrophic</span>
                    </div>
                </div>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="w-full flex cursor-pointer items-center justify-center gap-2 border transition-all disabled:opacity-40"
                style={{
                    background: isLoading ? "transparent" : "#f59e0b",
                    borderColor: "#f59e0b",
                    color: isLoading ? "#f59e0b" : "#0a0600",
                    fontFamily: MONO,
                    fontSize: "0.78rem",
                    fontWeight: 600,
                    letterSpacing: "0.08em",
                    padding: "0.65rem",
                    borderRadius: "var(--radius)",
                }}
            >
                {isLoading
                    ? <><Loader2 size={13} className="animate-spin" /> RUNNING MODEL…</>
                    : <><Play size={12} fill="currentColor" /> RUN ANALYSIS</>}
            </button>
        </form>
    );
}
