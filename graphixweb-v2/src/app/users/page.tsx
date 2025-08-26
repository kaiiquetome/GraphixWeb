'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/providers/auth-provider'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MainLayout } from '@/components/layout/main-layout'
import { UserService } from '@/lib/api'
import type { UserDtoResponse, ListUserResponse } from '@/types/api'
import { 
  Loader2, 
  Plus, 
  RefreshCw, 
  Search, 
  Filter, 
  Edit, 
  Eye, 
  Trash2,
  UserCircle,
  Users,
  Shield,
  Mail,
  Calendar,
  CheckCircle,
  XCircle
} from 'lucide-react'

export default function UsersPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [users, setUsers] = useState<UserDtoResponse[]>([])
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

  // Buscar usuários
  useEffect(() => {
    if (isAuthenticated) {
      fetchUsers()
    }
  }, [isAuthenticated])

  const fetchUsers = async (newCursor?: string | null) => {
    try {
      setLoading(true)
      setError(null)

      const params = {
        pageSize,
        cursor: newCursor || cursor || undefined
      }

      const response: ListUserResponse = await UserService.list(params)
      setUsers(response.data || [])
      setCursor(response.cursor || null)
    } catch (err: any) {
      setError(err.error || 'Erro ao carregar usuários')
      console.error('Erro ao buscar usuários:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita.')) {
      return
    }

    try {
      await UserService.delete(id)
      await fetchUsers()
    } catch (err: any) {
      setError(err.error || 'Erro ao excluir usuário')
      console.error('Erro ao excluir usuário:', err)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const getRoleText = (role: number) => {
    const roles = {
      0: 'Administrador',
      1: 'Operador',
      2: 'Visualizador'
    }
    return roles[role as keyof typeof roles] || 'Não definido'
  }

  const getRoleBadgeColor = (role: number) => {
    const colors = {
      0: 'bg-primary-100 text-primary-800', // Admin
      1: 'bg-accent-100 text-accent-800',   // Operador
      2: 'bg-secondary-100 text-secondary-800' // Visualizador
    }
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.login?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
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
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Usuários</h1>
              <p className="text-gray-600 mt-1">Gerenciamento de usuários do sistema</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => fetchUsers()}
                disabled={loading}
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Atualizar
              </Button>
              <Button
                onClick={() => router.push('/users/create')}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Novo Usuário
              </Button>
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total de Usuários</p>
                  <p className="text-2xl font-bold text-primary-600">{users.length}</p>
                </div>
                <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-primary-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Administradores</p>
                  <p className="text-2xl font-bold text-accent-600">
                    {users.filter(u => u.role === 0).length}
                  </p>
                </div>
                <div className="h-12 w-12 bg-accent-100 rounded-lg flex items-center justify-center">
                  <Shield className="h-6 w-6 text-accent-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Operadores</p>
                  <p className="text-2xl font-bold text-secondary-600">
                    {users.filter(u => u.role === 1).length}
                  </p>
                </div>
                <div className="h-12 w-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                  <UserCircle className="h-6 w-6 text-secondary-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ativos</p>
                  <p className="text-2xl font-bold text-primary-600">
                    {users.filter(u => u.isActive).length}
                  </p>
                </div>
                <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-6 w-6 text-primary-600" />
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
                    placeholder="Buscar por nome, login ou email..."
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

        {/* Lista de Usuários */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Lista de Usuários</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-8">
                <UserCircle className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">
                  {searchTerm ? 'Nenhum usuário encontrado com os filtros aplicados' : 'Nenhum usuário cadastrado'}
                </p>
                {!searchTerm && (
                  <Button
                    onClick={() => router.push('/users/create')}
                    className="mt-4"
                  >
                    Criar Primeiro Usuário
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Usuário</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Login</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Perfil</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Criado em</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-700">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-primary-100 rounded-full flex items-center justify-center">
                              <UserCircle className="h-6 w-6 text-primary-600" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{user.name}</p>
                              <p className="text-xs text-gray-500">ID: {user.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-sm text-gray-700">{user.login}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-700">{user.email}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getRoleBadgeColor(user.role)}`}>
                            {getRoleText(user.role)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            {user.isActive ? (
                              <>
                                <CheckCircle className="h-4 w-4 text-accent-600" />
                                <span className="text-sm text-accent-600 font-medium">Ativo</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="h-4 w-4 text-error-600" />
                                <span className="text-sm text-error-600 font-medium">Inativo</span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-700">
                              {formatDate(user.createdAt)}
                            </span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(`/users/${user.id}`)}
                              className="h-8 w-8 p-0"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => router.push(`/users/edit/${user.id}`)}
                              className="h-8 w-8 p-0"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDelete(user.id)}
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