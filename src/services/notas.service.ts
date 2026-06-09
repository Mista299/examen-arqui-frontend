import { api } from "@/lib/api"
import {
  extractCollection,
  type CollectionModelResponse,
  type EntityModelResponse,
} from "@/types/hateoas"
import type { NotaRequest, NotaResponse } from "@/types"

/**
 * Service para el recurso Notas.
 * Consume los endpoints HATEOAS del backend en `/api/v1/notas`.
 *
 *   GET  /api/v1/notas      → lista
 *   GET  /api/v1/notas/{id} → una por id
 *   POST /api/v1/notas      → registrar una nueva nota
 */
export const notasService = {
  async getAll(): Promise<NotaResponse[]> {
    const { data } = await api.get<CollectionModelResponse<EntityModelResponse<NotaResponse>>>(
      "/notas",
    )
    return extractCollection(data, "notas")
  },

  async getById(id: number): Promise<NotaResponse> {
    const { data } = await api.get<EntityModelResponse<NotaResponse>>(`/notas/${id}`)
    return data
  },

  /**
   * Registra una nueva nota.
   * @throws ApiError 400 (validación o regla de negocio) / 404 (estudiante o materia inexistente).
   */
  async registrar(payload: NotaRequest): Promise<NotaResponse> {
    const { data } = await api.post<EntityModelResponse<NotaResponse>>("/notas", payload)
    return data
  },
}
