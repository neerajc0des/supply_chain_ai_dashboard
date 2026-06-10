from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np
import joblib
import os
import math

app = FastAPI(title="Automotive Supply Chain AI Engine")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── 1. LOAD MODELS ───────────────────────────────────────────────
try:
    impact_model = joblib.load("models/impact_model.pkl")
    recovery_model = joblib.load("models/recovery_model.pkl")
    revenue_model = joblib.load("models/revenue_model.pkl")
    print("All ML models loaded successfully!")
except Exception as e:
    print(f"Warning: ML models failed to load: {e}")

# ─── 2. LOAD SUPPLIER DATASET ─────────────────────────────────────
COUNTRY_REGION = {
    "India": "South Asia",
    "Vietnam": "South East Asia",
    "Thailand": "South East Asia",
    "Malaysia": "South East Asia",
    "Singapore": "South East Asia",
    "Indonesia": "South East Asia",
    "Germany": "Europe",
    "France": "Europe",
    "Poland": "Europe",
    "Turkey": "Europe",
    "Spain": "Europe",
    "USA": "North America",
    "Canada": "North America",
    "Mexico": "North America",
    "Brazil": "South America",
    "Australia": "Oceania",
    "Japan": "East Asia",
    "South Korea": "East Asia",
}

CSV_PATH = "data/supplier_dataset.csv"

if os.path.exists(CSV_PATH):
    suppliers = pd.read_csv(CSV_PATH)
    suppliers["region"] = suppliers["country"].map(COUNTRY_REGION)

    missing = suppliers[suppliers["region"].isna()]["country"].unique()
    if len(missing) > 0:
        print(f"Warning: Unmapped countries dropped: {missing}")
    suppliers = suppliers.dropna(subset=["region"])

    suppliers["supplier_tier_clean"] = suppliers["supplier_tier"].str.strip().str.upper()
    suppliers["region_clean"] = suppliers["region"].str.strip().str.upper()

    print(f"Supplier dataset loaded: {len(suppliers)} suppliers across {suppliers['region'].nunique()} regions")
else:
    suppliers = None
    print(f"Warning: Supplier dataset not found at {CSV_PATH}")


# ─── 3. HELPER FUNCTIONS ──────────────────────────────────────────
def sanitize_float(value) -> float:
    if value is None:
        return 0.0
    try:
        f = float(value)
        if math.isnan(f) or math.isinf(f):
            return 0.0
        return f
    except Exception:
        return 0.0


def calculate_risk(impact: float, recovery: float, revenue: float) -> float:
    impact_norm = impact / 100
    recovery_norm = min(recovery / 365, 1.0)
    revenue_norm = min(revenue / 10_000_000, 1.0)
    return (0.5 * impact_norm + 0.3 * recovery_norm + 0.2 * revenue_norm) * 100


def get_risk_level(score: float) -> str:
    if score < 25:
        return "Low"
    elif score < 50:
        return "Medium"
    elif score < 75:
        return "High"
    else:
        return "Critical"


def build_tags(row: pd.Series, target_region: str, normalized_risk: str) -> list[str]:
    tags = []
    if sanitize_float(row["lead_time_days"]) <= 7:
        tags.append("Fast delivery")
    if sanitize_float(row["quality_score"]) >= 90:
        tags.append("High quality")
    if str(row.get("backup_capability", "No")).strip() == "Yes":
        tags.append("Backup capable")
    if str(row.get("region_clean", "")).strip().upper() != target_region:
        tags.append("Low geopolitical risk")
    else:
        if normalized_risk in ["Low", "Medium"]:
            tags.append("Local supplier")
    if sanitize_float(row["cost_index"]) <= 80:
        tags.append("Cost efficient")
    return tags


# ─── 4. SCHEMAS ───────────────────────────────────────────────────
class DisruptionInput(BaseModel):
    disruption_type: str
    industry: str = "Automotive"
    supplier_tier: str
    supplier_region: str
    supplier_size: str
    has_backup_supplier: str
    disruption_severity: int
    response_type: str
    response_time_days: int


# ─── 5. ENDPOINTS ─────────────────────────────────────────────────
@app.get("/")
def read_root():
    return {"status": "healthy", "message": "Supply Chain AI Engine is running"}


@app.post("/api/analyze")
async def analyze_supply_chain(payload: DisruptionInput):
    try:
        sample_df = pd.DataFrame([payload.model_dump()])

        predicted_impact = sanitize_float(impact_model.predict(sample_df)[0])

        pred_recovery_log = sanitize_float(recovery_model.predict(sample_df)[0])
        predicted_recovery = sanitize_float(np.expm1(pred_recovery_log))

        revenue_input_df = pd.DataFrame({
            "production_impact_pct": [predicted_impact],
            "full_recovery_days": [predicted_recovery],
            "disruption_severity": [payload.disruption_severity],
            "response_time_days": [payload.response_time_days],
            "supplier_size": [payload.supplier_size],
            "industry": [payload.industry],
            "supplier_tier": [payload.supplier_tier],
        })
        pred_revenue_log = sanitize_float(revenue_model.predict(revenue_input_df)[0])
        predicted_revenue = sanitize_float(np.expm1(pred_revenue_log))

        risk_score = sanitize_float(
            calculate_risk(predicted_impact, predicted_recovery, predicted_revenue)
        )
        risk_level = get_risk_level(risk_score)

        return {
            "success": True,
            "metrics": {
                "production_impact_pct": round(predicted_impact, 2),
                "full_recovery_days": round(predicted_recovery, 2),
                "revenue_loss_usd": round(predicted_revenue, 2),
                "risk_score": round(risk_score, 2),
                "risk_level": risk_level,
            },
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")


@app.get("/api/recommend")
async def get_supplier_recommendations(
    region: str = Query(..., example="East Asia"),
    tier: str = Query(..., example="Tier 1"),
    risk_level: str = Query(..., example="High"),
):
    if suppliers is None:
        raise HTTPException(status_code=500, detail="Supplier dataset not loaded.")

    try:
        candidates = suppliers.copy()

        target_tier = tier.strip().upper()
        target_region = region.strip().upper()
        normalized_risk = risk_level.strip().capitalize()

        # Filter by tier
        candidates = candidates[candidates["supplier_tier_clean"] == target_tier]

        if candidates.empty:
            return {
                "success": True,
                "message": f"No suppliers found for tier: {tier}",
                "recommendations": [],
            }

        # Exclude current region for High/Critical risk
        if normalized_risk in ["High", "Critical"]:
            outside = candidates[candidates["region_clean"] != target_region]
            candidates = outside if not outside.empty else candidates

        candidates = candidates.copy()
        candidates["rating_score"] = (candidates["supplier_rating"] / 5) * 100
        candidates["lead_score"] = ((15 - candidates["lead_time_days"]) / 15 * 100).clip(0, 100)
        candidates["backup_score"] = candidates["backup_capability"].map({"Yes": 100, "No": 0}).fillna(0)

        # Region bonus for Low/Medium risk — boosts local suppliers
        if normalized_risk in ["Low", "Medium"]:
            candidates["region_bonus"] = candidates["region_clean"].apply(
                lambda r: 8.0 if r == target_region else 0.0
            )
        else:
            candidates["region_bonus"] = 0.0

        # ← region_bonus is now included in final_score
        candidates["final_score"] = (
            candidates["rating_score"] * 0.35
            + candidates["quality_score"] * 0.30
            + candidates["lead_score"] * 0.20
            + (100 - candidates["cost_index"]) * 0.05
            + candidates["backup_score"] * 0.10
            + candidates["region_bonus"]
        ).round(1)

        candidates = candidates.dropna(subset=["final_score", "region"])

        top = candidates.sort_values("final_score", ascending=False).head(5)

        recommendations = []
        for _, row in top.iterrows():
            recommendations.append({
                "supplier_id": str(row["supplier_id"]),
                "country": str(row["country"]),
                "region": str(row["region"]),
                "supplier_rating": sanitize_float(row["supplier_rating"]),
                "lead_time_days": int(row["lead_time_days"]),
                "quality_score": sanitize_float(row["quality_score"]),
                "score": sanitize_float(row["final_score"]),
                "backup_capability": str(row["backup_capability"]),
                "tags": build_tags(row, target_region, normalized_risk),  # ← normalized_risk passed
            })

        return {
            "success": True,
            "query": {
                "region": region,
                "tier": tier,
                "risk_level": risk_level,
            },
            "recommendations": recommendations,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Recommendation error: {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8080, reload=True)