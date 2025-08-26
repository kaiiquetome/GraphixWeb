'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/providers/auth-provider'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MainLayout } from '@/components/layout/main-layout'
import { ProductService } from '@/lib/api'
import type { ProductDtoResponse, ListProductResponse } from '@/types/api'
import { 
  Loader2, 
  Plus, 
  RefreshCw, 
  Search, 
  Filter, 
  Edit, 
  Eye, 
  Trash2,
  Package,
  Palette,
  Ruler,
  FileText,
  Settings
} from 'lucide-react'

export default function ProductsPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [products, setProducts] = useState<ProductDtoResponse[]>([])
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

  // Função para buscar produtos
  const fetchProducts = async (newCursor?: string | null) => {
    try {
      setLoading(true)
      setError(null)

      const params = {
        pageSize,
        cursor: newCursor || cursor || undefined,
        startDate: dataInicio || undefined,
        endDate: dataFim || undefined
      }

      const response: ListProductResponse = await ProductService.list(params)
      setProducts(response.data || [])
      setCursor(response.cursor || null)
    } catch (err: any) {
      setError(err.error || 'Erro ao carregar produtos')
      console.error('Erro ao buscar produtos:', err)
    } finally {
      setLoading(false)
    }
  }

  // Função para deletar produto
  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) {
      return
    }

    try {
      await ProductService.delete(id)
      await fetchProducts() // Recarregar lista
    } catch (err: any) {
      setError(err.error || 'Erro ao excluir produto')
      console.error('Erro ao excluir produto:', err)
    }
  }

  // Função para limpar filtros
  const limparFiltros = () => {
    setSearchTerm('')
    setDataInicio('')
    setDataFim('')
    setCursor(null)
    setProducts([])
  }

  // Função para formatar data
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  // Função para truncar texto
  const truncateText = (text?: string, maxLength: number = 50) => {
    if (!text) return 'N/A'
    return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
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
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Produtos</h1>
              <p className="text-gray-600 mt-1">Gerencie o catálogo de produtos da gráfica</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={() => fetchProducts()}
                disabled={loading}
                variant="outline"
                className="flex items-center gap-2"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Atualizar</span>
              </Button>
              
              <Button 
                className="flex items-center gap-2"
                onClick={() => router.push('/products/create')}
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Novo Produto</span>
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
                  placeholder="Buscar por descrição, material, cor ou acabamento..."
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
            <span className="ml-2 text-gray-600">Carregando produtos...</span>
          </div>
        ) : products.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-gray-400 mb-4">
                <Package className="w-16 h-16" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum produto encontrado</h3>
              <p className="text-gray-600 text-center mb-4">
                {loading ? 'Carregando...' : 'Clique em "Atualizar" para buscar produtos ou "Novo Produto" para cadastrar o primeiro.'}
              </p>
              <Button onClick={() => router.push('/products/create')}>
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Primeiro Produto
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-sm lg:text-base line-clamp-2">
                        {product.description || `Produto #${product.id}`}
                      </CardTitle>
                      <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-800">
                        Ativo
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      {product.material && (
                        <div className="flex items-center text-xs text-gray-600">
                          <Settings className="h-3 w-3 mr-1" />
                          <span>Material: {product.material}</span>
                        </div>
                      )}
                      
                      {product.color && (
                        <div className="flex items-center text-xs text-gray-600">
                          <Palette className="h-3 w-3 mr-1" />
                          <span>Cor: {product.color}</span>
                        </div>
                      )}
                      
                      {product.dimension && (
                        <div className="flex items-center text-xs text-gray-600">
                          <Ruler className="h-3 w-3 mr-1" />
                          <span>Dimensão: {product.dimension}</span>
                        </div>
                      )}
                      
                      {product.finish && (
                        <div>
                          <p className="text-xs text-gray-600">Acabamento</p>
                          <p className="font-medium text-xs">{product.finish}</p>
                        </div>
                      )}
                      
                      {product.knife && (
                        <div>
                          <p className="text-xs text-gray-600">Faca</p>
                          <p className="font-medium text-xs">{product.knife}</p>
                        </div>
                      )}
                      
                      {product.tubet && (
                        <div>
                          <p className="text-xs text-gray-600">Tubo</p>
                          <p className="font-medium text-xs">{product.tubet}</p>
                        </div>
                      )}
                      
                      {product.observation && (
                        <div>
                          <p className="text-xs text-gray-600">Observação</p>
                          <p className="text-xs text-gray-700 line-clamp-2">{truncateText(product.observation, 60)}</p>
                        </div>
                      )}
                      
                      <div className="pt-1 border-t">
                        <p className="text-xs text-gray-500">
                          Cadastrado em: {formatDate(product.createdAt)}
                        </p>
                      </div>
                      
                      {/* Botões de ação */}
                      <div className="pt-2 flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 flex items-center gap-1 text-xs py-1"
                          onClick={() => router.push(`/products/${product.id}`)}
                        >
                          <Eye className="h-3 w-3" />
                          Ver
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 flex items-center gap-1 text-xs py-1"
                          onClick={() => router.push(`/products/${product.id}/edit`)}
                        >
                          <Edit className="h-3 w-3" />
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1 text-xs py-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(product.id)}
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
                    fetchProducts(null)
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
                  onClick={() => fetchProducts(null)}
                  disabled={!cursor}
                >
                  Primeira
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchProducts(cursor)}
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