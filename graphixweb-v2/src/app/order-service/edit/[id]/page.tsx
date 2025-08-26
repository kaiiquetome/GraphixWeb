'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MainLayout } from '@/components/layout/main-layout'
import { 
  Loader2, 
  Save, 
  ArrowLeft, 
  AlertCircle, 
  CheckCircle,
  Calendar,
  User,
  Package,
  Settings,
  Palette,
  RotateCcw,
  BarChart3,
  FileText
} from 'lucide-react'

// Tipos baseados no swagger.json
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
  rewindings?: any[] // RewindingDtoRequest[]
  traceabilitys?: any[] // TraceabilityDtoRequest[]
  aniloxs?: any[] // AniloxDtoRequest[]
  order: any // OrderDtoResponse
  customer: any // CustomerDtoResponse
}

interface UpdateOrderServiceRequest {
  id: number
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
  machine: any
  inkMixs?: any[]
  rewindings?: any[]
  traceabilitys?: any[]
  aniloxs?: any[]
}

export default function EditOrderServicePage() {
  const params = useParams()
  const router = useRouter()
  const { isAuthenticated, isLoading } = useAuth()
  const [orderService, setOrderService] = useState<OrderServiceDtoResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const orderServiceId = params.id as string

  // Verificar autenticação
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  // Buscar dados do Order Service
  const fetchOrderService = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const token = localStorage.getItem('jwtToken')
      if (!token) {
        throw new Error('Token não encontrado')
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/OrderService/${orderServiceId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      setOrderService(data)
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar Order Service')
      console.error('Erro ao buscar Order Service:', err)
    } finally {
      setLoading(false)
    }
  }

  // Carregar dados na montagem do componente
  useEffect(() => {
    if (isAuthenticated && !isLoading && orderServiceId) {
      fetchOrderService()
    }
  }, [isAuthenticated, isLoading, orderServiceId])

  // Salvar alterações
  const handleSave = async () => {
    if (!orderService) return

    try {
      setSaving(true)
      setError(null)
      setSuccess(null)
      
      const token = localStorage.getItem('jwtToken')
      if (!token) {
        throw new Error('Token não encontrado')
      }

      const updateData: UpdateOrderServiceRequest = {
        id: orderService.id,
        orderId: orderService.orderId,
        customerId: orderService.customerId,
        observation: orderService.observation,
        deliveryDeadline: orderService.deliveryDeadline,
        quantity: orderService.quantity,
        rollQuantityKg: orderService.rollQuantityKg,
        rollQuantityMeters: orderService.rollQuantityMeters,
        productionStartDate: orderService.productionStartDate,
        productionEndDate: orderService.productionEndDate,
        operator: orderService.operator,
        status: orderService.status,
        labelOrientation: orderService.labelOrientation,
        machine: orderService.machine,
        inkMixs: orderService.inkMixs,
        rewindings: orderService.rewindings,
        traceabilitys: orderService.traceabilitys,
        aniloxs: orderService.aniloxs
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/OrderService`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${response.statusText}`)
      }

      setSuccess('Order Service atualizado com sucesso!')
      setTimeout(() => {
        router.push('/order-service')
      }, 2000)
    } catch (err: any) {
      setError(err.message || 'Erro ao atualizar Order Service')
      console.error('Erro ao atualizar Order Service:', err)
    } finally {
      setSaving(false)
    }
  }

  // Função para formatar data
  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    return new Date(dateString).toISOString().split('T')[0]
  }

  // Função para obter status em texto
  const getStatusText = (status: number) => {
    const statusMap: Record<number, string> = {
      1: 'Pendente',
      2: 'Em Produção',
      3: 'Concluído',
      4: 'Cancelado',
      5: 'Aguardando Aprovação'
    }
    return statusMap[status] || `Status ${status}`
  }

  // Função para obter orientação de label
  const getLabelOrientationText = (orientation: number) => {
    const orientationMap: Record<number, string> = {
      1: 'Horizontal',
      2: 'Vertical',
      3: 'Diagonal'
    }
    return orientationMap[orientation] || `Orientação ${orientation}`
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

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2 text-gray-600">Carregando Order Service...</span>
        </div>
      </MainLayout>
    )
  }

  if (!orderService) {
    return (
      <MainLayout>
        <div className="p-4 lg:p-6">
          <div className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Order Service não encontrado</h3>
            <p className="text-gray-600">O Order Service solicitado não foi encontrado.</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="p-4 lg:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => router.push('/order-service')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                Editar Order Service #{orderService.orderId}
              </h1>
              <p className="text-gray-600 mt-1">Atualize as informações do serviço</p>
            </div>
          </div>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saving ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>

        {/* Alertas */}
        {error && (
          <div className="mb-4 rounded-md bg-red-50 border border-red-200 p-4">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-800">Erro</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-md bg-green-50 border border-green-200 p-4">
            <div className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-400 mt-0.5 mr-3 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-green-800">Sucesso</h3>
                <p className="text-sm text-green-700 mt-1">{success}</p>
              </div>
            </div>
          </div>
        )}

        {/* Formulário */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Informações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="ID do Pedido"
                  type="number"
                  value={orderService.orderId}
                  onChange={(e) => setOrderService({
                    ...orderService,
                    orderId: parseInt(e.target.value) || 0
                  })}
                />
                <Input
                  label="ID do Cliente"
                  type="number"
                  value={orderService.customerId}
                  onChange={(e) => setOrderService({
                    ...orderService,
                    customerId: parseInt(e.target.value) || 0
                  })}
                />
              </div>

              <Input
                label="Observação"
                type="text"
                value={orderService.observation || ''}
                onChange={(e) => setOrderService({
                  ...orderService,
                  observation: e.target.value
                })}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Status"
                  type="number"
                  value={orderService.status}
                  onChange={(e) => setOrderService({
                    ...orderService,
                    status: parseInt(e.target.value) || 0
                  })}
                  helperText={getStatusText(orderService.status)}
                />
                <Input
                  label="Orientação da Label"
                  type="number"
                  value={orderService.labelOrientation}
                  onChange={(e) => setOrderService({
                    ...orderService,
                    labelOrientation: parseInt(e.target.value) || 0
                  })}
                  helperText={getLabelOrientationText(orderService.labelOrientation)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Datas e Prazos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Datas e Prazos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Prazo de Entrega"
                type="datetime-local"
                value={formatDate(orderService.deliveryDeadline)}
                onChange={(e) => setOrderService({
                  ...orderService,
                  deliveryDeadline: e.target.value ? new Date(e.target.value).toISOString() : undefined
                })}
              />

              <Input
                label="Data de Início da Produção"
                type="datetime-local"
                value={formatDate(orderService.productionStartDate)}
                onChange={(e) => setOrderService({
                  ...orderService,
                  productionStartDate: e.target.value ? new Date(e.target.value).toISOString() : undefined
                })}
              />

              <Input
                label="Data de Fim da Produção"
                type="datetime-local"
                value={formatDate(orderService.productionEndDate)}
                onChange={(e) => setOrderService({
                  ...orderService,
                  productionEndDate: e.target.value ? new Date(e.target.value).toISOString() : undefined
                })}
              />
            </CardContent>
          </Card>

          {/* Quantidades */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Quantidades
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Quantidade"
                type="text"
                value={orderService.quantity || ''}
                onChange={(e) => setOrderService({
                  ...orderService,
                  quantity: e.target.value
                })}
              />

              <Input
                label="Quantidade de Bobinas (Kg)"
                type="text"
                value={orderService.rollQuantityKg || ''}
                onChange={(e) => setOrderService({
                  ...orderService,
                  rollQuantityKg: e.target.value
                })}
              />

              <Input
                label="Quantidade de Bobinas (Metros)"
                type="text"
                value={orderService.rollQuantityMeters || ''}
                onChange={(e) => setOrderService({
                  ...orderService,
                  rollQuantityMeters: e.target.value
                })}
              />
            </CardContent>
          </Card>

          {/* Operador */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Operador
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="Operador"
                type="text"
                value={orderService.operator || ''}
                onChange={(e) => setOrderService({
                  ...orderService,
                  operator: e.target.value
                })}
              />
            </CardContent>
          </Card>

          {/* Máquina */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configuração da Máquina
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="inkAdherenceOk"
                    checked={orderService.machine?.inkAdherenceOk || false}
                    onChange={(e) => setOrderService({
                      ...orderService,
                      machine: { ...orderService.machine, inkAdherenceOk: e.target.checked }
                    })}
                    className="rounded"
                  />
                  <label htmlFor="inkAdherenceOk" className="text-sm">Aderência de Tinta OK</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="colorOk"
                    checked={orderService.machine?.colorOk || false}
                    onChange={(e) => setOrderService({
                      ...orderService,
                      machine: { ...orderService.machine, colorOk: e.target.checked }
                    })}
                    className="rounded"
                  />
                  <label htmlFor="colorOk" className="text-sm">Cor OK</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="legibleTextOk"
                    checked={orderService.machine?.legibleTextOk || false}
                    onChange={(e) => setOrderService({
                      ...orderService,
                      machine: { ...orderService.machine, legibleTextOk: e.target.checked }
                    })}
                    className="rounded"
                  />
                  <label htmlFor="legibleTextOk" className="text-sm">Texto Legível OK</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="cutOk"
                    checked={orderService.machine?.cutOk || false}
                    onChange={(e) => setOrderService({
                      ...orderService,
                      machine: { ...orderService.machine, cutOk: e.target.checked }
                    })}
                    className="rounded"
                  />
                  <label htmlFor="cutOk" className="text-sm">Corte OK</label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="generalAspectOk"
                    checked={orderService.machine?.generalAspectOk || false}
                    onChange={(e) => setOrderService({
                      ...orderService,
                      machine: { ...orderService.machine, generalAspectOk: e.target.checked }
                    })}
                    className="rounded"
                  />
                  <label htmlFor="generalAspectOk" className="text-sm">Aspecto Geral OK</label>
                </div>
              </div>
              
              <div className="space-y-3">
                <Input
                  label="Motivo Aderência de Tinta"
                  type="text"
                  value={orderService.machine?.inkAdherenceReason || ''}
                  onChange={(e) => setOrderService({
                    ...orderService,
                    machine: { ...orderService.machine, inkAdherenceReason: e.target.value }
                  })}
                />
                <Input
                  label="Motivo Cor"
                  type="text"
                  value={orderService.machine?.colorReason || ''}
                  onChange={(e) => setOrderService({
                    ...orderService,
                    machine: { ...orderService.machine, colorReason: e.target.value }
                  })}
                />
                <Input
                  label="Motivo Texto Legível"
                  type="text"
                  value={orderService.machine?.legibleTextReason || ''}
                  onChange={(e) => setOrderService({
                    ...orderService,
                    machine: { ...orderService.machine, legibleTextReason: e.target.value }
                  })}
                />
                <Input
                  label="Motivo Corte"
                  type="text"
                  value={orderService.machine?.cutReason || ''}
                  onChange={(e) => setOrderService({
                    ...orderService,
                    machine: { ...orderService.machine, cutReason: e.target.value }
                  })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Misturas de Tinta */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Misturas de Tinta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Input
                  label="Nome da Tinta Pantone"
                  type="text"
                  value={orderService.inkMixs?.[0]?.inkNamePantone || ''}
                  onChange={(e) => setOrderService({
                    ...orderService,
                    inkMixs: [{ ...orderService.inkMixs?.[0], inkNamePantone: e.target.value }]
                  })}
                />
                <Input
                  label="Lote Utilizado"
                  type="text"
                  value={orderService.inkMixs?.[0]?.lotUsed || ''}
                  onChange={(e) => setOrderService({
                    ...orderService,
                    inkMixs: [{ ...orderService.inkMixs?.[0], lotUsed: e.target.value }]
                  })}
                />
                <Input
                  label="Percentual"
                  type="text"
                  value={orderService.inkMixs?.[0]?.percentage || ''}
                  onChange={(e) => setOrderService({
                    ...orderService,
                    inkMixs: [{ ...orderService.inkMixs?.[0], percentage: e.target.value }]
                  })}
                />
                <Input
                  label="Lote Final"
                  type="text"
                  value={orderService.inkMixs?.[0]?.finalLot || ''}
                  onChange={(e) => setOrderService({
                    ...orderService,
                    inkMixs: [{ ...orderService.inkMixs?.[0], finalLot: e.target.value }]
                  })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Rebobinamento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5" />
                Rebobinamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Input
                  label="ID do Produto"
                  type="number"
                  value={orderService.rewindings?.[0]?.productId || ''}
                  onChange={(e) => setOrderService({
                    ...orderService,
                    rewindings: [{ ...orderService.rewindings?.[0], productId: parseInt(e.target.value) || 0 }]
                  })}
                />
                <Input
                  label="Revisado Por"
                  type="text"
                  value={orderService.rewindings?.[0]?.reviewedBy || ''}
                  onChange={(e) => setOrderService({
                    ...orderService,
                    rewindings: [{ ...orderService.rewindings?.[0], reviewedBy: e.target.value }]
                  })}
                />
                <Input
                  label="Quantidade de Bobinas"
                  type="text"
                  value={orderService.rewindings?.[0]?.rollQuantity || ''}
                  onChange={(e) => setOrderService({
                    ...orderService,
                    rewindings: [{ ...orderService.rewindings?.[0], rollQuantity: e.target.value }]
                  })}
                />
                <Input
                  label="Quantidade de Caixas"
                  type="text"
                  value={orderService.rewindings?.[0]?.boxQuantity || ''}
                  onChange={(e) => setOrderService({
                    ...orderService,
                    rewindings: [{ ...orderService.rewindings?.[0], boxQuantity: e.target.value }]
                  })}
                />
                <Input
                  label="Data de Início"
                  type="datetime-local"
                  value={formatDate(orderService.rewindings?.[0]?.startDate)}
                  onChange={(e) => setOrderService({
                    ...orderService,
                    rewindings: [{ ...orderService.rewindings?.[0], startDate: e.target.value ? new Date(e.target.value).toISOString() : undefined }]
                  })}
                />
                <Input
                  label="Data de Fim"
                  type="datetime-local"
                  value={formatDate(orderService.rewindings?.[0]?.endDate)}
                  onChange={(e) => setOrderService({
                    ...orderService,
                    rewindings: [{ ...orderService.rewindings?.[0], endDate: e.target.value ? new Date(e.target.value).toISOString() : undefined }]
                  })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Rastreabilidade */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Rastreabilidade
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Input
                  label="Matéria Prima Tinta"
                  type="text"
                  value={orderService.traceabilitys?.[0]?.rawMaterialInk || ''}
                  onChange={(e) => setOrderService({
                    ...orderService,
                    traceabilitys: [{ ...orderService.traceabilitys?.[0], rawMaterialInk: e.target.value }]
                  })}
                />
                <Input
                  label="Lote"
                  type="text"
                  value={orderService.traceabilitys?.[0]?.lot || ''}
                  onChange={(e) => setOrderService({
                    ...orderService,
                    traceabilitys: [{ ...orderService.traceabilitys?.[0], lot: e.target.value }]
                  })}
                />
                <Input
                  label="Quantidade"
                  type="number"
                  value={orderService.traceabilitys?.[0]?.quantity || ''}
                  onChange={(e) => setOrderService({
                    ...orderService,
                    traceabilitys: [{ ...orderService.traceabilitys?.[0], quantity: parseInt(e.target.value) || 0 }]
                  })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Anilox */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Anilox
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <Input
                  label="Número"
                  type="number"
                  value={orderService.aniloxs?.[0]?.number || ''}
                  onChange={(e) => setOrderService({
                    ...orderService,
                    aniloxs: [{ ...orderService.aniloxs?.[0], number: parseInt(e.target.value) || 0 }]
                  })}
                />
                <Input
                  label="Cromia"
                  type="text"
                  value={orderService.aniloxs?.[0]?.cromia || ''}
                  onChange={(e) => setOrderService({
                    ...orderService,
                    aniloxs: [{ ...orderService.aniloxs?.[0], cromia: e.target.value }]
                  })}
                />
                <Input
                  label="Pantone"
                  type="text"
                  value={orderService.aniloxs?.[0]?.pantone || ''}
                  onChange={(e) => setOrderService({
                    ...orderService,
                    aniloxs: [{ ...orderService.aniloxs?.[0], pantone: e.target.value }]
                  })}
                />
                <Input
                  label="BCM"
                  type="text"
                  value={orderService.aniloxs?.[0]?.bcm || ''}
                  onChange={(e) => setOrderService({
                    ...orderService,
                    aniloxs: [{ ...orderService.aniloxs?.[0], bcm: e.target.value }]
                  })}
                />
                <Input
                  label="Linhas"
                  type="text"
                  value={orderService.aniloxs?.[0]?.lines || ''}
                  onChange={(e) => setOrderService({
                    ...orderService,
                    aniloxs: [{ ...orderService.aniloxs?.[0], lines: e.target.value }]
                  })}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
} 