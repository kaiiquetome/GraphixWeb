import { apiClient } from './client'
import type {
  CustomerDtoResponse,
  CreateCustomerRequest,
  UpdateCustomerRequest,
  ListCustomerResponse
} from '@/types/api'

export class CustomerService {
  private static baseUrl = '/customer'

  /**
   * Lista todos os clientes com paginação
   */
  static async list(params?: {
    pageSize?: number
    cursor?: string
    startDate?: string
    endDate?: string
  }): Promise<ListCustomerResponse> {
    const searchParams = new URLSearchParams()
    
    if (params?.pageSize) searchParams.append('PageSize', params.pageSize.toString())
    if (params?.cursor) searchParams.append('Cursor', params.cursor)
    if (params?.startDate) searchParams.append('StartDate', params.startDate)
    if (params?.endDate) searchParams.append('EndDate', params.endDate)

    const url = `${this.baseUrl}${searchParams.toString() ? `?${searchParams}` : ''}`
    return apiClient.get<ListCustomerResponse>(url)
  }

  /**
   * Busca um cliente por ID
   */
  static async getById(id: number): Promise<CustomerDtoResponse> {
    return apiClient.get<CustomerDtoResponse>(`${this.baseUrl}/${id}`)
  }

  /**
   * Cria um novo cliente
   */
  static async create(data: CreateCustomerRequest): Promise<CustomerDtoResponse> {
    return apiClient.post<CustomerDtoResponse>(this.baseUrl, data)
  }

  /**
   * Atualiza um cliente existente
   */
  static async update(data: UpdateCustomerRequest): Promise<CustomerDtoResponse> {
    return apiClient.put<CustomerDtoResponse>(`${this.baseUrl}/${data.id}`, data)
  }

  /**
   * Remove um cliente
   */
  static async delete(id: number): Promise<boolean> {
    return apiClient.delete<boolean>(`${this.baseUrl}/${id}`)
  }
}