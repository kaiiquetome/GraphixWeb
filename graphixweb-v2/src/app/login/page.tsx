'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/providers/auth-provider'
import { LoginForm } from '@/components/forms/login-form'
import { APP_CONFIG } from '@/lib/utils/constants'

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push('/home')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">

          <h1 className="text-3xl font-bold text-secondary-900 mb-2">
            {APP_CONFIG.name}
          </h1>
          <p className="text-secondary-600">{APP_CONFIG.description}</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
                      <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-secondary-900">
                Entrar no Sistema
              </h2>
              <p className="text-secondary-600 mt-2">
                Digite suas credenciais para acessar
              </p>
            </div>

          <LoginForm />
        </div>
      </div>
    </div>
  )
} 