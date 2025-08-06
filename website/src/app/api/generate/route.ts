import { NextRequest, NextResponse } from 'next/server'
import { OpenAI } from 'openai'

// Initialize OpenRouter client (uses OpenAI SDK)
const openRouter = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    'HTTP-Referer': process.env.SITE_URL || 'http://localhost:3000',
    'X-Title': 'Gen Design AI',
  }
})

const modelMap: Record<string, string> = {
  'claude-opus': 'anthropic/claude-3-opus',
  'claude-sonnet': 'anthropic/claude-3.5-sonnet',
  'gpt-4': 'openai/gpt-4-turbo',
  'gpt-3.5': 'openai/gpt-3.5-turbo'
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { prompt, designSystemId, model, systemPrompt, options, context } = body

    // Build the full prompt with design system context
    const fullPrompt = buildPrompt(prompt, systemPrompt, designSystemId, context, options)

    // Call the LLM via OpenRouter
    const completion = await openRouter.chat.completions.create({
      model: modelMap[model] || modelMap['claude-opus'],
      messages: [
        {
          role: 'system',
          content: systemPrompt || 'You are a helpful design assistant that creates Figma designs.'
        },
        {
          role: 'user',
          content: fullPrompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    })

    const response = completion.choices[0]?.message?.content || ''

    // Parse the LLM response into structured design data
    const designSpec = parseDesignResponse(response)

    return NextResponse.json({
      success: true,
      designSpec,
      rawResponse: response
    })
  } catch (error: any) {
    console.error('Generation error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to generate design' 
      },
      { status: 500 }
    )
  }
}

function buildPrompt(
  userPrompt: string,
  systemPrompt: string,
  designSystemId: string,
  context: any,
  options: any
): string {
  let prompt = `Create a Figma design based on this request: ${userPrompt}\n\n`

  if (designSystemId) {
    prompt += `Use the design system with ID: ${designSystemId}\n`
  }

  if (context) {
    prompt += `Current context:\n${JSON.stringify(context, null, 2)}\n\n`
  }

  if (options.variants > 1) {
    prompt += `Generate ${options.variants} different variants of this design.\n`
  }

  if (options.responsive) {
    prompt += `Include both mobile and desktop responsive versions.\n`
  }

  if (options.edgeCases) {
    prompt += `Include edge cases like error states and empty states.\n`
  }

  if (options.multiScreen) {
    prompt += `Create a multi-screen user flow.\n`
  }

  prompt += `\nProvide the response as a structured JSON specification that describes:
  - Layout structure (frames, components, spacing)
  - Component usage (which components from the design system to use)
  - Content (text, labels, placeholders)
  - Styling (colors, typography from design tokens)
  - Interactions (if applicable)`

  return prompt
}

function parseDesignResponse(response: string): any {
  // Try to parse JSON from the response
  try {
    // Look for JSON in the response
    const jsonMatch = response.match(/```json\n([\s\S]*?)\n```/)
    if (jsonMatch) {
      return JSON.parse(jsonMatch[1])
    }
    
    // Try to parse the whole response as JSON
    return JSON.parse(response)
  } catch (error) {
    // If parsing fails, return a basic structure
    return {
      type: 'frame',
      name: 'Generated Design',
      children: [],
      description: response
    }
  }
}