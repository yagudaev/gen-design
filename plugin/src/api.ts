// API client for communicating with the backend

const API_BASE_URL = 'http://localhost:3000/api'

export interface GenerationRequest {
  prompt: string
  designSystemId: string
  model: string
  systemPrompt: string
  options: {
    variants: number
    responsive: boolean
    edgeCases: boolean
    multiScreen: boolean
  }
  context?: any
}

export interface DesignSpec {
  type: string
  name: string
  children?: DesignSpec[]
  properties?: Record<string, any>
  layout?: {
    mode?: 'NONE' | 'HORIZONTAL' | 'VERTICAL'
    spacing?: number
    padding?: { top?: number; right?: number; bottom?: number; left?: number }
    primaryAxisAlignItems?: 'MIN' | 'CENTER' | 'MAX' | 'SPACE_BETWEEN'
    counterAxisAlignItems?: 'MIN' | 'CENTER' | 'MAX' | 'BASELINE' | 'STRETCH'
  }
  fills?: any[]
  strokes?: any[]
  effects?: any[]
  text?: {
    characters: string
    fontSize?: number
    fontFamily?: string
    fontWeight?: number
    textAlignHorizontal?: 'LEFT' | 'CENTER' | 'RIGHT' | 'JUSTIFIED'
    textAlignVertical?: 'TOP' | 'CENTER' | 'BOTTOM'
  }
}

export class APIClient {
  private baseUrl: string

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl
  }

  async generateDesign(request: GenerationRequest): Promise<DesignSpec> {
    try {
      const response = await fetch(`${this.baseUrl}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request)
      })

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'Generation failed')
      }

      return data.designSpec
    } catch (error) {
      console.error('Failed to generate design:', error)
      throw error
    }
  }

  async getDesignSystems(): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/design-systems`)
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      return data.designSystems || []
    } catch (error) {
      console.error('Failed to fetch design systems:', error)
      return []
    }
  }

  async getModels(): Promise<any[]> {
    try {
      const response = await fetch(`${this.baseUrl}/models`)
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      return data.models || []
    } catch (error) {
      console.error('Failed to fetch models:', error)
      return []
    }
  }
}

export const apiClient = new APIClient()