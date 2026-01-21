

import axios from "axios"

export const API_URL = "http://localhost:8080"

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add request interceptor to handle authentication
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('jwt')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response
      if (status === 400) {
        return Promise.reject(new Error(data?.message || 'Bad Request'))
      }
      if (status === 401) {
        localStorage.removeItem('jwt')
        return Promise.reject(new Error('Unauthorized access'))
      }
    }
    return Promise.reject(error)
  }
)