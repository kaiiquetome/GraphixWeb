'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MainLayout } from '@/components/layout/main-layout'
import { CustomerService } from '@/lib/api'
import type { CustomerDtoResponse } from '@/types/api'
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Loader2,
  Building2,
  FileText,
  Phone,
  Mail,
  User,
  Calendar
} from 'lucide-react'

export default function CustomerDetailPage() {
  const router = useRouter()
  const params = useParams()
  const customerId = parseInt(params.id as string)
  
  const [customer, setCustomer] = useState<CustomerDtoResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (customerId) {
      fetchCustomer()
    }
  }, [customerId])

  const fetchCustomer = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await CustomerService.getById(customerId)
      setCustomer(response)
    } catch (err: any) {
      setError(err.error || 'Erro ao carregar cliente')
      console.error('Erro ao buscar cliente:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.')) {
      return
    }

    try {
      await CustomerService.delete(customerId)
      router.push('/customers')
    } catch (err: any) {
      setError(err.error || 'Erro ao excluir cliente')
      console.error('Erro ao excluir cliente:', err)
    }
  }

  // Função para formatar data
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

  // Função para formatar CNPJ
  const formatCNPJ = (cnpj?: string) => {
    if (!cnpj) return 'N/A'
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5')
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

  if (error || !customer) {
    return (
      <MainLayout>
        <div className="p-4 lg:p-6">
          <div className="text-center py-12">
            <Building2 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {error || 'Cliente não encontrado'}
            </h3>
            <p className="text-gray-600 mb-4">
              {error || 'O cliente solicitado não foi encontrado ou foi removido.'}
            </p>
            <Button onClick={() => router.push('/customers')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Clientes
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
                onClick={() => router.push('/customers')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {customer.corporateName || `Cliente #${customer.id}`}
                </h1>
                <p className="text-gray-600 mt-1">Detalhes do cliente</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => router.push(`/customers/${customer.id}/edit`)}
                className="flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                Editar
              </Button>
              <Button
                variant="outline"
                onClick={handleDelete}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
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
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  Informações da Empresa
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Razão Social
                    </label>
                    <p className="text-gray-900 font-medium">
                      {customer.corporateName || 'N/A'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      CNPJ
                    </label>
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-400" />
                      <p className="text-gray-900">{formatCNPJ(customer.cnpj)}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Inscrição Estadual
                    </label>
                    <p className="text-gray-900">{customer.ie || 'N/A'}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ID do Sistema
                    </label>
                    <p className="text-gray-900">#{customer.id}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Informações de Contato */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="h-5 w-5" />
                  Contato
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nome do Contato
                  </label>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <p className="text-gray-900">{customer.contact || 'N/A'}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone
                  </label>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <p className="text-gray-900">{customer.phone || 'N/A'}</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <p className="text-gray-900 break-all">{customer.email || 'N/A'}</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Cadastro
                  </label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <p className="text-gray-900 text-sm">{formatDate(customer.createdAt)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Seção de Histórico/Relacionamentos Futuros */}
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Pedidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <p>Funcionalidade em desenvolvimento</p>
                <p className="text-sm">Em breve você poderá visualizar todos os pedidos deste cliente</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}