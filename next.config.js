/* eslint-disable @typescript-eslint/no-require-imports */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Performance optimizations
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  // Image optimization
  images: {
    remotePatterns: [
      // Add patterns for external images if needed
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Externalize server-only packages to avoid bundling issues
  serverExternalPackages: ['argon2', '@mapbox/node-pre-gyp'],

  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['lucide-react', '@dnd-kit/core', 'framer-motion'],
  },

  // Webpack optimizations
  webpack: (config, { dev, isServer }) => {
    // Fix argon2 native bindings - exclude from all bundles (server and edge)
    config.externals = config.externals || [];
    config.externals.push({
      argon2: 'commonjs argon2',
      '@mapbox/node-pre-gyp': 'commonjs @mapbox/node-pre-gyp',
    });

    // Ignore problematic node-pre-gyp files and HTML files
    config.module = config.module || {};
    config.module.rules = config.module.rules || [];

    // Ignore node-pre-gyp HTML files and directories
    config.module.rules.push({
      test: /node_modules\/@mapbox\/node-pre-gyp.*\.html$/,
      use: 'null-loader',
    });

    // Ignore entire node-pre-gyp directory for client bundle
    if (!isServer) {
      config.module.rules.push({
        test: /node_modules\/@mapbox\/node-pre-gyp/,
        use: 'null-loader',
      });
    }

    // Ignore nw-pre-gyp HTML files specifically
    config.module.rules.push({
      test: /node_modules\/@mapbox\/node-pre-gyp\/lib\/util\/nw-pre-gyp\/index\.html$/,
      use: 'null-loader',
    });

    // Production optimizations
    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Vendor chunk
            framework: {
              name: 'framework',
              chunks: 'all',
              test: /[\\/]node_modules[\\/](react|react-dom|scheduler|next)[\\/]/,
              priority: 40,
              enforce: true,
            },
            // UI library chunk
            lib: {
              test(module) {
                return module.size() > 160000 && /node_modules[/\\]/.test(module.identifier());
              },
              name(module) {
                const hash = require('node:crypto').createHash('sha1');
                hash.update(module.identifier());
                return hash.digest('hex').substring(0, 8);
              },
              priority: 30,
              minChunks: 1,
              reuseExistingChunk: true,
            },
            // Common chunk
            commons: {
              name: 'commons',
              minChunks: 2,
              priority: 20,
            },
            // Shared chunk
            shared: {
              name(module, chunks) {
                return require('node:crypto')
                  .createHash('sha1')
                  .update(chunks.reduce((acc, chunk) => acc + chunk.name, ''))
                  .digest('hex')
                  .substring(0, 8);
              },
              priority: 10,
              minChunks: 2,
              reuseExistingChunk: true,
            },
          },
        },
      };
    }

    return config;
  },

  // Headers for security and performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = withBundleAnalyzer(nextConfig);
/* eslint-enable @typescript-eslint/no-require-imports */
