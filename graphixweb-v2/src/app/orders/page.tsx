'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/providers/auth-provider'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MainLayout } from '@/components/layout/main-layout'
import { OrderService } from '@/lib/api'
import type { OrderDtoResponse, ListOrderResponse, OrderStatus } from '@/types/api'
import { getOrderStatusText, getOrderStatusColor } from '@/types/api'
import { 
  Loader2, 
  Plus, 
  RefreshCw, 
  Search, 
  Filter, 
  Edit, 
  Eye, 
  Trash2,
  ShoppingCart,
  User,
  Calendar,
  DollarSign,
  FileText,
  Download,
  Printer,
  Package
} from 'lucide-react'

export default function OrdersPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<OrderDtoResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pageSize, setPageSize] = useState(12)
  const [cursor, setCursor] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [dataInicio, setDataInicio] = useState<string>('')
  const [dataFim, setDataFim] = useState<string>('')
  const [statusFilter, setStatusFilter] = useState<OrderStatus | ''>('')

  // Carregar filtros salvos do sessionStorage
  useEffect(() => {
    const savedFilters = sessionStorage.getItem('orders-filters')
    if (savedFilters) {
      try {
        const filters = JSON.parse(savedFilters)
        setSearchTerm(filters.searchTerm || '')
        setDataInicio(filters.dataInicio || '')
        setDataFim(filters.dataFim || '')
        setStatusFilter(filters.statusFilter || '')
      } catch (error) {
        console.error('Erro ao carregar filtros salvos:', error)
      }
    }
  }, [])

  // Salvar filtros no sessionStorage quando mudarem
  useEffect(() => {
    const filters = {
      searchTerm,
      dataInicio,
      dataFim,
      statusFilter
    }
    sessionStorage.setItem('orders-filters', JSON.stringify(filters))
  }, [searchTerm, dataInicio, dataFim, statusFilter])

  // Verificar autenticação
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  // Função para buscar pedidos
  const fetchOrders = async (newCursor?: string | null) => {
    try {
      setLoading(true)
      setError(null)

      const params = {
        pageSize,
        cursor: newCursor || cursor || undefined,
        startDate: dataInicio || undefined,
        endDate: dataFim || undefined,
        status: statusFilter !== '' ? statusFilter : undefined
      }

      const response: ListOrderResponse = await OrderService.list(params)
      setOrders(response.data || [])
      setCursor(response.cursor || null)
    } catch (err: any) {
      setError(err.error || 'Erro ao carregar pedidos')
      console.error('Erro ao buscar pedidos:', err)
    } finally {
      setLoading(false)
    }
  }

  // Função para deletar pedido
  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este pedido? Esta ação não pode ser desfeita.')) {
      return
    }

    try {
      await OrderService.delete(id)
      await fetchOrders() // Recarregar lista
    } catch (err: any) {
      setError(err.error || 'Erro ao excluir pedido')
      console.error('Erro ao excluir pedido:', err)
    }
  }

  // Função para gerar orçamento
  const handleGenerateOrcamento = async (id: number) => {
    try {
      const blob = await OrderService.generateOrcamento(id)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `orcamento-${id}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err: any) {
      setError(err.error || 'Erro ao gerar orçamento')
      console.error('Erro ao gerar orçamento:', err)
    }
  }

  // Função para gerar ordem de serviço
  const handleGenerateOS = async (id: number) => {
    try {
      const blob = await OrderService.generateOrdemServico(id)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `ordem-servico-${id}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err: any) {
      setError(err.error || 'Erro ao gerar ordem de serviço')
      console.error('Erro ao gerar ordem de serviço:', err)
    }
  }

  // Função para limpar filtros
  const limparFiltros = () => {
    setSearchTerm('')
    setDataInicio('')
    setDataFim('')
    setStatusFilter('')
    setCursor(null)
    setOrders([])
  }

  // Função para formatar data
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  // Função para formatar valor
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <MainLayout>
      <div className="p-4 lg:p-6">
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Pedidos</h1>
              <p className="text-gray-600 mt-1">Gerencie todos os pedidos da gráfica FirstLabel</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={() => fetchOrders()}
                disabled={loading}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Atualizar</span>
              </Button>
              
              <Button 
                className="flex items-center gap-2"
                onClick={() => router.push('/orders/create')}
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Novo Pedido</span>
              </Button>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="mt-4 space-y-3">
            {/* Barra de busca */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por número, cliente ou observações..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filtros Avançados</span>
              </Button>
            </div>
            
            {/* Filtros */}
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as OrderStatus | '')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                >
                  <option value="">Todos os status</option>
                  <option value="0">Orçamento</option>
                  <option value="1">Em Execução</option>
                  <option value="2">Finalizado</option>
                  <option value="3">Recusado</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Data Início</label>
                <input
                  type="date"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Data Fim</label>
                <input
                  type="date"
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                />
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={limparFiltros}
                  className="flex items-center gap-2"
                >
                  Limpar
                </Button>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2 text-gray-600">Carregando pedidos...</span>
          </div>
        ) : orders.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-gray-400 mb-4">
                <ShoppingCart className="w-16 h-16" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum pedido encontrado</h3>
              <p className="text-gray-600 text-center mb-4">
                {loading ? 'Carregando...' : 'Clique em "Atualizar" para buscar pedidos ou "Novo Pedido" para criar o primeiro.'}
              </p>
              <Button onClick={() => router.push('/orders/create')}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Pedido
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid gap-4 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
              {orders.map((order) => (
                <Card key={order.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-sm lg:text-base">
                        Pedido #{order.orderNumber}
                      </CardTitle>
                      <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold ${getOrderStatusColor(order.status)}`}>
                        {getOrderStatusText(order.status)}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <User className="h-4 w-4 mr-2" />
                        <span>{order.customer?.corporateName || `Cliente #${order.customerId}`}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <DollarSign className="h-4 w-4 mr-2" />
                        <span className="font-medium text-green-600">{formatCurrency(order.total)}</span>
                        {order.discount > 0 && (
                          <span className="ml-2 text-xs text-orange-600">
                            (-{formatCurrency(order.discount)})
                          </span>
                        )}
                      </div>
                      
                      {order.deliveryDeadline && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>Prazo: {formatDate(order.deliveryDeadline)}</span>
                        </div>
                      )}
                      
                      {order.seller && (
                        <div className="flex items-center text-sm text-gray-600">
                          <User className="h-4 w-4 mr-2" />
                          <span>Vendedor: {order.seller}</span>
                        </div>
                      )}
                      
                      {order.items && order.items.length > 0 && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Package className="h-4 w-4 mr-2" />
                          <span>{order.items.length} item(s)</span>
                        </div>
                      )}
                      
                      {order.observation && (
                        <div>
                          <p className="text-xs text-gray-600">Observação</p>
                          <p className="text-xs text-gray-700 line-clamp-2">{order.observation}</p>
                        </div>
                      )}
                      
                      <div className="pt-1 border-t">
                        <p className="text-xs text-gray-500">
                          Criado em: {formatDate(order.createdAt)}
                        </p>
                      </div>
                      
                      {/* Botões de ação FirstLabel */}
                      <div className="pt-2 space-y-1">
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 flex items-center gap-1 text-xs py-1"
                            onClick={() => router.push(`/orders/${order.id}`)}
                          >
                            <Eye className="h-3 w-3" />
                            Ver
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 flex items-center gap-1 text-xs py-1"
                            onClick={() => router.push(`/orders/${order.id}/edit`)}
                          >
                            <Edit className="h-3 w-3" />
                            Editar
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex items-center gap-1 text-xs py-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDelete(order.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        {/* Botões FirstLabel específicos */}
                        <div className="flex gap-1">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 flex items-center gap-1 text-xs py-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => handleGenerateOrcamento(order.id)}
                          >
                            <FileText className="h-3 w-3" />
                            Orçamento
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 flex items-center gap-1 text-xs py-1 text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={() => handleGenerateOS(order.id)}
                          >
                            <Printer className="h-3 w-3" />
                            Ordem Serviço
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Paginação */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Itens por página:</span>
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value))
                    fetchOrders(null)
                  }}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  <option value={12}>12</option>
                  <option value={24}>24</option>
                  <option value={48}>48</option>
                  <option value={96}>96</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchOrders(null)}
                  disabled={!cursor}
                >
                  Primeira
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchOrders(cursor)}
                  disabled={!cursor}
                >
                  Próxima
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  )
}