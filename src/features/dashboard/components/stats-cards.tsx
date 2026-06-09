import { Users, BookOpen, TrendingUp, Award } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { DashboardStats } from "@/types"
import { cn, formatGrade } from "@/lib/utils"

/**
 * El backend puede devolver la respuesta de `/dashboard/stats` con todas
 * sus propiedades, pero por seguridad (responses parciales, transient
 * states, distintos entornos) este componente trata cualquier
 * `undefined`/`null` como `0` y no rompe el render.
 *
 * Si en algún momento quieres mostrar "—" en vez de `0` cuando el dato
 * no esté disponible, basta con cambiar las funciones `safe*` de abajo.
 */
const safeToString = (v: number | undefined | null): string => (v ?? 0).toString()
const safeFormatGrade = (v: number | undefined | null): string => formatGrade(v ?? 0)
const safePercent = (v: number | undefined | null): string => `${v ?? 0}%`

export function StatsCards({ stats }: { stats: DashboardStats }) {
  // Defensive defaults: si el objeto llega incompleto, caemos a 0 en vez de reventar.
  const totalEstudiantes = stats?.totalEstudiantes ?? 0
  const totalMaterias = stats?.totalMaterias ?? 0
  const promedioGeneral = stats?.promedioGeneral ?? 0
  const porcentajeAprobados = stats?.porcentajeAprobados ?? 0

  const cards = [
    {
      label: "Estudiantes",
      value: totalEstudiantes,
      icon: Users,
      format: safeToString,
    },
    {
      label: "Materias",
      value: totalMaterias,
      icon: BookOpen,
      format: safeToString,
    },
    {
      label: "Promedio General",
      value: promedioGeneral,
      icon: TrendingUp,
      format: safeFormatGrade,
      bar: true,
    },
    {
      label: "% Aprobados (≥3.0)",
      value: porcentajeAprobados,
      icon: Award,
      format: safePercent,
      barPrimary: true,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => (
        <Card key={card.label} className={cn("animate-in")} style={{ animationDelay: `${index * 75}ms` }}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">{card.label}</span>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-2 text-3xl font-bold tracking-tight">{card.format(card.value)}</div>
            {card.bar && (
              <div className="mt-3 h-2 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700 ease-out"
                  style={{
                    width: `${(promedioGeneral / 5) * 100}%`,
                    background: "linear-gradient(90deg, #ef4444 0%, #f59e0b 60%, #22c55e 100%)",
                  }}
                />
              </div>
            )}
            {card.barPrimary && (
              <div className="mt-3 h-2 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-700 ease-out"
                  style={{ width: `${porcentajeAprobados}%` }}
                />
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
