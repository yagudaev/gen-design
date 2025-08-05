import { NextRequest, NextResponse } from 'next/server'
import { User as AuthUser } from 'next-auth'

import { requireRouteAuth } from '@/lib/requireRouteAuth'

export const dynamic = 'force-dynamic'

export const POST = requireRouteAuth(postHandler)

async function postHandler(
  request: Request,
  authUser: AuthUser,
  userId: number,
) {
  try {
    // Call OpenAI to get ephemeral key/session for realtime
    const response = await fetch(
      'https://api.openai.com/v1/realtime/sessions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-realtime-preview-2024-12-17',
          voice: 'echo', // You can make this dynamic if needed
        }),
      },
    )

    if (!response.ok) {
      const error = await response.json()
      return NextResponse.json(
        { error: error.error || 'Failed to get realtime session key' },
        { status: 500 },
      )
    }

    const data = await response.json()
    // Return the full JSON response (including client_secret)
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error getting OpenAI realtime key:', error)
    return NextResponse.json(
      { error: 'Failed to get OpenAI realtime session key' },
      { status: 500 },
    )
  }
}
