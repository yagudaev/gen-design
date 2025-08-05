import { NextResponse } from 'next/server'
import { User as AuthUser } from 'next-auth'

import { prisma } from '@/lib/db'
import { requireAdminRouteAuth } from '@/lib/requireRouteAuth'
import { AudioStorage } from '@/utils/audioStorage'

type AdminTranscriptionListItem = {
  id: number
  userId: number
  userEmail: string
  userName: string
  transcriptText: string
  audioUrl: string
  duration: number
  targetApp?: string
  targetAppBundle?: string
  deviceName?: string
  createdAt: string
  recordedAt: string
  processingStatus: string
}

/**
 * Admin API endpoint to list all transcriptions
 * GET /api/admin/transcriptions
 */
export const GET = requireAdminRouteAuth(getHandler)

async function getHandler(
  request: Request,
  _authUser: AuthUser,
  _userId: number,
) {
  // Transcription functionality has been removed
  return NextResponse.json({
    transcriptions: [],
    total: 0,
    limit: 50,
    offset: 0,
    hasMore: false,
  })
}
