/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    return config;
  },
  experimental: {
    serverComponentsExternalPackages: ["pdf-parse"],
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
