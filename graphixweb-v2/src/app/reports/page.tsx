'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/providers/auth-provider'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MainLayout } from '@/components/layout/main-layout'
import { OrderService, CustomerService, ProductService, CashFlowService } from '@/lib/api'
import { 
  BarChart3,
  Download,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Package,
  Users,
  ShoppingCart,
  FileText,
  Filter,
  Loader2,
  Eye
} from 'lucide-react'

interface ReportStats {
  totalOrders: number
  totalCustomers: number
  totalProducts: number
  totalRevenue: number
  monthlyRevenue: number
  pendingOrders: number
  completedOrders: number
  averageOrderValue: number
}

export default function ReportsPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<ReportStats>({
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    pendingOrders: 0,
    completedOrders: 0,
    averageOrderValue: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dateFilter, setDateFilter] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  })

  // Verificar autenticação
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  // Buscar dados para relatórios
  useEffect(() => {
    if (isAuthenticated) {
      fetchReportData()
    }
  }, [isAuthenticated, dateFilter])

  const fetchReportData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Buscar dados em paralelo
      const [ordersRes, customersRes, productsRes, cashFlowRes] = await Promise.allSettled([
        OrderService.list({ 
          pageSize: 1000,
          startDate: dateFilter.startDate,
          endDate: dateFilter.endDate
        }),
        CustomerService.list({ pageSize: 1000 }),
        ProductService.list({ pageSize: 1000 }),
        CashFlowService.list({ 
          pageSize: 1000,
          startDate: dateFilter.startDate,
          endDate: dateFilter.endDate
        })
      ])

      const orders = ordersRes.status === 'fulfilled' ? ordersRes.value.data || [] : []
      const customers = customersRes.status === 'fulfilled' ? customersRes.value.data || [] : []
      const products = productsRes.status === 'fulfilled' ? productsRes.value.data || [] : []
      const cashFlow = cashFlowRes.status === 'fulfilled' ? cashFlowRes.value.data || [] : []

      // Calcular estatísticas
      const totalRevenue = cashFlow
        .filter(cf => cf.type === 0 && cf.valueReceive) // Entradas realizadas
        .reduce((sum, cf) => sum + (cf.valueReceive || 0), 0)

      const completedOrders = orders.filter(o => o.status === 2).length // Status Finalizado
      const pendingOrders = orders.filter(o => o.status === 0 || o.status === 1).length // Orçamento ou Execução

      const averageOrderValue = orders.length > 0 
        ? orders.reduce((sum, o) => sum + (o.total || 0), 0) / orders.length 
        : 0

      setStats({
        totalOrders: orders.length,
        totalCustomers: customers.length,
        totalProducts: products.length,
        totalRevenue,
        monthlyRevenue: totalRevenue, // Como já filtramos por período
        pendingOrders,
        completedOrders,
        averageOrderValue
      })

    } catch (err: any) {
      setError(err.error || 'Erro ao carregar dados dos relatórios')
      console.error('Erro ao buscar dados:', err)
    } finally {
      setLoading(false)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const getGrowthIndicator = (current: number, previous: number) => {
    if (previous === 0) return { percentage: 0, isPositive: true }
    const percentage = ((current - previous) / previous) * 100
    return { percentage: Math.abs(percentage), isPositive: percentage >= 0 }
  }

  if (isLoading && loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="p-4 lg:p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Relatórios</h1>
              <p className="text-gray-600 mt-1">Análises e relatórios do sistema</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => fetchReportData()}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <BarChart3 className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
            </div>
          </div>
        </div>

        {/* Filtros de Data */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Período do Relatório
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Data Início</label>
                <input
                  type="date"
                  value={dateFilter.startDate}
                  onChange={(e) => setDateFilter(prev => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Data Fim</label>
                <input
                  type="date"
                  value={dateFilter.endDate}
                  onChange={(e) => setDateFilter(prev => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={() => setDateFilter({
                    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
                    endDate: new Date().toISOString().split('T')[0]
                  })}
                  variant="outline"
                >
                  Este Mês
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {/* Receita Total */}
          <Card className="border-primary-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Receita Total</p>
                  <p className="text-2xl font-bold text-primary-600">
                    {formatCurrency(stats.totalRevenue)}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-accent-600" />
                    <span className="text-xs text-accent-600">Período selecionado</span>
                  </div>
                </div>
                <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-primary-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total de Pedidos */}
          <Card className="border-accent-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Pedidos</p>
                  <p className="text-2xl font-bold text-accent-600">{stats.totalOrders}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs text-gray-500">
                      {stats.completedOrders} finalizados
                    </span>
                  </div>
                </div>
                <div className="h-12 w-12 bg-accent-100 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="h-6 w-6 text-accent-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ticket Médio */}
          <Card className="border-secondary-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ticket Médio</p>
                  <p className="text-2xl font-bold text-secondary-600">
                    {formatCurrency(stats.averageOrderValue)}
                  </p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs text-gray-500">Por pedido</span>
                  </div>
                </div>
                <div className="h-12 w-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-secondary-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pedidos Pendentes */}
          <Card className="border-warning-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pedidos Pendentes</p>
                  <p className="text-2xl font-bold text-warning-600">{stats.pendingOrders}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs text-gray-500">
                      Aguardando conclusão
                    </span>
                  </div>
                </div>
                <div className="h-12 w-12 bg-warning-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-6 w-6 text-warning-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Relatórios Disponíveis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Relatórios de Vendas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Relatórios de Vendas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Vendas por Cliente</p>
                  <p className="text-sm text-gray-600">Ranking dos principais clientes</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Vendas por Produto</p>
                  <p className="text-sm text-gray-600">Produtos mais vendidos</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Vendas por Período</p>
                  <p className="text-sm text-gray-600">Evolução das vendas no tempo</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Relatórios Financeiros */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Relatórios Financeiros
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Fluxo de Caixa</p>
                  <p className="text-sm text-gray-600">Entradas e saídas por período</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Contas a Receber</p>
                  <p className="text-sm text-gray-600">Pendências e vencimentos</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Resultado por Período</p>
                  <p className="text-sm text-gray-600">Lucro e margem de contribuição</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Relatórios Operacionais */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Relatórios Operacionais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Produção por Período</p>
                  <p className="text-sm text-gray-600">Ordens de serviço concluídas</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Tempo de Produção</p>
                  <p className="text-sm text-gray-600">Análise de eficiência produtiva</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Produtos Cadastrados</p>
                  <p className="text-sm text-gray-600">Listagem completa de produtos</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Relatórios de Clientes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Relatórios de Clientes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Base de Clientes</p>
                  <p className="text-sm text-gray-600">Listagem completa de clientes</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Histórico de Compras</p>
                  <p className="text-sm text-gray-600">Relacionamento com clientes</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Análise de Segmentação</p>
                  <p className="text-sm text-gray-600">Perfil e comportamento de compra</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}