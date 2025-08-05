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
  try {
    // Parse query parameters
    const url = new URL(request.url)
    const { searchParams } = url
    const limit = parseInt(searchParams.get('limit') || '50', 10)
    const offset = parseInt(searchParams.get('offset') || '0', 10)
    const filterUserId = searchParams.get('userId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const search = searchParams.get('search')

    // Validate pagination parameters
    if (
      isNaN(limit) ||
      isNaN(offset) ||
      limit < 1 ||
      limit > 100 ||
      offset < 0
    ) {
      return NextResponse.json(
        {
          error:
            'Invalid pagination parameters. Limit must be 1-100, offset must be >= 0',
        },
        { status: 400 },
      )
    }

    // Build date filter
    const dateFilter: any = {}
    if (startDate) {
      dateFilter.gte = new Date(startDate)
      if (isNaN(dateFilter.gte.getTime())) {
        return NextResponse.json(
          { error: 'Invalid startDate format' },
          { status: 400 },
        )
      }
    }
    if (endDate) {
      dateFilter.lte = new Date(endDate)
      if (isNaN(dateFilter.lte.getTime())) {
        return NextResponse.json(
          { error: 'Invalid endDate format' },
          { status: 400 },
        )
      }
    }

    // Build where clause
    const whereClause: any = {}

    if (filterUserId) {
      whereClause.userId = parseInt(filterUserId, 10)
    }

    if (Object.keys(dateFilter).length > 0) {
      whereClause.createdAt = dateFilter
    }

    if (search) {
      whereClause.transcriptText = {
        contains: search,
        mode: 'insensitive',
      }
    }

    // Get transcriptions with user data
    const [transcriptions, total] = await Promise.all([
      prisma.transcription.findMany({
        where: whereClause,
        include: {
          user: {
            select: {
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      }),
      prisma.transcription.count({
        where: whereClause,
      }),
    ])

    // Transform transcriptions for admin view
    const transcriptionList: AdminTranscriptionListItem[] = transcriptions.map(
      (transcription) => ({
        id: transcription.id,
        userId: transcription.userId,
        userEmail: transcription.user.email,
        userName:
          `${transcription.user.firstName || ''} ${transcription.user.lastName || ''}`.trim() ||
          'Unknown',
        transcriptText: transcription.transcriptText,
        audioUrl: AudioStorage.getAudioFileUrl(transcription.audioFileName),
        duration: transcription.duration,
        targetApp: transcription.targetApp || undefined,
        targetAppBundle: transcription.targetAppBundle || undefined,
        deviceName: transcription.deviceName || undefined,
        createdAt: transcription.createdAt.toISOString(),
        recordedAt: transcription.recordedAt.toISOString(),
        processingStatus: transcription.processingStatus,
      }),
    )

    const hasMore = offset + limit < total

    return NextResponse.json({
      transcriptions: transcriptionList,
      total,
      hasMore,
    })
  } catch (error) {
    console.error('Error listing transcriptions (admin):', error)
    return NextResponse.json(
      { error: 'Failed to list transcriptions' },
      { status: 500 },
    )
  }
}
