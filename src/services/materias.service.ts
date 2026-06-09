import { api } from "@/lib/api"
import {
  extractCollection,
  type CollectionModelResponse,
  type EntityModelResponse,
} from "@/types/hateoas"
import type { Materia } from "@/types"

/**
 * Service para el recurso Materias.
 * Consume los endpoints HATEOAS del backend en `/api/v1/materias`.
 *
 *   GET /api/v1/materias           → lista
 *   GET /api/v1/materias/{codigo}  → una por código
 */
export const materiasService = {
  async getAll(): Promise<Materia[]> {
    const { data } = await api.get<CollectionModelResponse<EntityModelResponse<Materia>>>(
      "/materias",
    )
    return extractCollection(data, "materias")
  },

  async getByCodigo(codigo: string): Promise<Materia> {
    const { data } = await api.get<EntityModelResponse<Materia>>(
      `/materias/${encodeURIComponent(codigo)}`,
    )
    return data
  },
}
