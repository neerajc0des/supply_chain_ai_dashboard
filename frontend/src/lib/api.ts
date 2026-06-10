import axios from "axios"
import { DisruptionInput } from "./validators"

const api = axios.create({ baseURL: "http://localhost:8080" })

export const analyzeDisruption = async (data: DisruptionInput) => {
  const { data: res } = await api.post("/api/analyze", data)
  return res
}

export const getRecommendations = async (
  region: string,
  tier: string,
  risk_level: string
) => {
  const { data: res } = await api.get("/api/recommend", {
    params: { region, tier, risk_level }
  })
  return res
}