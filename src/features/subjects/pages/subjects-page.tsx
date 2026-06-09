import { User, GraduationCap, AlertCircle } from "lucide-react"
import { useMaterias } from "@/hooks/use-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

const accentColors = [
  "border-t-primary",
  "border-t-emerald-500",
  "border-t-amber-500",
  "border-t-blue-500",
  "border-t-purple-500",
  "border-t-rose-500",
]

export function SubjectsPage() {
  const { materias, loading, error, refetch } = useMaterias()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Materias</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Catálogo de materias del semestre actual
        </p>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
          <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-destructive">No se pudieron cargar las materias</p>
            <p className="text-sm text-muted-foreground mt-0.5">{error}</p>
            <button
              onClick={refetch}
              className="mt-2 text-sm font-medium text-primary hover:underline"
            >
              Reintentar
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[160px]" />
          ))}
        </div>
      ) : !error && materias.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <GraduationCap className="h-12 w-12 text-muted-foreground/40" />
          <p className="mt-4 text-lg font-medium text-muted-foreground">No hay materias registradas</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {materias.map((materia, index) => (
            <Card
              key={materia.id}
              className={cn("animate-in border-t-2", accentColors[index % accentColors.length])}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{materia.nombre}</CardTitle>
                  <Badge variant="outline" className="font-mono text-xs">
                    {materia.codigo}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Créditos</span>
                  <Badge variant="secondary" className="ml-auto">
                    {materia.creditos}
                  </Badge>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Horario</span>
                  <span className="ml-auto font-medium text-xs text-muted-foreground">Ver en el sistema</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
