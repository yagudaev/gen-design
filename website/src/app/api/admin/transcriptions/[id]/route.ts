import { NextResponse } from 'next/server'
import { User as AuthUser } from 'next-auth'

import { prisma } from '@/lib/db'
import {
  AuthenticatedRouteOptions,
  requireAdminRouteAuth,
} from '@/lib/requireRouteAuth'
import { AudioStorage } from '@/utils/audioStorage'

/**
 * Admin API endpoint to delete a transcription
 * DELETE /api/admin/transcriptions/[id]
 */
export const DELETE = requireAdminRouteAuth(deleteHandler)

async function deleteHandler(
  request: Request,
  _authUser: AuthUser,
  _userId: number,
  options: AuthenticatedRouteOptions,
) {
  // Transcription functionality has been removed
  return NextResponse.json(
    { error: 'Transcription functionality is not available' },
    { status: 400 },
  )
}
