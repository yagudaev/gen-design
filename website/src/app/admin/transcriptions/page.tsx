'use client'

import { format } from 'date-fns'
import {
  PauseIcon,
  PlayIcon,
  RefreshCwIcon,
  SearchIcon,
  Trash2Icon,
} from 'lucide-react'
import React, { useEffect, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'

type AdminTranscriptionItem = {
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

type AdminListTranscriptionsResponse = {
  transcriptions: AdminTranscriptionItem[]
  total: number
  hasMore: boolean
}

export default function AdminTranscriptionsPage() {
  const [transcriptions, setTranscriptions] = useState<
    AdminTranscriptionItem[]
  >([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [playingId, setPlayingId] = useState<number | null>(null)
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(
    null,
  )
  const [searchTerm, setSearchTerm] = useState('')
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set())

  useEffect(() => {
    fetchTranscriptions()
  }, [])

  const fetchTranscriptions = async (search?: string) => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (search) {
        params.set('search', search)
      }

      const response = await fetch(`/api/admin/transcriptions?${params}`)

      if (!response.ok) {
        throw new Error('Failed to fetch transcriptions')
      }

      const data: AdminListTranscriptionsResponse = await response.json()
      setTranscriptions(data.transcriptions)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchTranscriptions(searchTerm)
  }

  const handlePlayPause = (transcription: AdminTranscriptionItem) => {
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

  const handleDelete = async (transcriptionId: number) => {
    if (
      !confirm(
        'Are you sure you want to delete this transcription? This will permanently remove the transcription and its audio file.',
      )
    ) {
      return
    }

    try {
      setDeletingIds((prev) => new Set([...prev, transcriptionId]))

      const response = await fetch(
        `/api/admin/transcriptions/${transcriptionId}`,
        {
          method: 'DELETE',
        },
      )

      if (!response.ok) {
        throw new Error('Failed to delete transcription')
      }

      // Remove from list
      setTranscriptions((prev) => prev.filter((t) => t.id !== transcriptionId))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete')
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev)
        next.delete(transcriptionId)
        return next
      })
    }
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="container py-8 mx-auto">
        <h1 className="mb-8 text-3xl font-bold">Transcriptions</h1>
        <div className="py-8 text-center">Loading transcriptions...</div>
      </div>
    )
  }

  return (
    <div className="container py-8 mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin - Transcriptions</h1>
        <Button
          onClick={() => fetchTranscriptions(searchTerm)}
          variant="outline"
        >
          <RefreshCwIcon className="mr-2 w-4 h-4" />
          Refresh
        </Button>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search Transcriptions</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              type="text"
              placeholder="Search transcription text..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">
              <SearchIcon className="mr-2 w-4 h-4" />
              Search
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Card className="mb-6 bg-red-50 border-red-200">
          <CardContent className="py-4">
            <p className="text-red-600">Error: {error}</p>
          </CardContent>
        </Card>
      )}

      {transcriptions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="mb-4 text-gray-500">No transcriptions found.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {transcriptions.map((transcription) => (
            <Card
              key={transcription.id}
              className="transition-shadow hover:shadow-md"
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="mb-2 text-lg">
                      {format(
                        new Date(transcription.recordedAt),
                        'MMM d, yyyy at h:mm a',
                      )}
                    </CardTitle>
                    <CardDescription className="flex gap-2 items-center mb-2">
                      <span className="font-medium">
                        {transcription.userName} ({transcription.userEmail})
                      </span>
                      <span>•</span>
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
                    <div className="flex gap-2 items-center">
                      <Badge
                        variant={
                          transcription.processingStatus === 'completed'
                            ? 'default'
                            : 'secondary'
                        }
                      >
                        {transcription.processingStatus}
                      </Badge>
                      <Badge variant="outline">ID: {transcription.id}</Badge>
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePlayPause(transcription)}
                    >
                      {playingId === transcription.id ? (
                        <PauseIcon className="w-4 h-4" />
                      ) : (
                        <PlayIcon className="w-4 h-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={deletingIds.has(transcription.id)}
                      onClick={() => handleDelete(transcription.id)}
                    >
                      <Trash2Icon className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="p-4 bg-gray-50 rounded-lg">
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
  )
}
