'use client'

import { DropdownMenu } from '@workspace/shared/components/ui/dropdown-menu'
import { asyncReduce, cn } from '@workspace/shared/utils'
import { useState } from 'react'
import toast from 'react-hot-toast'

import { Button, ButtonProps } from '@/components/ui/button'
import { ApiError, callApi } from '@/lib/callApi'
import { Chapter, Chunk, SerializedUser, Version } from '@/types'

// 30 mins
const FOREVER = 30 * 60 * 1000
enum ProcessingStep {
  Chunking = 'Chunking',
  Converting = 'Converting',
  Stitching = 'Stitching',
}
export function ProcessingButton({
  chunks,
  setChunks,
  user,
  projectId,
  chapter,
  onSuccess,
  variant = 'default',
  label = 'Process',
}: {
  chunks: Chunk[]
  setChunks: (chunks: Chunk[]) => void
  user: SerializedUser | null
  projectId: number
  chapter: Chapter | null
  onSuccess?: (version: Version | null) => void
  variant?: ButtonProps['variant']
  label?: string
}) {
  const chapterId = chapter?.id

  // processing
  const [processsing, setProcessing] = useState(false)
  const [processingStep, setProcessingStep] = useState<null | ProcessingStep>(
    null,
  )
  const [processingPercentage, setProcessingPercentage] = useState(0)

  const [chuncking, setChuncking] = useState(false)
  const [convertingAll, setConvertingAll] = useState(false)
  const [convertingAllProgress, setConvertingAllProgress] = useState(0)
  const [stitching, setStitching] = useState(false)

  async function handleProcess() {
    // allocate 10% chunking, 80% converting, 10% stitching
    try {
      setProcessing(true)
      setProcessingPercentage(0)

      setProcessingStep(ProcessingStep.Chunking)
      setProcessingPercentage(5)
      let { chunks } = await handleChunking()
      setProcessingPercentage(10)
      const currentVersion = chunks[0].version

      setProcessingStep(ProcessingStep.Converting)
      const { chunks: convertedChunks } = await handleConverting(
        chunks,
        (progress) => setProcessingPercentage(10 + progress * 0.8),
        currentVersion,
      )
      setProcessingPercentage(90)

      setProcessingStep(ProcessingStep.Stitching)
      const updatedVersion = await handleStitching(
        convertedChunks,
        chunks,
        currentVersion,
      )
      setProcessingPercentage(100)

      setProcessing(false)

      onSuccess?.(updatedVersion ?? null)
    } catch (error) {
      console.error('Error processing', error)
      toast.error('Error processing', { duration: FOREVER })
      setProcessing(false)
    }
  }

  async function handleChunking() {
    // if already chunked lets skip
    if (chunks.length > 0) return { chunks }
    if (!chapterId) return { chunks: [] }

    setChuncking(true)

    try {
      const { chunks } = await callApi<{ chunks: Chunk[] }>(
        `/api/projects/${projectId}/chapters/${chapterId}/chunk`,
        { method: 'POST' },
      )
      setChunks(chunks.sort((a: any, b: any) => a.order - b.order))
      setChuncking(false)

      return { chunks }
    } catch (error) {
      console.error('Error chunking', error)
      toast.error('Error chunking')
      setChuncking(false)
      throw error
    }
  }

  async function handleConverting(
    localChunks = chunks,
    onProgress?: (progress: number) => void,
    currentVersion?: Version | null,
  ) {
    // if already converting, or no chapterId, lets skip
    if (convertingAll || !chapterId) {
      setConvertingAll(false)
      return { chunks: [] }
    }

    const updatedChunks: Chunk[] = []
    const batchSize = 10

    setConvertingAll(true)

    try {
      for (let i = 0; i < localChunks.length; i += batchSize) {
        const batch = localChunks.slice(i, i + batchSize)

        const convertedBatch = await Promise.all(
          batch.map(async (chunk) => {
            let newChunk = chunk

            // Skip if already converted
            if (chunk.status !== 'converted') {
              const data = await convertChunk(projectId, chapterId, chunk)
              newChunk = data.chunk
            }

            updatedChunks.push(newChunk)
            const progress = (updatedChunks.length / localChunks.length) * 100
            setConvertingAllProgress(progress)
            onProgress?.(progress)

            return newChunk
          }),
        )

        // might lose order, so sort again
        updatedChunks.sort((a, b) => a.order - b.order)
      }

      setConvertingAll(false)

      return { chunks: updatedChunks }
    } catch (error) {
      console.error('Error converting', error)
      setConvertingAll(false)

      if (
        error instanceof ApiError &&
        error.errorCode === 'INSUFFICIENT_CREDITS'
      ) {
        if (updatedChunks.length > 0) {
          toast.success(
            'You’ve converted 10 minutes for free! Upgrade to unlock the full chapter.',
            {
              duration: 5_000,
            },
          )
        } else {
          toast.error(
            'Oppsy, looks like we ran out of credits. Get more credits to convert the rest of the chapter.',
            { duration: FOREVER },
          )
        }

        if (!currentVersion) return { chunks: updatedChunks }
        const updatedVersion = await updateVersion(currentVersion, projectId, {
          status: 'partial',
        })

        // return the converted chunks instead
        return { chunks: updatedChunks, version: updatedVersion }
      } else {
        toast.error('Error converting', { duration: FOREVER })
        throw error
      }
    }
  }

  async function handleStitching(
    convertedChunks = chunks,
    allChunks = chunks,
    currentVersion?: Version | null,
  ) {
    if (!user) return
    if (!chapterId) return

    if (!currentVersion) return

    // special case, probably not enough credits, so nothing was converted
    if (convertedChunks.length === 0) return

    try {
      const audioUrl = await stitchInBatches(convertedChunks, user)
      if (!audioUrl) throw new Error('Error stitching')

      const chunksWithAudioUrl = convertedChunks.filter(
        (chunk) => !!chunk.audioUrl,
      )

      const updatedVersion = await updateVersion(currentVersion, projectId, {
        audioUrl,
        status:
          allChunks.length > chunksWithAudioUrl.length ? 'partial' : 'stitched',
      })

      setStitching(false)

      return updatedVersion
    } catch (error) {
      toast.error('Error stitching', { duration: FOREVER })
      setStitching(false)
      console.error('Error stitching', error)
      throw error
    }
  }

  return (
    <div className="flex items-center w-full md:w-auto">
      <DropdownMenu>
        <Button
          onClick={handleProcess}
          loading={processsing}
          loadingLabel={processingStep}
          loadingProgress={processingPercentage}
          variant={variant}
          className={cn(
            'flex w-full px-6  md:w-auto',
            chapter?.status === 'stitched' && 'border-r-1',
          )}
        >
          {chapter?.status === 'stitched' ? 'Re-process' : label}
        </Button>
      </DropdownMenu>
    </div>
  )
}

export async function convertChunk(
  projectId: number,
  chapterId: number,
  chunk: Chunk,
): Promise<{ chunk: Chunk }> {
  return await callApi<{ chunk: any }>(
    `/api/projects/${projectId}/chapters/${chapterId}/chunks/${chunk.id}/convert`,
    { method: 'POST', retry: true, noRetryOn: ['INSUFFICIENT_CREDITS'] },
  )
}
const FFMPEG_SERVER_URL = 'https://ffmpeg.audiowaveai.com'
// const FFMPEG_SERVER_URL = 'http://ec2-54-227-49-55.compute-1.amazonaws.com'
// const FFMPEG_SERVER_URL = 'http://localhost:4000'
interface FfmpegChunk {
  id: number
  order: number
  audioUrl: string | null
  chapterId: number
}

async function stitchInBatches(chunks: Chunk[], user: SerializedUser) {
  const groupSize = 60
  const chunkGroups = []

  // Divide chunks into groups of 100
  for (let i = 0; i < chunks.length; i += groupSize) {
    chunkGroups.push(chunks.slice(i, i + groupSize))
  }

  console.log('stitching chunks', chunkGroups)
  const stitchedAudioUrls: string[] = []
  for (const chunkGroup of chunkGroups) {
    const stitchedUrl = await stitch(chunkGroup, user)
    stitchedAudioUrls.push(stitchedUrl)
    console.log('stitched chunks for a group', stitchedUrl)
  }

  // If there's only one group, no need to stitch again
  if (stitchedAudioUrls.length === 1) {
    return stitchedAudioUrls[0]
  }

  const finalAudioUrl = await stitchGroups(stitchedAudioUrls, chunks, user)

  return finalAudioUrl
}

async function stitchGroups(
  stitchedAudioUrls: string[],
  chunks: Chunk[],
  user: SerializedUser,
) {
  return await asyncReduce<string, string | null>(
    stitchedAudioUrls,
    async (acc, url, i) => {
      if (!acc) return url

      const chapterId = chunks[0].chapterId
      const timestamp = new Date().getTime()

      const audioUrl = await stitch(
        [
          {
            id: timestamp + i,
            order: i,
            audioUrl: acc,
            chapterId,
          },
          {
            audioUrl: url,
            id: timestamp + i + 1,
            order: i + 1,
            chapterId,
          },
        ],
        user,
      )

      console.log('stitched two group', audioUrl, [acc, url])

      return audioUrl
    },
    '',
  )
}

async function stitch(
  chunks: (Partial<Chunk> & FfmpegChunk)[],
  user: SerializedUser,
) {
  const jwt = user.accessToken
  const ffmpegChunks: FfmpegChunk[] = chunks.map((chunk) => ({
    id: chunk.id,
    order: chunk.order,
    audioUrl: chunk.audioUrl,
    chapterId: chunk.chapterId,
  }))

  const response = await fetch(`${FFMPEG_SERVER_URL}/stitch`, {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + jwt,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(ffmpegChunks),
  })

  if (!response.ok) {
    console.error(response)
    throw new Error('Failed to stitch audio')
  }

  const { audioUrl } = await response.json()
  return audioUrl
}

async function updateVersion(
  version: Version,
  projectId: number,
  data: Partial<Version>,
) {
  const { version: updatedVersion } = await callApi<{ version: Version }>(
    `/api/projects/${projectId}/chapters/${version.chapterId}/versions/${version.id}`,
    {
      method: 'PATCH',
      body: JSON.stringify(data),
    },
  )

  return updatedVersion
}
