import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ['better-sqlite3', '@prisma/adapter-better-sqlite3', 'bcryptjs'],
  images: {
    localPatterns: [
      { pathname: '/images/**' },
      { pathname: '/uploads/**' },
    ],
  },
};

export default nextConfig;
