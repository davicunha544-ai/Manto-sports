import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['pg', '@prisma/adapter-pg', 'bcryptjs'],
  images: {
    localPatterns: [
      { pathname: '/images/**' },
      { pathname: '/uploads/**' },
    ],
  },
};

export default nextConfig;
