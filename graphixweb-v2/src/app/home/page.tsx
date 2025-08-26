'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/providers/auth-provider'
import { useRouter } from 'next/navigation'
import { APP_CONFIG } from '@/lib/utils/constants'
import { OrderService, CustomerService, ProductService, OrderServiceService } from '@/lib/api'
import { MainLayout } from '@/components/layout/main-layout'

interface DashboardStats {
  orders: number
  customers: number
  products: number
  services: number
}

export default function HomePage() {
  const { user, logout, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    orders: 0,
    customers: 0,
    products: 0,
    services: 0
  })
  const [loading, setLoading] = useState(true)

  // Verificar autenticação
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  // Buscar estatísticas do dashboard
  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardStats()
    }
  }, [isAuthenticated])

  const fetchDashboardStats = async () => {
    try {
      setLoading(true)
      
      // Buscar dados dos diferentes endpoints
      const [ordersData, customersData, productsData, servicesData] = await Promise.allSettled([
        OrderService.list({ pageSize: 1 }),
        CustomerService.list({ pageSize: 1 }),
        ProductService.list({ pageSize: 1 }),
        OrderServiceService.list({ pageSize: 1 })
      ])

      const newStats = {
        orders: ordersData.status === 'fulfilled' ? (ordersData.value.totalCount || 0) : 0,
        customers: customersData.status === 'fulfilled' ? (customersData.value.totalCount || 0) : 0,
        products: productsData.status === 'fulfilled' ? (productsData.value.totalCount || 0) : 0,
        services: servicesData.status === 'fulfilled' ? (servicesData.value.totalCount || 0) : 0
      }

      setStats(newStats)
    } catch (error) {
      console.error('Erro ao carregar estatísticas do dashboard:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <MainLayout>
      <div className="p-4 lg:p-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold text-secondary-900">
                Bem-vindo ao {APP_CONFIG.name}
              </h1>
              <p className="text-secondary-600 mt-2">
                Sistema de Gestão para Indústria Gráfica
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-secondary-900">
                  {user?.name}
                </p>
                <p className="text-xs text-secondary-500">
                  {user?.login}
                </p>
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-medium text-secondary-700 bg-secondary-100 rounded-md hover:bg-secondary-200 transition-colors"
              >
                Sair
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-primary-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-primary-900 mb-2">
                Pedidos
              </h3>
              <p className="text-3xl font-bold text-primary-600">0</p>
              <p className="text-sm text-primary-700 mt-1">Total de pedidos</p>
            </div>

            <div className="bg-success-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-success-900 mb-2">
                Clientes
              </h3>
              <p className="text-3xl font-bold text-success-600">0</p>
              <p className="text-sm text-success-700 mt-1">Clientes cadastrados</p>
            </div>

            <div className="bg-secondary-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-secondary-900 mb-2">
                Produtos
              </h3>
              <p className="text-3xl font-bold text-secondary-600">0</p>
              <p className="text-sm text-secondary-700 mt-1">Produtos cadastrados</p>
            </div>

            <div className="bg-error-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-error-900 mb-2">
                Serviços
              </h3>
              <p className="text-3xl font-bold text-error-600">0</p>
              <p className="text-sm text-error-700 mt-1">Serviços em andamento</p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
} 