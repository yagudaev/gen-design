import { NextRequest, NextResponse } from 'next/server'

// const allowedOrigins = ['https://acme.com', 'https://my-app.org']

const corsOptions = {
  // 'Access-Control-Allow-Credentials': 'false',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  'Access-Control-Allow-Headers':
    'Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, Authorization',
}

// Main middleware router function
export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''

  if (hostname === 'voiceflow.sh') {
    return { notFound: true }
  }

  // Only handle domain canonicalization - HTTPS is handled by socat
  if (hostname === 'vibeflow.sh') {
    // Get the pathname and search params from the current request
    const { pathname, search } = request.nextUrl

    // Construct a new URL without port information
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http'
    const redirectUrl = `${protocol}://www.vibeflow.sh${pathname}${search}`

    return NextResponse.redirect(redirectUrl, 301) // 301 permanent redirect
  }

  const { pathname } = request.nextUrl
  if (pathname.startsWith('/api/')) {
    return handleApiCors(request)
  }

  // For regular routes, just pass through
  return NextResponse.next()
}

function handleApiCors(request: NextRequest) {
  const { pathname } = request.nextUrl
  const origin = request.headers.get('origin') ?? ''
  // const isAllowedOrigin = allowedOrigins.includes(origin)
  // allow any origin since it is a chrome extension
  const isAllowedOrigin = true

  // Handle preflighted requests
  const isPreflight = request.method === 'OPTIONS'

  if (isPreflight) {
    if (
      // chrome extension api path
      pathname === '/api/summarize' ||
      // login paths
      pathname === '/api/login' ||
      pathname === '/api/login/chrome' ||
      pathname === '/api/login/apple' ||
      pathname === '/api/user'
    ) {
      const preflightHeaders = {
        ...(isAllowedOrigin && { 'Access-Control-Allow-Origin': origin }),
        ...corsOptions,
      }

      // TODO: somewhere here there is an issue with next.js: https://github.com/vercel/next.js/issues/49587
      return NextResponse.json({ status: 'OK' }, { headers: preflightHeaders })
    }
  }

  // Handle simple requests
  const response = NextResponse.next()

  if (isAllowedOrigin) {
    response.headers.set('Access-Control-Allow-Origin', origin)
  }

  Object.entries(corsOptions).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  return response
}

export const config = {
  // Match ALL paths, including static files, images, and favicon
  matcher: ['/'],
}
