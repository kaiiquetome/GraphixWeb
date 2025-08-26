import { apiClient } from './client'
import type {
  UserDtoResponse,
  CreateUserRequest,
  UpdateUserRequest,
  ListUserResponse
} from '@/types/api'

export class UserService {
  private static baseUrl = '/user'

  /**
   * Lista todos os usuários com paginação
   */
  static async list(params?: {
    pageSize?: number
    cursor?: string
    startDate?: string
    endDate?: string
  }): Promise<ListUserResponse> {
    const searchParams = new URLSearchParams()
    
    if (params?.pageSize) searchParams.append('PageSize', params.pageSize.toString())
    if (params?.cursor) searchParams.append('Cursor', params.cursor)
    if (params?.startDate) searchParams.append('StartDate', params.startDate)
    if (params?.endDate) searchParams.append('EndDate', params.endDate)

    const url = `${this.baseUrl}${searchParams.toString() ? `?${searchParams}` : ''}`
    return apiClient.get<ListUserResponse>(url)
  }

  /**
   * Busca um usuário por ID
   */
  static async getById(id: number): Promise<UserDtoResponse> {
    return apiClient.get<UserDtoResponse>(`${this.baseUrl}/${id}`)
  }

  /**
   * Cria um novo usuário
   */
  static async create(data: CreateUserRequest): Promise<UserDtoResponse> {
    return apiClient.post<UserDtoResponse>(this.baseUrl, data)
  }

  /**
   * Atualiza um usuário existente
   */
  static async update(data: UpdateUserRequest): Promise<UserDtoResponse> {
    return apiClient.put<UserDtoResponse>(`${this.baseUrl}/${data.id}`, data)
  }

  /**
   * Remove um usuário
   */
  static async delete(id: number): Promise<boolean> {
    return apiClient.delete<boolean>(`${this.baseUrl}/${id}`)
  }
}