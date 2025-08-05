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
  try {
    const { id } = options.params
    const transcriptionId = parseInt(id as string, 10)

    if (isNaN(transcriptionId)) {
      return NextResponse.json(
        { error: 'Invalid transcription ID' },
        { status: 400 },
      )
    }

    // Get transcription record to get audio file path
    const transcription = await prisma.transcription.findUnique({
      where: { id: transcriptionId },
      select: {
        id: true,
        audioFileName: true,
        userId: true,
      },
    })

    if (!transcription) {
      return NextResponse.json(
        { error: 'Transcription not found' },
        { status: 404 },
      )
    }

    // Delete audio file from storage (don't fail if file doesn't exist)
    try {
      await AudioStorage.deleteAudioFile(transcription.audioFileName)
    } catch (error) {
      console.warn(
        `Failed to delete audio file ${transcription.audioFileName}:`,
        error,
      )
    }

    // Delete transcription record from database
    await prisma.transcription.delete({
      where: { id: transcriptionId },
    })

    return NextResponse.json({
      message: 'Transcription deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting transcription (admin):', error)
    return NextResponse.json(
      { error: 'Failed to delete transcription' },
      { status: 500 },
    )
  }
}
