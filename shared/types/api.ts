// Shared types for API communication between plugin and website

export interface DesignSystem {
  id: string
  name: string
  componentCount: number
  components: ComponentInfo[]
}

export interface ComponentInfo {
  id: string
  name: string
  type: string
  description?: string
  properties?: Record<string, any>
}

export interface GenerationOptions {
  variants: number
  responsive: boolean
  edgeCases: boolean
  multiScreen: boolean
}

export interface GenerationRequest {
  prompt: string
  designSystemId: string
  model: string
  systemPrompt: string
  options: GenerationOptions
  context?: FrameContext
}

export interface FrameContext {
  selectedNode?: {
    id: string
    name: string
    type: string
  }
  components: Array<{
    id: string
    name: string
    type: string
  }>
  layout?: any
  tokens?: DesignTokens
}

export interface DesignTokens {
  colors?: Record<string, string>
  typography?: Record<string, TypographyToken>
  spacing?: Record<string, number>
  borderRadius?: Record<string, number>
  shadows?: Record<string, string>
}

export interface TypographyToken {
  fontFamily: string
  fontSize: number
  fontWeight: number
  lineHeight?: number
  letterSpacing?: number
}

export interface DesignSpec {
  type: 'frame' | 'text' | 'rectangle' | 'component' | 'group'
  name: string
  children?: DesignSpec[]
  properties?: {
    width?: number
    height?: number
    x?: number
    y?: number
    cornerRadius?: number
    componentId?: string
    componentName?: string
    [key: string]: any
  }
  layout?: {
    mode?: 'NONE' | 'HORIZONTAL' | 'VERTICAL'
    spacing?: number
    padding?: {
      top?: number
      right?: number
      bottom?: number
      left?: number
    }
    primaryAxisAlignItems?: 'MIN' | 'CENTER' | 'MAX' | 'SPACE_BETWEEN'
    counterAxisAlignItems?: 'MIN' | 'CENTER' | 'MAX' | 'STRETCH'
  }
  fills?: Array<{
    type: string
    color?: { r: number; g: number; b: number; a?: number }
    [key: string]: any
  }>
  strokes?: Array<{
    type: string
    color?: { r: number; g: number; b: number; a?: number }
    [key: string]: any
  }>
  effects?: Array<{
    type: string
    [key: string]: any
  }>
  text?: {
    characters: string
    fontSize?: number
    fontFamily?: string
    fontWeight?: number
    textAlignHorizontal?: 'LEFT' | 'CENTER' | 'RIGHT' | 'JUSTIFIED'
    textAlignVertical?: 'TOP' | 'CENTER' | 'BOTTOM'
  }
}

export interface APIResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

export interface GenerationResponse {
  designSpec: DesignSpec
  rawResponse?: string
}

export interface Model {
  id: string
  name: string
  provider: string
  description?: string
}