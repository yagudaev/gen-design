'use client'

import { format } from 'date-fns'
import { PauseIcon, PlayIcon, Trash2Icon } from 'lucide-react'
import React, { useEffect, useState } from 'react'

import { MarketingContainer } from '@/components/MarketingContainer'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

type TranscriptionItem = {
  id: number
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

type ListTranscriptionsResponse = {
  transcriptions: TranscriptionItem[]
  total: number
  hasMore: boolean
}

export default function RecentActivityPage() {
  const [transcriptions, setTranscriptions] = useState<TranscriptionItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [playingId, setPlayingId] = useState<number | null>(null)
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(
    null,
  )

  useEffect(() => {
    fetchTranscriptions()
  }, [])

  const fetchTranscriptions = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/transcriptions')

      if (!response.ok) {
        throw new Error('Failed to fetch transcriptions')
      }

      const data: ListTranscriptionsResponse = await response.json()
      setTranscriptions(data.transcriptions)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handlePlayPause = (transcription: TranscriptionItem) => {
    if (playingId === transcription.id) {
      // Stop current audio
      if (audioElement) {
        audioElement.pause()
        setPlayingId(null)
        setAudioElement(null)
      }
    } else {
      // Stop any currently playing audio
      if (audioElement) {
        audioElement.pause()
      }

      // Start new audio
      const audio = new Audio(transcription.audioUrl)
      audio.addEventListener('ended', () => {
        setPlayingId(null)
        setAudioElement(null)
      })
      audio.addEventListener('error', () => {
        setError('Failed to load audio file')
        setPlayingId(null)
        setAudioElement(null)
      })

      audio.play()
      setPlayingId(transcription.id)
      setAudioElement(audio)
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <MarketingContainer>
        <div className="py-8">
          <h1 className="text-3xl font-bold mb-8">Recent Activity</h1>
          <div className="text-center py-8">Loading transcriptions...</div>
        </div>
      </MarketingContainer>
    )
  }

  if (error) {
    return (
      <MarketingContainer>
        <div className="py-8">
          <h1 className="text-3xl font-bold mb-8">Recent Activity</h1>
          <div className="text-center py-8 text-red-600">Error: {error}</div>
        </div>
      </MarketingContainer>
    )
  }

  return (
    <MarketingContainer>
      <div className="py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Recent Activity</h1>
          <Button onClick={() => fetchTranscriptions()} variant="outline">
            Refresh
          </Button>
        </div>

        {transcriptions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-500 mb-4">No transcriptions found.</p>
              <p className="text-sm text-gray-400">
                Start using Vibeflow to see your transcriptions here.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {transcriptions.map((transcription) => (
              <Card
                key={transcription.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">
                        {format(
                          new Date(transcription.recordedAt),
                          'MMM d, yyyy at h:mm a',
                        )}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-2 mb-2">
                        <span>{formatDuration(transcription.duration)}</span>
                        {transcription.targetApp && (
                          <>
                            <span>•</span>
                            <span>{transcription.targetApp}</span>
                          </>
                        )}
                        {transcription.deviceName && (
                          <>
                            <span>•</span>
                            <span>{transcription.deviceName}</span>
                          </>
                        )}
                      </CardDescription>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            transcription.processingStatus === 'completed'
                              ? 'default'
                              : 'secondary'
                          }
                        >
                          {transcription.processingStatus}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePlayPause(transcription)}
                      >
                        {playingId === transcription.id ? (
                          <PauseIcon className="h-4 w-4" />
                        ) : (
                          <PlayIcon className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm leading-relaxed">
                      {transcription.transcriptText}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MarketingContainer>
  )
}
