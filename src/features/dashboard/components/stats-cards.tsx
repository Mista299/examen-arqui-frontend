import { Users, BookOpen, TrendingUp, Award } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import type { DashboardStats } from "@/types"
import { cn, formatGrade } from "@/lib/utils"

export function StatsCards({ stats }: { stats: DashboardStats }) {
  const cards = [
    {
      label: "Estudiantes",
      value: stats.totalEstudiantes,
      icon: Users,
      format: (v: number) => v.toString(),
    },
    {
      label: "Materias",
      value: stats.totalMaterias,
      icon: BookOpen,
      format: (v: number) => v.toString(),
    },
    {
      label: "Promedio General",
      value: stats.promedioGeneral,
      icon: TrendingUp,
      format: formatGrade,
      bar: true,
    },
    {
      label: "% Aprobados (≥3.0)",
      value: stats.porcentajeAprobados,
      icon: Award,
      format: (v: number) => `${v}%`,
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
                    width: `${(stats.promedioGeneral / 5) * 100}%`,
                    background: "linear-gradient(90deg, #ef4444 0%, #f59e0b 60%, #22c55e 100%)",
                  }}
                />
              </div>
            )}
            {card.barPrimary && (
              <div className="mt-3 h-2 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-700 ease-out"
                  style={{ width: `${stats.porcentajeAprobados}%` }}
                />
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}