'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/providers/auth-provider'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MainLayout } from '@/components/layout/main-layout'
import { Loader2, Plus, RefreshCw, Search, Filter, Edit, Printer, X } from 'lucide-react'

// Tipos baseados no swagger.json
interface CustomerDtoResponse {
  id: number
  createdAt?: string
  corporateName?: string
  cnpj?: string
  ie?: string
  contact?: string
  phone?: string
  email?: string
}

interface OrderServiceDtoResponse {
  id: number
  createdAt?: string
  orderId: number
  customerId: number
  observation?: string
  deliveryDeadline?: string
  quantity?: string
  rollQuantityKg?: string
  rollQuantityMeters?: string
  productionStartDate?: string
  productionEndDate?: string
  operator?: string
  status: number
  labelOrientation: number
  machine: any // MachineSetupDtoResponse
  inkMixs?: any[] // InkMixDtoResponse[]
  rewindings?: any[] // RewindingDtoResponse[]
  traceabilitys?: any[] // TraceabilityDtoResponse[]
  aniloxs?: any[] // AniloxDtoResponse[]
  order: any // OrderDtoResponse
  customer: CustomerDtoResponse
}

interface ListOrderServiceResponse {
  cursor?: string
  pageSize?: number
  data?: OrderServiceDtoResponse[]
}

export default function OrderServicePage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [orderServices, setOrderServices] = useState<OrderServiceDtoResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pageSize, setPageSize] = useState(5)
  const [cursor, setCursor] = useState<string | null>(null)
  const [dataInicio, setDataInicio] = useState<string>('')
  const [dataFim, setDataFim] = useState<string>('')
  const [customers, setCustomers] = useState<Record<number, CustomerDtoResponse>>({})

  // Verificar autenticação
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  // Função para buscar dados do cliente
  const fetchCustomer = async (customerId: number): Promise<CustomerDtoResponse | null> => {
    try {
      const token = localStorage.getItem('jwtToken')
      if (!token) {
        throw new Error('Token não encontrado')
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customer/${customerId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`)
      }

      const customer: CustomerDtoResponse = await response.json()
      return customer
    } catch (err: any) {
      console.error(`Erro ao buscar cliente ${customerId}:`, err)
      return null
    }
  }

  // Função para buscar OrderServices
  const fetchOrderServices = async (newCursor?: string | null) => {
    try {
      setLoading(true)
      setError(null)
      
      const token = localStorage.getItem('jwtToken')
      if (!token) {
        throw new Error('Token não encontrado')
      }

      const params = new URLSearchParams()
      if (pageSize) params.append('PageSize', pageSize.toString())
      if (newCursor || cursor) params.append('Cursor', (newCursor || cursor) || '')
      if (dataInicio) params.append('StartDate', dataInicio)
      if (dataFim) params.append('EndDate', dataFim)

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/OrderService?${params}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`)
      }

      const data: ListOrderServiceResponse = await response.json()
      const orderServicesData = data.data || []
      
      setOrderServices(orderServicesData)
      setCursor(data.cursor || null)

      // Buscar dados dos clientes para os order services
      const customerIds = Array.from(new Set(orderServicesData.map(os => os.customerId)))
      const customersData: Record<number, CustomerDtoResponse> = {}
      
      // Buscar clientes em paralelo
      const customerPromises = customerIds.map(async (customerId) => {
        const customer = await fetchCustomer(customerId)
        if (customer) {
          customersData[customerId] = customer
        }
      })
      
      await Promise.all(customerPromises)
      setCustomers(customersData)
      
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar OrderServices')
      console.error('Erro ao buscar OrderServices:', err)
    } finally {
      setLoading(false)
    }
  }

  // Função para imprimir/download
  const handlePrint = async () => {
    try {
      const token = localStorage.getItem('jwtToken')
      if (!token) {
        throw new Error('Token não encontrado')
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/OrderService/download`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`)
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'order-services.pdf'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err: any) {
      setError(err.message || 'Erro ao baixar relatório')
      console.error('Erro ao baixar relatório:', err)
    }
  }

  // Função para limpar filtros
  const limparFiltros = () => {
    setDataInicio('')
    setDataFim('')
    setCursor(null)
    setOrderServices([])
  }

  // Removida a consulta automática - só busca quando o usuário clicar em atualizar

  // Função para formatar data
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  // Função para obter status em texto
  const getStatusText = (status: number) => {
    const statusMap: Record<number, string> = {
      0: 'Pendente',
      1: 'Em Execução',
      2: 'Finalizado'
    }
    return statusMap[status] || `Status ${status}`
  }

  // Função para obter cor do status
  const getStatusColor = (status: number) => {
    const colorMap: Record<number, string> = {
      0: 'bg-yellow-100 text-yellow-800',
      1: 'bg-blue-100 text-blue-800',
      2: 'bg-green-100 text-green-800'
    }
    return colorMap[status] || 'bg-gray-100 text-gray-800'
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
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Ordem de Serviço</h1>
              <p className="text-gray-600 mt-1">Gerencie os serviços dos pedidos</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={() => fetchOrderServices()}
                disabled={loading}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Atualizar</span>
              </Button>
              
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Novo Order Service</span>
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
                  placeholder="Buscar Order Services..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filtros</span>
              </Button>
            </div>
            
            {/* Filtros de data */}
            <div className="flex flex-col sm:flex-row gap-2">
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
            <span className="ml-2 text-gray-600">Carregando Order Services...</span>
          </div>
        ) : orderServices.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum Order Service encontrado</h3>
              <p className="text-gray-600 text-center">
                {loading ? 'Carregando...' : 'Clique em "Atualizar" para buscar Order Services.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {orderServices.map((orderService) => (
                <Card key={orderService.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-sm lg:text-base">
                        Pedido #{orderService.order.orderNumber}
                      </CardTitle>
                      <span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-xs font-semibold ${getStatusColor(orderService.status)}`}>
                        {getStatusText(orderService.status)}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs text-gray-600">Cliente</p>
                        <p className="font-medium text-xs">
                          {orderService.order.customer.corporateName}
                        </p>
                      </div>
                      
                      {orderService.operator && (
                        <div>
                          <p className="text-xs text-gray-600">Operador</p>
                          <p className="font-medium text-xs">{orderService.operator}</p>
                        </div>
                      )}
                      
                      {orderService.quantity && (
                        <div>
                          <p className="text-xs text-gray-600">Quantidade</p>
                          <p className="font-medium text-xs">{orderService.quantity}</p>
                        </div>
                      )}
                      
                      {orderService.deliveryDeadline && (
                        <div>
                          <p className="text-xs text-gray-600">Prazo de Entrega</p>
                          <p className="font-medium text-xs">{formatDate(orderService.deliveryDeadline)}</p>
                        </div>
                      )}
                      
                      {orderService.observation && (
                        <div>
                          <p className="text-xs text-gray-600">Observação</p>
                          <p className="text-xs text-gray-700 line-clamp-2">{orderService.observation}</p>
                        </div>
                      )}
                      
                      <div className="pt-1 border-t">
                        <p className="text-xs text-gray-500">
                          Criado em: {formatDate(orderService.createdAt)}
                        </p>
                      </div>
                      
                      {/* Botão de Editar */}
                      <div className="pt-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full flex items-center gap-1 text-xs py-1"
                          onClick={() => router.push(`/order-service/edit/${orderService.id}`)}
                        >
                          <Edit className="h-3 w-3" />
                          Atualizar
                        </Button>
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
                    fetchOrderServices(null)
                  }}
                  className="border border-gray-300 rounded px-2 py-1 text-sm"
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                </select>
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchOrderServices(null)}
                  disabled={!cursor}
                >
                  Primeira
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchOrderServices(cursor)}
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