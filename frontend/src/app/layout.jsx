import './globals.css'
import { Providers } from '@/providers'
import { Poppins } from 'next/font/google'

const poppins = Poppins({ subsets: ['latin'], weight: ['400', '500', '600', '700', '800'], variable: '--font-sans' })

export const metadata = {
  title: 'Congo HMS — Gestion Hospitalière',
  description: 'Système de gestion hospitalière moderne',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${poppins.variable} font-sans antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}