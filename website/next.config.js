/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return []
  },
  async headers() {
    return [
      {
        // Allow CORS for API routes from Figma plugin
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ]
  },
  images: {
    domains: ['images.unsplash.com', 'www.gravatar.com'],
  },
  env: {
    NEXT_PUBLIC_BASE_URL: process.env.BASE_URL,
  },
  outputFileTracingIncludes: {
    '/api/projects/[id]/chapters/route.js': [
      './node_modules/@sparticuz/chromium/**/*',
    ],
  },
}

// Temporarily disable Sentry for Next.js 15 upgrade
// const { withSentryConfig } = require('@sentry/nextjs')

// module.exports = withSentryConfig(nextConfig, {
//   org: 'nano-3-labs',
//   project: 'vibeflow-website',
//   silent: !process.env.CI,
//   widenClientFileUpload: true,
//   tunnelRoute: '/monitoring',
//   hideSourceMaps: true,
//   disableLogger: true,
//   automaticVercelMonitors: true,
//   sourcemaps: {
//     disable: true,
//   },
// })

module.exports = nextConfig
