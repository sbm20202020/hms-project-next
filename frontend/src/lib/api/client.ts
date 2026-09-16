import axios from 'axios'
import type { Session } from 'next-auth'

const api = axios.create({
  baseURL: '/api',
  timeout: 20_000,
  headers: { 'Content-Type': 'application/json' },
})

// Attach Django JWT from the next-auth session
api.interceptors.request.use(async (config) => {
  try {
    const { getSession } = await import('next-auth/react')
    const session = (await getSession()) as (Session & { djangoAccessToken?: string }) | null
    if (session?.djangoAccessToken) {
      config.headers.Authorization = `Bearer ${session.djangoAccessToken}`
    }
  } catch {
    // next-auth not available – skip
  }
  return config
})

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      return Promise.reject(new Error('Requête annulée : délai dépassé'))
    }
    return Promise.reject(error)
  },
)

export default api
