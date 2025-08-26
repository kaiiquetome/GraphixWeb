'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/providers/auth-provider'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MainLayout } from '@/components/layout/main-layout'
import { CustomerService } from '@/lib/api'
import type { CustomerDtoResponse, ListCustomerResponse } from '@/types/api'
import { 
  Loader2, 
  Plus, 
  RefreshCw, 
  Search, 
  Filter, 
  Edit, 
  Eye, 
  Trash2,
  Building2,
  Phone,
  Mail,
  FileText
} from 'lucide-react'

export default function CustomersPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [customers, setCustomers] = useState<CustomerDtoResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pageSize, setPageSize] = useState(12)
  const [cursor, setCursor] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [dataInicio, setDataInicio] = useState<string>('')
  const [dataFim, setDataFim] = useState<string>('')

  // Verificar autenticação
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  // Função para buscar clientes
  const fetchCustomers = async (newCursor?: string | null) => {
    try {
      setLoading(true)
      setError(null)

      const params = {
        pageSize,
        cursor: newCursor || cursor || undefined,
        startDate: dataInicio || undefined,
        endDate: dataFim || undefined
      }

      const response: ListCustomerResponse = await CustomerService.list(params)
      setCustomers(response.data || [])
      setCursor(response.cursor || null)
    } catch (err: any) {
      setError(err.error || 'Erro ao carregar clientes')
      console.error('Erro ao buscar clientes:', err)
    } finally {
      setLoading(false)
    }
  }

  // Função para deletar cliente
  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este cliente?')) {
      return
    }

    try {
      await CustomerService.delete(id)
      await fetchCustomers() // Recarregar lista
    } catch (err: any) {
      setError(err.error || 'Erro ao excluir cliente')
      console.error('Erro ao excluir cliente:', err)
    }
  }

  // Função para limpar filtros
  const limparFiltros = () => {
    setSearchTerm('')
    setDataInicio('')
    setDataFim('')
    setCursor(null)
    setCustomers([])
  }

  // Função para formatar data
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  // Função para formatar CNPJ
  const formatCNPJ = (cnpj?: string) => {
    if (!cnpj) return 'N/A'
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')
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
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Clientes</h1>
              <p className="text-gray-600 mt-1">Gerencie a base de clientes da empresa</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={() => fetchCustomers()}
                disabled={loading}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Atualizar</span>
              </Button>
              
              <Button 
                className="flex items-center gap-2"
                onClick={() => router.push('/customers/create')}
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Novo Cliente</span>
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
                  placeholder="Buscar por nome, CNPJ ou contato..."
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
            <span className="ml-2 text-gray-600">Carregando clientes...</span>
          </div>
        ) : customers.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-gray-400 mb-4">
                <Building2 className="w-16 h-16" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum cliente encontrado</h3>
              <p className="text-gray-600 text-center mb-4">
                {loading ? 'Carregando...' : 'Clique em "Atualizar" para buscar clientes ou "Novo Cliente" para cadastrar o primeiro.'}
              </p>
              <Button onClick={() => router.push('/customers/create')}>
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Primeiro Cliente
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {customers.map((customer) => (
                <Card key={customer.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-sm lg:text-base line-clamp-2">
                        {customer.corporateName || `Cliente #${customer.id}`}
                      </CardTitle>
                      <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold bg-green-100 text-green-800">
                        Ativo
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      {customer.cnpj && (
                        <div className="flex items-center text-xs text-gray-600">
                          <FileText className="h-3 w-3 mr-1" />
                          <span>CNPJ: {formatCNPJ(customer.cnpj)}</span>
                        </div>
                      )}
                      
                      {customer.contact && (
                        <div>
                          <p className="text-xs text-gray-600">Contato</p>
                          <p className="font-medium text-xs">{customer.contact}</p>
                        </div>
                      )}
                      
                      {customer.phone && (
                        <div className="flex items-center text-xs text-gray-600">
                          <Phone className="h-3 w-3 mr-1" />
                          <span>{customer.phone}</span>
                        </div>
                      )}
                      
                      {customer.email && (
                        <div className="flex items-center text-xs text-gray-600">
                          <Mail className="h-3 w-3 mr-1" />
                          <span className="truncate">{customer.email}</span>
                        </div>
                      )}
                      
                      <div className="pt-1 border-t">
                        <p className="text-xs text-gray-500">
                          Cadastrado em: {formatDate(customer.createdAt)}
                        </p>
                      </div>
                      
                      {/* Botões de ação */}
                      <div className="pt-2 flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 flex items-center gap-1 text-xs py-1"
                          onClick={() => router.push(`/customers/${customer.id}`)}
                        >
                          <Eye className="h-3 w-3" />
                          Ver
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 flex items-center gap-1 text-xs py-1"
                          onClick={() => router.push(`/customers/${customer.id}/edit`)}
                        >
                          <Edit className="h-3 w-3" />
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1 text-xs py-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(customer.id)}
                        >
                          <Trash2 className="h-3 w-3" />
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
                    fetchCustomers(null)
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
                  onClick={() => fetchCustomers(null)}
                  disabled={!cursor}
                >
                  Primeira
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchCustomers(cursor)}
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