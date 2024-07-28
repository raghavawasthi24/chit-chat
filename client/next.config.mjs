// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:1337/:path*", // Proxy to Strapi
      },
    ];
  },
};

export default nextConfig;
