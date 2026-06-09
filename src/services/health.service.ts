import { api } from "@/lib/api"
import type { HateoasLinks } from "@/types/hateoas"

/**
 * Service para el health-check del backend.
 * Útil para mostrar un banner "conectado / sin conexión" en el frontend.
 */
export interface HealthInfo {
  servicio: string
  estado: "UP" | "DEGRADED" | "DOWN"
  version: string
  timestamp: string
  baseDeDatos: {
    estado: "UP" | "DOWN"
    url?: string
    driver?: string
    error?: string
  }
  _links?: HateoasLinks
}

export const healthService = {
  async check(): Promise<HealthInfo> {
    const { data } = await api.get<HealthInfo>("/health")
    return data
  },
}
