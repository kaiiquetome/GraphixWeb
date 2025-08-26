import { apiClient } from './client'
import type {
  OrderServiceDtoResponse,
  CreateOrderServiceRequest,
  UpdateOrderServiceRequest,
  ListOrderServiceResponse
} from '@/types/api'

export class OrderServiceService {
  private static baseUrl = '/OrderService'

  /**
   * Lista todas as ordens de serviço com paginação
   */
  static async list(params?: {
    pageSize?: number
    cursor?: string
    startDate?: string
    endDate?: string
  }): Promise<ListOrderServiceResponse> {
    const searchParams = new URLSearchParams()
    
    if (params?.pageSize) searchParams.append('PageSize', params.pageSize.toString())
    if (params?.cursor) searchParams.append('Cursor', params.cursor)
    if (params?.startDate) searchParams.append('StartDate', params.startDate)
    if (params?.endDate) searchParams.append('EndDate', params.endDate)

    const url = `${this.baseUrl}${searchParams.toString() ? `?${searchParams}` : ''}`
    return apiClient.get<ListOrderServiceResponse>(url)
  }

  /**
   * Busca uma ordem de serviço por ID
   */
  static async getById(id: number): Promise<OrderServiceDtoResponse> {
    return apiClient.get<OrderServiceDtoResponse>(`${this.baseUrl}/${id}`)
  }

  /**
   * Cria uma nova ordem de serviço
   */
  static async create(data: CreateOrderServiceRequest): Promise<OrderServiceDtoResponse> {
    return apiClient.post<OrderServiceDtoResponse>(this.baseUrl, data)
  }

  /**
   * Atualiza uma ordem de serviço existente
   */
  static async update(data: UpdateOrderServiceRequest): Promise<OrderServiceDtoResponse> {
    return apiClient.put<OrderServiceDtoResponse>(`${this.baseUrl}/${data.id}`, data)
  }

  /**
   * Remove uma ordem de serviço
   */
  static async delete(id: number): Promise<boolean> {
    return apiClient.delete<boolean>(`${this.baseUrl}/${id}`)
  }

  /**
   * Download de relatório de ordens de serviço
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
}