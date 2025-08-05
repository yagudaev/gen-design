const FFMPEG_SERVER_URL = 'https://ffmpeg.vibeflow.com'

interface FfmpegChunk {
  id: number
  order: number
  audioUrl: string | null
  chapterId: number
}

export async function stitchAudio(
  chunks: FfmpegChunk[],
  jwt: string,
): Promise<string> {
  const ffmpegChunks: FfmpegChunk[] = chunks.map((chunk) => ({
    id: chunk.id,
    order: chunk.order,
    audioUrl: chunk.audioUrl,
    chapterId: chunk.chapterId,
  }))
  console.log('********* ffmpegChunks', ffmpegChunks)
  console.log('********* jwt', jwt)

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
