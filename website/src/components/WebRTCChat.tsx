'use client'

import { Loader2, Mic, MicOff, Send } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'

import { Button } from '@/components/ui/button'
import { callApi } from '@/lib/callApi'
import { useUser } from '@/lib/useUser'
import { cn } from '@/lib/utils'
import { ChatMessage } from '@/types'

// WebRTC connection states
type ConnectionState = 'disconnected' | 'connecting' | 'connected' | 'failed'

export function WebRTCChat() {
  const [isAudioStreaming, setIsAudioStreaming] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [textInput, setTextInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [connectionState, setConnectionState] =
    useState<ConnectionState>('disconnected')

  // WebRTC related refs
  const localAudioRef = useRef<HTMLAudioElement>(null)
  const remoteAudioRef = useRef<HTMLAudioElement>(null)
  const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
  const dataChannelRef = useRef<RTCDataChannel | null>(null)
  const audioStreamRef = useRef<MediaStream | null>(null)

  // UI related refs
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const user = useUser()

  // Define cleanupWebRTC with useCallback to prevent dependency cycle
  const cleanupWebRTC = useCallback(() => {
    // Stop audio stream
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((track) => track.stop())
      audioStreamRef.current = null
    }

    if (remoteAudioRef.current) {
      remoteAudioRef.current.srcObject = null
    }

    // Close data channel
    if (dataChannelRef.current) {
      dataChannelRef.current.close()
      dataChannelRef.current = null
    }

    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close()
      peerConnectionRef.current = null
    }

    setIsAudioStreaming(false)
    setConnectionState('disconnected')
  }, [])

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Setup WebRTC when component mounts
  useEffect(() => {
    // Cleanup function to handle component unmount
    return () => {
      cleanupWebRTC()
    }
  }, [cleanupWebRTC])

  // Initialize WebRTC peer connection and setup
  const initWebRTC = async () => {
    try {
      // Create a new RTCPeerConnection
      const configuration: RTCConfiguration = {
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
      }

      const peerConnection = new RTCPeerConnection(configuration)
      peerConnectionRef.current = peerConnection

      // Setup data channel for text messaging
      const dataChannel = peerConnection.createDataChannel('chat')
      dataChannelRef.current = dataChannel

      dataChannel.onopen = () => {
        console.log('Data channel is open')
        setConnectionState('connected')
        toast.success('Connected to peer')
      }

      dataChannel.onclose = () => {
        console.log('Data channel is closed')
        setConnectionState('disconnected')
      }

      dataChannel.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          if (data.type === 'chat') {
            const aiMessage: ChatMessage = {
              id: Date.now(),
              projectId: 0,
              role: 'assistant',
              content: data.message,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            }

            setMessages((prev) => [...prev, aiMessage])
          }
        } catch (error) {
          console.error('Error processing message:', error)
        }
      }

      // Handle ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          // Send the ICE candidate to the signaling server or peer
          // Implementation depends on your signaling mechanism
          console.log('New ICE candidate:', event.candidate)
        }
      }

      // Handle connection state changes
      peerConnection.onconnectionstatechange = () => {
        console.log('Connection state changed:', peerConnection.connectionState)
        switch (peerConnection.connectionState) {
          case 'connected':
            setConnectionState('connected')
            break
          case 'disconnected':
          case 'closed':
            setConnectionState('disconnected')
            break
          case 'failed':
            setConnectionState('failed')
            toast.error('Connection failed. Please try again.')
            break
        }
      }

      // Handle incoming data channels (in case we didn't create one)
      peerConnection.ondatachannel = (event) => {
        const incomingDataChannel = event.channel
        dataChannelRef.current = incomingDataChannel

        incomingDataChannel.onmessage = (msgEvent) => {
          try {
            const data = JSON.parse(msgEvent.data)
            if (data.type === 'chat') {
              const aiMessage: ChatMessage = {
                id: Date.now(),
                projectId: 0,
                role: 'assistant',
                content: data.message,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              }

              setMessages((prev) => [...prev, aiMessage])
            }
          } catch (error) {
            console.error('Error processing message:', error)
          }
        }
      }

      return peerConnection
    } catch (error) {
      console.error('Error initializing WebRTC:', error)
      toast.error('Failed to initialize WebRTC. Please try again.')
      setConnectionState('failed')
      return null
    }
  }

  // Toggle audio stream
  const toggleAudioStream = async () => {
    if (isAudioStreaming) {
      stopAudioStream()
    } else {
      try {
        // Get user media (audio only) FIRST
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        })
        audioStreamRef.current = stream

        // Initialize WebRTC if not already done
        if (!peerConnectionRef.current) {
          const pc = await initWebRTC()
          if (!pc) return // Exit if initialization failed
        }

        // Add audio tracks to peer connection BEFORE offer
        stream.getAudioTracks().forEach((track) => {
          // Only add if not already added
          const senders = peerConnectionRef.current?.getSenders() || []
          const alreadyAdded = senders.some(
            (s) => s.track && s.track.id === track.id,
          )
          if (!alreadyAdded) {
            peerConnectionRef.current?.addTrack(track, stream)
          }
        })

        // Listen for remote tracks
        peerConnectionRef.current!.ontrack = (event) => {
          if (remoteAudioRef.current) {
            remoteAudioRef.current.srcObject = event.streams[0]
            remoteAudioRef.current.play().catch((err) => {
              console.error('Error playing remote audio:', err)
            })
          }
        }

        setIsAudioStreaming(true)
        setConnectionState('connecting')

        // Create and send an offer if we're initiating
        createOffer()
      } catch (error) {
        console.error('Error accessing microphone:', error)
        toast.error('Unable to access microphone. Please check permissions.')
      }
    }
  }

  // Stop audio stream
  const stopAudioStream = () => {
    cleanupWebRTC()
  }

  // Create and send an offer (initiator role)
  const createOffer = async () => {
    if (!peerConnectionRef.current) return
    setIsProcessing(true)
    try {
      // 1. Create the offer
      const offer = await peerConnectionRef.current.createOffer()
      await peerConnectionRef.current.setLocalDescription(offer)

      // 2. Get ephemeral OpenAI session key from backend
      const keyRes = await fetch('/api/ai/realtime-key', { method: 'POST' })
      if (!keyRes.ok) {
        throw new Error('Failed to fetch OpenAI session key')
      }
      const keyData = await keyRes.json()
      // OpenAI docs: the key is in client_secret.value
      const ephemeralKey = keyData?.client_secret?.value
      if (!ephemeralKey) {
        throw new Error('No ephemeral key received from backend')
      }

      // 3. Send offer SDP to OpenAI's correct endpoint
      const model = 'gpt-4o-realtime-preview-2024-12-17'
      const openaiRes = await fetch(
        `https://api.openai.com/v1/realtime?model=${model}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${ephemeralKey}`,
            'Content-Type': 'application/sdp',
          },
          body: offer.sdp,
        },
      )
      if (!openaiRes.ok) {
        const errText = await openaiRes.text()
        throw new Error(errText || 'Failed to get answer from OpenAI')
      }
      // 4. The answer is plain text SDP
      const answerSdp = await openaiRes.text()
      await peerConnectionRef.current.setRemoteDescription({
        type: 'answer',
        sdp: answerSdp,
      })
      setConnectionState('connected')
      toast.success('Connected to OpenAI Realtime')
    } catch (error: any) {
      console.error('WebRTC setup error:', error)
      toast.error(error?.message || 'WebRTC setup failed')
      setConnectionState('failed')
    } finally {
      setIsProcessing(false)
    }
  }

  // Send a text message
  const sendMessage = () => {
    if (!textInput.trim() || connectionState !== 'connected') return

    const userMessage: ChatMessage = {
      id: Date.now(),
      projectId: 0,
      role: 'user',
      content: textInput,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])

    // Send message through data channel if connected
    if (
      dataChannelRef.current &&
      dataChannelRef.current.readyState === 'open'
    ) {
      const messageData = {
        type: 'chat',
        message: textInput,
        timestamp: new Date().toISOString(),
      }

      dataChannelRef.current.send(JSON.stringify(messageData))
    }

    setTextInput('')

    // For demo purposes, simulate receiving a response
    simulateReceivedMessage(textInput)
  }

  // Simulate receiving a message (for demo purposes)
  const simulateReceivedMessage = (userMessage: string) => {
    // This would be replaced with actual message reception in a real application
    setTimeout(() => {
      const aiResponse = `This is a simulated WebRTC response to: "${userMessage}". In a real implementation, messages would come from the peer.`

      const aiMessage: ChatMessage = {
        id: Date.now(),
        projectId: 0,
        role: 'assistant',
        content: aiResponse,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, aiMessage])
    }, 1000)
  }

  return (
    <div className="flex overflow-hidden flex-col w-full max-w-3xl bg-white rounded-lg shadow-md">
      <div className="p-4 border-b bg-slate-50">
        <h2 className="text-lg font-medium">WebRTC Audio Chat</h2>
        <p className="text-sm text-slate-500">
          Real-time audio and text communication
        </p>
        <div className="mt-2 text-xs inline-block px-2 py-1 rounded bg-slate-200">
          <span
            className={cn(
              'inline-block w-2 h-2 rounded-full mr-1',
              connectionState === 'connected'
                ? 'bg-green-500'
                : connectionState === 'connecting'
                  ? 'bg-yellow-500'
                  : connectionState === 'failed'
                    ? 'bg-red-500'
                    : 'bg-slate-500',
            )}
          ></span>
          {connectionState === 'connected'
            ? 'Connected'
            : connectionState === 'connecting'
              ? 'Connecting...'
              : connectionState === 'failed'
                ? 'Connection failed'
                : 'Disconnected'}
        </div>
      </div>

      {/* Audio elements - hidden but functional */}
      <div className="hidden">
        <audio ref={remoteAudioRef} autoPlay />
      </div>

      {/* Audio streaming status indicator */}
      {isAudioStreaming && (
        <div className="flex items-center justify-center py-2 bg-blue-50">
          <div className="animate-pulse mr-2 w-3 h-3 bg-blue-500 rounded-full"></div>
          <span className="text-sm text-blue-700">Audio streaming active</span>
        </div>
      )}

      {/* Chat messages area */}
      <div className="overflow-y-auto flex-1 p-4 h-96">
        {messages.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-full text-slate-400">
            <p>No messages yet. Start a conversation!</p>
            {connectionState === 'disconnected' && (
              <p className="mt-2 text-sm">
                Click the microphone button to connect
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex max-w-[85%] rounded-lg p-4',
                  message.role === 'user'
                    ? 'ml-auto bg-blue-100 text-blue-900'
                    : 'bg-slate-100 text-slate-900',
                )}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="flex p-4 space-x-2 border-t">
        <input
          type="text"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 px-3 py-2 rounded-md border focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={connectionState !== 'connected'}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault()
              sendMessage()
            }
          }}
        />

        <Button
          onClick={toggleAudioStream}
          variant={isAudioStreaming ? 'destructive' : 'outline'}
          size="icon"
          disabled={isProcessing}
        >
          {isAudioStreaming ? <MicOff /> : <Mic />}
        </Button>

        <Button
          onClick={sendMessage}
          disabled={!textInput.trim() || connectionState !== 'connected'}
        >
          <Send />
        </Button>
      </div>
    </div>
  )
}
