'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/providers/auth-provider'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MainLayout } from '@/components/layout/main-layout'
import { CashFlowService } from '@/lib/api'
import type { CashFlowDtoResponse, ListCashFlowResponse } from '@/types/api'
import { 
  Loader2, 
  Plus, 
  RefreshCw, 
  Search, 
  Filter, 
  Edit, 
  Eye, 
  Trash2,
  DollarSign,
  Calendar,
  TrendingUp,
  TrendingDown,
  FileText,
  Download
} from 'lucide-react'

export default function CashFlowPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [cashFlows, setCashFlows] = useState<CashFlowDtoResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pageSize, setPageSize] = useState(12)
  const [cursor, setCursor] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [dataInicio, setDataInicio] = useState<string>('')
  const [dataFim, setDataFim] = useState<string>('')
  const [totalEntradas, setTotalEntradas] = useState(0)
  const [totalSaidas, setTotalSaidas] = useState(0)

  // Verificar autenticação
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  // Buscar dados do fluxo de caixa
  useEffect(() => {
    if (isAuthenticated) {
      fetchCashFlows()
    }
  }, [isAuthenticated, dataInicio, dataFim])

  const fetchCashFlows = async (newCursor?: string | null) => {
    try {
      setLoading(true)
      setError(null)

      const params = {
        pageSize,
        cursor: newCursor || cursor || undefined,
        startDate: dataInicio || undefined,
        endDate: dataFim || undefined
      }

      const response: ListCashFlowResponse = await CashFlowService.list(params)
      setCashFlows(response.data || [])
      setCursor(response.cursor || null)

      // Calcular totais
      const entradas = (response.data || [])
        .filter(item => item.type === 0) // Entrada
        .reduce((sum, item) => sum + (item.valueReceive || item.expectedValueReceive || 0), 0)

      const saidas = (response.data || [])
        .filter(item => item.type === 1) // Saída
        .reduce((sum, item) => sum + (item.valueReceive || item.expectedValueReceive || 0), 0)

      setTotalEntradas(entradas)
      setTotalSaidas(saidas)

    } catch (err: any) {
      setError(err.error || 'Erro ao carregar fluxo de caixa')
      console.error('Erro ao buscar fluxo de caixa:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este registro? Esta ação não pode ser desfeita.')) {
      return
    }

    try {
      await CashFlowService.delete(id)
      await fetchCashFlows()
    } catch (err: any) {
      setError(err.error || 'Erro ao excluir registro')
      console.error('Erro ao excluir registro:', err)
    }
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const getCategoryText = (category: number) => {
    const categories = {
      0: 'Vendas',
      1: 'Serviços',
      2: 'Despesas Operacionais',
      3: 'Investimentos',
      4: 'Outros'
    }
    return categories[category as keyof typeof categories] || 'Não definido'
  }

  const getTypeIcon = (type: number) => {
    return type === 0 ? (
      <TrendingUp className="h-4 w-4 text-accent-600" />
    ) : (
      <TrendingDown className="h-4 w-4 text-error-600" />
    )
  }

  const getTypeText = (type: number) => {
    return type === 0 ? 'Entrada' : 'Saída'
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        </div>
      </MainLayout>
    )
  }

  const saldoAtual = totalEntradas - totalSaidas

  return (
    <MainLayout>
      <div className="p-4 lg:p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Fluxo de Caixa</h1>
              <p className="text-gray-600 mt-1">Gestão financeira e controle de receitas e despesas</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => fetchCashFlows()}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
              <Button
                onClick={() => router.push('/cash-flow/create')}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Novo Registro
              </Button>
            </div>
          </div>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-accent-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Entradas</p>
                  <p className="text-2xl font-bold text-accent-600">
                    {formatCurrency(totalEntradas)}
                  </p>
                </div>
                <div className="h-12 w-12 bg-accent-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-accent-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-error-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Saídas</p>
                  <p className="text-2xl font-bold text-error-600">
                    {formatCurrency(totalSaidas)}
                  </p>
                </div>
                <div className="h-12 w-12 bg-error-100 rounded-lg flex items-center justify-center">
                  <TrendingDown className="h-6 w-6 text-error-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className={`border-${saldoAtual >= 0 ? 'primary' : 'warning'}-200`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Saldo Atual</p>
                  <p className={`text-2xl font-bold text-${saldoAtual >= 0 ? 'primary' : 'warning'}-600`}>
                    {formatCurrency(saldoAtual)}
                  </p>
                </div>
                <div className={`h-12 w-12 bg-${saldoAtual >= 0 ? 'primary' : 'warning'}-100 rounded-lg flex items-center justify-center`}>
                  <DollarSign className={`h-6 w-6 text-${saldoAtual >= 0 ? 'primary' : 'warning'}-600`} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Registros</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {cashFlows.length}
                  </p>
                </div>
                <div className="h-12 w-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-secondary-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Data Início</label>
                <input
                  type="date"
                  value={dataInicio}
                  onChange={(e) => setDataInicio(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Data Fim</label>
                <input
                  type="date"
                  value={dataFim}
                  onChange={(e) => setDataFim(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                />
              </div>
              <div className="flex items-end">
                <Button
                  onClick={() => {
                    setDataInicio('')
                    setDataFim('')
                  }}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  Limpar Filtros
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Registros */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Registros do Fluxo de Caixa</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
              </div>
            ) : cashFlows.length === 0 ? (
              <div className="text-center py-8">
                <DollarSign className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Nenhum registro encontrado</p>
                <Button
                  onClick={() => router.push('/cash-flow/create')}
                  className="mt-4"
                >
                  Criar Primeiro Registro
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Tipo</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Descrição</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Categoria</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Data Prevista</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Valor Previsto</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Valor Realizado</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cashFlows.map((cashFlow) => (
                      <tr key={cashFlow.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {getTypeIcon(cashFlow.type)}
                            <span className={`text-sm font-medium ${
                              cashFlow.type === 0 ? 'text-accent-600' : 'text-error-600'
                            }`}>
                              {getTypeText(cashFlow.type)}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm font-medium text-gray-900">{cashFlow.description}</p>
                          {cashFlow.orderId && (
                            <p className="text-xs text-gray-500">Pedido #{cashFlow.orderId}</p>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-700">
                            {getCategoryText(cashFlow.category)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-700">
                            {formatDate(cashFlow.expectedDateReceive)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm font-medium text-gray-900">
                            {formatCurrency(cashFlow.expectedValueReceive)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {cashFlow.valueReceive ? (
                            <span className="text-sm font-medium text-gray-900">
                              {formatCurrency(cashFlow.valueReceive)}
                            </span>
                          ) : (
                            <span className="text-sm text-gray-500">Pendente</span>
                          )}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                            cashFlow.dateReceive 
                              ? 'bg-accent-100 text-accent-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {cashFlow.dateReceive ? 'Realizado' : 'Pendente'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(`/cash-flow/${cashFlow.id}`)}
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(`/cash-flow/edit/${cashFlow.id}`)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(cashFlow.id)}
                              className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}