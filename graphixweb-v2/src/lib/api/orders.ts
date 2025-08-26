import { apiClient } from './client'
import type {
  OrderDtoResponse,
  CreateOrderRequest,
  UpdateOrderRequest,
  ListOrderResponse,
  OrderStatus
} from '@/types/api'

export class OrderService {
  private static baseUrl = '/order'

  /**
   * Lista todos os pedidos com paginação e filtros
   */
  static async list(params?: {
    pageSize?: number
    cursor?: string
    startDate?: string
    endDate?: string
    status?: OrderStatus
    customerId?: number
  }): Promise<ListOrderResponse> {
    const searchParams = new URLSearchParams()
    
    if (params?.pageSize) searchParams.append('PageSize', params.pageSize.toString())
    if (params?.cursor) searchParams.append('Cursor', params.cursor)
    if (params?.startDate) searchParams.append('StartDate', params.startDate)
    if (params?.endDate) searchParams.append('EndDate', params.endDate)
    if (params?.status !== undefined) searchParams.append('Status', params.status.toString())
    if (params?.customerId) searchParams.append('CustomerId', params.customerId.toString())

    const url = `${this.baseUrl}${searchParams.toString() ? `?${searchParams}` : ''}`
    return apiClient.get<ListOrderResponse>(url)
  }

  /**
   * Busca um pedido por ID com itens e relacionamentos
   */
  static async getById(id: number): Promise<OrderDtoResponse> {
    return apiClient.get<OrderDtoResponse>(`${this.baseUrl}/${id}`)
  }

  /**
   * Cria um novo pedido com itens
   */
  static async create(data: CreateOrderRequest): Promise<OrderDtoResponse> {
    return apiClient.post<OrderDtoResponse>(this.baseUrl, data)
  }

  /**
   * Atualiza um pedido existente
   */
  static async update(data: UpdateOrderRequest): Promise<OrderDtoResponse> {
    return apiClient.put<OrderDtoResponse>(`${this.baseUrl}/${data.id}`, data)
  }

  /**
   * Remove um pedido
   */
  static async delete(id: number): Promise<boolean> {
    return apiClient.delete<boolean>(`${this.baseUrl}/${id}`)
  }

  /**
   * Altera status do pedido (Workflow FirstLabel)
   */
  static async updateStatus(id: number, status: OrderStatus): Promise<OrderDtoResponse> {
    const currentOrder = await this.getById(id)
    const updateData: UpdateOrderRequest = {
      ...currentOrder,
              status
    }
    return this.update(updateData)
  }

  /**
   * Gera orçamento em PDF (FirstLabel specific)
   */
  static async generateOrcamento(id: number): Promise<Blob> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${this.baseUrl}/${id}/download`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Erro ${response.status}: ${response.statusText}`)
    }

    return response.blob()
  }

  /**
   * Gera ordem de serviço em PDF (FirstLabel specific)
   */
  static async generateOrdemServico(id: number): Promise<Blob> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${this.baseUrl}/${id}/ordem-servico`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Erro ${response.status}: ${response.statusText}`)
    }

    return response.blob()
  }

  /**
   * Download de relatório de pedidos
   */
  static async download(): Promise<Blob> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${this.baseUrl}/download`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Erro ${response.status}: ${response.statusText}`)
    }

    return response.blob()
  }

  /**
   * Export de pedidos
   */
  static async export(): Promise<Blob> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${this.baseUrl}/export`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Erro ${response.status}: ${response.statusText}`)
    }

    return response.blob()
  }

  /**
   * Calcula total do pedido baseado nos itens
   */
  static calculateOrderTotal(items: { quantity: number; total: number }[]): number {
    return items.reduce((sum, item) => sum + (item.quantity * item.total), 0)
  }

  /**
   * Gera próximo número de pedido
   */
  static async getNextOrderNumber(): Promise<number> {
    // Esta funcionalidade pode ser implementada no backend
    // Por ora, geramos um número baseado no timestamp
    return Date.now()
  }
}