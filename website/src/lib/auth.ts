import { NextRequest } from 'next/server'

// Simple authentication for MVP - replace with proper auth in production
const HARDCODED_USER = {
  email: 'michael@nano3labs.com',
  password: 'secret123',
  apiKey: 'sk-dev-1234567890' // Development API key
}

export function authenticateRequest(request: NextRequest): boolean {
  // Check for API key in headers
  const apiKey = request.headers.get('x-api-key')
  if (apiKey === HARDCODED_USER.apiKey) {
    return true
  }

  // Check for basic auth
  const authHeader = request.headers.get('authorization')
  if (authHeader?.startsWith('Basic ')) {
    const base64 = authHeader.slice(6)
    const [email, password] = Buffer.from(base64, 'base64').toString().split(':')
    
    if (email === HARDCODED_USER.email && password === HARDCODED_USER.password) {
      return true
    }
  }

  // For development, allow localhost without auth
  const origin = request.headers.get('origin')
  if (origin && (origin.includes('localhost') || origin.includes('127.0.0.1'))) {
    return true
  }

  return false
}

export function requireAuth(handler: Function) {
  return async (request: NextRequest, ...args: any[]) => {
    if (!authenticateRequest(request)) {
      return new Response('Unauthorized', { status: 401 })
    }
    return handler(request, ...args)
  }
}