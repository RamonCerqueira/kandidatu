import axios, { AxiosError } from 'axios'

export const API_URL: string = import.meta.env.VITE_API_URL ?? 'http://localhost:8080/api'
export const TOKEN_KEY = 'kandidatu.token'

export const api = axios.create({ baseURL: API_URL, timeout: 15000 })

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY)
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (r) => r,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY)
      window.dispatchEvent(new Event('session-expired'))
    }
    return Promise.reject(error)
  },
)

