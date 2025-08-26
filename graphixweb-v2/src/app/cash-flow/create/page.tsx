'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { MainLayout } from '@/components/layout/main-layout'
import { CashFlowService, OrderService } from '@/lib/api'
import type { CreateCashFlowRequest, OrderDtoResponse } from '@/types/api'
import { ArrowLeft, Save, Loader2, DollarSign, Calendar } from 'lucide-react'

// Schema de validação
const cashFlowSchema = z.object({
  orderId: z.number().optional(),
  installmentNumber: z.number().min(1, 'Número da parcela deve ser maior que 0').optional(),
  description: z.string().min(1, 'Descrição é obrigatória'),
  type: z.number().min(0).max(1), // 0 = Entrada, 1 = Saída
  category: z.number().min(0).max(4), // 0-4 conforme enum
  expectedDateReceive: z.string().min(1, 'Data prevista é obrigatória'),
  expectedValueReceive: z.number().min(0.01, 'Valor deve ser maior que zero'),
  valueReceive: z.number().optional(),
  dateReceive: z.string().optional()
})

type CashFlowFormData = z.infer<typeof cashFlowSchema>

export default function CreateCashFlowPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [orders, setOrders] = useState<OrderDtoResponse[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue
  } = useForm<CashFlowFormData>({
    resolver: zodResolver(cashFlowSchema),
    mode: 'onChange',
    defaultValues: {
      type: 0, // Entrada por padrão
      category: 0, // Vendas por padrão
      installmentNumber: 1
    }
  })

  const watchType = watch('type')
  const watchValueReceive = watch('valueReceive')
  const watchDateReceive = watch('dateReceive')

  // Buscar pedidos para vincular
  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await OrderService.list({ pageSize: 100 })
      setOrders(response.data || [])
    } catch (err) {
      console.error('Erro ao buscar pedidos:', err)
    }
  }

  const onSubmit = async (data: CashFlowFormData) => {
    try {
      setLoading(true)
      setError(null)

      const createData: CreateCashFlowRequest = {
        id: 0,
        orderId: data.orderId || null,
        installmentNumber: data.installmentNumber || null,
        description: data.description,
        type: data.type,
        category: data.category,
        expectedDateReceive: new Date(data.expectedDateReceive).toISOString(),
        expectedValueReceive: data.expectedValueReceive,
        valueReceive: data.valueReceive || null,
        dateReceive: data.dateReceive ? new Date(data.dateReceive).toISOString() : null,
        createdAt: new Date().toISOString()
      }

      await CashFlowService.create(createData)
      router.push('/cash-flow')
    } catch (err: any) {
      setError(err.error || 'Erro ao criar registro')
      console.error('Erro ao criar registro:', err)
    } finally {
      setLoading(false)
    }
  }

  const getTypeOptions = () => [
    { value: 0, label: 'Entrada' },
    { value: 1, label: 'Saída' }
  ]

  const getCategoryOptions = () => [
    { value: 0, label: 'Vendas' },
    { value: 1, label: 'Serviços' },
    { value: 2, label: 'Despesas Operacionais' },
    { value: 3, label: 'Investimentos' },
    { value: 4, label: 'Outros' }
  ]

  return (
    <MainLayout>
      <div className="p-4 lg:p-6">
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              onClick={() => router.push('/cash-flow')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Novo Registro</h1>
              <p className="text-gray-600 mt-1">Criar um novo registro no fluxo de caixa</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Informações do Registro
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Tipo */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo *
                  </label>
                  <select
                    {...register('type', { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {getTypeOptions().map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.type && (
                    <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
                  )}
                </div>

                {/* Categoria */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categoria *
                  </label>
                  <select
                    {...register('category', { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    {getCategoryOptions().map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.category && (
                    <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                  )}
                </div>

                {/* Descrição */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição *
                  </label>
                  <Input
                    {...register('description')}
                    placeholder="Descrição do registro"
                    error={errors.description?.message}
                  />
                </div>

                {/* Pedido Vinculado */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pedido Vinculado
                  </label>
                  <select
                    {...register('orderId', { valueAsNumber: true })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="">Selecionar pedido (opcional)</option>
                    {orders.map((order) => (
                      <option key={order.id} value={order.id}>
                        Pedido #{order.orderNumber} - {order.customer?.corporateName}
                      </option>
                    ))}
                  </select>
                  {errors.orderId && (
                    <p className="mt-1 text-sm text-red-600">{errors.orderId.message}</p>
                  )}
                </div>

                {/* Número da Parcela */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número da Parcela
                  </label>
                  <Input
                    {...register('installmentNumber', { valueAsNumber: true })}
                    type="number"
                    min="1"
                    placeholder="1"
                    error={errors.installmentNumber?.message}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Valores e Datas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Valores e Datas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Data Prevista */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data Prevista *
                  </label>
                  <Input
                    {...register('expectedDateReceive')}
                    type="date"
                    error={errors.expectedDateReceive?.message}
                  />
                </div>

                {/* Valor Previsto */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valor Previsto *
                  </label>
                  <Input
                    {...register('expectedValueReceive', { valueAsNumber: true })}
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0,00"
                    error={errors.expectedValueReceive?.message}
                  />
                </div>

                {/* Data Realizada */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Data Realizada
                  </label>
                  <Input
                    {...register('dateReceive')}
                    type="date"
                    error={errors.dateReceive?.message}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Preencha apenas se o valor já foi recebido/pago
                  </p>
                </div>

                {/* Valor Realizado */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Valor Realizado
                  </label>
                  <Input
                    {...register('valueReceive', { valueAsNumber: true })}
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0,00"
                    error={errors.valueReceive?.message}
                    disabled={!watchDateReceive}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Disponível apenas com data realizada preenchida
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ações */}
          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/cash-flow')}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!isValid || loading}
              className="flex-1 flex items-center gap-2"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {loading ? 'Salvando...' : 'Salvar Registro'}
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  )
}