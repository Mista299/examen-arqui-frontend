import { useState, useCallback } from "react"
import { api } from "@/lib/api"
import type { Estudiante, Materia, Nota, NotaRequest, EstudianteConNotas, NotaResponse, DashboardStats, Actividad } from "@/types"

const mockEstudiantes: Estudiante[] = [
  { id: 1, cedula: "1001234567", nombre: "María", apellido: "González", email: "maria.gonzalez@udea.edu.co", programa: "Ingeniería de Sistemas" },
  { id: 2, cedula: "1002345678", nombre: "Carlos", apellido: "Rodríguez", email: "carlos.rodriguez@udea.edu.co", programa: "Ingeniería de Sistemas" },
  { id: 3, cedula: "1003456789", nombre: "Ana", apellido: "Martínez", email: "ana.martinez@udea.edu.co", programa: "Ingeniería Electrónica" },
  { id: 4, cedula: "1004567890", nombre: "Juan", apellido: "Pérez", email: "juan.perez@udea.edu.co", programa: "Ingeniería de Sistemas" },
  { id: 5, cedula: "1005678901", nombre: "Laura", apellido: "Sánchez", email: "laura.sanchez@udea.edu.co", programa: "Ingeniería Industrial" },
  { id: 6, cedula: "1006789012", nombre: "Pedro", apellido: "López", email: "pedro.lopez@udea.edu.co", programa: "Ingeniería de Sistemas" },
  { id: 7, cedula: "1007890123", nombre: "Camila", apellido: "Torres", email: "camila.torres@udea.edu.co", programa: "Ingeniería Electrónica" },
  { id: 8, cedula: "1008901234", nombre: "Diego", apellido: "Ramírez", email: "diego.ramirez@udea.edu.co", programa: "Ingeniería Industrial" },
]

const mockMaterias: Materia[] = [
  { id: 1, codigo: "ING303", nombre: "Arquitectura de Software", creditos: 4 },
  { id: 2, codigo: "ING201", nombre: "Bases de Datos", creditos: 3 },
  { id: 3, codigo: "ING305", nombre: "Ingeniería de Requisitos", creditos: 3 },
  { id: 4, codigo: "ING401", nombre: "Inteligencia Artificial", creditos: 4 },
  { id: 5, codigo: "ING302", nombre: "Redes y Comunicaciones", creditos: 3 },
  { id: 6, codigo: "ING204", nombre: "Programación Avanzada", creditos: 3 },
]

const mockNotas: Nota[] = [
  { id: 1, valor: 4.6, periodo: "2026-1", fechaRegistro: "2026-02-15", observaciones: "Excelente desempeño", estudiante: mockEstudiantes[0], materia: { codigo: "ING303", nombre: "Arquitectura de Software", creditos: 4 } },
  { id: 2, valor: 4.25, periodo: "2026-1", fechaRegistro: "2026-02-16", observaciones: null, estudiante: mockEstudiantes[0], materia: { codigo: "ING201", nombre: "Bases de Datos", creditos: 3 } },
  { id: 3, valor: 3.9, periodo: "2026-1", fechaRegistro: "2026-02-17", observaciones: null, estudiante: mockEstudiantes[0], materia: { codigo: "ING305", nombre: "Ingeniería de Requisitos", creditos: 3 } },
  { id: 4, valor: 4.4, periodo: "2026-1", fechaRegistro: "2026-02-18", observaciones: null, estudiante: mockEstudiantes[1], materia: { codigo: "ING303", nombre: "Arquitectura de Software", creditos: 4 } },
  { id: 5, valor: 3.6, periodo: "2026-1", fechaRegistro: "2026-02-19", observaciones: null, estudiante: mockEstudiantes[1], materia: { codigo: "ING401", nombre: "Inteligencia Artificial", creditos: 4 } },
  { id: 6, valor: 4.75, periodo: "2026-1", fechaRegistro: "2026-02-20", observaciones: "Destacada", estudiante: mockEstudiantes[2], materia: { codigo: "ING303", nombre: "Arquitectura de Software", creditos: 4 } },
  { id: 7, valor: 4.55, periodo: "2026-1", fechaRegistro: "2026-02-21", observaciones: null, estudiante: mockEstudiantes[2], materia: { codigo: "ING201", nombre: "Bases de Datos", creditos: 3 } },
  { id: 8, valor: 4.15, periodo: "2026-1", fechaRegistro: "2026-02-22", observaciones: null, estudiante: mockEstudiantes[2], materia: { codigo: "ING302", nombre: "Redes y Comunicaciones", creditos: 3 } },
  { id: 9, valor: 3.25, periodo: "2026-1", fechaRegistro: "2026-02-23", observaciones: null, estudiante: mockEstudiantes[3], materia: { codigo: "ING303", nombre: "Arquitectura de Software", creditos: 4 } },
  { id: 10, valor: 2.9, periodo: "2026-1", fechaRegistro: "2026-02-24", observaciones: "Requiere refuerzo", estudiante: mockEstudiantes[3], materia: { codigo: "ING204", nombre: "Programación Avanzada", creditos: 3 } },
  { id: 11, valor: 4.45, periodo: "2026-1", fechaRegistro: "2026-02-25", observaciones: null, estudiante: mockEstudiantes[4], materia: { codigo: "ING201", nombre: "Bases de Datos", creditos: 3 } },
  { id: 12, valor: 3.8, periodo: "2026-1", fechaRegistro: "2026-02-26", observaciones: null, estudiante: mockEstudiantes[4], materia: { codigo: "ING305", nombre: "Ingeniería de Requisitos", creditos: 3 } },
  { id: 13, valor: 4.7, periodo: "2026-1", fechaRegistro: "2026-03-01", observaciones: "Excelente", estudiante: mockEstudiantes[5], materia: { codigo: "ING303", nombre: "Arquitectura de Software", creditos: 4 } },
  { id: 14, valor: 4.35, periodo: "2026-1", fechaRegistro: "2026-03-02", observaciones: null, estudiante: mockEstudiantes[5], materia: { codigo: "ING401", nombre: "Inteligencia Artificial", creditos: 4 } },
  { id: 15, valor: 3.55, periodo: "2026-1", fechaRegistro: "2026-03-03", observaciones: null, estudiante: mockEstudiantes[6], materia: { codigo: "ING303", nombre: "Arquitectura de Software", creditos: 4 } },
  { id: 16, valor: 4.1, periodo: "2026-1", fechaRegistro: "2026-03-04", observaciones: null, estudiante: mockEstudiantes[7], materia: { codigo: "ING201", nombre: "Bases de Datos", creditos: 3 } },
]

const mockActividades: Actividad[] = [
  { id: "1", tipo: "nota_registrada", descripcion: "Nota registrada para María González en Arquitectura de Software", timestamp: "2026-02-15T10:30:00Z" },
  { id: "2", tipo: "estudiante_inscrito", descripcion: "Pedro López se inscribió en el semestre 2026-1", timestamp: "2026-02-14T09:00:00Z" },
  { id: "3", tipo: "nota_registrada", descripcion: "Ana Martínez obtuvo 4.75 en Arquitectura de Software", timestamp: "2026-02-20T08:30:00Z" },
  { id: "4", tipo: "nota_actualizada", descripcion: "Nota actualizada para Juan Pérez en Programación Avanzada", timestamp: "2026-02-24T09:00:00Z" },
  { id: "5", tipo: "nota_registrada", descripcion: "Carlos Rodríguez obtuvo 4.4 en Arquitectura de Software", timestamp: "2026-02-18T11:00:00Z" },
  { id: "6", tipo: "estudiante_inscrito", descripcion: "Camila Torres se inscribió en Ingeniería Electrónica", timestamp: "2026-02-13T14:00:00Z" },
]

export function useEstudiantes() {
  const [estudiantes] = useState<Estudiante[]>(mockEstudiantes)
  const [loading, setLoading] = useState(false)

  const fetchEstudiantes = useCallback(async () => {
    setLoading(true)
    try {
      const response = await api.get<Estudiante[]>("/estudiantes")
      return response.data
    } catch {
      return estudiantes
    } finally {
      setLoading(false)
    }
  }, [estudiantes])

  return { estudiantes, loading, fetchEstudiantes }
}

export function useMaterias() {
  const [materias] = useState<Materia[]>(mockMaterias)
  const [loading, setLoading] = useState(false)

  const fetchMaterias = useCallback(async () => {
    setLoading(true)
    try {
      const response = await api.get<Materia[]>("/materias")
      return response.data
    } catch {
      return materias
    } finally {
      setLoading(false)
    }
  }, [materias])

  return { materias, loading, fetchMaterias }
}

export function useNotas() {
  const [notas, setNotas] = useState<Nota[]>(mockNotas)

  const registrarNota = useCallback(async (payload: NotaRequest) => {
    const estudiante = mockEstudiantes.find((e) => e.cedula === payload.cedulaEstudiante)
    const materia = mockMaterias.find((m) => m.codigo === payload.codigoMateria)
    const nuevaNota: Nota = {
      id: notas.length + 1,
      valor: payload.valor,
      periodo: payload.periodo,
      fechaRegistro: new Date().toISOString().split("T")[0],
      observaciones: payload.observaciones ?? null,
      estudiante: estudiante!,
      materia: { codigo: materia!.codigo, nombre: materia!.nombre, creditos: materia!.creditos },
    }
    setNotas((prev) => [nuevaNota, ...prev])
    try {
      const response = await api.post<NotaResponse>("/notas", payload)
      return response.data
    } catch {
      return nuevaNota
    }
  }, [notas, setNotas])

  const getNotasByCedula = useCallback(async (cedula: string): Promise<EstudianteConNotas | null> => {
    try {
      const response = await api.get<EstudianteConNotas>(`/estudiantes/${cedula}/notas`)
      return response.data
    } catch {
      const estudiante = mockEstudiantes.find((e) => e.cedula === cedula)
      const notasEstudiante = notas.filter((n) => n.estudiante.cedula === cedula)
      if (!estudiante || notasEstudiante.length === 0) return null

      const promediosMap: Record<string, { sum: number; count: number; nombre: string }> = {}
      notasEstudiante.forEach((n) => {
        if (!promediosMap[n.materia.codigo]) {
          promediosMap[n.materia.codigo] = { sum: 0, count: 0, nombre: n.materia.nombre }
        }
        promediosMap[n.materia.codigo].sum += n.valor
        promediosMap[n.materia.codigo].count += 1
      })

      return {
        cedula: estudiante.cedula,
        nombreCompleto: `${estudiante.nombre} ${estudiante.apellido}`,
        programa: estudiante.programa,
        notas: notasEstudiante.map((n) => ({
          id: n.id,
          valor: n.valor,
          periodo: n.periodo,
          fechaRegistro: n.fechaRegistro,
          observaciones: n.observaciones,
          materia: n.materia,
        })),
      }
    }
  }, [notas])

  return { notas, registrarNota, getNotasByCedula }
}

export function useDashboard() {
  const stats: DashboardStats = {
    totalEstudiantes: mockEstudiantes.length,
    totalMaterias: mockMaterias.length,
    promedioGeneral: Math.round((mockNotas.reduce((acc, n) => acc + n.valor, 0) / mockNotas.length) * 100) / 100,
    porcentajeAprobados: Math.round((mockNotas.filter((n) => n.valor >= 3.0).length / mockNotas.length) * 1000) / 10,
  }

  const actividades: Actividad[] = mockActividades

  return { stats, actividades }
}