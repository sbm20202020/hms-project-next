import './globals.css'
import AuthProvider from '../components/AuthProvider'

export const metadata = {
  title: 'My App with Auth',
  description: 'Complete authentication system with NextAuth.js v4',
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