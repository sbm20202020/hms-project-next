/** @type {import("next").NextConfig} */

const DEFAULT_DJANGO_API_URL = "http://localhost:8000";

function normalizeDjangoApiUrl(rawUrl) {
  try {
    const parsed = new URL(rawUrl || DEFAULT_DJANGO_API_URL);
    const trimmedPath = parsed.pathname.replace(/\/+$/, "");

    if (trimmedPath.endsWith("/api")) {
      parsed.pathname = trimmedPath.slice(0, -4) || "/";
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
  output: "standalone",

  allowedDevOrigins: ["172.16.10.70", "127.0.0.1", "localhost", "192.168.1.100", "192.168.1.101", "192.168.1.102"],

  async rewrites() {
    const djangoBaseUrl = normalizeDjangoApiUrl(process.env.DJANGO_API_URL);
    const frontendOrigin = getOrigin(process.env.NEXTAUTH_URL || "");
    const djangoOrigin = getOrigin(djangoBaseUrl);
    const forceApiRewrite = process.env.NEXT_FORCE_API_REWRITE === "true";

    if (!forceApiRewrite && frontendOrigin && djangoOrigin && frontendOrigin === djangoOrigin) {
      return [];
    }

    return {
      // beforeFiles ensures these rewrites run before any Next.js API route
      beforeFiles: [
        // /api/auth/signup → Django (before NextAuth's /api/auth/* catch-all)
        {
          source: "/api/auth/signup",
          destination: `${djangoBaseUrl}/api/auth/signup/`,
        },
        // All /api/* except /api/auth/* → Django
        {
          source: "/api/:path((?!auth/).*)",
          destination: `${djangoBaseUrl}/api/:path`,
        },
      ],
    };
  },
};

export default nextConfig;
