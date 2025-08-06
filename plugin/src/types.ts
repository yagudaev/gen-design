import { EventHandler } from '@create-figma-plugin/utilities'

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
}

export interface LoadDesignSystemsHandler extends EventHandler {
  name: 'LOAD_DESIGN_SYSTEMS'
  handler: () => void
}

export interface DesignSystemsLoadedHandler extends EventHandler {
  name: 'DESIGN_SYSTEMS_LOADED'
  handler: (systems: DesignSystem[]) => void
}

export interface GenerateDesignHandler extends EventHandler {
  name: 'GENERATE_DESIGN'
  handler: (request: GenerationRequest) => void
}

export interface GenerationCompleteHandler extends EventHandler {
  name: 'GENERATION_COMPLETE'
  handler: (result: { frameCount: number; frames: Array<{ id: string; name: string }> }) => void
}

export interface GenerationErrorHandler extends EventHandler {
  name: 'GENERATION_ERROR'
  handler: (error: string) => void
}
