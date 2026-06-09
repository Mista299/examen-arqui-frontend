export interface Estudiante {
  id: number
  cedula: string
  nombre: string
  apellido: string
  email: string
  programa: string
}

export interface Materia {
  id: number
  codigo: string
  nombre: string
  creditos: number
}

export interface Nota {
  id: number
  valor: number
  periodo: string
  fechaRegistro: string
  observaciones: string | null
  estudiante: Estudiante
  materia: MateriaSimple
}

export interface MateriaSimple {
  codigo: string
  nombre: string
  creditos: number
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
}

export interface EstudianteConNotas {
  cedula: string
  nombreCompleto: string
  programa: string
  notas: NotaResponse[]
}

export interface PromedioMateria {
  codigoMateria: string
  nombreMateria: string
  promedio: number
  cantidadNotas: number
}

export interface DashboardStats {
  totalEstudiantes: number
  totalMaterias: number
  promedioGeneral: number
  porcentajeAprobados: number
}

export interface Actividad {
  id: string
  tipo: "nota_registrada" | "estudiante_inscrito" | "nota_actualizada"
  descripcion: string
  timestamp: string
}