import type { NextConfig } from "next";

// Check if we're building for static export (GitHub Pages)
const isStaticExport = process.env.NEXT_BUILD_STATIC === 'true';

const nextConfig: NextConfig = {
  // Static export for GitHub Pages, standalone for Docker deployment
  output: isStaticExport ? "export" : "standalone",

  // Base path for GitHub Pages (if deployed to repo subdirectory)
  ...(isStaticExport && {
    basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
    images: {
      unoptimized: true,
    },
    trailingSlash: true,
  }),

  // API Rewrites: Only for standalone builds (not needed for static export)
  ...(!isStaticExport && {
    async rewrites() {
      // INTERNAL_API_URL: Where Next.js server-side should proxy API requests
      // Default: http://localhost:5055 (single-container deployment)
      // Override for multi-container: INTERNAL_API_URL=http://api-service:5055
      const internalApiUrl = process.env.INTERNAL_API_URL || 'http://localhost:5055'

      console.log(`[Next.js Rewrites] Proxying /api/* to ${internalApiUrl}/api/*`)

      return [
        {
          source: '/api/:path*',
          destination: `${internalApiUrl}/api/:path*`,
        },
      ]
    },
  }),
};

export default nextConfig;
