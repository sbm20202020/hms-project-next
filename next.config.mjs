/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow dev requests to internal /_next/* resources from this origin
  allowedDevOrigins: ["172.16.10.70"],
};

export default nextConfig;
