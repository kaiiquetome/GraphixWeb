export const APP_CONFIG = {
  name: 'Graphix Hub',
  version: '1.0.0',
  description: 'Sistema de Gestão para Indústria Gráfica',
} as const

export const API_ENDPOINTS = {
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    refreshToken: '/auth/refresh-token',
  },
  account: '/account',
  user: '/user',
  customer: '/customer',
  product: '/product',
  order: '/order',
  orderService: '/OrderService',
  cashFlow: '/cashFlow',
} as const

export const ROUTES = {
  home: '/home',
  login: '/login',
  dashboard: '/dashboard',
} as const

export const USER_PROFILES = {
  ADMIN: 1,
  MANAGER: 2,
  OPERATOR: 3,
} as const 