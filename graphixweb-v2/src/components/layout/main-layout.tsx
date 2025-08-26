'use client'

import { useState } from 'react'
import { Sidebar } from './sidebar'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200 px-4 py-3 lg:hidden shadow-sm">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className="hover:bg-gray-100"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-primary-500 rounded flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-xs">G</span>
              </div>
              <span className="font-semibold text-gray-900">First Label</span>
            </div>
            <div className="w-10"></div> {/* Spacer para centralizar */}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
} 