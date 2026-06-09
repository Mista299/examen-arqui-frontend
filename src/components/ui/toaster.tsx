/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect, useCallback } from "react"
import * as Toast from "@/components/ui/toast"

const TOAST_LIMIT = 3
const TOAST_REMOVE_DELAY = 5000

type ToastVariant = "default" | "success" | "destructive"

interface ToastData {
  id: string
  title?: string
  description?: string
  variant?: ToastVariant
  action?: React.ReactNode
}

let toastCount = 0

function genId() {
  toastCount += 1
  return String(toastCount)
}

type Action =
  | { type: "ADD_TOAST"; toast: ToastData }
  | { type: "DISMISS_TOAST"; toastId: string }
  | { type: "REMOVE_TOAST"; toastId: string }

interface State {
  toasts: ToastData[]
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "ADD_TOAST":
      return { ...state, toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT) }
    case "DISMISS_TOAST":
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.toastId) }
    case "REMOVE_TOAST":
      return { ...state, toasts: state.toasts.filter((t) => t.id !== action.toastId) }
  }
}

const listeners: Array<(state: State) => void> = []
let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => listener(memoryState))
}

function toast({ title, description, variant = "default", action }: Omit<ToastData, "id">) {
  const id = genId()
  dispatch({ type: "ADD_TOAST", toast: { id, title, description, variant, action } })
  setTimeout(() => {
    dispatch({ type: "REMOVE_TOAST", toastId: id })
  }, TOAST_REMOVE_DELAY)
  return id
}

function useToast() {
  const [state, setState] = useState<State>(memoryState)

  useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) listeners.splice(index, 1)
    }
  }, [])

  const dismiss = useCallback((toastId: string) => {
    dispatch({ type: "DISMISS_TOAST", toastId })
  }, [])

  return { ...state, toast, dismiss }
}

function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <Toast.ToastProvider>
      {toasts.map((t) => (
        <Toast.Toast key={t.id} variant={t.variant} onOpenChange={(open) => { if (!open) dismiss(t.id) }}>
          <div className="grid gap-1">
            {t.title && <Toast.ToastTitle>{t.title}</Toast.ToastTitle>}
            {t.description && <Toast.ToastDescription>{t.description}</Toast.ToastDescription>}
          </div>
          {t.action}
          <Toast.ToastClose />
        </Toast.Toast>
      ))}
      <Toast.ToastViewport />
    </Toast.ToastProvider>
  )
}

export { useToast, Toaster, toast }