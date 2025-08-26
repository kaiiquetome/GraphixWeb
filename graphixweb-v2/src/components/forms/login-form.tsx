'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { loginSchema, LoginFormData } from '@/lib/utils/validation'
import { useAuth } from '@/providers/auth-provider'
import { CustomErrorModel } from '@/types/api'
import { AlertCircle, X } from 'lucide-react'

export function LoginForm() {
  const [error, setError] = useState<string>('')
  const { login } = useAuth()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    console.log('Dados do formulário:', data)
    console.log('Erros do formulário:', errors)
    try {
      setError('')
      await login(data.userName, data.password)
      router.push('/home')
    } catch (err: any) {
      const errorData = err as CustomErrorModel
      const errorMessage = errorData.detail || errorData.error || 'Erro ao fazer login'
      setError(errorMessage)
      
      // Mostrar alerta nativo também
      alert(`Erro no Login: ${errorMessage}`)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <Input
          label="Nome de Usuário"
          type="text"
          placeholder="Digite seu nome de usuário"
          error={errors.userName?.message}
          {...register('userName')}
        />

        <Input
          label="Senha"
          type="password"
          placeholder="Digite sua senha"
          error={errors.password?.message}
          {...register('password')}
        />
      </div>

      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 p-4">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-red-800">Erro no Login</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
            <button
              type="button"
              onClick={() => setError('')}
              className="text-red-400 hover:text-red-600"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <Button
        type="submit"
        className="w-full"
        loading={isSubmitting}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Entrando...' : 'Entrar'}
      </Button>
    </form>
  )
} 