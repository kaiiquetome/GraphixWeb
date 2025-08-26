'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { MainLayout } from '@/components/layout/main-layout'
import { CustomerService } from '@/lib/api'
import type { CreateCustomerRequest } from '@/types/api'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'

// Schema de validação
const customerSchema = z.object({
  corporateName: z.string().min(1, 'Razão social é obrigatória'),
  cnpj: z.string().optional(),
  ie: z.string().optional(),
  contact: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email('Email inválido').optional().or(z.literal(''))
})

type CustomerFormData = z.infer<typeof customerSchema>

export default function CreateCustomerPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    mode: 'onChange'
  })

  const onSubmit = async (data: CustomerFormData) => {
    try {
      setLoading(true)
      setError(null)

      const request: CreateCustomerRequest = {
        corporateName: data.corporateName,
        cnpj: data.cnpj || undefined,
        ie: data.ie || undefined,
        contact: data.contact || undefined,
        phone: data.phone || undefined,
        email: data.email || undefined
      }

      await CustomerService.create(request)
      router.push('/customers')
    } catch (err: any) {
      setError(err.error || 'Erro ao criar cliente')
      console.error('Erro ao criar cliente:', err)
    } finally {
      setLoading(false)
    }
  }

  // Função para formatar CNPJ
  const formatCNPJ = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    return numbers.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')
  }

  // Função para formatar telefone
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 10) {
      return numbers.replace(/^(\d{2})(\d{4})(\d{4})$/, '($1) $2-$3')
    } else {
      return numbers.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3')
    }
  }

  return (
    <MainLayout>
      <div className="p-4 lg:p-6">
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              onClick={() => router.push('/customers')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Novo Cliente</h1>
              <p className="text-gray-600 mt-1">Cadastre um novo cliente no sistema</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Informações do Cliente</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Razão Social */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Razão Social *
                  </label>
                  <Input
                    {...register('corporateName')}
                    placeholder="Digite a razão social da empresa"
                    error={errors.corporateName?.message}
                  />
                </div>

                {/* CNPJ */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CNPJ
                  </label>
                  <Input
                    {...register('cnpj')}
                    placeholder="00.000.000/0000-00"
                    onChange={(e) => {
                      const formatted = formatCNPJ(e.target.value)
                      e.target.value = formatted
                    }}
                    error={errors.cnpj?.message}
                  />
                </div>

                {/* Inscrição Estadual */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Inscrição Estadual
                  </label>
                  <Input
                    {...register('ie')}
                    placeholder="Digite a inscrição estadual"
                    error={errors.ie?.message}
                  />
                </div>

                {/* Nome do Contato */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do Contato
                  </label>
                  <Input
                    {...register('contact')}
                    placeholder="Digite o nome do contato principal"
                    error={errors.contact?.message}
                  />
                </div>

                {/* Telefone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefone
                  </label>
                  <Input
                    {...register('phone')}
                    placeholder="(00) 00000-0000"
                    onChange={(e) => {
                      const formatted = formatPhone(e.target.value)
                      e.target.value = formatted
                    }}
                    error={errors.phone?.message}
                  />
                </div>

                {/* Email */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <Input
                    {...register('email')}
                    type="email"
                    placeholder="contato@empresa.com"
                    error={errors.email?.message}
                  />
                </div>
              </div>

              {/* Botões */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/customers')}
                  className="flex items-center gap-2"
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => reset()}
                  disabled={loading}
                >
                  Limpar Formulário
                </Button>
                <Button
                  type="submit"
                  disabled={loading || !isValid}
                  className="flex items-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {loading ? 'Salvando...' : 'Salvar Cliente'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}