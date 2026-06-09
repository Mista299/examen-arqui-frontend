import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { useEstudiantes } from "@/hooks/use-data"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Filter, GraduationCap, CreditCard } from "lucide-react"

export function StudentsPage() {
  const { estudiantes } = useEstudiantes()
  const navigate = useNavigate()
  const [search, setSearch] = useState("")
  const [selectedPrograma, setSelectedPrograma] = useState<string>("all")

  const programas = useMemo(() => {
    const unique = Array.from(new Set(estudiantes.map((e) => e.programa)))
    return unique.sort()
  }, [estudiantes])

  const filtered = useMemo(() => {
    return estudiantes.filter((estudiante) => {
      const matchesSearch =
        estudiante.nombre.toLowerCase().includes(search.toLowerCase()) ||
        estudiante.apellido.toLowerCase().includes(search.toLowerCase()) ||
        estudiante.cedula.includes(search) ||
        estudiante.email.toLowerCase().includes(search.toLowerCase())

      const matchesPrograma =
        selectedPrograma === "all" || estudiante.programa === selectedPrograma

      return matchesSearch && matchesPrograma
    })
  }, [estudiantes, search, selectedPrograma])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Estudiantes</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {filtered.length} estudiante{filtered.length !== 1 ? "s" : ""} encontrado{filtered.length !== 1 ? "s" : ""}
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre, apellido o cédula..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <select
            value={selectedPrograma}
            onChange={(e) => setSelectedPrograma(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent"
          >
            <option value="all">Todos los programas</option>
            {programas.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <GraduationCap className="h-12 w-12 text-muted-foreground/40" />
          <p className="mt-4 text-lg font-medium text-muted-foreground">No se encontraron estudiantes</p>
          <p className="mt-1 text-sm text-muted-foreground/70">
            Intenta ajustar tu búsqueda o filtro
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((estudiante) => (
            <Card
              key={estudiante.id}
              className="cursor-pointer transition-all duration-200 hover:border-primary/30 hover:shadow-md active:scale-[0.98]"
              onClick={() => navigate(`/grades/query?cedula=${estudiante.cedula}`)}
            >
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold leading-tight">
                      {estudiante.nombre} {estudiante.apellido}
                    </h3>
                    <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                      <CreditCard className="h-3.5 w-3.5 shrink-0" />
                      <span className="font-mono">{estudiante.cedula}</span>
                    </div>
                    <p className="mt-0.5 truncate text-sm text-muted-foreground">{estudiante.email}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <GraduationCap className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{estudiante.programa}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}