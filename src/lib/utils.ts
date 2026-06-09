import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getGradeColor(valor: number): string {
  if (valor >= 4.5) return "text-emerald-600 dark:text-emerald-400"
  if (valor >= 3.5) return "text-primary dark:text-primary"
  if (valor >= 3.0) return "text-amber-600 dark:text-amber-400"
  return "text-destructive"
}

export function getGradeBg(valor: number): string {
  if (valor >= 4.5) return "bg-emerald-500"
  if (valor >= 3.5) return "bg-primary"
  if (valor >= 3.0) return "bg-amber-500"
  return "bg-destructive"
}

export function getGradeLabel(valor: number): string {
  if (valor >= 4.5) return "Excelente"
  if (valor >= 3.5) return "Bueno"
  if (valor >= 3.0) return "Aceptable"
  return "Deficiente"
}

export function formatGrade(valor: number): string {
  return valor.toFixed(1)
}

export function getGradeBadgeVariant(valor: number): "success" | "default" | "warning" | "destructive" {
  if (valor >= 4.5) return "success"
  if (valor >= 3.5) return "default"
  if (valor >= 3.0) return "warning"
  return "destructive"
}