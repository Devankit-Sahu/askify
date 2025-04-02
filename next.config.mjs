/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    return config;
  },
  serverExternalPackages: ["pdf-parse"],
  experimental: {
    serverActions: {
      bodySizeLimit: "16mb",
    },
  },
  images: {
    remotePatterns: [
      {
        hostname: "img.clerk.com",
        protocol: "https",
      },
    ],
  },
};

export default nextConfig;
