import { Analytics } from '@vercel/analytics/react'
import clsx from 'clsx'
import { Inter, Lexend } from 'next/font/google'

import ClientLayout from '@/components/ClientLayout'
import { openGraphTags } from '@/lib/metadata'

import '@workspace/shared/tailwind.css'
import { type Metadata } from 'next'

import './global.css'

// TODO: should these things be in the config?
const title = 'Gen Design - AI-Powered Design System Explorer'
const description = 'Create and explore AI-driven design variations using your existing design systems'
const url = 'https://gen-design.ai'
const image = `${url}/opengraph-image.jpg`

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title: {
    template: '%s - Gen Design',
    default: title,
  },
  description: description,
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    title: 'Gen Design',
    startupImage: [
      {
        url: '/splash/splash-1170x2532.png',
        media:
          '(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)',
      },
    ],
    statusBarStyle: 'black-translucent',
  },
  icons: {
    icon: [
      // TOOD: can use .png in the future instead
      // {
      //   rel: 'icon',
      //   type: 'image/png',
      //   sizes: '32x32',
      //   url: '/favicon.ico',
      // },
      // {
      //   rel: 'icon',
      //   type: 'image/png',
      //   sizes: '16x16',
      //   url: '/favicon.ico',
      // },
      { rel: 'icon', type: 'image/x-icon', url: '/favicon.ico' },
    ],
    apple: [
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        url: '/apple-touch-icon.png',
      },
    ],
  },
  ...openGraphTags(title, description, url, image),
}

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

const lexend = Lexend({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lexend',
})

export default async function RootLayout({ children }: { children: any }) {
  return (
    <html
      lang="en"
      className={clsx(
        'h-full scroll-smooth bg-white antialiased',
        inter.variable,
        lexend.variable,
      )}
    >
      <body className="flex flex-col h-full">
        <ClientLayout>{children}</ClientLayout>
        <Analytics />
      </body>
    </html>
  )
}
