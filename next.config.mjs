/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow dev requests to internal /_next/* resources from this origin
  allowedDevOrigins: ["172.16.10.70", "127.0.0.1", "localhost", "192.168.1.100","192.168.1.101", "192.168.1.102"],

  async rewrites() {
    const djangoUrl = process.env.DJANGO_API_URL || "http://localhost:8000";
    return [
      // Proxy all /api/* requests to Django EXCEPT /api/auth/ (handled by next-auth)
      {
        source: "/api/auth/signup",
        destination: `${djangoUrl}/api/auth/signup/`,
      },
      {
        source: "/api/:path((?!auth/).*)",
        destination: `${djangoUrl}/api/:path`,
      },
    ];
  },
};

export default nextConfig;

