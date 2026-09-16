/** @type {import("next").NextConfig} */

const DEFAULT_DJANGO_API_URL = "http://localhost:8000";
const DJANGO_API_PATH_SEGMENT = "/api";

function normalizeDjangoApiUrl(rawUrl) {
  try {
    const candidateUrl = typeof rawUrl === "string" && rawUrl.trim() ? rawUrl.trim() : DEFAULT_DJANGO_API_URL;
    const parsed = new URL(candidateUrl);
    const trimmedPath = parsed.pathname.replace(/\/+$/, "");

    if (trimmedPath.endsWith(DJANGO_API_PATH_SEGMENT)) {
      const withoutApiPath = trimmedPath.substring(0, trimmedPath.length - DJANGO_API_PATH_SEGMENT.length);
      parsed.pathname = withoutApiPath || "/";
    } else {
      parsed.pathname = trimmedPath || "/";
    }

    return `${parsed.origin}${parsed.pathname === "/" ? "" : parsed.pathname}`;
  } catch {
    return DEFAULT_DJANGO_API_URL;
  }
}

function getOrigin(urlValue) {
  try {
    return new URL(urlValue).origin;
  } catch {
    return null;
  }
}

const nextConfig = {
  // Required for Docker standalone output (copies only needed files)
  output: 'standalone', 
  allowedDevOrigins: [ '172.16.10.70' , '127.0.0.1' , 'localhost' , '192.168.1.100' , '192.168.1.101' , '192.168.1.102' ],
  
  async rewrites() {
    const djangoBaseUrl = normalizeDjangoApiUrl(process.env.DJANGO_API_URL);
    
    // Always enable rewrites when DJANGO_API_URL points to internal Docker service
    // This ensures /api/* routes are proxied to Django backend
    console.log('[next.config] Django API URL:', djangoBaseUrl);

    return {
      // beforeFiles ensures these rewrites run before any Next.js API route
      beforeFiles: [
        // Signup endpoint - redirect to Django
        {
          source: '/api/auth/signup',
          destination: `${djangoBaseUrl}/api/auth/signup/`,
        },
        {
          source: '/api/auth/signup/',
          destination: `${djangoBaseUrl}/api/auth/signup/`,
        },
        // All other API routes (excluding NextAuth routes /api/auth/*)
        // Handle paths with trailing slash
        {
          source: '/api/:path((?!auth/).*)/',
          destination: `${djangoBaseUrl}/api/:path/`,
        },
        // Handle paths without trailing slash - add trailing slash for Django
        {
          source: '/api/:path((?!auth/).+)',
          destination: `${djangoBaseUrl}/api/:path/`,
        },
      ],
    };
  },
  // Disable automatic trailing slash redirect for API routes
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
