'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { MainLayout } from '@/components/layout/main-layout'
import { OrderService, CustomerService, ProductService } from '@/lib/api'
import type { CreateOrderRequest, CustomerDtoResponse, ProductDtoResponse, OrderItemDtoRequest } from '@/types/api'
import { ArrowLeft, Save, Loader2, Plus, Trash2, Search, DollarSign, Package, User } from 'lucide-react'

// Schema de validação FirstLabel específico
const orderItemSchema = z.object({
  productId: z.number().min(1, 'Produto é obrigatório'),
  quantity: z.number().min(1, 'Quantidade deve ser maior que 0'),
  total: z.number().min(0, 'Total deve ser maior ou igual a 0')
})

const orderSchema = z.object({
  customerId: z.number().min(1, 'Cliente é obrigatório'),
  accountId: z.number().min(1, 'Conta é obrigatória'),
  status: z.number().default(0), // Orçamento por padrão
  orderNumber: z.number(),
  total: z.number().min(0, 'Total deve ser maior ou igual a 0'),
  discount: z.number().min(0, 'Desconto deve ser maior ou igual a 0').default(0),
  observation: z.string().optional(),
  paymentCondition: z.string().optional(),
  seller: z.string().optional(),
  freight: z.number().min(0, 'Frete deve ser maior ou igual a 0').default(0),
  fob: z.boolean().default(false),
  deliveryDeadline: z.string().optional(),
  deliveryDate: z.string().optional(),
  items: z.array(orderItemSchema).min(1, 'Pelo menos um item é obrigatório')
})

type OrderFormData = z.infer<typeof orderSchema>

export default function CreateOrderPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [customers, setCustomers] = useState<CustomerDtoResponse[]>([])
  const [products, setProducts] = useState<ProductDtoResponse[]>([])
  const [customerSearch, setCustomerSearch] = useState('')
  const [productSearch, setProductSearch] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch,
    setValue,
    control
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderSchema),
    mode: 'onChange',
    defaultValues: {
      status: 0, // Orçamento
      discount: 0,
      freight: 0,
      fob: false,
      items: [{ productId: 0, quantity: 1, total: 0 }]
      // Removido orderNumber dos defaultValues para não preencher automaticamente
    }
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items'
  })

  const watchItems = watch('items')
  const watchDiscount = watch('discount')
  const watchFreight = watch('freight')

  // Buscar clientes e produtos
  useEffect(() => {
    fetchCustomers()
    fetchProducts()
    generateOrderNumber()
  }, [])

  const fetchCustomers = async () => {
    try {
      const response = await CustomerService.list({ pageSize: 100 })
      setCustomers(response.data || [])
    } catch (err) {
      console.error('Erro ao buscar clientes:', err)
    }
  }

  const fetchProducts = async () => {
    try {
      const response = await ProductService.list({ pageSize: 100 })
      setProducts(response.data || [])
    } catch (err) {
      console.error('Erro ao buscar produtos:', err)
    }
  }

  const generateOrderNumber = async () => {
    try {
      const orderNumber = await OrderService.getNextOrderNumber()
      setValue('orderNumber', orderNumber)
    } catch (err) {
      console.error('Erro ao gerar número do pedido:', err)
    }
  }

  // Calcular total automaticamente
  useEffect(() => {
    const subtotal = watchItems.reduce((sum, item) => {
      return sum + (item.quantity * item.total)
    }, 0)
    const total = subtotal + watchFreight - watchDiscount
    setValue('total', Math.max(0, total))
  }, [watchItems, watchDiscount, watchFreight, setValue])

  const onSubmit = async (data: OrderFormData) => {
    try {
      setLoading(true)
      setError(null)

      const request: CreateOrderRequest = {
        customerId: data.customerId,
        accountId: 1, // Default account - pode ser ajustado
        status: data.status,
        orderNumber: data.orderNumber,
        total: data.total,
        discount: data.discount,
        observation: data.observation || undefined,
        paymentCondition: data.paymentCondition || undefined,
        seller: data.seller || undefined,
        freight: data.freight,
        fob: data.fob,
        deliveryDeadline: data.deliveryDeadline || undefined,
        deliveryDate: data.deliveryDate || undefined,
        items: data.items as OrderItemDtoRequest[]
      }

      const createdOrder = await OrderService.create(request)
      router.push(`/orders/${createdOrder.id}`)
    } catch (err: any) {
      setError(err.error || 'Erro ao criar pedido')
      console.error('Erro ao criar pedido:', err)
    } finally {
      setLoading(false)
    }
  }

  const addItem = () => {
    append({ productId: 0, quantity: 1, total: 0 })
  }

  const removeItem = (index: number) => {
    if (fields.length > 1) {
      remove(index)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const filteredCustomers = customers.filter(customer => {
    if (!customerSearch) return true
    const searchLower = customerSearch.toLowerCase()
    return (
      customer.corporateName?.toLowerCase().includes(searchLower) ||
      customer.tradeName?.toLowerCase().includes(searchLower) ||
      customer.cnpj?.includes(customerSearch) ||
      customer.email?.toLowerCase().includes(searchLower)
    )
  })

  const filteredProducts = products.filter(product =>
    product.description?.toLowerCase().includes(productSearch.toLowerCase())
  )

  return (
    <MainLayout>
      <div className="p-4 lg:p-6">
        <div className="mb-6">
          <div className="flex items-center gap-4 mb-4">
            <Button
              variant="outline"
              onClick={() => router.push('/orders')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Novo Pedido</h1>
              <p className="text-gray-600 mt-1">Crie um novo pedido para a gráfica FirstLabel</p>
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
                <User className="h-5 w-5" />
                Informações do Pedido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Cliente */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cliente *
                  </label>
                  <div className="space-y-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Buscar cliente..."
                        value={customerSearch}
                        onChange={(e) => setCustomerSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                      />
                    </div>
                    <select
                      {...register('customerId', { valueAsNumber: true })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Selecione um cliente</option>
                      {filteredCustomers.map((customer) => (
                        <option key={customer.id} value={customer.id}>
                          {customer.corporateName} {customer.cnpj && `- ${customer.cnpj}`}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.customerId && (
                    <p className="mt-1 text-sm text-red-600">{errors.customerId.message}</p>
                  )}
                </div>

                {/* Número do Pedido */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número do Pedido *
                  </label>
                  <Input
                    {...register('orderNumber', { valueAsNumber: true })}
                    type="number"
                    placeholder="Número automático"
                    error={errors.orderNumber?.message}
                    readOnly
                  />
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
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Condição de Pagamento
                  </label>
                  <Input
                    {...register('paymentCondition')}
                    placeholder="Ex: 30/60/90 dias, À vista, etc."
                    error={errors.paymentCondition?.message}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Itens do Pedido */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Itens do Pedido
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium">Item {index + 1}</h4>
                      {fields.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeItem(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Produto */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Produto *
                        </label>
                        <select
                          {...register(`items.${index}.productId`, { valueAsNumber: true })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                          <option value="">Selecione um produto</option>
                          {filteredProducts.map((product) => (
                            <option key={product.id} value={product.id}>
                              {product.description}
                            </option>
                          ))}
                        </select>
                        {errors.items?.[index]?.productId && (
                          <p className="mt-1 text-sm text-red-600">
                            {errors.items[index]?.productId?.message}
                          </p>
                        )}
                      </div>

                      {/* Quantidade */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Quantidade *
                        </label>
                        <Input
                          {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                          type="number"
                          min="1"
                          placeholder="1"
                          error={errors.items?.[index]?.quantity?.message}
                        />
                      </div>

                      {/* Valor Unitário */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Valor Unitário *
                        </label>
                        <Input
                          {...register(`items.${index}.total`, { valueAsNumber: true })}
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0,00"
                          error={errors.items?.[index]?.total?.message}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={addItem}
                  className="w-full flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Adicionar Item
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Totais e Observações */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Valores e Observações
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Frete */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Frete
                  </label>
                  <Input
                    {...register('freight', { valueAsNumber: true })}
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0,00"
                    error={errors.freight?.message}
                  />
                </div>

                {/* Desconto */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Desconto
                  </label>
                  <Input
                    {...register('discount', { valueAsNumber: true })}
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0,00"
                    error={errors.discount?.message}
                  />
                </div>

                {/* FOB */}
                <div className="md:col-span-2">
                  <label className="flex items-center space-x-2">
                    <input
                      {...register('fob')}
                      type="checkbox"
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-medium text-gray-700">FOB (Frete por conta do cliente)</span>
                  </label>
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

                {/* Resumo do Total */}
                <div className="md:col-span-2 bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Resumo do Pedido</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subtotal:</span>
                      <span>{formatCurrency(watchItems.reduce((sum, item) => sum + (item.quantity * item.total), 0))}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Frete:</span>
                      <span>{formatCurrency(watchFreight || 0)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Desconto:</span>
                      <span>-{formatCurrency(watchDiscount || 0)}</span>
                    </div>
                    <div className="border-t pt-2 flex justify-between font-medium">
                      <span>Total:</span>
                      <span className="text-green-600">{formatCurrency(watch('total') || 0)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Botões */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/orders')}
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
              {loading ? 'Salvando...' : 'Criar Pedido'}
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  )
}