import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'

const DJANGO_API_URL = process.env.DJANGO_API_URL || 'http://localhost:8000'

// Detect if we're running in a secure context (HTTPS)
const useSecureCookies = process.env.NEXTAUTH_URL?.startsWith('https://')
const cookiePrefix = useSecureCookies ? '__Secure-' : ''
const hostCookiePrefix = useSecureCookies ? '__Host-' : ''

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const res = await fetch(`${DJANGO_API_URL}/api/auth/token/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          })

          if (!res.ok) return null

          const data = await res.json()

          if (!data.access) return null

          return {
            id: data.user_id || credentials.email,
            email: credentials.email,
            djangoAccessToken: data.access,
            djangoRefreshToken: data.refresh,
            organisationId: data.organisation_id,
            accessType: data.access_type,
          }
        } catch {
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
  },
  // Configure cookies based on environment (HTTP vs HTTPS)
  cookies: {
    sessionToken: {
      name: `${cookiePrefix}next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: useSecureCookies,
      },
    },
    callbackUrl: {
      name: `${cookiePrefix}next-auth.callback-url`,
      options: {
        sameSite: 'lax',
        path: '/',
        secure: useSecureCookies,
      },
    },
    csrfToken: {
      name: `${hostCookiePrefix}next-auth.csrf-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: useSecureCookies,
      },
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          djangoAccessToken: user.djangoAccessToken,
          djangoRefreshToken: user.djangoRefreshToken,
          accessType: user.accessType,
          organisationId: user.organisationId,
        }
      }
      return token
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          accessType: token.accessType,
          organisationId: token.organisationId,
        },
        djangoAccessToken: token.djangoAccessToken,
      }
    },
  }
}

export default NextAuth(authOptions)
