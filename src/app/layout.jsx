import './globals.css'
import AuthProvider from '../components/AuthProvider'

export const metadata = {
  title: 'Congo HMS',
  description: 'Complete HMS system',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}