export interface User {
  id: number
  name: string
  login: string
  profile: number
}

export interface AuthState {
  user: User | null
  token: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface AuthContextType extends AuthState {
  login: (userName: string, password: string) => Promise<void>
  logout: () => void
  refreshAuth: () => Promise<void>
} 