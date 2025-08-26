'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/providers/auth-provider'
import { Button } from '@/components/ui/button'
import { 
  Menu, 
  X, 
  FileText, 
  Users, 
  Package, 
  Settings, 
  LogOut,
  ChevronRight,
  Home,
  ShoppingCart,
  Building2,
  DollarSign,
  UserCircle,
  ClipboardList,
  BarChart3,
  Download
} from 'lucide-react'

interface SubItem {
  title: string
  href: string
  description: string
}

interface MenuItem {
  title: string
  href: string
  icon: any
  description: string
  subItems?: SubItem[]
}

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

const menuItems = [
  {
    title: 'Dashboard',
    href: '/home',
    icon: Home,
    description: 'Visão geral do sistema'
  },
  {
    title: 'Pedidos',
    href: '/orders',
    icon: ShoppingCart,
    description: 'Gerenciar pedidos de clientes',
    subItems: [
      { title: 'Lista de Pedidos', href: '/orders', description: 'Ver todos os pedidos' },
      { title: 'Novo Pedido', href: '/orders/create', description: 'Criar novo pedido' },
      { title: 'Relatórios', href: '/orders/reports', description: 'Relatórios de pedidos' }
    ]
  },
  {
    title: 'Ordem de Serviço',
    href: '/order-service',
    icon: ClipboardList,
    description: 'Gerenciar serviços de produção',
    subItems: [
      { title: 'Lista de OS', href: '/order-service', description: 'Ver todas as ordens' },
      { title: 'Nova OS', href: '/order-service/create', description: 'Criar nova ordem' }
    ]
  },
  {
    title: 'Clientes',
    href: '/customers',
    icon: Users,
    description: 'Gerenciar base de clientes',
    subItems: [
      { title: 'Lista de Clientes', href: '/customers', description: 'Ver todos os clientes' },
      { title: 'Novo Cliente', href: '/customers/create', description: 'Cadastrar cliente' }
    ]
  },
  {
    title: 'Produtos',
    href: '/products',
    icon: Package,
    description: 'Catálogo de produtos',
    subItems: [
      { title: 'Lista de Produtos', href: '/products', description: 'Ver todos os produtos' },
      { title: 'Novo Produto', href: '/products/create', description: 'Cadastrar produto' }
    ]
  },
  {
    title: 'Fluxo de Caixa',
    href: '/cash-flow',
    icon: DollarSign,
    description: 'Gestão financeira'
  },
  {
    title: 'Usuários',
    href: '/users',
    icon: UserCircle,
    description: 'Gerenciar usuários do sistema'
  },
  {
    title: 'Contas',
    href: '/accounts',
    icon: Building2,
    description: 'Gerenciar contas da empresa'
  },
  {
    title: 'Relatórios',
    href: '/reports',
    icon: BarChart3,
    description: 'Relatórios e análises',
    subItems: [
      { title: 'Dashboard Analytics', href: '/reports/dashboard', description: 'Visão analítica' },
      { title: 'Relatórios de Vendas', href: '/reports/sales', description: 'Relatórios de vendas' },
      { title: 'Relatórios Financeiros', href: '/reports/financial', description: 'Relatórios financeiros' }
    ]
  },
  {
    title: 'Configurações',
    href: '/settings',
    icon: Settings,
    description: 'Configurações do sistema'
  }
]

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname()
  const { logout } = useAuth()
  const [expandedItem, setExpandedItem] = useState<string | null>(null)

  const handleLogout = () => {
    logout()
  }

  const toggleExpanded = (title: string) => {
    setExpandedItem(expandedItem === title ? null : title)
  }

  return (
    <>
      {/* Overlay para mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full bg-dark-900 border-r border-dark-700 z-50
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:z-auto
        w-64 lg:w-72 shadow-xl
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-dark-700">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">G</span>
            </div>
            <span className="font-semibold text-lg text-white">Graphix</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="lg:hidden text-gray-400 hover:text-white hover:bg-dark-800"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || 
              (item.subItems && item.subItems.some(subItem => pathname === subItem.href))
            const isExpanded = expandedItem === item.title
            const hasSubItems = item.subItems && item.subItems.length > 0

            return (
              <div key={item.title}>
                {/* Item principal */}
                <div
                  className={`
                    flex items-center justify-between p-3 rounded-lg cursor-pointer
                    transition-colors duration-200
                    ${isActive 
                      ? 'bg-primary-500 text-white shadow-lg' 
                      : 'hover:bg-dark-800 text-gray-300 hover:text-white'
                    }
                  `}
                  onClick={() => {
                    if (hasSubItems) {
                      toggleExpanded(item.title)
                    } else {
                      window.location.href = item.href
                    }
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{item.title}</span>
                  </div>
                  {hasSubItems && (
                    <ChevronRight 
                      className={`h-4 w-4 transition-transform duration-200 ${
                        isExpanded ? 'rotate-90' : ''
                      }`} 
                    />
                  )}
                </div>
                
                {/* Sub-items */}
                {hasSubItems && isExpanded && (
                  <div className="ml-6 mt-2 space-y-1">
                    {item.subItems?.map((subItem) => {
                      const isSubActive = pathname === subItem.href
                      return (
                        <Link key={subItem.href} href={subItem.href}>
                          <div
                            className={`
                              flex items-center p-2 rounded-md cursor-pointer text-sm
                              transition-colors duration-200
                              ${isSubActive 
                                ? 'bg-primary-500/20 text-primary-400 font-medium border-l-2 border-primary-500' 
                                : 'hover:bg-dark-800 text-gray-400 hover:text-gray-200'
                              }
                            `}
                          >
                            <div className={`w-2 h-2 rounded-full mr-3 ${isSubActive ? 'bg-primary-500' : 'bg-gray-500'}`}></div>
                            <span>{subItem.title}</span>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                )}
                
                {/* Descrição expandida para itens sem sub-items */}
                {!hasSubItems && isExpanded && (
                  <div className="ml-8 mt-2 p-2 bg-dark-800 rounded-md border border-dark-700">
                    <p className="text-sm text-gray-400">{item.description}</p>
                  </div>
                )}
              </div>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-dark-700">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/20"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-3" />
            Sair
          </Button>
        </div>
      </div>
    </>
  )
} 