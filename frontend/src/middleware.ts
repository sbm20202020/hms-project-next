import { NextResponse, type NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

const PUBLIC_EXACT = ["/", "/auth/signin", "/auth/signup"]
const PUBLIC_PREFIXES = ["/auth/"]

export async function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl

  // Bypass all /api/* routes — they are proxied to Django which handles its
  // own JWT authentication.  Redirecting XHR requests to /auth/signin would
  // cause ERR_TOO_MANY_REDIRECTS in the browser.
  if (pathname.startsWith("/api/")) {
    return NextResponse.next()
  }

  const isPublic =
    PUBLIC_EXACT.includes(pathname) ||
    PUBLIC_PREFIXES.some((p) => pathname.startsWith(p))

  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const isLoggedIn = !!token

  if (!isLoggedIn && !isPublic) {
    const signInUrl = new URL("/auth/signin", origin)
    signInUrl.searchParams.set("callbackUrl", req.nextUrl.href)
    return NextResponse.redirect(signInUrl)
  }

  if (isLoggedIn && (pathname === "/auth/signin" || pathname === "/auth/signup")) {
    return NextResponse.redirect(new URL("/", origin))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)"], // toutes les pages sauf assets/statics
}
