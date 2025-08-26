'use client'

import { useAuth } from '@/providers/auth-provider'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MainLayout } from '@/components/layout/main-layout'
import { 
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Database,
  Palette,
  Globe,
  Mail,
  Smartphone,
  Monitor
} from 'lucide-react'

export default function SettingsPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  // Verificar autenticação
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        </div>
      </MainLayout>
    )
  }

  const settingsCategories = [
    {
      title: 'Perfil do Usuário',
      description: 'Gerenciar informações pessoais e preferências',
      icon: User,
      items: [
        'Dados pessoais',
        'Alterar senha',
        'Foto do perfil',
        'Preferências de idioma'
      ]
    },
    {
      title: 'Notificações',
      description: 'Configurar alertas e notificações do sistema',
      icon: Bell,
      items: [
        'Notificações por email',
        'Alertas de pedidos',
        'Lembretes de vencimento',
        'Relatórios automáticos'
      ]
    },
    {
      title: 'Segurança',
      description: 'Configurações de segurança e acesso',
      icon: Shield,
      items: [
        'Autenticação de dois fatores',
        'Histórico de logins',
        'Sessões ativas',
        'Políticas de senha'
      ]
    },
    {
      title: 'Sistema',
      description: 'Configurações gerais do sistema',
      icon: Database,
      items: [
        'Backup automático',
        'Integração com APIs',
        'Logs do sistema',
        'Manutenção'
      ]
    },
    {
      title: 'Aparência',
      description: 'Personalizar interface e tema',
      icon: Palette,
      items: [
        'Tema escuro/claro',
        'Cores personalizadas',
        'Layout da dashboard',
        'Densidade de informações'
      ]
    },
    {
      title: 'Localização',
      description: 'Configurações regionais e de localização',
      icon: Globe,
      items: [
        'Fuso horário',
        'Formato de moeda',
        'Formato de data',
        'Idioma do sistema'
      ]
    }
  ]

  return (
    <MainLayout>
      <div className="p-4 lg:p-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <SettingsIcon className="h-6 w-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Configurações</h1>
              <p className="text-gray-600 mt-1">Personalize e configure o sistema conforme suas necessidades</p>
            </div>
          </div>
        </div>

        {/* Cards de Configurações */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {settingsCategories.map((category, index) => {
            const Icon = category.icon
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-primary-100 rounded-lg flex items-center justify-center">
                      <Icon className="h-5 w-5 text-primary-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{category.title}</h3>
                      <p className="text-sm text-gray-600 font-normal">{category.description}</p>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {category.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center gap-2 text-sm text-gray-700 hover:text-primary-600 cursor-pointer">
                        <div className="w-1.5 h-1.5 bg-primary-300 rounded-full"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Informações do Sistema */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Informações do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Versão do Sistema</p>
                <p className="text-lg font-semibold text-gray-900">1.0.0</p>
                <p className="text-xs text-gray-500">Build: 2024.01.15</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Última Atualização</p>
                <p className="text-lg font-semibold text-gray-900">15 Jan 2024</p>
                <p className="text-xs text-gray-500">Sistema atualizado</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Status do Servidor</p>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-accent-500 rounded-full"></div>
                  <span className="text-lg font-semibold text-gray-900">Online</span>
                </div>
                <p className="text-xs text-gray-500">Funcionando normalmente</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Nota de Desenvolvimento */}
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-2">
            <div className="mt-0.5">
              <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
            </div>
            <div>
              <p className="text-sm font-medium text-amber-800">Em Desenvolvimento</p>
              <p className="text-sm text-amber-700 mt-1">
                As funcionalidades de configuração estão sendo desenvolvidas. 
                Em breve você poderá personalizar completamente o sistema conforme suas necessidades.
              </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}