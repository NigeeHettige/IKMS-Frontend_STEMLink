import axios from 'axios'
import { exceptionHandler } from "../core/exceptionHandler"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE

// Create public instance
export const axiosPublicInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
})

// Response interceptor for error handling
axiosPublicInstance.interceptors.response.use(
  (response) => response,
  async (error) => Promise.reject(await exceptionHandler(error.response))
)

export * from "./file.service"
export * from "./answering.service"