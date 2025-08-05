import { NextRequest, NextResponse } from 'next/server'
import { User as AuthUser } from 'next-auth'
import { OpenAI } from 'openai'

import { requireRouteAuth } from '@/lib/requireRouteAuth'
import { ChatMessage } from '@/types'

// Opt out of caching for all data requests in the route segment
export const dynamic = 'force-dynamic'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const POST = requireRouteAuth(postHandler)

async function postHandler(
  request: Request,
  authUser: AuthUser,
  userId: number,
) {
  try {
    const { messages, userInput, voice = 'alloy' } = await request.json()

    if (!userInput) {
      return NextResponse.json(
        { error: 'No user input provided' },
        { status: 400 },
      )
    }

    const chatResponse = await openai.chat.completions.create({
      model: 'gpt-4-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful voice assistant.' },
        ...(messages as ChatMessage[]).map((m) => ({
          role: m.role as 'user' | 'assistant' | 'system',
          content: m.content,
        })),
        { role: 'user', content: userInput },
      ],
      temperature: 0.7,
    })

    const responseText =
      chatResponse.choices[0]?.message?.content ||
      "Sorry, I couldn't process that."

    const mp3 = await openai.audio.speech.create({
      model: 'tts-1',
      voice: voice as 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer',
      input: responseText,
    })

    const buffer = Buffer.from(await mp3.arrayBuffer())
    const audioBase64 = buffer.toString('base64')

    return NextResponse.json({
      text: responseText,
      audioBase64: `data:audio/mpeg;base64,${audioBase64}`,
    })
  } catch (error) {
    console.error('Error processing chat request:', error)
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 },
    )
  }
}
