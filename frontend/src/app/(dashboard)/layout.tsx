'use client'

import { AppSidebar } from '@/components/layout/app-sidebar'
import { AppHeader } from '@/components/layout/app-header'
import { useUIStore } from '@/stores/ui-store'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { sidebarCollapsed } = useUIStore()

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <AppSidebar />
      <div className={`flex flex-1 flex-col overflow-hidden transition-all duration-300 ml-0 ${sidebarCollapsed ? 'lg:ml-[68px]' : 'lg:ml-64'}`}>
        <AppHeader />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
