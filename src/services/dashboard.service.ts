import { api } from "@/lib/api"
import {
  extractCollection,
  type CollectionModelResponse,
  type EntityModelResponse,
} from "@/types/hateoas"
import type { DashboardStats, PromedioMateria } from "@/types"

/**
 * Service para el Dashboard.
 * Consume los endpoints HATEOAS del backend en `/api/v1/dashboard`.
 *
 *   GET /api/v1/dashboard/stats                → totales + promedio + % aprobados
 *   GET /api/v1/dashboard/promedios-por-materia → promedios agrupados por materia
 *
 * `getStats` sanea la respuesta para garantizar que siempre devuelve un
 * objeto con los 4 campos numéricos: si el backend llega a devolver
 * la respuesta incompleta, el frontend no rompe el render.
 */
export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    const { data } = await api.get<EntityModelResponse<DashboardStats>>("/dashboard/stats")
    return {
      totalEstudiantes: data?.totalEstudiantes ?? 0,
      totalMaterias: data?.totalMaterias ?? 0,
      promedioGeneral: data?.promedioGeneral ?? 0,
      porcentajeAprobados: data?.porcentajeAprobados ?? 0,
      _links: data?._links,
    }
  },

  async getPromediosPorMateria(): Promise<PromedioMateria[]> {
    const { data } = await api.get<
      CollectionModelResponse<EntityModelResponse<PromedioMateria>>
    >("/dashboard/promedios-por-materia")
    return extractCollection(data, "promediosMaterias")
  },
}
