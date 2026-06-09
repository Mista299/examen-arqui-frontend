import { NavLink, useLocation } from "react-router-dom"
import {
  LayoutDashboard,
  Users,
  BookOpen,
  PenLine,
  Search,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/students", label: "Estudiantes", icon: Users },
  { to: "/subjects", label: "Materias", icon: BookOpen },
  { to: "/grades/register", label: "Registrar Nota", icon: PenLine },
  { to: "/grades/query", label: "Consultar Notas", icon: Search },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const location = useLocation()

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col h-screen sticky top-0 border-r border-sidebar-border bg-sidebar transition-all duration-300 ease-in-out",
        collapsed ? "w-[68px]" : "w-[240px]"
      )}
    >
      <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#1e3a5f] text-white shrink-0">
          <BookOpen className="h-5 w-5" />
        </div>
        {!collapsed && (
          <div className="animate-fade">
            <h1 className="text-sm font-bold tracking-tight text-sidebar-foreground leading-none">
              NotasUdeA
            </h1>
            <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center gap-1">
              <GraduationCap className="h-2.5 w-2.5" />
              Universidad de Antioquia
            </p>
          </div>
        )}
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span className="animate-fade">{item.label}</span>}
            </NavLink>
          )
        })}
      </nav>

      <div className="border-t border-sidebar-border p-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-full rounded-lg py-2 text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground transition-colors cursor-pointer"
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>
    </aside>
  )
}