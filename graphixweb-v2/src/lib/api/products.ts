import { apiClient } from './client'
import type {
  ProductDtoResponse,
  CreateProductRequest,
  UpdateProductRequest,
  ListProductResponse,
  GetProductResponse
} from '@/types/api'

export class ProductService {
  private static baseUrl = '/product'

  /**
   * Lista todos os produtos com paginação
   */
  static async list(params?: {
    pageSize?: number
    cursor?: string
    startDate?: string
    endDate?: string
  }): Promise<ListProductResponse> {
    const searchParams = new URLSearchParams()
    
    if (params?.pageSize) searchParams.append('PageSize', params.pageSize.toString())
    if (params?.cursor) searchParams.append('Cursor', params.cursor)
    if (params?.startDate) searchParams.append('StartDate', params.startDate)
    if (params?.endDate) searchParams.append('EndDate', params.endDate)

    const url = `${this.baseUrl}${searchParams.toString() ? `?${searchParams}` : ''}`
    return apiClient.get<ListProductResponse>(url)
  }

  /**
   * Busca um produto por ID
   */
  static async getById(id: number): Promise<GetProductResponse> {
    return apiClient.get<GetProductResponse>(`${this.baseUrl}/${id}`)
  }

  /**
   * Cria um novo produto
   */
  static async create(data: CreateProductRequest): Promise<GetProductResponse> {
    return apiClient.post<GetProductResponse>(this.baseUrl, data)
  }

  /**
   * Atualiza um produto existente
   */
  static async update(data: UpdateProductRequest): Promise<GetProductResponse> {
    return apiClient.put<GetProductResponse>(`${this.baseUrl}/${data.id}`, data)
  }

  /**
   * Remove um produto
   */
  static async delete(id: number): Promise<boolean> {
    return apiClient.delete<boolean>(`${this.baseUrl}/${id}`)
  }
}