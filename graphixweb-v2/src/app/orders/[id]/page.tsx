'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MainLayout } from '@/components/layout/main-layout'
import { OrderService } from '@/lib/api'
import type { OrderDtoResponse, OrderStatus } from '@/types/api'
import { getOrderStatusText, getOrderStatusColor } from '@/types/api'
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Loader2,
  ShoppingCart,
  User,
  Building2,
  Calendar,
  DollarSign,
  FileText,
  Download,
  Printer,
  Package,
  Truck,
  CreditCard,
  Phone,
  Mail
} from 'lucide-react'
import { StatusWorkflow } from '@/components/ui/status-workflow'

export default function OrderDetailPage() {
  const router = useRouter()
  const params = useParams()
  const orderId = parseInt(params.id as string)
  
  const [order, setOrder] = useState<OrderDtoResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (orderId) {
      fetchOrder()
    }
  }, [orderId])

  const fetchOrder = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await OrderService.getById(orderId)
      setOrder(response)
    } catch (err: any) {
      setError(err.error || 'Erro ao carregar pedido')
      console.error('Erro ao buscar pedido:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir este pedido? Esta ação não pode ser desfeita.')) {
      return
    }

    try {
      setActionLoading(true)
      await OrderService.delete(orderId)
      router.push('/orders')
    } catch (err: any) {
      setError(err.error || 'Erro ao excluir pedido')
      console.error('Erro ao excluir pedido:', err)
    } finally {
      setActionLoading(false)
    }
  }

  const handleStatusChange = async (newStatus: OrderStatus) => {
    try {
      setActionLoading(true)
      const updatedOrder = await OrderService.updateStatus(orderId, newStatus)
      setOrder(updatedOrder)
    } catch (err: any) {
      setError(err.error || 'Erro ao alterar status')
      console.error('Erro ao alterar status:', err)
    } finally {
      setActionLoading(false)
    }
  }

  const handleGenerateOrcamento = async () => {
    try {
      setActionLoading(true)
      const blob = await OrderService.generateOrcamento(orderId)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `orcamento-${order?.orderNumber}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err: any) {
      setError(err.error || 'Erro ao gerar orçamento')
      console.error('Erro ao gerar orçamento:', err)
    } finally {
      setActionLoading(false)
    }
  }

  const handleGenerateOS = async () => {
    try {
      setActionLoading(true)
      const blob = await OrderService.generateOrdemServico(orderId)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `ordem-servico-${order?.orderNumber}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err: any) {
      setError(err.error || 'Erro ao gerar ordem de serviço')
      console.error('Erro ao gerar ordem de serviço:', err)
    } finally {
      setActionLoading(false)
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
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

  if (error || !order) {
    return (
      <MainLayout>
        <div className="p-4 lg:p-6">
          <div className="text-center py-12">
            <ShoppingCart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {error || 'Pedido não encontrado'}
            </h3>
            <p className="text-gray-600 mb-4">
              {error || 'O pedido solicitado não foi encontrado ou foi removido.'}
            </p>
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
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => router.push('/orders')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  Pedido #{order.orderNumber}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ${getOrderStatusColor(order.status)}`}>
                    {getOrderStatusText(order.status)}
                  </span>
                  <span className="text-gray-600 text-sm">
                    Criado em {formatDate(order.createdAt)}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => router.push(`/orders/${order.id}/edit`)}
                className="flex items-center gap-2"
                disabled={actionLoading}
              >
                <Edit className="h-4 w-4" />
                Editar
              </Button>
              <Button
                variant="outline"
                onClick={handleDelete}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                disabled={actionLoading}
              >
                <Trash2 className="h-4 w-4" />
                Excluir
              </Button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Informações do Cliente */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Informações do Cliente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cliente
                    </label>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-gray-400" />
                      <p className="text-gray-900 font-medium">
                        {order.customer?.corporateName || `Cliente #${order.customerId}`}
                      </p>
                    </div>
                  </div>

                  {order.customer?.cnpj && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        CNPJ
                      </label>
                      <p className="text-gray-900">{order.customer.cnpj}</p>
                    </div>
                  )}

                  {order.customer?.contact && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contato
                      </label>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-400" />
                        <p className="text-gray-900">{order.customer.contact}</p>
                      </div>
                    </div>
                  )}

                  {order.customer?.phone && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Telefone
                      </label>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <p className="text-gray-900">{order.customer.phone}</p>
                      </div>
                    </div>
                  )}

                  {order.customer?.email && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <p className="text-gray-900">{order.customer.email}</p>
                      </div>
                    </div>
                  )}
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
                {order.items && order.items.length > 0 ? (
                  <div className="space-y-4">
                    {order.items.map((item, index) => (
                      <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">
                              {item.product?.description || `Produto #${item.productId}`}
                            </h4>
                            <div className="mt-2 grid grid-cols-3 gap-4 text-sm">
                              <div>
                                <span className="text-gray-600">Quantidade:</span>
                                <p className="font-medium">{item.quantity}</p>
                              </div>
                              <div>
                                <span className="text-gray-600">Valor Unit.:</span>
                                <p className="font-medium">{formatCurrency(item.total)}</p>
                              </div>
                              <div>
                                <span className="text-gray-600">Total:</span>
                                <p className="font-medium text-green-600">
                                  {formatCurrency(item.quantity * item.total)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-4">Nenhum item cadastrado</p>
                )}
              </CardContent>
            </Card>

            {/* Observações */}
            {order.observation && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Observações
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 whitespace-pre-wrap">{order.observation}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Informações Laterais */}
          <div className="space-y-6">
            {/* Resumo Financeiro */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Resumo Financeiro
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-medium">
                    {formatCurrency((order.items || []).reduce((sum, item) => sum + (item.quantity * item.total), 0))}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Frete:</span>
                  <span className="font-medium">{formatCurrency(order.freight)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Desconto:</span>
                  <span className="font-medium text-red-600">-{formatCurrency(order.discount)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-semibold">Total:</span>
                  <span className="font-semibold text-lg text-green-600">{formatCurrency(order.total)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Informações de Entrega */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck className="h-5 w-5" />
                  Entrega e Pagamento
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {order.deliveryDeadline && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Prazo de Entrega
                    </label>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <p className="text-gray-900">{formatDate(order.deliveryDeadline)}</p>
                    </div>
                  </div>
                )}

                {order.seller && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Vendedor
                    </label>
                    <p className="text-gray-900">{order.seller}</p>
                  </div>
                )}

                {order.paymentCondition && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Condição de Pagamento
                    </label>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-gray-400" />
                      <p className="text-gray-900">{order.paymentCondition}</p>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Frete
                  </label>
                  <p className="text-gray-900">
                    {order.fob ? 'FOB (por conta do cliente)' : 'CIF (por nossa conta)'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Workflow de Status FirstLabel */}
            <Card>
              <CardHeader>
                <CardTitle>Workflow do Pedido</CardTitle>
              </CardHeader>
              <CardContent>
                <StatusWorkflow
                  currentStatus={order.status}
                  onStatusChange={handleStatusChange}
                  disabled={actionLoading}
                  showDescription={true}
                />
              </CardContent>
            </Card>

            {/* Ações do Pedido FirstLabel */}
            <Card>
              <CardHeader>
                <CardTitle>Ações do Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">

                {/* PDFs FirstLabel */}
                <div className="space-y-2 pt-3 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleGenerateOrcamento}
                    disabled={actionLoading}
                    className="w-full flex items-center gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Gerar Orçamento PDF
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleGenerateOS}
                    disabled={actionLoading}
                    className="w-full flex items-center gap-2"
                  >
                    <Printer className="h-4 w-4" />
                    Gerar Ordem Serviço PDF
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}