import type { HateoasLinks } from "./hateoas"

// ===== Estudiantes =====

export interface Estudiante {
  id: number
  cedula: string
  nombre: string
  apellido: string
  email: string
  programa: string
  _links?: HateoasLinks
}

// ===== Materias =====

export interface Materia {
  id: number
  codigo: string
  nombre: string
  creditos: number
  _links?: HateoasLinks
}

/** Materia anidada dentro de NotaResponse / EstudianteConNotas (versión ligera). */
export interface MateriaSimple {
  codigo: string
  nombre: string
  creditos: number
}

// ===== Notas =====

export interface Nota {
  id: number
  valor: number
  periodo: string
  fechaRegistro: string
  observaciones: string | null
  estudiante: Estudiante
  materia: MateriaSimple
}

export interface NotaRequest {
  cedulaEstudiante: string
  codigoMateria: string
  valor: number
  periodo: string
  observaciones?: string | null
}

export interface NotaResponse {
  id: number
  valor: number
  periodo: string
  fechaRegistro: string
  observaciones: string | null
  materia: MateriaSimple
  _links?: HateoasLinks
}

export interface EstudianteConNotas {
  cedula: string
  nombreCompleto: string
  programa: string
  notas: NotaResponse[]
  _links?: HateoasLinks
}

// ===== Dashboard =====

export interface DashboardStats {
  totalEstudiantes: number
  totalMaterias: number
  promedioGeneral: number
  porcentajeAprobados: number
  _links?: HateoasLinks
}

export interface PromedioMateria {
  codigoMateria: string
  nombreMateria: string
  promedio: number
  cantidadNotas: number
  _links?: HateoasLinks
}

// ===== Actividad (derivada en cliente) =====
//
// "Actividad reciente" no es un endpoint del backend; la construimos
// en el cliente a partir de las últimas notas registradas.
// El campo `estudiante` puede ser null si la nota no trae el dato embebido.

export interface Actividad {
  id: string
  tipo: "nota_registrada" | "estudiante_inscrito" | "nota_actualizada"
  descripcion: string
  timestamp: string
}
