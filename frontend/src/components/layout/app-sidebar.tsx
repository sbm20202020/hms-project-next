'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { navigation } from '@/lib/navigation'
import { useUIStore } from '@/stores/ui-store'
import { Heart, ChevronsLeft, ChevronsRight, X } from 'lucide-react'

export function AppSidebar() {
  const pathname = usePathname()
  const { sidebarOpen, sidebarCollapsed, toggleCollapsed, setSidebarOpen } = useUIStore()

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex flex-col border-r border-border bg-card transition-all duration-300 lg:static',
          sidebarCollapsed ? 'w-[68px]' : 'w-64',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          {!sidebarCollapsed && (
            <Link href="/dashboard" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Heart className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="leading-tight">
                <p className="text-sm font-bold text-foreground">CongoHMS</p>
                <p className="text-[10px] text-muted-foreground">Hospital System</p>
              </div>
            </Link>
          )}
          {sidebarCollapsed && (
            <Link href="/dashboard" className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Heart className="h-4 w-4 text-primary-foreground" />
            </Link>
          )}

          {/* Close button on mobile */}
          <button
            className="lg:hidden rounded-md p-1 text-muted-foreground hover:text-foreground"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>

          {/* Collapse toggle on desktop */}
          <button
            className="hidden lg:flex rounded-md p-1 text-muted-foreground hover:text-foreground"
            onClick={toggleCollapsed}
          >
            {sidebarCollapsed ? (
              <ChevronsRight className="h-4 w-4" />
            ) : (
              <ChevronsLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
              const Icon = item.icon

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    title={sidebarCollapsed ? item.title : undefined}
                    className={cn(
                      'group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                      sidebarCollapsed && 'justify-center px-2',
                    )}
                  >
                    <Icon className={cn('h-4 w-4 shrink-0', isActive && 'text-primary')} />
                    {!sidebarCollapsed && <span>{item.title}</span>}
                    {!sidebarCollapsed && item.badge && (
                      <span className="ml-auto rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Footer */}
        {!sidebarCollapsed && (
          <div className="border-t border-border p-4">
            <p className="text-[10px] text-muted-foreground text-center">
              © 2026 CongoHMS v2.0
            </p>
          </div>
        )}
      </aside>
    </>
  )
}
