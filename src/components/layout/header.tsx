import { Link, useLocation } from "react-router-dom"
import { Moon, Sun, Menu, X } from "lucide-react"
import { useTheme } from "@/providers/theme-provider"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState } from "react"

const breadcrumbMap: Record<string, string> = {
  "/": "Dashboard",
  "/students": "Estudiantes",
  "/subjects": "Materias",
  "/grades/register": "Registrar Nota",
  "/grades/query": "Consultar Notas",
}

const routeLabels: Record<string, string> = {
  "": "Dashboard",
  students: "Estudiantes",
  subjects: "Materias",
  grades: "Notas",
  register: "Registrar",
  query: "Consultar",
}

export function Header() {
  const { theme, setTheme } = useTheme()
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const pathSegments = location.pathname.split("/").filter(Boolean)
  const breadcrumbs = pathSegments.length > 0
    ? [
        { label: "Inicio", to: "/" },
        ...pathSegments.map((segment, i) => ({
          label: routeLabels[segment] || segment,
          to: "/" + pathSegments.slice(0, i + 1).join("/"),
        })),
      ]
    : [{ label: "Dashboard", to: "/" }]

  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="flex items-center justify-between h-14 px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            <nav className="hidden sm:flex items-center gap-1.5 text-sm">
              {breadcrumbs.map((crumb, i) => (
                <span key={crumb.to} className="flex items-center gap-1.5">
                  {i > 0 && <span className="text-muted-foreground">/</span>}
                  {i === breadcrumbs.length - 1 ? (
                    <span className="font-medium text-foreground">{crumb.label}</span>
                  ) : (
                    <Link
                      to={crumb.to}
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {crumb.label}
                    </Link>
                  )}
                </span>
              ))}
            </nav>

            <h2 className="sm:hidden font-semibold text-sm truncate">
              {breadcrumbMap[location.pathname] || "NotasUdeA"}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : theme === "light" ? "dark" : theme === "system" ? "dark" : "system")}
              className="text-muted-foreground hover:text-foreground"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 top-14 z-30 bg-background/95 backdrop-blur-sm animate-fade">
          <nav className="flex flex-col p-4 gap-1">
            {Object.entries(breadcrumbMap).map(([to, label]) => {
              const isActive = location.pathname === to
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={closeMobileMenu}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-muted-foreground hover:bg-muted"
                  )}
                >
                  {label}
                </Link>
              )
            })}
          </nav>
        </div>
      )}
    </>
  )
}