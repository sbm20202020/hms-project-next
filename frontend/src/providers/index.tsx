'use client'

import type { ReactNode } from 'react'
import { AuthProvider } from './auth-provider'
import { QueryProvider } from './query-provider'
import { ThemeProvider } from './theme-provider'
import { Toaster } from 'sonner'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <QueryProvider>
        <ThemeProvider>
          {children}
          <Toaster richColors position="top-right" closeButton />
        </ThemeProvider>
      </QueryProvider>
    </AuthProvider>
  )
}
