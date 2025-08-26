import { apiClient } from './client'
import type {
  CashFlowDtoResponse,
  CreateCashFlowRequest,
  UpdateCashFlowRequest,
  ListCashFlowResponse
} from '@/types/api'

export class CashFlowService {
  private static baseUrl = '/cashFlow'

  /**
   * Lista todos os registros de fluxo de caixa com paginação
   */
  static async list(params?: {
    pageSize?: number
    cursor?: string
    startDate?: string
    endDate?: string
  }): Promise<ListCashFlowResponse> {
    const searchParams = new URLSearchParams()
    
    if (params?.pageSize) searchParams.append('PageSize', params.pageSize.toString())
    if (params?.cursor) searchParams.append('Cursor', params.cursor)
    if (params?.startDate) searchParams.append('StartDate', params.startDate)
    if (params?.endDate) searchParams.append('EndDate', params.endDate)

    const url = `${this.baseUrl}${searchParams.toString() ? `?${searchParams}` : ''}`
    return apiClient.get<ListCashFlowResponse>(url)
  }

  /**
   * Busca um registro de fluxo de caixa por ID
   */
  static async getById(id: number): Promise<CashFlowDtoResponse> {
    return apiClient.get<CashFlowDtoResponse>(`${this.baseUrl}/${id}`)
  }

  /**
   * Cria um novo registro de fluxo de caixa
   */
  static async create(data: CreateCashFlowRequest): Promise<CashFlowDtoResponse> {
    return apiClient.post<CashFlowDtoResponse>(this.baseUrl, data)
  }

  /**
   * Atualiza um registro de fluxo de caixa existente
   */
  static async update(data: UpdateCashFlowRequest): Promise<CashFlowDtoResponse> {
    return apiClient.put<CashFlowDtoResponse>(`${this.baseUrl}/${data.id}`, data)
  }

  /**
   * Remove um registro de fluxo de caixa
   */
  static async delete(id: number): Promise<boolean> {
    return apiClient.delete<boolean>(`${this.baseUrl}/${id}`)
  }
}