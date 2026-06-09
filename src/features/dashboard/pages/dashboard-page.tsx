import { useDashboard } from "@/hooks/use-data"
import { StatsCards } from "../components/stats-cards"
import { RecentActivity } from "../components/recent-activity"

export function DashboardPage() {
  const { stats, actividades } = useDashboard()

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
      <StatsCards stats={stats} />
      <RecentActivity actividades={actividades} />
    </div>
  )
}