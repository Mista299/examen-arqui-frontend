import { api } from "@/lib/api"
import {
  extractCollection,
  type CollectionModelResponse,
  type EntityModelResponse,
} from "@/types/hateoas"
import type { Estudiante, EstudianteConNotas } from "@/types"

/**
 * Service para el recurso Estudiantes.
 * Consume los endpoints HATEOAS del backend en `/api/v1/estudiantes`.
 *
 *   GET /api/v1/estudiantes                  → lista
 *   GET /api/v1/estudiantes/{cedula}         → uno por cédula
 *   GET /api/v1/estudiantes/{cedula}/notas   → notas del estudiante
 */
export const estudiantesService = {
  /**
   * Lista todos los estudiantes.
   * @throws ApiError si el backend devuelve un error.
   */
  async getAll(): Promise<Estudiante[]> {
    const { data } = await api.get<CollectionModelResponse<EntityModelResponse<Estudiante>>>(
      "/estudiantes",
    )
    return extractCollection(data, "estudiantes")
  },

  /**
   * Obtiene un estudiante por su cédula.
   * @throws ApiError 404 si no existe.
   */
  async getByCedula(cedula: string): Promise<Estudiante> {
    const { data } = await api.get<EntityModelResponse<Estudiante>>(
      `/estudiantes/${encodeURIComponent(cedula)}`,
    )
    return data
  },

  /**
   * Devuelve el estudiante con todas sus notas registradas.
   * @throws ApiError 404 si la cédula no existe.
   */
  async getNotasByCedula(cedula: string): Promise<EstudianteConNotas> {
    const { data } = await api.get<EntityModelResponse<EstudianteConNotas>>(
      `/estudiantes/${encodeURIComponent(cedula)}/notas`,
    )
    return data
  },
}
