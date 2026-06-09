import { useState, useEffect, useCallback } from "react"

import {
  dashboardService,
  estudiantesService,
  materiasService,
  notasService,
} from "@/services"
import type {
  Actividad,
  DashboardStats,
  Estudiante,
  EstudianteConNotas,
  Materia,
  NotaRequest,
  NotaResponse,
} from "@/types"

function getStatus(e: unknown): number | undefined {
  return typeof e === "object" && e !== null && "status" in e
    ? (e as { status?: number }).status
    : undefined
}

function getErrorMessage(e: unknown, fallback: string): string {
  if (e instanceof Error) return e.message
  return fallback
}

/**
 * Hooks de acceso a datos. Cada uno envuelve un service HTTP y expone
 * estado React (data, loading, error, refetch) para que las páginas
 * puedan mostrar spinners o mensajes de error.
 *
 * Antes estos hooks devolvían datos en memoria (mock). Ahora hacen
 * fetch real contra el backend Spring Boot de `/api/v1/...` y respetan
 * el formato HATEOAS (los services se encargan de desenvolverlo).
 */

// ============================================================
// Hooks de listado
// ============================================================

export function useEstudiantes() {
  const [estudiantes, setEstudiantes] = useState<Estudiante[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchEstudiantes = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await estudiantesService.getAll()
      setEstudiantes(data)
    } catch (e) {
      setError(getErrorMessage(e, "Error al cargar estudiantes"))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchEstudiantes()
  }, [fetchEstudiantes])

  return { estudiantes, loading, error, refetch: fetchEstudiantes }
}

export function useMaterias() {
  const [materias, setMaterias] = useState<Materia[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchMaterias = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await materiasService.getAll()
      setMaterias(data)
    } catch (e) {
      setError(getErrorMessage(e, "Error al cargar materias"))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchMaterias()
  }, [fetchMaterias])

  return { materias, loading, error, refetch: fetchMaterias }
}

// ============================================================
// Hook de notas (acciones)
// ============================================================

/**
 * Expone las acciones contra el recurso Notas. No mantiene estado
 * propio: cada llamada es una petición HTTP. Las páginas que las
 * usan manejan su propio estado de loading / error / resultado.
 */
export function useNotas() {
  const registrarNota = useCallback(async (payload: NotaRequest): Promise<NotaResponse> => {
    return notasService.registrar(payload)
  }, [])

  const getNotasByCedula = useCallback(
    async (cedula: string): Promise<EstudianteConNotas | null> => {
      try {
        return await estudiantesService.getNotasByCedula(cedula)
      } catch (e) {
        // 404 se traduce a "no encontrado"; cualquier otro error se relanza
        // para que la página lo muestre como error.
        if (getStatus(e) === 404) {
          return null
        }
        throw e
      }
    },
    [],
  )

  const getAll = useCallback(() => notasService.getAll(), [])

  return { registrarNota, getNotasByCedula, getAll }
}

// ============================================================
// Hook de dashboard
// ============================================================

/**
 * Combina las estadísticas del backend con una "actividad reciente"
 * derivada en cliente a partir de las últimas notas registradas
 * (ordenadas por id desc, que es el orden natural de inserción).
 */
export function useDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [actividades, setActividades] = useState<Actividad[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      // Lanzamos las dos peticiones en paralelo.
      const [statsData, notasData] = await Promise.all([
        dashboardService.getStats(),
        notasService.getAll(),
      ])
      setStats(statsData)

      // Las 5 últimas notas (mayor id = más reciente) → Actividad.
      const ultimas = [...notasData]
        .sort((a, b) => b.id - a.id)
        .slice(0, 5)
        .map<Actividad>((n) => ({
          id: String(n.id),
          tipo: "nota_registrada",
          descripcion: `Nota de ${n.valor.toFixed(1)} registrada en ${n.materia.nombre} (${n.materia.codigo}) — ${n.periodo}`,
          // fechaRegistro viene como "YYYY-MM-DD"; lo pasamos a ISO-8601 con T00:00:00Z
          // para que `new Date(...)` lo parsee de forma estable.
          timestamp: n.fechaRegistro.includes("T")
            ? n.fechaRegistro
            : `${n.fechaRegistro}T00:00:00Z`,
        }))
      setActividades(ultimas)
    } catch (e) {
      setError(getErrorMessage(e, "Error al cargar el dashboard"))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAll()
  }, [fetchAll])

  return { stats, actividades, loading, error, refetch: fetchAll }
}
