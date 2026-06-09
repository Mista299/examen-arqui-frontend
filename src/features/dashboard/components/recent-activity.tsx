import { PenLine, UserPlus, RefreshCw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import type { Actividad } from "@/types"
import { cn } from "@/lib/utils"

function timeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)
  if (seconds < 60) return "justo ahora"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `hace ${minutes}m`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `hace ${hours}h`
  const days = Math.floor(hours / 24)
  return `hace ${days}d`
}

const actividadConfig: Record<Actividad["tipo"], { icon: typeof PenLine; color: string }> = {
  nota_registrada: { icon: PenLine, color: "text-emerald-600 dark:text-emerald-400" },
  estudiante_inscrito: { icon: UserPlus, color: "text-primary" },
  nota_actualizada: { icon: RefreshCw, color: "text-amber-600 dark:text-amber-400" },
}

export function RecentActivity({ actividades }: { actividades: Actividad[] }) {
  return (
    <Card className="animate-in" style={{ animationDelay: "300ms" }}>
      <CardHeader>
        <CardTitle className="text-lg">Actividad Reciente</CardTitle>
        <CardDescription>Últimas acciones en el sistema</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-0">
          {actividades.map((actividad, index) => {
            const config = actividadConfig[actividad.tipo]
            const Icon = config.icon
            const isLast = index === actividades.length - 1
            return (
              <div key={actividad.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className={cn("flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-background", config.color)}>
                    <Icon className="h-3.5 w-3.5" />
                  </div>
                  {!isLast && <div className="w-px flex-1 bg-border" />}
                </div>
                <div className={cn("flex-1 pb-4", isLast && "pb-0")}>
                  <p className="text-sm text-foreground">{actividad.descripcion}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{timeAgo(actividad.timestamp)}</p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}