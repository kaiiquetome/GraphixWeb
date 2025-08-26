import { apiClient } from './client'
import { LoginRequest, LoginResponse, RefreshTokenRequest } from '@/types/api'

export class AuthService {
  static async login(credentials: LoginRequest): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>('/auth/login', credentials)
  }

  static async register(userData: any): Promise<void> {
    return apiClient.post('/auth/register', userData)
  }

  static async refreshToken(refreshData: RefreshTokenRequest): Promise<LoginResponse> {
    return apiClient.post<LoginResponse>('/auth/refresh-token', refreshData)
  }

  static setTokens(token: string, refreshToken: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('jwtToken', token)
      localStorage.setItem('refresh_token', refreshToken)
    }
  }

  static getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('jwtToken')
    }
    return null
  }

  static getRefreshToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('refresh_token')
    }
    return null
  }

  static clearTokens(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('jwtToken')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user')
    }
  }

  static isAuthenticated(): boolean {
    return !!this.getToken()
  }
} 