'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/providers/auth-provider'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MainLayout } from '@/components/layout/main-layout'
import { AccountService } from '@/lib/api'
import type { AccountDtoResponse, ListAccountResponse } from '@/types/api'
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
  FileText,
  Calendar
} from 'lucide-react'

export default function AccountsPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [accounts, setAccounts] = useState<AccountDtoResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pageSize, setPageSize] = useState(12)
  const [cursor, setCursor] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  // Verificar autenticação
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  // Buscar contas
  useEffect(() => {
    if (isAuthenticated) {
      fetchAccounts()
    }
  }, [isAuthenticated])

  const fetchAccounts = async (newCursor?: string | null) => {
    try {
      setLoading(true)
      setError(null)

      const params = {
        pageSize,
        cursor: newCursor || cursor || undefined
      }

      const response: ListAccountResponse = await AccountService.list(params)
      setAccounts(response.data || [])
      setCursor(response.cursor || null)
    } catch (err: any) {
      setError(err.error || 'Erro ao carregar contas')
      console.error('Erro ao buscar contas:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta conta? Esta ação não pode ser desfeita.')) {
      return
    }

    try {
      await AccountService.delete(id)
      await fetchAccounts()
    } catch (err: any) {
      setError(err.error || 'Erro ao excluir conta')
      console.error('Erro ao excluir conta:', err)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const formatCNPJ = (cnpj: string) => {
    if (!cnpj) return ''
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5')
  }

  const filteredAccounts = accounts.filter(account =>
    account.corporateName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.cnpj?.includes(searchTerm) ||
    account.email?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
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
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Contas</h1>
              <p className="text-gray-600 mt-1">Gerenciamento de contas da empresa</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => fetchAccounts()}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
              <Button
                onClick={() => router.push('/accounts/create')}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Nova Conta
              </Button>
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Contas</p>
                  <p className="text-2xl font-bold text-primary-600">{accounts.length}</p>
                </div>
                <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-primary-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Com Email</p>
                  <p className="text-2xl font-bold text-accent-600">
                    {accounts.filter(a => a.email).length}
                  </p>
                </div>
                <div className="h-12 w-12 bg-accent-100 rounded-lg flex items-center justify-center">
                  <Mail className="h-6 w-6 text-accent-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Com Telefone</p>
                  <p className="text-2xl font-bold text-secondary-600">
                    {accounts.filter(a => a.phone).length}
                  </p>
                </div>
                <div className="h-12 w-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                  <Phone className="h-6 w-6 text-secondary-600" />
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
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar por razão social, CNPJ ou email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>
              <div className="flex items-end">
                <Button
                  onClick={() => setSearchTerm('')}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  Limpar Filtros
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Contas */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Lista de Contas</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
              </div>
            ) : filteredAccounts.length === 0 ? (
              <div className="text-center py-8">
                <Building2 className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  {searchTerm ? 'Nenhuma conta encontrada com os filtros aplicados' : 'Nenhuma conta cadastrada'}
                </p>
                {!searchTerm && (
                  <Button
                    onClick={() => router.push('/accounts/create')}
                    className="mt-4"
                  >
                    Criar Primeira Conta
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Empresa</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">CNPJ</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">IE</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Contato</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Criado em</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAccounts.map((account) => (
                      <tr key={account.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-primary-100 rounded-lg flex items-center justify-center">
                              <Building2 className="h-6 w-6 text-primary-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{account.corporateName}</p>
                              <p className="text-xs text-gray-500">ID: {account.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-700 font-mono">
                              {formatCNPJ(account.cnpj)}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-700">{account.ie || '-'}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="space-y-1">
                            {account.phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="h-3 w-3 text-gray-400" />
                                <span className="text-xs text-gray-700">{account.phone}</span>
                              </div>
                            )}
                            {account.email && (
                              <div className="flex items-center gap-2">
                                <Mail className="h-3 w-3 text-gray-400" />
                                <span className="text-xs text-gray-700">{account.email}</span>
                              </div>
                            )}
                            {!account.phone && !account.email && (
                              <span className="text-xs text-gray-500">Sem contato</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-700">
                              {account.createdAt ? formatDate(account.createdAt) : '-'}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(`/accounts/${account.id}`)}
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(`/accounts/edit/${account.id}`)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(account.id)}
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