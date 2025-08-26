'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { MainLayout } from '@/components/layout/main-layout'
import { OrderService, CustomerService, ProductService } from '@/lib/api'
import type { UpdateOrderRequest, OrderDtoResponse, CustomerDtoResponse, ProductDtoResponse } from '@/types/api'
import { ArrowLeft, Save, Loader2, User } from 'lucide-react'

// Schema básico para edição
const orderEditSchema = z.object({
  customerId: z.number().min(1, 'Cliente é obrigatório'),
  seller: z.string().optional(),
  paymentCondition: z.string().optional(),
  deliveryDeadline: z.string().optional(),
  observation: z.string().optional()
})

type OrderEditFormData = z.infer<typeof orderEditSchema>

export default function EditOrderPage() {
  const router = useRouter()
  const params = useParams()
  const orderId = parseInt(params.id as string)
  
  const [order, setOrder] = useState<OrderDtoResponse | null>(null)
  const [customers, setCustomers] = useState<CustomerDtoResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [saveLoading, setSaveLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset
  } = useForm<OrderEditFormData>({
    resolver: zodResolver(orderEditSchema),
    mode: 'onChange'
  })

  useEffect(() => {
    if (orderId) {
      fetchOrderAndData()
    }
  }, [orderId])

  const fetchOrderAndData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [orderResponse, customersResponse] = await Promise.all([
        OrderService.getById(orderId),
        CustomerService.list({ pageSize: 100 })
      ])
      
      setOrder(orderResponse)
      setCustomers(customersResponse.data || [])
      
      // Preencher formulário com dados existentes
      reset({
        customerId: orderResponse.customerId,
        seller: orderResponse.seller || '',
        paymentCondition: orderResponse.paymentCondition || '',
        deliveryDeadline: orderResponse.deliveryDeadline || '',
        observation: orderResponse.observation || ''
      })
    } catch (err: any) {
      setError(err.error || 'Erro ao carregar dados')
      console.error('Erro ao buscar dados:', err)
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (data: OrderEditFormData) => {
    if (!order) return

    try {
      setSaveLoading(true)
      setError(null)

      const request: UpdateOrderRequest = {
        customerId: data.customerId,
        accountId: order.accountId,
        status: order.status,
        orderNumber: order.orderNumber,
        total: order.total,
        discount: order.discount,
        seller: data.seller || undefined,
        paymentCondition: data.paymentCondition || undefined,
        deliveryDeadline: data.deliveryDeadline || undefined,
        observation: data.observation || undefined,
        freight: order.freight,
        fob: order.fob,
        deliveryDate: order.deliveryDate,
        items: order.items || []
      }

      await OrderService.update(orderId, request)
      router.push(`/orders/${orderId}`)
    } catch (err: any) {
      setError(err.error || 'Erro ao salvar pedido')
      console.error('Erro ao atualizar pedido:', err)
    } finally {
      setSaveLoading(false)
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </MainLayout>
    )
  }

  if (error && !order) {
    return (
      <MainLayout>
        <div className="p-4 lg:p-6">
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">Erro ao carregar pedido</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={() => router.push('/orders')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Pedidos
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
              onClick={() => router.push(`/orders/${orderId}`)}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                Editar Pedido #{order?.orderNumber}
              </h1>
              <p className="text-gray-600 mt-1">Modificar informações do pedido FirstLabel</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Cliente */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cliente *
                  </label>
                  <select
                    {...register('customerId', { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Selecione um cliente</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.corporateName} {customer.cnpj && `- ${customer.cnpj}`}
                      </option>
                    ))}
                  </select>
                  {errors.customerId && (
                    <p className="mt-1 text-sm text-red-600">{errors.customerId.message}</p>
                  )}
                </div>

                {/* Vendedor */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vendedor
                  </label>
                  <Input
                    {...register('seller')}
                    placeholder="Nome do vendedor"
                    error={errors.seller?.message}
                  />
                </div>

                {/* Prazo de Entrega */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prazo de Entrega
                  </label>
                  <Input
                    {...register('deliveryDeadline')}
                    type="date"
                    error={errors.deliveryDeadline?.message}
                  />
                </div>

                {/* Condição de Pagamento */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Condição de Pagamento
                  </label>
                  <Input
                    {...register('paymentCondition')}
                    placeholder="Ex: 30/60/90 dias, À vista, etc."
                    error={errors.paymentCondition?.message}
                  />
                </div>

                {/* Observações */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Observações
                  </label>
                  <textarea
                    {...register('observation')}
                    placeholder="Informações adicionais sobre o pedido..."
                    rows={4}
                    className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  {errors.observation && (
                    <p className="mt-1 text-sm text-red-600">{errors.observation.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botões */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(`/orders/${orderId}`)}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={saveLoading || !isValid}
              className="flex items-center gap-2"
            >
              {saveLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {saveLoading ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  )
}