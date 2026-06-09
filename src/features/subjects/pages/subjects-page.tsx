import { User, GraduationCap } from "lucide-react"
import { useMaterias } from "@/hooks/use-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
  const { materias } = useMaterias()

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Materias</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Catálogo de materias del semestre actual
        </p>
      </div>

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
    </div>
  )
}