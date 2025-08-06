import { emit, on, once, showUI } from '@create-figma-plugin/utilities'
import { apiClient } from './api'
import { DesignBuilder } from './design-builder'

interface DesignSystem {
  id: string
  name: string
  componentCount: number
  components: ComponentInfo[]
}

interface ComponentInfo {
  id: string
  name: string
  type: string
  description?: string
}

interface GenerationRequest {
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
}

export default function () {
  // Show the UI with appropriate size
  showUI({ 
    height: 600, 
    width: 400,
    title: 'Gen Design AI'
  })

  // Handle design system loading
  on('LOAD_DESIGN_SYSTEMS', async () => {
    try {
      const designSystems = await extractDesignSystems()
      emit('DESIGN_SYSTEMS_LOADED', designSystems)
    } catch (error) {
      console.error('Failed to load design systems:', error)
      emit('DESIGN_SYSTEMS_LOADED', [])
    }
  })

  // Handle design generation
  on('GENERATE_DESIGN', async (request: GenerationRequest) => {
    try {
      console.log('Generating design with request:', request)
      
      // Get the selected frame context if any
      const context = await getSelectedFrameContext()
      
      // Find the design system
      const designSystem = await findDesignSystem(request.designSystemId)
      
      // Call the API to generate design specification
      try {
        const designSpec = await apiClient.generateDesign({
          ...request,
          context
        })
        
        // Build the design from the specification
        const builder = new DesignBuilder()
        const frames: FrameNode[] = []
        
        // Create a section for organization
        const section = figma.createSection()
        section.name = `Generated: ${request.prompt.substring(0, 50)}...`
        
        // Generate the specified number of variants
        for (let i = 0; i < request.options.variants; i++) {
          // Modify the spec slightly for each variant (in production, the API would return different variants)
          const variantSpec = {
            ...designSpec,
            name: `Variant ${i + 1}: ${designSpec.name || request.prompt.substring(0, 30)}`,
            properties: {
              ...designSpec.properties,
              x: i * 500,
              y: 0,
              width: 375,
              height: 812
            }
          }
          
          const frame = await builder.buildFromSpec(variantSpec) as FrameNode
          section.appendChild(frame)
          frames.push(frame)
        }
        
        // Select and zoom to the created frames
        figma.currentPage.selection = frames
        figma.viewport.scrollAndZoomIntoView(frames)
        
        emit('GENERATION_COMPLETE', {
          frameCount: frames.length,
          frames: frames.map(f => ({ id: f.id, name: f.name }))
        })
      } catch (apiError: any) {
        console.warn('API call failed, using fallback generation:', apiError)
        // Fallback to simple frame generation if API is not available
        const frames = await createDesignFrames(request, designSystem, context)
        
        emit('GENERATION_COMPLETE', {
          frameCount: frames.length,
          frames: frames.map(f => ({ id: f.id, name: f.name }))
        })
      }
    } catch (error: any) {
      console.error('Generation failed:', error)
      emit('GENERATION_ERROR', error.message || 'Unknown error occurred')
    }
  })
}

async function extractDesignSystems(): Promise<DesignSystem[]> {
  const systems: DesignSystem[] = []
  
  // Get all enabled libraries
  const libraries = await figma.teamLibrary.getAvailableLibraryVariableCollectionsAsync()
  
  // Also check for local components
  const localComponents = figma.root.findAll(node => node.type === 'COMPONENT') as ComponentNode[]
  
  if (localComponents.length > 0) {
    const localSystem: DesignSystem = {
      id: 'local',
      name: 'Local Components',
      componentCount: localComponents.length,
      components: localComponents.map((comp) => ({
        id: comp.id,
        name: comp.name,
        type: 'component',
        description: comp.description
      }))
    }
    systems.push(localSystem)
  }
  
  // Note: Team library component enumeration requires additional API calls
  // This is simplified for now - in production you'd use figma.importComponentByKeyAsync
  for (const lib of libraries) {
    // For now, just show the library exists
    systems.push({
      id: lib.key,
      name: lib.name,
      componentCount: 0, // Would need to enumerate components
      components: []
    })
  }
  
  return systems
}

async function getSelectedFrameContext(): Promise<any> {
  const selection = figma.currentPage.selection
  
  if (selection.length === 0) {
    return null
  }
  
  const selected = selection[0]
  
  // Find all components in the selection
  const components = selected.type === 'FRAME' || selected.type === 'GROUP' 
    ? selected.findAll(node => node.type === 'INSTANCE' || node.type === 'COMPONENT')
    : []
  
  return {
    selectedNode: {
      id: selected.id,
      name: selected.name,
      type: selected.type
    },
    components: components.map(comp => ({
      id: comp.id,
      name: comp.name,
      type: comp.type
    }))
  }
}

async function findDesignSystem(systemId: string): Promise<DesignSystem | null> {
  const systems = await extractDesignSystems()
  return systems.find(s => s.id === systemId) || null
}

async function createDesignFrames(
  request: GenerationRequest,
  designSystem: DesignSystem | null,
  context: any
): Promise<FrameNode[]> {
  const frames: FrameNode[] = []
  const variantCount = request.options.variants
  
  // Create a section if generating multiple variants
  let section: SectionNode | null = null
  if (variantCount > 1 || request.options.multiScreen) {
    section = figma.createSection()
    section.name = `Generated: ${request.prompt.substring(0, 50)}...`
    section.x = 0
    section.y = 0
  }
  
  // Generate the specified number of variants
  for (let i = 0; i < variantCount; i++) {
    const frame = figma.createFrame()
    frame.name = `Variant ${i + 1}: ${request.prompt.substring(0, 30)}...`
    frame.resize(375, 812) // iPhone size by default
    
    // Position frames horizontally with spacing
    frame.x = i * (375 + 100)
    frame.y = 0
    
    // Add basic auto-layout
    frame.layoutMode = 'VERTICAL'
    frame.primaryAxisAlignItems = 'CENTER'
    frame.counterAxisAlignItems = 'CENTER'
    frame.paddingTop = 40
    frame.paddingBottom = 40
    frame.paddingLeft = 20
    frame.paddingRight = 20
    frame.itemSpacing = 20
    
    // Set background
    frame.fills = [{
      type: 'SOLID',
      color: { r: 0.98, g: 0.98, b: 0.98 }
    }]
    
    // Add a placeholder text for now
    const text = figma.createText()
    await figma.loadFontAsync({ family: "Inter", style: "Regular" })
    text.characters = `${request.prompt}\n\nVariant ${i + 1}\n\n(Connecting to API...)`
    text.fontSize = 14
    text.textAlignHorizontal = 'CENTER'
    frame.appendChild(text)
    
    if (section) {
      section.appendChild(frame)
    }
    
    frames.push(frame)
  }
  
  // Handle responsive variants
  if (request.options.responsive && frames.length > 0) {
    const desktopFrame = frames[0].clone()
    desktopFrame.name = `Desktop: ${request.prompt.substring(0, 30)}...`
    desktopFrame.resize(1440, 900)
    desktopFrame.x = frames.length * (375 + 100)
    
    if (section) {
      section.appendChild(desktopFrame)
    }
    frames.push(desktopFrame)
  }
  
  // Handle edge cases
  if (request.options.edgeCases && frames.length > 0) {
    const errorFrame = frames[0].clone()
    errorFrame.name = `Error State: ${request.prompt.substring(0, 30)}...`
    errorFrame.y = 912
    
    const emptyFrame = frames[0].clone()
    emptyFrame.name = `Empty State: ${request.prompt.substring(0, 30)}...`
    emptyFrame.x = 475
    emptyFrame.y = 912
    
    if (section) {
      section.appendChild(errorFrame)
      section.appendChild(emptyFrame)
    }
    frames.push(errorFrame, emptyFrame)
  }
  
  // Select and zoom to the created frames
  if (frames.length > 0) {
    figma.currentPage.selection = frames
    figma.viewport.scrollAndZoomIntoView(frames)
  }
  
  return frames
}