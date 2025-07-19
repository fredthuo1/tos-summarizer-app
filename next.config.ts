import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,

  webpackDevMiddleware: (config) => {
    config.watchOptions = {
      ignored: [
        '**/.git/**',
        '**/.next/**',
        '**/node_modules/**',
        '**/*.log',
        '**/.env*',
        '**/logs/**',
      ],
    }
    return config
  },
}

export default nextConfig
