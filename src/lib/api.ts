import axios from "axios"

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
})

/**
 * Normaliza los errores de Axios para que las páginas fallen con un mensaje
 * legible en español. El backend envía `{ mensaje: "...", detalles: [...] }`
 * (clase `ErrorResponse` en `GlobalExceptionHandler`); si por algún motivo
 * viene el campo `message` en su lugar, también lo aceptamos.
 *
 * Adicionalmente, preservamos el `error.response.data` original en
 * `error.originalData` para que los servicios puedan acceder a los
 * `detalles` de validación si lo necesitan.
 */
export interface ApiError extends Error {
  status?: number
  originalData?: unknown
}

function normalizeError(error: unknown): Promise<never> {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { mensaje?: string; message?: string; detalles?: unknown }
      | undefined
    const message =
      data?.mensaje ||
      data?.message ||
      error.message ||
      "Ocurrió un error inesperado"

    const apiError: ApiError = new Error(message)
    apiError.status = error.response?.status
    apiError.originalData = data
    return Promise.reject(apiError)
  }

  if (error instanceof Error) return Promise.reject(error)
  return Promise.reject(new Error("Ocurrió un error inesperado"))
}

api.interceptors.response.use(
  (response) => response,
  (error) => normalizeError(error),
)
