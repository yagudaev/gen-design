import { User as DbUser } from '@prisma/client'
import { put } from '@vercel/blob'
import { titleize } from '@workspace/shared/utils'
import {
  AudioConfig,
  AudioOutputStream,
  CancellationDetails,
  CancellationReason,
  ResultReason,
  SpeechConfig,
  SpeechSynthesisOutputFormat,
  SpeechSynthesisResult,
  SpeechSynthesizer,
} from 'microsoft-cognitiveservices-speech-sdk'
import OpenAI from 'openai'

import { normalizeSpokenText } from '@/lib/normalizeContent'

import { sendEmail } from './email'


const openaiSystemKey = process.env.OPENAI_API_KEY as string
const silenceUrl =
  'https://hispp5xuhwtenshp.public.blob.vercel-storage.com/static/silence-WC6YKpepGCwLbgx3cI1R0LdApE0vvm.mp3'

//  TODO: consider using voice explicity instead uf going through user
export async function convert(
  text: string,
  user: DbUser,
  chapterId: number,
  chunkId: number,
): Promise<string> {
  let optimizedText = normalizeSpokenText(text)
  // rare case when text in chunk is empty, just add 2 sec silence
  if (optimizedText.trim().length === 0) {
    return silenceUrl
  }

  // const conversionService = user.conversionService
  const conversionService: 'openai' | 'azure' = 'openai' as any
  console.info('Using conversion service', conversionService)
  let convertUsingPrimary =
    conversionService === 'azure' ? convertUsingAzure : convertUsingOpenAI

  // let convertUsingFallback = user.enableFallbackService
  let convertUsingFallback = false
    ? convertUsingPrimary === convertUsingAzure
      ? convertUsingOpenAI
      : convertUsingAzure
    : null

  // Note: voice field was removed from User model
  // const voice = user.voice as Voice
  // Default to a fallback voice since user.voice doesn't exist
  const voice = 'alloy' as Voice // Default voice
  
  // check if azure only voices are used
  const isAzureOnlyVoice = azureSpecificVoices.includes(voice as any)
  if (isAzureOnlyVoice) {
    convertUsingPrimary = convertUsingAzure
    convertUsingFallback = null
  }

  console.log('convertUsingPrimary', convertUsingPrimary)
  console.log('convertUsingFallback', convertUsingFallback)

  let audioUrl: string
  try {
    audioUrl = await convertUsingPrimary(
      optimizedText,
      user,
      chapterId,
      chunkId,
    )
  } catch (error) {
    console.error(
      `Error converting audio using primary ${conversionService} service, falling back`,
      error,
    )
    try {
      if (!convertUsingFallback)
        throw new Error('No fallback service available')

      audioUrl = await convertUsingFallback(
        optimizedText,
        user,
        chapterId,
        chunkId,
      )
    } catch (error) {
      console.error(
        `Error converting audio using fallback ${conversionService} service`,
        error,
      )
      throw error
    }
  }

  return audioUrl
}

const openaiVoices = [
  'alloy',
  'echo',
  'fable',
  'onyx',
  'nova',
  'shimmer',
] as const
const azureSpecificVoices = [
  'cecilio',
  'beatriz',
  'aarav',
  'kunal',
  'brenda',
  'macerio',
  'antonio',
  'thalita',
] as const

type OpenAIVoices = (typeof openaiVoices)[number]
type AzureSpecificVoices = (typeof azureSpecificVoices)[number]
type Voice = OpenAIVoices | AzureSpecificVoices

const azureVoiceMap: Record<Voice, string> = {
  alloy: 'en-US-AlloyMultilingualNeural',
  echo: 'en-US-EchoMultilingualNeural',
  fable: 'en-US-FableMultilingualNeural',
  onyx: 'en-US-OnyxMultilingualNeural',
  nova: 'en-US-NovaMultilingualNeural',
  shimmer: 'en-US-ShimmerMultilingualNeural',

  cecilio: 'es-MX-CecilioNeural',
  beatriz: 'es-MX-BeatrizNeural',
  aarav: 'en-IN-AaravNeural',
  kunal: 'en-IN-KunalNeural',

  antonio: 'pt-BR-AntonioNeural',
  brenda: 'pt-BR-BrendaNeural',
  macerio: 'pt-BR-MacerioMultilingualNeural',
  thalita: 'pt-BR-ThalitaMultilingualNeural',
}

async function convertUsingOpenAI(
  text: string,
  user: DbUser,
  chapterId: number,
  chunkId: number,
): Promise<string> {
  const openai = new OpenAI({ apiKey: openaiSystemKey })
  const userId = user.id

  const mp3 = await openai.audio.speech.create({
    model: 'tts-1',
    voice: 'alloy' as OpenAIVoices, // Default voice since user.voice field doesn't exist
    input: text,
  })
  const buffer = Buffer.from(await mp3.arrayBuffer())
  const url = await storeMp3(buffer, userId, chapterId, chunkId)

  return url

  // await sleep(1_000)
  // return 'https://hispp5xuhwtenshp.public.blob.vercel-storage.com/users/1/chapters/15/chunks/78/yx0sk-1P6JLaJ1tzBJjVHU2b4l6aNMFhLHlz.mp3'
}

export class SpeechSynthesisCanceledError extends Error {}

const azureApiKey = process.env.AZURE_SPEECH_KEY as string
const azureRegion = process.env.AZURE_SPEECH_REGION as string

async function convertUsingAzure(
  text: string,
  user: DbUser,
  chapterId: number,
  chunkId: number,
) {
  const buffer = await synthesizeToBuffer(text, 'alloy' as OpenAIVoices) // Default voice since user.voice doesn't exist
  const url = await storeMp3(buffer, user.id, chapterId, chunkId)

  return url
}

function getAzureVoiceName(voice: Voice): string {
  return azureVoiceMap[voice]
}

async function synthesizeToBuffer(
  text: string,
  voice: OpenAIVoices,
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const speechConfig = SpeechConfig.fromSubscription(azureApiKey, azureRegion)
    speechConfig.speechSynthesisVoiceName = getAzureVoiceName(voice)
    speechConfig.speechSynthesisOutputFormat =
      SpeechSynthesisOutputFormat.Audio24Khz160KBitRateMonoMp3

    const outputStream = AudioOutputStream.createPullStream()
    const audioConfig = AudioConfig.fromStreamOutput(outputStream)

    const synthesizer = new SpeechSynthesizer(speechConfig, audioConfig)

    synthesizer.speakTextAsync(
      text,
      async (result) => {
        if (result.reason === ResultReason.SynthesizingAudioCompleted) {
          const audioData: ArrayBuffer[] = []

          synthesizer.close()
          // Pull audio data from the stream
          let buffer = new ArrayBuffer(1024)
          let bytesRead = await outputStream.read(buffer)
          while (bytesRead > 0) {
            audioData.push(buffer.slice(0, bytesRead))
            buffer = new ArrayBuffer(1024)
            bytesRead = await outputStream.read(buffer)
          }

          // Concatenate all audio chunks
          const totalLength = audioData.reduce(
            (acc, curr) => acc + curr.byteLength,
            0,
          )
          const audioBuffer = Buffer.concat(
            audioData.map((buffer) => Buffer.from(buffer)),
            totalLength,
          )

          resolve(audioBuffer)
        } else {
          if (result.reason === ResultReason.Canceled) {
            console.error('Speech synthesis canceled,', result.errorDetails)
            const cancellationDetails = CancellationDetails.fromResult(result)
            let str =
              '(cancel) Reason: ' +
              CancellationReason[cancellationDetails.reason]

            if (cancellationDetails.reason === CancellationReason.Error) {
              str += ': ' + result.errorDetails
            }

            console.error(str)
          }

          // new error?
          // Speech synthesis canceled, Status(StatusCode="ResourceExhausted", Detail="AOAI Resource Exhausted") websocket error code: 1013
          // Speech synthesis canceled, The request is throttled because you have exceeded the concurrent request limit allowed for your sub websocket error code: 4429

          // will get called on error
          synthesizer.close()
          reject(
            new SpeechSynthesisCanceledError(
              `Speech synthesis canceled, ${result.errorDetails}`,
            ),
          )
        }
      },
      (error) => {
        synthesizer.close()
        reject(error)
      },
    )
  })
}

async function storeMp3(
  buffer: Buffer,
  userId: number,
  chapterId: number,
  chunkId: number,
): Promise<string> {
  const randomHash = Math.random().toString(36).substring(7)
  const { url } = await put(
    `users/${userId}/chapters/${chapterId}/chunks/${chunkId}/${randomHash}.mp3`,
    buffer,
    {
      access: 'public',
    },
  )

  return url
}
