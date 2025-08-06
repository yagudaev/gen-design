import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const models = [
      {
        id: 'claude-opus',
        name: 'Claude Opus 4.1',
        provider: 'Anthropic',
        description: 'Most capable model for complex design tasks'
      },
      {
        id: 'claude-sonnet',
        name: 'Claude Sonnet 3.5',
        provider: 'Anthropic',
        description: 'Fast and efficient for most design tasks'
      },
      {
        id: 'gpt-4',
        name: 'GPT-4 Turbo',
        provider: 'OpenAI',
        description: 'OpenAI\'s most capable model'
      },
      {
        id: 'gpt-3.5',
        name: 'GPT-3.5 Turbo',
        provider: 'OpenAI',
        description: 'Fast and cost-effective'
      }
    ]

    return NextResponse.json({
      success: true,
      models
    })
  } catch (error: any) {
    console.error('Failed to fetch models:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to fetch models' 
      },
      { status: 500 }
    )
  }
}