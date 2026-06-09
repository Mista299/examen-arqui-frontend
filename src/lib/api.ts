import axios from "axios"

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "Ocurrió un error inesperado"
    return Promise.reject(new Error(message))
  }
)