export interface LoginRequest {
  userName: string
  password: string
}

export interface LoginResponse {
  jwtToken: string
  refreshToken: string
  user: {
    id: number
    name: string
    login: string
    profile: number
  }
}

export interface RegisterRequest {
  userName: string
  login: string
  password: string
  role: string
}

export interface RefreshTokenRequest {
  jwtToken: string
  refreshToken: string
}

export interface CustomErrorModel {
  error: string
  detail: string
}

export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
}

export interface PaginatedResponse<T> {
  cursor: string | null
  pageSize: number | null
  data: T[]
}

// ===== ACCOUNT ENTITIES =====
export interface AccountDtoResponse {
  id: number
  createdAt?: string
  corporateName?: string
  cnpj?: string
  ie?: string
  phone?: string
  email?: string
}

export interface CreateAccountRequest {
  corporateName?: string
  cnpj?: string
  ie?: string
  phone?: string
  email?: string
}

export interface UpdateAccountRequest {
  id: number
  corporateName?: string
  cnpj?: string
  ie?: string
  phone?: string
  email?: string
}

// ===== CUSTOMER ENTITIES =====
export interface CustomerDtoResponse {
  id: number
  createdAt?: string
  corporateName?: string
  cnpj?: string
  ie?: string
  contact?: string
  phone?: string
  email?: string
}

export interface CreateCustomerRequest {
  corporateName?: string
  cnpj?: string
  ie?: string
  contact?: string
  phone?: string
  email?: string
}

export interface UpdateCustomerRequest {
  id: number
  corporateName?: string
  cnpj?: string
  ie?: string
  contact?: string
  phone?: string
  email?: string
}

export interface ListCustomerResponse {
  cursor?: string
  pageSize?: number
  data?: CustomerDtoResponse[]
}

// ===== PRODUCT ENTITIES =====
export interface ProductDtoResponse {
  id: number
  createdAt?: string
  description?: string
  finish?: string
  color?: string
  dimension?: string
  knife?: string
  tubet?: string
  material?: string
  observation?: string
}

export interface CreateProductRequest {
  description?: string
  finish?: string
  color?: string
  dimension?: string
  knife?: string
  tubet?: string
  material?: string
  observation?: string
}

export interface UpdateProductRequest {
  id: number
  description?: string
  finish?: string
  color?: string
  dimension?: string
  knife?: string
  tubet?: string
  material?: string
  observation?: string
}

export interface GetProductResponse {
  product: ProductDtoResponse
}

export interface ListProductResponse {
  cursor?: string
  pageSize?: number
  data?: ProductDtoResponse[]
}

// ===== USER ENTITIES =====
export interface UserDtoResponse {
  id: number
  createdAt?: string
  name?: string
  login?: string
  profile: number
}

export interface CreateUserRequest {
  name?: string
  login?: string
  password?: string
  profile: number
}

export interface UpdateUserRequest {
  id: number
  name?: string
  login?: string
  password?: string
  profile: number
}

export interface ListUserResponse {
  cursor?: string
  pageSize?: number
  data?: UserDtoResponse[]
}

// ===== ORDER ITEM ENTITIES =====
export interface OrderItemDtoRequest {
  productId: number
  quantity: number
  total: number
}

export interface OrderItemDtoResponse {
  id: number
  createdAt?: string
  orderId: number
  productId: number
  quantity: number
  total: number
  product?: ProductDtoResponse
}

// ===== ORDER ENTITIES =====
export interface OrderDtoResponse {
  id: number
  createdAt?: string
  customerId: number
  accountId: number
  status: number
  orderNumber: number
  total: number
  discount: number
  observation?: string
  paymentCondition?: string
  seller?: string
  freight: number
  fob: boolean
  deliveryDeadline?: string
  deliveryDate?: string
  items?: OrderItemDtoResponse[]
  account?: AccountDtoResponse
  customer?: CustomerDtoResponse
}

export interface CreateOrderRequest {
  customerId: number
  accountId: number
  status: number
  orderNumber: number
  total: number
  discount: number
  observation?: string
  paymentCondition?: string
  seller?: string
  freight: number
  fob: boolean
  deliveryDeadline?: string
  deliveryDate?: string
  items?: OrderItemDtoRequest[]
}

export interface UpdateOrderRequest {
  id: number
  customerId: number
  accountId: number
  status: number
  orderNumber: number
  total: number
  discount: number
  observation?: string
  paymentCondition?: string
  seller?: string
  freight: number
  fob: boolean
  deliveryDeadline?: string
  deliveryDate?: string
  items?: OrderItemDtoRequest[]
}

// ===== ORDER STATUS ENUMS (FirstLabel Specific) =====
export enum OrderStatus {
  Orcamento = 0,     // Orçamento
  Execucao = 1,      // Em execução
  Finalizado = 2,    // Finalizado
  Recusado = 3       // Recusado
}

// ===== HELPER FUNCTIONS FOR ORDER STATUS =====
export const getOrderStatusText = (status: number): string => {
  const statusMap: Record<number, string> = {
    0: 'Orçamento',
    1: 'Em Execução',
    2: 'Finalizado',
    3: 'Recusado'
  }
  return statusMap[status] || `Status ${status}`
}

export const getOrderStatusColor = (status: number): string => {
  const colorMap: Record<number, string> = {
    0: 'bg-yellow-100 text-yellow-800',      // Orçamento
    1: 'bg-blue-100 text-blue-800',         // Em Execução
    2: 'bg-green-100 text-green-800',       // Finalizado
    3: 'bg-red-100 text-red-800'            // Recusado
  }
  return colorMap[status] || 'bg-gray-100 text-gray-800'
}

export interface ListOrderResponse {
  cursor?: string
  pageSize?: number
  data?: OrderDtoResponse[]
}

// ===== CASH FLOW ENTITIES =====
export enum CashFlowType {
  Income = 0,
  Expense = 1
}

export enum CashFlowCategory {
  Sales = 0,
  Purchase = 1,
  OperationalExpense = 2,
  Investment = 3,
  Financing = 4
}

export interface CashFlowDtoResponse {
  id: number
  createdAt?: string
  orderId?: number
  installmentNumber?: number
  description?: string
  type: CashFlowType
  category: CashFlowCategory
  expectedDateReceive: string
  expectedValueReceive: number
  valueReceive?: number
  dateReceive?: string
}

export interface CreateCashFlowRequest {
  orderId?: number
  installmentNumber?: number
  description?: string
  type: CashFlowType
  category: CashFlowCategory
  expectedDateReceive: string
  expectedValueReceive: number
  valueReceive?: number
  dateReceive?: string
}

export interface UpdateCashFlowRequest {
  id: number
  orderId?: number
  installmentNumber?: number
  description?: string
  type: CashFlowType
  category: CashFlowCategory
  expectedDateReceive: string
  expectedValueReceive: number
  valueReceive?: number
  dateReceive?: string
  createdAt: string
}

export interface ListCashFlowResponse {
  cursor?: string
  pageSize?: number
  data?: CashFlowDtoResponse[]
}

// ===== ORDER SERVICE COMPLEX ENTITIES =====
export interface MachineSetupDtoRequest {
  machineNumber?: string
  speed?: string
  temperature?: string
  pressure?: string
  observation?: string
}

export interface MachineSetupDtoResponse {
  id: number
  createdAt?: string
  orderServiceId: number
  machineNumber?: string
  speed?: string
  temperature?: string
  pressure?: string
  observation?: string
}

export interface InkMixDtoRequest {
  inkCode?: string
  inkDescription?: string
  quantity?: string
  observation?: string
}

export interface InkMixDtoResponse {
  id: number
  createdAt?: string
  orderServiceId: number
  inkCode?: string
  inkDescription?: string
  quantity?: string
  observation?: string
}

export interface AniloxDtoRequest {
  aniloxCode?: string
  lineature?: string
  angle?: string
  volume?: string
  observation?: string
}

export interface AniloxDtoResponse {
  id: number
  createdAt?: string
  orderServiceId: number
  aniloxCode?: string
  lineature?: string
  angle?: string
  volume?: string
  observation?: string
}

export interface RewindingDtoRequest {
  productId: number
  quantity: number
  observation?: string
}

export interface RewindingDtoResponse {
  id: number
  createdAt?: string
  orderServiceId: number
  productId: number
  quantity: number
  observation?: string
  product?: ProductDtoResponse
}

export interface TraceabilityDtoRequest {
  id: number
  orderServiceId: number
  rawMaterialInk?: string
  lot?: string
  quantity: number
}

export interface TraceabilityDtoResponse {
  id: number
  createdAt?: string
  orderServiceId: number
  rawMaterialInk?: string
  lot?: string
  quantity: number
}

// ===== ORDER SERVICE MAIN ENTITIES =====
export interface OrderServiceDtoResponse {
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
  machine?: MachineSetupDtoResponse
  inkMixs?: InkMixDtoResponse[]
  rewindings?: RewindingDtoResponse[]
  traceabilitys?: TraceabilityDtoResponse[]
  aniloxs?: AniloxDtoResponse[]
  order?: OrderDtoResponse
  customer?: CustomerDtoResponse
}

export interface CreateOrderServiceRequest {
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
  machine?: MachineSetupDtoRequest
  inkMixs?: InkMixDtoRequest[]
  rewindings?: RewindingDtoRequest[]
  traceabilitys?: TraceabilityDtoRequest[]
  aniloxs?: AniloxDtoRequest[]
}

export interface UpdateOrderServiceRequest {
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
  machine?: MachineSetupDtoRequest
  inkMixs?: InkMixDtoRequest[]
  rewindings?: RewindingDtoRequest[]
  traceabilitys?: TraceabilityDtoRequest[]
  aniloxs?: AniloxDtoRequest[]
}

export interface ListOrderServiceResponse {
  cursor?: string
  pageSize?: number
  data?: OrderServiceDtoResponse[]
} 