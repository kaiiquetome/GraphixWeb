'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MainLayout } from '@/components/layout/main-layout'
import { CashFlowService } from '@/lib/api'
import type { CashFlowDtoResponse } from '@/types/api'
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Loader2,
  DollarSign,
  Calendar,
  FileText,
  TrendingUp,
  TrendingDown,
  Building2,
  Clock
} from 'lucide-react'

interface CashFlowDetailPageProps {
  params: { id: string }
}

export default function CashFlowDetailPage({ params }: CashFlowDetailPageProps) {
  const router = useRouter()
  const [cashFlow, setCashFlow] = useState<CashFlowDtoResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchCashFlowDetails()
  }, [params.id])

  const fetchCashFlowDetails = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await CashFlowService.getById(parseInt(params.id))
      setCashFlow(response)
    } catch (err: any) {
      setError(err.error || 'Erro ao carregar detalhes do registro')
      console.error('Erro ao buscar detalhes:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir este registro? Esta ação não pode ser desfeita.')) {
      return
    }

    try {
      await CashFlowService.delete(parseInt(params.id))
      router.push('/cash-flow')
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
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
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

  const getTypeText = (type: number) => {
    return type === 0 ? 'Entrada' : 'Saída'
  }

  const getTypeIcon = (type: number) => {
    return type === 0 ? (
      <TrendingUp className="h-5 w-5 text-accent-600" />
    ) : (
      <TrendingDown className="h-5 w-5 text-error-600" />
    )
  }

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
        </div>
      </MainLayout>
    )
  }

  if (error || !cashFlow) {
    return (
      <MainLayout>
        <div className="p-4 lg:p-6">
          <div className="text-center py-8">
            <p className="text-red-600 mb-4">{error || 'Registro não encontrado'}</p>
            <Button
              onClick={() => router.push('/cash-flow')}
              variant="outline"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Lista
            </Button>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="p-4 lg:p-6">
        {/* Header */}
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
            <div className="flex-1">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                Detalhes do Registro
              </h1>
              <p className="text-gray-600 mt-1">
                Informações completas do registro #{cashFlow.id}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => router.push(`/cash-flow/edit/${cashFlow.id}`)}
                className="flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                Editar
              </Button>
              <Button
                variant="outline"
                onClick={handleDelete}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
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
          {/* Informações Principais */}
          <div className="lg:col-span-2 space-y-6">
            {/* Card Principal */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getTypeIcon(cashFlow.type)}
                  Informações Gerais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tipo
                    </label>
                    <div className="flex items-center gap-2">
                      {getTypeIcon(cashFlow.type)}
                      <span className={`font-medium ${
                        cashFlow.type === 0 ? 'text-accent-600' : 'text-error-600'
                      }`}>
                        {getTypeText(cashFlow.type)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Categoria
                    </label>
                    <p className="text-gray-900">{getCategoryText(cashFlow.category)}</p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descrição
                    </label>
                    <p className="text-gray-900">{cashFlow.description}</p>
                  </div>

                  {cashFlow.orderId && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Pedido Vinculado
                      </label>
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-900">Pedido #{cashFlow.orderId}</span>
                      </div>
                    </div>
                  )}

                  {cashFlow.installmentNumber && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Parcela
                      </label>
                      <p className="text-gray-900">{cashFlow.installmentNumber}ª parcela</p>
                    </div>
                  )}
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
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Data Prevista
                    </label>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900">
                        {formatDate(cashFlow.expectedDateReceive)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Valor Previsto
                    </label>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-900 font-medium">
                        {formatCurrency(cashFlow.expectedValueReceive)}
                      </span>
                    </div>
                  </div>

                  {cashFlow.dateReceive && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Data Realizada
                      </label>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-accent-600" />
                        <span className="text-gray-900">
                          {formatDate(cashFlow.dateReceive)}
                        </span>
                      </div>
                    </div>
                  )}

                  {cashFlow.valueReceive && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Valor Realizado
                      </label>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-accent-600" />
                        <span className="text-gray-900 font-medium">
                          {formatCurrency(cashFlow.valueReceive)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Comparação de Valores */}
                {cashFlow.valueReceive && cashFlow.valueReceive !== cashFlow.expectedValueReceive && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm font-medium text-yellow-800">Variação</span>
                    </div>
                    <p className="text-sm text-yellow-700">
                      Diferença de {formatCurrency(cashFlow.valueReceive - cashFlow.expectedValueReceive)} 
                      {cashFlow.valueReceive > cashFlow.expectedValueReceive ? ' acima' : ' abaixo'} do previsto
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <div className={`inline-flex px-3 py-2 rounded-full text-sm font-medium ${
                    cashFlow.dateReceive 
                      ? 'bg-accent-100 text-accent-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {cashFlow.dateReceive ? 'Realizado' : 'Pendente'}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resumo Financeiro */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Resumo Financeiro
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Valor Previsto:</span>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(cashFlow.expectedValueReceive)}
                  </span>
                </div>
                
                {cashFlow.valueReceive && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Valor Realizado:</span>
                      <span className="font-medium text-gray-900">
                        {formatCurrency(cashFlow.valueReceive)}
                      </span>
                    </div>
                    
                    <div className="border-t pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Diferença:</span>
                        <span className={`font-bold ${
                          cashFlow.valueReceive >= cashFlow.expectedValueReceive 
                            ? 'text-accent-600' 
                            : 'text-error-600'
                        }`}>
                          {formatCurrency(cashFlow.valueReceive - cashFlow.expectedValueReceive)}
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            {/* Informações do Sistema */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Informações do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    ID do Registro
                  </label>
                  <p className="text-sm text-gray-900">#{cashFlow.id}</p>
                </div>
                
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Data de Criação
                  </label>
                  <p className="text-sm text-gray-900">
                    {formatDateTime(cashFlow.createdAt)}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}