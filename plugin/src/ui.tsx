import { render } from '@create-figma-plugin/ui'
import { emit, on } from '@create-figma-plugin/utilities'
import { h } from 'preact'
import { useCallback, useEffect, useState } from 'preact/hooks'
import styles from './styles.css'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

interface DesignSystem {
  id: string
  name: string
  componentCount: number
}

interface GenerationOptions {
  variants: number
  responsive: boolean
  edgeCases: boolean
  multiScreen: boolean
}

function Plugin() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedDesignSystem, setSelectedDesignSystem] = useState<string>('')
  const [designSystems, setDesignSystems] = useState<DesignSystem[]>([])
  const [selectedModel, setSelectedModel] = useState('claude-opus')
  const [systemPrompt, setSystemPrompt] = useState('You are a helpful design assistant that creates Figma designs.')
  const [showSettings, setShowSettings] = useState(false)
  const [generationOptions, setGenerationOptions] = useState<GenerationOptions>({
    variants: 4,
    responsive: false,
    edgeCases: false,
    multiScreen: false
  })

  useEffect(() => {
    // Load design systems when plugin starts
    emit('LOAD_DESIGN_SYSTEMS')
    
    // Listen for design systems from main thread
    on('DESIGN_SYSTEMS_LOADED', (systems: DesignSystem[]) => {
      setDesignSystems(systems)
      if (systems.length > 0 && !selectedDesignSystem) {
        setSelectedDesignSystem(systems[0].id)
      }
    })

    // Listen for generation results
    on('GENERATION_COMPLETE', (result: any) => {
      setIsLoading(false)
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Generated ${result.frameCount} frame(s) successfully!`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, assistantMessage])
    })

    on('GENERATION_ERROR', (error: string) => {
      setIsLoading(false)
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Error: ${error}`,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    })
  }, [selectedDesignSystem])

  const handleSendMessage = useCallback(() => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    // Send generation request to main thread
    emit('GENERATE_DESIGN', {
      prompt: inputValue,
      designSystemId: selectedDesignSystem,
      model: selectedModel,
      systemPrompt,
      options: generationOptions
    })
  }, [inputValue, isLoading, selectedDesignSystem, selectedModel, systemPrompt, generationOptions])

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }, [handleSendMessage])

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>Gen Design AI</h2>
        <button 
          className={styles.settingsButton}
          onClick={() => setShowSettings(!showSettings)}
        >
          ⚙️
        </button>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className={styles.settingsPanel}>
          <div className={styles.settingGroup}>
            <label className={styles.label}>Design System</label>
            <select 
              className={styles.select}
              value={selectedDesignSystem}
              onChange={(e) => setSelectedDesignSystem((e.target as HTMLSelectElement).value)}
            >
              {designSystems.length === 0 && (
                <option value="">No design systems found</option>
              )}
              {designSystems.map(system => (
                <option key={system.id} value={system.id}>
                  {system.name} ({system.componentCount} components)
                </option>
              ))}
            </select>
          </div>

          <div className={styles.settingGroup}>
            <label className={styles.label}>Model</label>
            <select 
              className={styles.select}
              value={selectedModel}
              onChange={(e) => setSelectedModel((e.target as HTMLSelectElement).value)}
            >
              <option value="claude-opus">Claude Opus 4.1</option>
              <option value="claude-sonnet">Claude Sonnet</option>
              <option value="gpt-4">GPT-4</option>
              <option value="gpt-3.5">GPT-3.5 Turbo</option>
            </select>
          </div>

          <div className={styles.settingGroup}>
            <label className={styles.label}>System Prompt</label>
            <textarea 
              className={styles.textarea}
              value={systemPrompt}
              onChange={(e) => setSystemPrompt((e.target as HTMLTextAreaElement).value)}
              rows={3}
            />
          </div>

          <div className={styles.settingGroup}>
            <label className={styles.checkboxLabel}>
              <input 
                type="checkbox"
                checked={generationOptions.responsive}
                onChange={(e) => setGenerationOptions(prev => ({
                  ...prev,
                  responsive: (e.target as HTMLInputElement).checked
                }))}
              />
              Generate responsive variants
            </label>
            <label className={styles.checkboxLabel}>
              <input 
                type="checkbox"
                checked={generationOptions.edgeCases}
                onChange={(e) => setGenerationOptions(prev => ({
                  ...prev,
                  edgeCases: (e.target as HTMLInputElement).checked
                }))}
              />
              Include edge cases (error, empty states)
            </label>
            <label className={styles.checkboxLabel}>
              <input 
                type="checkbox"
                checked={generationOptions.multiScreen}
                onChange={(e) => setGenerationOptions(prev => ({
                  ...prev,
                  multiScreen: (e.target as HTMLInputElement).checked
                }))}
              />
              Create multi-screen flow
            </label>
          </div>

          <div className={styles.settingGroup}>
            <label className={styles.label}>Variants to Generate: {generationOptions.variants}</label>
            <input 
              type="range"
              min="1"
              max="6"
              value={generationOptions.variants}
              onChange={(e) => setGenerationOptions(prev => ({
                ...prev,
                variants: parseInt((e.target as HTMLInputElement).value)
              }))}
              className={styles.slider}
            />
          </div>
        </div>
      )}

      {/* Chat Messages */}
      <div className={styles.chatContainer}>
        {messages.length === 0 && (
          <div className={styles.emptyState}>
            <p>Start by describing what you want to design...</p>
            <p className={styles.hint}>Examples:</p>
            <ul className={styles.examples}>
              <li>"Create a login screen with email and password fields"</li>
              <li>"Design a product card for an e-commerce app"</li>
              <li>"Build a dashboard with charts and metrics"</li>
            </ul>
          </div>
        )}
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`${styles.message} ${styles[message.role]}`}
          >
            <div className={styles.messageContent}>
              {message.content}
            </div>
            <div className={styles.messageTime}>
              {message.timestamp.toLocaleTimeString()}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className={`${styles.message} ${styles.assistant}`}>
            <div className={styles.loadingDots}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className={styles.inputArea}>
        <textarea
          className={styles.input}
          value={inputValue}
          onChange={(e) => setInputValue((e.target as HTMLTextAreaElement).value)}
          onKeyPress={handleKeyPress}
          placeholder="Describe what you want to design..."
          rows={2}
          disabled={isLoading}
        />
        <button 
          className={styles.sendButton}
          onClick={handleSendMessage}
          disabled={!inputValue.trim() || isLoading}
        >
          {isLoading ? '⏳' : '➤'}
        </button>
      </div>
    </div>
  )
}

export default render(Plugin)