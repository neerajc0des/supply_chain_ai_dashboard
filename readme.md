# Supply Chain ET Hackathon

AI-powered supply chain disruption analysis and alternate supplier recommendation system.

---

# Backend API Testing

Base URL:

```bash
http://localhost:8080
```

---

## 1. Alternate Supplier Recommendation

### Endpoint

```http
GET /api/recommend
```

### Example Request

```http
GET http://localhost:8080/api/recommend?region=India&tier=Tier%203&risk_level=critical
```

### Query Parameters

| Parameter    | Description         |
| ------------ | ------------------- |
| `region`     | Supplier region     |
| `tier`       | Supplier tier       |
| `risk_level` | Risk severity level |

---

## 2. Supply Chain Disruption Analysis

### Endpoint

```http
POST /api/analyze
```

### Request Body

Content-Type: `application/json`

### Example Request

```json
{
  "disruption_type": "Geopolitical",
  "industry": "Automotive",
  "supplier_tier": "Tier 1",
  "supplier_region": "East Asia",
  "supplier_size": "Large",
  "has_backup_supplier": "No",
  "disruption_severity": 5,
  "response_type": "No Action",
  "response_time_days": 30
}
```

### Example Response

```json
{
  "success": true,
  "metrics": {
    "production_impact_pct": 45.33,
    "full_recovery_days": 128.98,
    "revenue_loss_usd": 5933515.39,
    "risk_score": 45.13,
    "risk_level": "Medium"
  }
}
```

---

# Project Structure

```txt
backend/
frontend/
```

* `backend/` → FastAPI backend, ML models, datasets
* `frontend/` → Next.js frontend application
