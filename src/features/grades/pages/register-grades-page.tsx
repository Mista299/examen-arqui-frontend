import { useState } from "react"
import { PenLine, CheckCircle2 } from "lucide-react"
import { useEstudiantes, useMaterias, useNotas } from "@/hooks/use-data"
import { toast } from "@/components/ui/toaster"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn, getGradeColor, getGradeLabel, formatGrade } from "@/lib/utils"

const PERIODOS = ["2026-1", "2025-2", "2025-1", "2024-2"] as const

interface FormErrors {
  cedulaEstudiante?: string
  codigoMateria?: string
  valor?: string
  periodo?: string
}

export function RegisterGradesPage() {
  const { estudiantes } = useEstudiantes()
  const { materias } = useMaterias()
  const { registrarNota } = useNotas()

  const [cedula, setCedula] = useState("")
  const [codigoMateria, setCodigoMateria] = useState("")
  const [valor, setValor] = useState("")
  const [periodo, setPeriodo] = useState("")
  const [observaciones, setObservaciones] = useState("")
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const numericValue = valor === "" ? null : parseFloat(valor)

  const validate = (): FormErrors => {
    const newErrors: FormErrors = {}
    if (!cedula) newErrors.cedulaEstudiante = "Seleccione un estudiante"
    if (!codigoMateria) newErrors.codigoMateria = "Seleccione una materia"
    if (!valor) {
      newErrors.valor = "La nota es obligatoria"
    } else if (isNaN(parseFloat(valor))) {
      newErrors.valor = "La nota debe ser un número"
    } else if (parseFloat(valor) < 0 || parseFloat(valor) > 5) {
      newErrors.valor = "La nota debe estar entre 0.0 y 5.0"
    }
    if (!periodo) newErrors.periodo = "Seleccione un periodo"
    return newErrors
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const validationErrors = validate()
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) return

    setIsSubmitting(true)
    try {
      await registrarNota({
        cedulaEstudiante: cedula,
        codigoMateria,
        valor: parseFloat(valor),
        periodo,
        observaciones: observaciones || null,
      })
      toast({
        title: "Nota registrada",
        description: `Nota de ${parseFloat(valor).toFixed(1)} registrada exitosamente`,
        variant: "success",
      })
      setCedula("")
      setCodigoMateria("")
      setValor("")
      setPeriodo("")
      setObservaciones("")
      setErrors({})
    } catch {
      toast({
        title: "Error",
        description: "No se pudo registrar la nota. Intente de nuevo.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const selectedEstudiante = estudiantes.find((e) => e.cedula === cedula)
  const selectedMateria = materias.find((m) => m.codigo === codigoMateria)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Registrar Nota</h1>
        <p className="mt-1 text-sm text-muted-foreground">Ingrese una nueva nota al sistema</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PenLine className="h-5 w-5" />
              Datos de la Nota
            </CardTitle>
            <CardDescription>Complete la información de la nota</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="estudiante">Estudiante</Label>
                <Select value={cedula} onValueChange={setCedula}>
                  <SelectTrigger id="estudiante" className={cn(errors.cedulaEstudiante && "border-destructive")}>
                    <SelectValue placeholder="Seleccione un estudiante" />
                  </SelectTrigger>
                  <SelectContent>
                    {estudiantes.map((e) => (
                      <SelectItem key={e.cedula} value={e.cedula}>
                        {e.nombre} {e.apellido} — {e.cedula}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.cedulaEstudiante && (
                  <p className="text-xs text-destructive">{errors.cedulaEstudiante}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="materia">Materia</Label>
                <Select value={codigoMateria} onValueChange={setCodigoMateria}>
                  <SelectTrigger id="materia" className={cn(errors.codigoMateria && "border-destructive")}>
                    <SelectValue placeholder="Seleccione una materia" />
                  </SelectTrigger>
                  <SelectContent>
                    {materias.map((m) => (
                      <SelectItem key={m.codigo} value={m.codigo}>
                        {m.codigo} — {m.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.codigoMateria && (
                  <p className="text-xs text-destructive">{errors.codigoMateria}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="valor">Nota (0.0 — 5.0)</Label>
                <Input
                  id="valor"
                  type="number"
                  min={0}
                  max={5}
                  step={0.1}
                  placeholder="0.0 — 5.0"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  className={cn(errors.valor && "border-destructive")}
                />
                {errors.valor && (
                  <p className="text-xs text-destructive">{errors.valor}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="periodo">Periodo</Label>
                <Select value={periodo} onValueChange={setPeriodo}>
                  <SelectTrigger id="periodo" className={cn(errors.periodo && "border-destructive")}>
                    <SelectValue placeholder="Seleccione un periodo" />
                  </SelectTrigger>
                  <SelectContent>
                    {PERIODOS.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.periodo && (
                  <p className="text-xs text-destructive">{errors.periodo}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="observaciones">Observaciones (opcional)</Label>
                <Input
                  id="observaciones"
                  placeholder="Ej: Excelente desempeño"
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                />
              </div>

              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? "Registrando..." : "Registrar Nota"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5" />
              Vista Previa
            </CardTitle>
            <CardDescription>Vista previa de la nota antes de registrar</CardDescription>
          </CardHeader>
          <CardContent>
            {cedula && codigoMateria && valor && periodo && numericValue !== null && !isNaN(numericValue) ? (
              <div className="space-y-6">
                <div className="flex flex-col items-center justify-center rounded-lg border border-border bg-muted/30 py-8">
                  <span className={cn("text-5xl font-bold tracking-tight", getGradeColor(numericValue))}>
                    {formatGrade(numericValue)}
                  </span>
                  <span className={cn("mt-2 text-sm font-medium", getGradeColor(numericValue))}>
                    {getGradeLabel(numericValue)}
                  </span>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estudiante</span>
                    <span className="font-medium">{selectedEstudiante?.nombre} {selectedEstudiante?.apellido}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cédula</span>
                    <span className="font-mono font-medium">{selectedEstudiante?.cedula}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Materia</span>
                    <span className="font-medium">{selectedMateria?.codigo} — {selectedMateria?.nombre}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Periodo</span>
                    <span className="font-medium">{periodo}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12 text-center">
                <p className="text-sm text-muted-foreground">
                  Complete el formulario para ver la vista previa
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}