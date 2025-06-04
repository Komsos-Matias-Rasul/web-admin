/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/",
        destination: "/login",
        permanent: false,
      },
    ]
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "parokikosambi-backend.vercel.app",
        port: "",
        pathname: "/api/img/**"
      },
      {
        protocol: "https",
        hostname: "parokikosambi-backend-dev.vercel.app",
        port: "",
        pathname: "/api/img/**"
      },
    ]
  }
};

export default nextConfig;
