import { z } from "zod"

export const disruptionSchema = z.object({
  disruption_type: z.enum([
    "Factory Incident",
    "Cyber Attack", 
    "Port Congestion",
    "Labor Strike",
    "Geopolitical",
    "Natural Disaster"
  ]),
  
  industry: z.string().default("Automotive"),
  supplier_tier: z.number().min(1).max(4),
  supplier_region: z.enum([
    "Asia-Pacific",
    "Europe",
    "South America",
    "North America",
    "Africa/Middle East"
  ]),
  supplier_size: z.enum(["Large", "Medium", "Small"]),
  has_backup_supplier: z.boolean(),
  disruption_severity: z.number().min(1).max(10),
  response_type: z.enum([
    "Customer Delay",
    "Alternative Supplier",
    "Production Reroute",
    "Inventory Buffer",
    "Combined Strategy"
  ]),
  response_time_days: z.number().min(1).max(365),
})

export type DisruptionInput = z.infer<typeof disruptionSchema>