'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { MainLayout } from '@/components/layout/main-layout'
import { CustomerService } from '@/lib/api'
import type { CustomerDtoResponse, UpdateCustomerRequest } from '@/types/api'
import { ArrowLeft, Save, Loader2, Eye } from 'lucide-react'

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

export default function EditCustomerPage() {
  const router = useRouter()
  const params = useParams()
  const customerId = parseInt(params.id as string)
  
  const [customer, setCustomer] = useState<CustomerDtoResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isDirty },
    reset,
    setValue
  } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
    mode: 'onChange'
  })

  useEffect(() => {
    if (customerId) {
      fetchCustomer()
    }
  }, [customerId])

  const fetchCustomer = async () => {
    try {
      setInitialLoading(true)
      setError(null)
      const response = await CustomerService.getById(customerId)
      setCustomer(response)
      
      // Preencher formulário com dados existentes
      setValue('corporateName', response.corporateName || '')
      setValue('cnpj', response.cnpj || '')
      setValue('ie', response.ie || '')
      setValue('contact', response.contact || '')
      setValue('phone', response.phone || '')
      setValue('email', response.email || '')
    } catch (err: any) {
      setError(err.error || 'Erro ao carregar cliente')
      console.error('Erro ao buscar cliente:', err)
    } finally {
      setInitialLoading(false)
    }
  }

  const onSubmit = async (data: CustomerFormData) => {
    try {
      setLoading(true)
      setError(null)

      const request: UpdateCustomerRequest = {
        id: customerId,
        corporateName: data.corporateName,
        cnpj: data.cnpj || undefined,
        ie: data.ie || undefined,
        contact: data.contact || undefined,
        phone: data.phone || undefined,
        email: data.email || undefined
      }

      await CustomerService.update(request)
      router.push(`/customers/${customerId}`)
    } catch (err: any) {
      setError(err.error || 'Erro ao atualizar cliente')
      console.error('Erro ao atualizar cliente:', err)
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

  if (initialLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </MainLayout>
    )
  }

  if (error && !customer) {
    return (
      <MainLayout>
        <div className="p-4 lg:p-6">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Cliente não encontrado
            </h3>
            <p className="text-gray-600 mb-4">
              O cliente solicitado não foi encontrado ou foi removido.
            </p>
            <Button onClick={() => router.push('/customers')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Clientes
            </Button>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="p-4 lg:p-6">
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              onClick={() => router.push(`/customers/${customerId}`)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                Editar Cliente
              </h1>
              <p className="text-gray-600 mt-1">
                {customer?.corporateName || `Cliente #${customerId}`}
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push(`/customers/${customerId}`)}
              className="flex items-center gap-2"
            >
              <Eye className="h-4 w-4" />
              Visualizar
            </Button>
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
                  onClick={() => router.push(`/customers/${customerId}`)}
                  className="flex items-center gap-2"
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (customer) {
                      setValue('corporateName', customer.corporateName || '')
                      setValue('cnpj', customer.cnpj || '')
                      setValue('ie', customer.ie || '')
                      setValue('contact', customer.contact || '')
                      setValue('phone', customer.phone || '')
                      setValue('email', customer.email || '')
                    }
                  }}
                  disabled={loading}
                >
                  Restaurar Dados Originais
                </Button>
                <Button
                  type="submit"
                  disabled={loading || !isValid || !isDirty}
                  className="flex items-center gap-2"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  {loading ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </div>

              {!isDirty && (
                <div className="text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-md p-3">
                  💡 Faça alterações nos campos acima para habilitar o botão de salvar
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}