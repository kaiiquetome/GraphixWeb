'use client'

import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { AuthContextType, AuthState, User } from '@/types/auth'
import { AuthService } from '@/lib/api/auth'

const initialState: AuthState = {
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: true,
}

type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string; refreshToken: string } }
  | { type: 'LOGOUT' }
  | { type: 'SET_USER'; payload: User }

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload }
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        refreshToken: action.payload.refreshToken,
        isAuthenticated: true,
        isLoading: false,
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
      }
    case 'SET_USER':
      return { ...state, user: action.payload }
    default:
      return state
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = AuthService.getToken()
        const refreshToken = AuthService.getRefreshToken()
        const userStr = localStorage.getItem('user')

        if (token && userStr) {
          try {
            const user = JSON.parse(userStr)
            // Restaurar sessão com os dados salvos
            dispatch({ 
              type: 'LOGIN_SUCCESS', 
              payload: { user, token, refreshToken: refreshToken || '' } 
            })
          } catch (parseError) {
            console.error('Erro ao parsear dados do usuário:', parseError)
            AuthService.clearTokens()
            dispatch({ type: 'LOGOUT' })
          }
        } else {
          dispatch({ type: 'SET_LOADING', payload: false })
        }
      } catch (error) {
        console.error('Erro na inicialização da autenticação:', error)
        AuthService.clearTokens()
        dispatch({ type: 'LOGOUT' })
      }
    }

    // Garantir que só execute no cliente
    if (typeof window !== 'undefined') {
      initializeAuth()
    } else {
      dispatch({ type: 'SET_LOADING', payload: false })
    }
  }, [])

  const login = async (userName: string, password: string) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true })
      const response = await AuthService.login({ userName, password })
      
      AuthService.setTokens(response.jwtToken, response.refreshToken)
      localStorage.setItem('user', JSON.stringify(response.user))
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: response.user,
          token: response.jwtToken,
          refreshToken: response.refreshToken,
        },
      })
    } catch (error) {
      dispatch({ type: 'LOGOUT' })
      throw error
    }
  }

  const logout = () => {
    AuthService.clearTokens()
    dispatch({ type: 'LOGOUT' })
  }

  const refreshAuth = async () => {
    const refreshToken = AuthService.getRefreshToken()
    if (!refreshToken) {
      logout()
      return
    }

    try {
      const response = await AuthService.refreshToken({
        jwtToken: state.token || '',
        refreshToken,
      })
      
      AuthService.setTokens(response.jwtToken, response.refreshToken)
      localStorage.setItem('user', JSON.stringify(response.user))
      
      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: {
          user: response.user,
          token: response.jwtToken,
          refreshToken: response.refreshToken,
        },
      })
    } catch (error) {
      logout()
    }
  }

  const value: AuthContextType = {
    ...state,
    login,
    logout,
    refreshAuth,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 