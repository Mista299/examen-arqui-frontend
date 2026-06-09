import { useDashboard } from "@/hooks/use-data"
import { StatsCards } from "../components/stats-cards"
import { RecentActivity } from "../components/recent-activity"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle } from "lucide-react"

export function DashboardPage() {
  const { stats, actividades, loading, error, refetch } = useDashboard()

  const formattedDate = new Date().toLocaleDateString("es-CO", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground capitalize">{formattedDate}</p>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
          <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-destructive">No se pudo cargar el dashboard</p>
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

      {loading || !stats ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[120px]" />
          ))}
        </div>
      ) : (
        <StatsCards stats={stats} />
      )}

      {!loading && !error && <RecentActivity actividades={actividades} />}
    </div>
  )
}
