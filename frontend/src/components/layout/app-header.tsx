'use client'

import { useSession, signOut } from 'next-auth/react'
import { useTheme } from 'next-themes'
import { useUIStore } from '@/stores/ui-store'
import { Menu, Sun, Moon, Bell, Search, LogOut, User, Settings } from 'lucide-react'
import { useState } from 'react'

export function AppHeader() {
  const { data: session } = useSession()
  const { theme, setTheme } = useTheme()
  const { setSidebarOpen } = useUIStore()
  const [showUserMenu, setShowUserMenu] = useState(false)

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-card/80 backdrop-blur-sm px-4 lg:px-6">
      {/* Left side */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(true)}
          className="rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Search */}
        <div className="hidden sm:flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-muted-foreground w-64 lg:w-80">
          <Search className="h-4 w-4" />
          <span>Rechercher... ⌘K</span>
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="relative rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground"
          title="Changer le thème"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute top-2 left-2 h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </button>

        {/* Notifications */}
        <button className="relative rounded-lg p-2 text-muted-foreground hover:bg-muted hover:text-foreground">
          <Bell className="h-4 w-4" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground">
            3
          </span>
        </button>

        {/* User menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 rounded-lg p-1.5 text-sm hover:bg-muted"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs">
              {session?.user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-foreground leading-none">
                {session?.user?.email?.split('@')[0] || 'Utilisateur'}
              </p>
              <p className="text-xs text-muted-foreground">
                {(session as any)?.user?.accessType === 'ADMIN_GLOBAL_HMS' ? 'Admin' : 'Utilisateur'}
              </p>
            </div>
          </button>

          {showUserMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
              <div className="absolute right-0 top-full z-50 mt-2 w-48 rounded-lg border border-border bg-card shadow-lg">
                <div className="p-1">
                  <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted">
                    <User className="h-4 w-4" />
                    Mon profil
                  </button>
                  <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted">
                    <Settings className="h-4 w-4" />
                    Paramètres
                  </button>
                  <div className="my-1 border-t border-border" />
                  <button
                    onClick={() => signOut({ callbackUrl: '/auth/login' })}
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
                  >
                    <LogOut className="h-4 w-4" />
                    Déconnexion
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
