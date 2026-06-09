import { useState, useEffect, useCallback, useRef } from "react"
import { useSearchParams } from "react-router-dom"
import { Search, User, BookOpen, TrendingUp, CreditCard } from "lucide-react"
import { useNotas, useEstudiantes } from "@/hooks/use-data"
import { toast } from "@/components/ui/toaster"
import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { formatGrade, getGradeColor, getGradeBadgeVariant, getGradeLabel, cn } from "@/lib/utils"
import type { EstudianteConNotas } from "@/types"

export default function StudentGradesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { getNotasByCedula } = useNotas()
  const { estudiantes } = useEstudiantes()

  const initialCedula = searchParams.get("cedula") || ""
  const [searchInput, setSearchInput] = useState<string>(initialCedula)
  const [selectedCedula, setSelectedCedula] = useState<string>(initialCedula)
  const [data, setData] = useState<EstudianteConNotas | null>(null)
  const [loading, setLoading] = useState(false)
  const [notFound, setNotFound] = useState(false)
  const hasFetchedRef = useRef(false)

  const fetchGrades = useCallback(async (cedula: string) => {
    if (!cedula) return
    setLoading(true)
    setNotFound(false)
    try {
      const result = await getNotasByCedula(cedula)
      if (result) {
        setData(result)
        setNotFound(false)
      } else {
        setData(null)
        setNotFound(true)
      }
    } catch {
      setData(null)
      setNotFound(true)
      toast({ title: "Error", description: "Error al consultar las notas del estudiante", variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }, [getNotasByCedula])

  useEffect(() => {
    if (initialCedula && !hasFetchedRef.current) {
      hasFetchedRef.current = true
      fetchGrades(initialCedula)
    }
  }, [initialCedula, fetchGrades])

  const handleSearch = () => {
    const cedula = searchInput.trim()
    if (!cedula) {
      toast({ title: "Dato requerido", description: "Ingrese una cédula o seleccione un estudiante", variant: "destructive" })
      return
    }
    setSearchParams({ cedula })
    fetchGrades(cedula)
  }

  const handleSelectChange = (value: string) => {
    setSelectedCedula(value)
    setSearchInput(value)
    setSearchParams({ cedula: value })
    fetchGrades(value)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch()
  }

  const average = data ? data.notas.reduce((acc, n) => acc + n.valor, 0) / data.notas.length : 0

  const subjectAverages = data
    ? (() => {
        const map: Record<string, { sum: number; count: number; nombre: string }> = {}
        data.notas.forEach((n) => {
          if (!map[n.materia.codigo]) {
            map[n.materia.codigo] = { sum: 0, count: 0, nombre: n.materia.nombre }
          }
          map[n.materia.codigo].sum += n.valor
          map[n.materia.codigo].count += 1
        })
        return Object.entries(map).map(([codigo, d]) => ({
          codigo,
          nombre: d.nombre,
          promedio: Math.round((d.sum / d.count) * 100) / 100,
          cantidad: d.count,
        }))
      })()
    : []

  const performanceGradient = "linear-gradient(to right, #ef4444, #f59e0b 60%, #22c55e)"

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Consultar Notas</h1>
        <p className="text-muted-foreground mt-1">Busque por cédula o seleccione un estudiante para ver sus notas</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <div className="relative">
                <CreditCard className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Ingrese la cédula (ej. 1001234567)..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={selectedCedula} onValueChange={handleSelectChange}>
              <SelectTrigger className="w-full sm:w-[280px]">
                <SelectValue placeholder="Seleccione estudiante..." />
              </SelectTrigger>
              <SelectContent>
                {estudiantes.map((e) => (
                  <SelectItem key={e.cedula} value={e.cedula}>
                    {e.nombre} {e.apellido} — {e.cedula}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleSearch} disabled={loading}>
              <Search className="h-4 w-4" />
              Buscar
            </Button>
          </div>
        </CardContent>
      </Card>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="pt-6">
                <div className="h-20 animate-pulse rounded-md bg-muted" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {notFound && !loading && (
        <Card className="border-destructive/30">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <User className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <h3 className="text-lg font-semibold">Estudiante no encontrado</h3>
              <p className="text-muted-foreground mt-1 text-sm">
                No se encontraron datos para la cédula ingresada. Verifique e intente de nuevo.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {data && !loading && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" />
                  Estudiante
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <p className="text-lg font-semibold leading-tight">{data.nombreCompleto}</p>
                  <p className="text-sm text-muted-foreground">{estudiantes.find((e) => e.cedula === data.cedula)?.email}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-1.5">
                  <CreditCard className="h-3.5 w-3.5" />
                  Cédula
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold font-mono">{data.cedula}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5" />
                  Programa
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-lg font-semibold">{data.programa}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-1.5">
                  <TrendingUp className="h-3.5 w-3.5" />
                  Promedio
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline gap-2">
                  <span className={cn("text-3xl font-bold tabular-nums", getGradeColor(average))}>
                    {formatGrade(average)}
                  </span>
                  <Badge variant={getGradeBadgeVariant(average)}>
                    {getGradeLabel(average)}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardDescription>Rendimiento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="h-3 w-full overflow-hidden rounded-full">
                    <div
                      className="h-full rounded-full transition-all duration-700 ease-out"
                      style={{
                        width: `${(average / 5) * 100}%`,
                        background: performanceGradient,
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0.0</span>
                    <span>2.5</span>
                    <span>5.0</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <h2 className="text-lg font-semibold tracking-tight mb-4">Promedio por Materia</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {subjectAverages.map((subject) => (
                <Card key={subject.codigo} className="overflow-hidden">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="min-w-0 flex-1 mr-3">
                        <p className="font-medium text-sm truncate">{subject.nombre}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {subject.cantidad} {subject.cantidad === 1 ? "nota" : "notas"}
                        </p>
                      </div>
                      <span className={cn("text-xl font-bold tabular-nums shrink-0", getGradeColor(subject.promedio))}>
                        {formatGrade(subject.promedio)}
                      </span>
                    </div>
                    <Progress value={(subject.promedio / 5) * 100} className="h-2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold tracking-tight mb-4">Detalle de Notas</h2>
            <Card>
              <CardContent className="pt-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Materia</TableHead>
                      <TableHead>Código</TableHead>
                      <TableHead>Nota</TableHead>
                      <TableHead>Periodo</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Observaciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.notas.map((nota) => (
                      <TableRow key={nota.id} className="transition-colors">
                        <TableCell className="font-medium">{nota.materia.nombre}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{nota.materia.codigo}</Badge>
                        </TableCell>
                        <TableCell>
                          <span className={cn("font-semibold tabular-nums", getGradeColor(nota.valor))}>
                            {formatGrade(nota.valor)}
                          </span>
                        </TableCell>
                        <TableCell className="text-muted-foreground">{nota.periodo}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {nota.fechaRegistro}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {nota.observaciones || "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {!data && !loading && !notFound && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Search className="h-12 w-12 text-muted-foreground/30 mb-4" />
              <h3 className="text-lg font-semibold">Consultar notas</h3>
              <p className="text-muted-foreground mt-1 text-sm">
                Ingrese una cédula o seleccione un estudiante del listado para ver sus notas.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}