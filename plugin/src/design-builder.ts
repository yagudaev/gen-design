import { DesignSpec } from './api'

export class DesignBuilder {
  private componentCache: Map<string, ComponentNode> = new Map()

  async buildFromSpec(spec: DesignSpec, parent?: BaseNode): Promise<SceneNode> {
    switch (spec.type) {
      case 'frame':
        return this.createFrame(spec, parent)
      case 'text':
        return this.createText(spec, parent)
      case 'rectangle':
        return this.createRectangle(spec, parent)
      case 'component':
        return this.createComponentInstance(spec, parent)
      case 'group':
        return this.createGroup(spec, parent)
      default:
        // Default to frame if type is unknown
        return this.createFrame(spec, parent)
    }
  }

  private async createFrame(spec: DesignSpec, parent?: BaseNode): Promise<FrameNode> {
    const frame = figma.createFrame()
    frame.name = spec.name || 'Frame'

    // Apply layout properties
    if (spec.layout) {
      if (spec.layout.mode && spec.layout.mode !== 'NONE') {
        frame.layoutMode = spec.layout.mode
      }
      if (spec.layout.spacing !== undefined) {
        frame.itemSpacing = spec.layout.spacing
      }
      if (spec.layout.padding) {
        frame.paddingTop = spec.layout.padding.top || 0
        frame.paddingRight = spec.layout.padding.right || 0
        frame.paddingBottom = spec.layout.padding.bottom || 0
        frame.paddingLeft = spec.layout.padding.left || 0
      }
      if (spec.layout.primaryAxisAlignItems) {
        frame.primaryAxisAlignItems = spec.layout.primaryAxisAlignItems
      }
      if (spec.layout.counterAxisAlignItems) {
        // Map STRETCH to BASELINE for Figma compatibility
        const alignMap: Record<string, any> = {
          'MIN': 'MIN',
          'CENTER': 'CENTER',
          'MAX': 'MAX',
          'STRETCH': 'BASELINE'
        }
        frame.counterAxisAlignItems = alignMap[spec.layout.counterAxisAlignItems] || 'MIN'
      }
    }

    // Apply properties
    if (spec.properties) {
      if (spec.properties.width) frame.resize(spec.properties.width, frame.height)
      if (spec.properties.height) frame.resize(frame.width, spec.properties.height)
      if (spec.properties.x !== undefined) frame.x = spec.properties.x
      if (spec.properties.y !== undefined) frame.y = spec.properties.y
    }

    // Apply fills
    if (spec.fills) {
      frame.fills = spec.fills
    }

    // Apply strokes
    if (spec.strokes) {
      frame.strokes = spec.strokes
    }

    // Apply effects
    if (spec.effects) {
      frame.effects = spec.effects
    }

    // Create children
    if (spec.children && spec.children.length > 0) {
      for (const childSpec of spec.children) {
        const child = await this.buildFromSpec(childSpec, frame)
        frame.appendChild(child)
      }
    }

    if (parent && 'appendChild' in parent) {
      (parent as any).appendChild(frame)
    }

    return frame
  }

  private async createText(spec: DesignSpec, parent?: BaseNode): Promise<TextNode> {
    const text = figma.createText()
    
    // Load font
    await figma.loadFontAsync({ family: "Inter", style: "Regular" })
    
    if (spec.text) {
      text.characters = spec.text.characters || ''
      
      if (spec.text.fontSize) {
        text.fontSize = spec.text.fontSize
      }
      
      if (spec.text.fontFamily && spec.text.fontWeight) {
        try {
          const weight = this.mapFontWeight(spec.text.fontWeight)
          await figma.loadFontAsync({ family: spec.text.fontFamily, style: weight })
          text.fontName = { family: spec.text.fontFamily, style: weight }
        } catch (error) {
          console.warn('Failed to load font:', error)
        }
      }
      
      if (spec.text.textAlignHorizontal) {
        text.textAlignHorizontal = spec.text.textAlignHorizontal
      }
      
      if (spec.text.textAlignVertical) {
        text.textAlignVertical = spec.text.textAlignVertical
      }
    }

    if (spec.name) {
      text.name = spec.name
    }

    // Apply fills
    if (spec.fills) {
      text.fills = spec.fills
    }

    if (parent && 'appendChild' in parent) {
      (parent as any).appendChild(text)
    }

    return text
  }

  private createRectangle(spec: DesignSpec, parent?: BaseNode): RectangleNode {
    const rect = figma.createRectangle()
    rect.name = spec.name || 'Rectangle'

    // Apply properties
    if (spec.properties) {
      if (spec.properties.width) rect.resize(spec.properties.width, rect.height)
      if (spec.properties.height) rect.resize(rect.width, spec.properties.height)
      if (spec.properties.x !== undefined) rect.x = spec.properties.x
      if (spec.properties.y !== undefined) rect.y = spec.properties.y
      if (spec.properties.cornerRadius) rect.cornerRadius = spec.properties.cornerRadius
    }

    // Apply fills
    if (spec.fills) {
      rect.fills = spec.fills
    }

    // Apply strokes
    if (spec.strokes) {
      rect.strokes = spec.strokes
    }

    // Apply effects
    if (spec.effects) {
      rect.effects = spec.effects
    }

    if (parent && 'appendChild' in parent) {
      (parent as any).appendChild(rect)
    }

    return rect
  }

  private async createComponentInstance(spec: DesignSpec, parent?: BaseNode): Promise<SceneNode> {
    // Try to find the component
    let component: ComponentNode | null = null

    if (spec.properties?.componentId) {
      // Try to get from cache first
      component = this.componentCache.get(spec.properties.componentId) || null

      if (!component) {
        // Try to find in the document
        component = figma.root.findOne(node => 
          node.type === 'COMPONENT' && node.id === spec.properties?.componentId
        ) as ComponentNode | null

        if (component) {
          this.componentCache.set(spec.properties.componentId, component)
        }
      }
    }

    if (!component && spec.properties?.componentName) {
      // Try to find by name
      component = figma.root.findOne(node => 
        node.type === 'COMPONENT' && node.name === spec.properties?.componentName
      ) as ComponentNode | null
    }

    if (!component) {
      // Fallback to creating a frame
      console.warn('Component not found, creating frame instead')
      return await this.createFrame(spec, parent)
    }

    const instance = component.createInstance()
    instance.name = spec.name || instance.name

    // Apply properties
    if (spec.properties) {
      if (spec.properties.x !== undefined) instance.x = spec.properties.x
      if (spec.properties.y !== undefined) instance.y = spec.properties.y
    }

    if (parent && 'appendChild' in parent) {
      (parent as any).appendChild(instance)
    }

    return instance
  }

  private async createGroup(spec: DesignSpec, parent?: BaseNode): Promise<GroupNode> {
    const children: SceneNode[] = []

    // Create children first
    if (spec.children && spec.children.length > 0) {
      for (const childSpec of spec.children) {
        const child = await this.buildFromSpec(childSpec)
        children.push(child)
      }
    }

    // Create group from children
    const group = figma.group(children, figma.currentPage)
    group.name = spec.name || 'Group'

    // Apply properties
    if (spec.properties) {
      if (spec.properties.x !== undefined) group.x = spec.properties.x
      if (spec.properties.y !== undefined) group.y = spec.properties.y
    }

    if (parent && 'appendChild' in parent) {
      (parent as any).appendChild(group)
    }

    return group
  }

  private mapFontWeight(weight: number): string {
    if (weight <= 300) return 'Light'
    if (weight <= 400) return 'Regular'
    if (weight <= 500) return 'Medium'
    if (weight <= 600) return 'Semi Bold'
    if (weight <= 700) return 'Bold'
    if (weight <= 800) return 'Extra Bold'
    return 'Black'
  }
}