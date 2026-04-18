/** @type {import('next').NextConfig} */
const nextConfig = {
  // Required for Docker standalone output (copies only needed files)
  output: "standalone",

  allowedDevOrigins: ["172.16.10.70", "127.0.0.1", "localhost", "192.168.1.100", "192.168.1.101", "192.168.1.102"],

  async rewrites() {
    const djangoUrl = process.env.DJANGO_API_URL || "http://localhost:8000";
    return {
      // beforeFiles ensures these rewrites run before any Next.js API route
      beforeFiles: [
        // /api/auth/signup → Django (before NextAuth's /api/auth/* catch-all)
        {
          source: "/api/auth/signup",
          destination: `${djangoUrl}/api/auth/signup/`,
        },
        // All /api/* except /api/auth/* → Django.
        // Two rules normalise trailing slashes so Django's APPEND_SLASH=True
        // never triggers a 301 redirect loop:
        //   1. path already ends with '/' → forward as-is
        {
          source: "/api/:path((?!auth/).*/)",
          destination: `${djangoUrl}/api/:path`,
        },
        //   2. path does NOT end with '/' → add one
        {
          source: "/api/:path((?!auth/).*[^/])",
          destination: `${djangoUrl}/api/:path/`,
        },
      ],
    };
  },
};

export default nextConfig;
