import { apiClient } from './client'
import type {
  AccountDtoResponse,
  CreateAccountRequest,
  UpdateAccountRequest
} from '@/types/api'

export class AccountService {
  private static baseUrl = '/account'

  /**
   * Lista todas as contas
   */
  static async list(): Promise<AccountDtoResponse[]> {
    return apiClient.get<AccountDtoResponse[]>(this.baseUrl)
  }

  /**
   * Busca uma conta por ID
   */
  static async getById(id: number): Promise<AccountDtoResponse> {
    return apiClient.get<AccountDtoResponse>(`${this.baseUrl}/${id}`)
  }

  /**
   * Cria uma nova conta
   */
  static async create(data: CreateAccountRequest): Promise<boolean> {
    return apiClient.post<boolean>(this.baseUrl, data)
  }

  /**
   * Atualiza uma conta existente
   */
  static async update(data: UpdateAccountRequest): Promise<boolean> {
    return apiClient.put<boolean>(`${this.baseUrl}/${data.id}`, data)
  }

  /**
   * Remove uma conta
   */
  static async delete(id: number): Promise<boolean> {
    return apiClient.delete<boolean>(`${this.baseUrl}/${id}`)
  }
}