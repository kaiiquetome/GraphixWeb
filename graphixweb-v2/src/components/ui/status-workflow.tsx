'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { OrderStatus, getOrderStatusText, getOrderStatusColor } from '@/types/api'
import { CheckCircle, Clock, PlayCircle, XCircle, AlertCircle } from 'lucide-react'

interface StatusWorkflowProps {
  currentStatus: OrderStatus
  onStatusChange: (newStatus: OrderStatus) => Promise<void>
  disabled?: boolean
  showDescription?: boolean
}

export function StatusWorkflow({ 
  currentStatus, 
  onStatusChange, 
  disabled = false,
  showDescription = true 
}: StatusWorkflowProps) {
  const [loading, setLoading] = useState(false)

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (newStatus === currentStatus || loading) return

    try {
      setLoading(true)
      await onStatusChange(newStatus)
    } catch (error) {
      console.error('Erro ao alterar status:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 0: return <Clock className="h-4 w-4" /> // Orçamento
      case 1: return <PlayCircle className="h-4 w-4" /> // Em Execução
      case 2: return <CheckCircle className="h-4 w-4" /> // Finalizado
      case 3: return <XCircle className="h-4 w-4" /> // Recusado
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  const getStatusDescription = (status: OrderStatus) => {
    switch (status) {
      case 0: return "Aguardando aprovação do cliente"
      case 1: return "Pedido em processo de produção"
      case 2: return "Pedido concluído e entregue"
      case 3: return "Pedido cancelado ou recusado"
      default: return ""
    }
  }

  const isStatusChangeAllowed = (fromStatus: OrderStatus, toStatus: OrderStatus) => {
    // Regras de negócio FirstLabel
    switch (fromStatus) {
      case 0: // Orçamento pode ir para qualquer status
        return true
      case 1: // Em Execução pode ir para Finalizado ou Recusado
        return toStatus === 2 || toStatus === 3
      case 2: // Finalizado não pode ser alterado
        return false
      case 3: // Recusado pode voltar para Orçamento
        return toStatus === 0
      default:
        return false
    }
  }

  const statuses: { value: OrderStatus; label: string; color: string }[] = [
    { value: 0, label: 'Orçamento', color: 'text-yellow-600 hover:bg-yellow-50 border-yellow-200' },
    { value: 1, label: 'Em Execução', color: 'text-blue-600 hover:bg-blue-50 border-blue-200' },
    { value: 2, label: 'Finalizado', color: 'text-green-600 hover:bg-green-50 border-green-200' },
    { value: 3, label: 'Recusado', color: 'text-red-600 hover:bg-red-50 border-red-200' }
  ]

  return (
    <div className="space-y-4">
      {/* Status Atual */}
      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
        {getStatusIcon(currentStatus)}
        <div>
          <span className={`font-semibold ${getOrderStatusColor(currentStatus).replace('bg-', 'text-').replace('-100', '-600')}`}>
            Status Atual: {getOrderStatusText(currentStatus)}
          </span>
          {showDescription && (
            <p className="text-sm text-gray-600 mt-1">
              {getStatusDescription(currentStatus)}
            </p>
          )}
        </div>
      </div>

      {/* Botões de Mudança de Status */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Alterar Status
        </label>
        <div className="grid grid-cols-2 gap-2">
          {statuses.map((status) => {
            const isAllowed = isStatusChangeAllowed(currentStatus, status.value)
            const isCurrent = status.value === currentStatus
            
            return (
              <Button
                key={status.value}
                variant="outline"
                size="sm"
                onClick={() => handleStatusChange(status.value)}
                disabled={disabled || loading || !isAllowed || isCurrent}
                className={`
                  flex items-center gap-2 justify-start
                  ${isCurrent ? 'bg-gray-100 border-gray-300' : ''}
                  ${isAllowed && !isCurrent ? status.color : 'text-gray-400'}
                  ${!isAllowed && !isCurrent ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                title={
                  isCurrent 
                    ? 'Status atual' 
                    : !isAllowed 
                    ? 'Mudança de status não permitida'
                    : `Alterar para ${status.label}`
                }
              >
                {getStatusIcon(status.value)}
                {status.label}
                {isCurrent && <span className="text-xs">(atual)</span>}
              </Button>
            )
          })}
        </div>
      </div>

      {/* Workflow Visual */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Fluxo do Pedido
        </label>
        <div className="flex items-center space-x-2 text-sm">
          {statuses.slice(0, 3).map((status, index) => (
            <div key={status.value} className="flex items-center">
              <div className={`
                flex items-center gap-1 px-2 py-1 rounded
                ${currentStatus === status.value 
                  ? getOrderStatusColor(status.value)
                  : 'bg-gray-100 text-gray-500'
                }
              `}>
                {getStatusIcon(status.value)}
                <span className="text-xs font-medium">{status.label}</span>
              </div>
              {index < 2 && (
                <div className="mx-2 text-gray-400">→</div>
              )}
            </div>
          ))}
        </div>
        <p className="text-xs text-gray-500">
          * Pedidos recusados podem retornar ao status de orçamento
        </p>
      </div>
    </div>
  )
}