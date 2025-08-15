/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow dev requests to internal /_next/* resources from this origin
  allowedDevOrigins: ["172.16.10.70", "127.0.0.1", "localhost", "192.168.1.101", "192.168.1.102"],
};

export default nextConfig;
