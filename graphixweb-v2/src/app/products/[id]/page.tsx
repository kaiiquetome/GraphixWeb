'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MainLayout } from '@/components/layout/main-layout'
import { ProductService } from '@/lib/api'
import type { GetProductResponse } from '@/types/api'
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Loader2,
  Package,
  Settings,
  Palette,
  Ruler,
  Scissors,
  Circle,
  FileText,
  Calendar
} from 'lucide-react'

export default function ProductDetailPage() {
  const router = useRouter()
  const params = useParams()
  const productId = parseInt(params.id as string)
  
  const [productData, setProductData] = useState<GetProductResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (productId) {
      fetchProduct()
    }
  }, [productId])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await ProductService.getById(productId)
      setProductData(response)
    } catch (err: any) {
      setError(err.error || 'Erro ao carregar produto')
      console.error('Erro ao buscar produto:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita.')) {
      return
    }

    try {
      await ProductService.delete(productId)
      router.push('/products')
    } catch (err: any) {
      setError(err.error || 'Erro ao excluir produto')
      console.error('Erro ao excluir produto:', err)
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

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </MainLayout>
    )
  }

  if (error || !productData?.product) {
    return (
      <MainLayout>
        <div className="p-4 lg:p-6">
          <div className="text-center py-12">
            <Package className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {error || 'Produto não encontrado'}
            </h3>
            <p className="text-gray-600 mb-4">
              {error || 'O produto solicitado não foi encontrado ou foi removido.'}
            </p>
            <Button onClick={() => router.push('/products')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar para Produtos
            </Button>
          </div>
        </div>
      </MainLayout>
    )
  }

  const product = productData.product

  return (
    <MainLayout>
      <div className="p-4 lg:p-6">
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => router.push('/products')}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {product.description || `Produto #${product.id}`}
                </h1>
                <p className="text-gray-600 mt-1">Detalhes do produto</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => router.push(`/products/${product.id}/edit`)}
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
                  <Package className="h-5 w-5" />
                  Informações do Produto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descrição
                    </label>
                    <p className="text-gray-900 font-medium">
                      {product.description || 'N/A'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Material
                    </label>
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4 text-gray-400" />
                      <p className="text-gray-900">{product.material || 'N/A'}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Cor
                    </label>
                    <div className="flex items-center gap-2">
                      <Palette className="h-4 w-4 text-gray-400" />
                      <p className="text-gray-900">{product.color || 'N/A'}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Dimensão
                    </label>
                    <div className="flex items-center gap-2">
                      <Ruler className="h-4 w-4 text-gray-400" />
                      <p className="text-gray-900">{product.dimension || 'N/A'}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Acabamento
                    </label>
                    <p className="text-gray-900">{product.finish || 'N/A'}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      ID do Sistema
                    </label>
                    <p className="text-gray-900">#{product.id}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Especificações Técnicas */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Especificações Técnicas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Faca
                    </label>
                    <div className="flex items-center gap-2">
                      <Scissors className="h-4 w-4 text-gray-400" />
                      <p className="text-gray-900">{product.knife || 'N/A'}</p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tubo
                    </label>
                    <div className="flex items-center gap-2">
                      <Circle className="h-4 w-4 text-gray-400" />
                      <p className="text-gray-900">{product.tubet || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {product.observation && (
                  <div className="pt-4 border-t">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Observações
                    </label>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-gray-700 text-sm whitespace-pre-wrap">{product.observation}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Informações Adicionais */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Informações do Sistema
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Data de Cadastro
                  </label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <p className="text-gray-900 text-sm">{formatDate(product.createdAt)}</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold bg-green-100 text-green-800">
                    Ativo
                  </span>
                </div>

                <div className="pt-4 border-t">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ações Rápidas
                  </label>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => router.push(`/products/${product.id}/edit`)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Editar Produto
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => console.log('Duplicar produto')}
                    >
                      <Package className="h-4 w-4 mr-2" />
                      Duplicar Produto
                    </Button>
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
              <CardTitle>Histórico de Uso</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <p>Funcionalidade em desenvolvimento</p>
                <p className="text-sm">Em breve você poderá visualizar em quais pedidos este produto foi utilizado</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}