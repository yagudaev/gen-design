/**
 * Global Jest setup for VibeFlow tests
 * Mocks external services while keeping Next.js APIs real
 */

// Mock Prisma Database Operations
jest.mock('@/lib/db', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    transcription: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    adminUser: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}))

// Mock OpenAI API
jest.mock('openai', () => ({
  OpenAI: jest.fn().mockImplementation(() => ({
    chat: {
      completions: {
        create: jest.fn(() =>
          Promise.resolve({
            choices: [
              {
                message: {
                  content: 'Mocked OpenAI response',
                },
              },
            ],
          }),
        ),
      },
    },
    audio: {
      transcriptions: {
        create: jest.fn(() =>
          Promise.resolve({
            text: 'Mocked transcription text from OpenAI',
          }),
        ),
      },
      speech: {
        create: jest.fn(() =>
          Promise.resolve({
            arrayBuffer: () => Promise.resolve(new ArrayBuffer(1024)),
          }),
        ),
      },
    },
  })),
}))

// Mock AI SDK (Google)
jest.mock('@ai-sdk/google', () => ({
  google: jest.fn(() => ({
    generateText: jest.fn(() =>
      Promise.resolve({
        text: 'Mocked Google AI response',
      }),
    ),
    generateObject: jest.fn(() =>
      Promise.resolve({
        object: { response: 'Mocked Google AI object response' },
      }),
    ),
  })),
}))

// Mock Authentication
jest.mock('@/lib/requireRouteAuth', () => ({
  requireRouteAuth:
    (handler: any) => async (request: Request, options?: any) => {
      // Mock successful authentication
      const mockUser = { id: '1', email: 'test@example.com', name: 'Test User' }

      // Extract params from URL for dynamic routes
      const url = new URL(request.url)
      const pathSegments = url.pathname.split('/').filter(Boolean)
      const params: Record<string, string> = {}

      // Extract ID from common patterns like /api/transcriptions/[id]
      if (pathSegments.includes('transcriptions') && pathSegments.length > 2) {
        const id = pathSegments[pathSegments.length - 1]
        if (id && !isNaN(Number(id))) {
          params.id = id
        }
      }

      // Extract user ID from patterns like /api/admin/users/[id]
      if (pathSegments.includes('users') && pathSegments.length > 3) {
        const id = pathSegments[pathSegments.length - 1]
        if (id && !isNaN(Number(id))) {
          params.id = id
        }
      }

      const authOptions = options || { params }
      return handler(request, mockUser, 1, authOptions)
    },
}))

// Mock Audio Storage Utility
jest.mock('@/utils/audioStorage', () => ({
  AudioStorage: {
    saveAudioFile: jest.fn(() => Promise.resolve('user-1/test-audio.wav')),
    getAudioFile: jest.fn(() =>
      Promise.resolve(Buffer.from('mock audio data')),
    ),
    deleteAudioFile: jest.fn(() => Promise.resolve()),
    fileExists: jest.fn(() => Promise.resolve(true)),
    getAudioFileUrl: jest.fn(
      (fileName) => `http://localhost:3000/api/audio/${fileName}`,
    ),
    validateFilename: jest.fn(() => true),
  },
}))

// Mock Serializers
jest.mock('@/serializers', () => ({
  serializeUser: jest.fn((user) => Promise.resolve(user)),
  serializeTranscription: jest.fn((transcription) =>
    Promise.resolve(transcription),
  ),
}))

// Mock Canvas (prevents native module loading issues in tests)
jest.mock('canvas', () => ({
  createCanvas: jest.fn(() => ({
    getContext: jest.fn(() => ({
      fillRect: jest.fn(),
      clearRect: jest.fn(),
      getImageData: jest.fn(() => ({ data: new Array(4) })),
      putImageData: jest.fn(),
      createImageData: jest.fn(() => ({ data: new Array(4) })),
      setTransform: jest.fn(),
      drawImage: jest.fn(),
      save: jest.fn(),
      fillText: jest.fn(),
      restore: jest.fn(),
      beginPath: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      closePath: jest.fn(),
      stroke: jest.fn(),
      translate: jest.fn(),
      scale: jest.fn(),
      rotate: jest.fn(),
      arc: jest.fn(),
      fill: jest.fn(),
      measureText: jest.fn(() => ({ width: 0 })),
      transform: jest.fn(),
      rect: jest.fn(),
      clip: jest.fn(),
    })),
    toBuffer: jest.fn(),
    toDataURL: jest.fn(),
  })),
  createImageData: jest.fn(() => ({ data: new Array(4) })),
  loadImage: jest.fn(() => Promise.resolve({})),
}))

// Mock Stripe (if used)
jest.mock('stripe', () => ({
  Stripe: jest.fn().mockImplementation(() => ({
    customers: {
      create: jest.fn(() => Promise.resolve({ id: 'cus_mock123' })),
      retrieve: jest.fn(() => Promise.resolve({ id: 'cus_mock123' })),
    },
    subscriptions: {
      create: jest.fn(() => Promise.resolve({ id: 'sub_mock123' })),
      retrieve: jest.fn(() => Promise.resolve({ id: 'sub_mock123' })),
    },
    webhooks: {
      constructEvent: jest.fn(() => ({
        type: 'customer.subscription.created',
      })),
    },
  })),
}))

// Global test setup
beforeEach(() => {
  // Clear all mocks before each test
  jest.clearAllMocks()

  // Setup default mock implementations
  const { prisma } = require('@/lib/db')

  // Default user mock
  prisma.user.findUnique.mockResolvedValue({
    id: 1,
    email: 'test@example.com',
    firstName: 'Test',
    lastName: 'User',
    createdAt: new Date(),
    updatedAt: new Date(),
  })

  // Default transcription mocks
  prisma.transcription.findMany.mockResolvedValue([
    {
      id: 1,
      userId: 1,
      transcriptText: 'Test transcription',
      audioFileName: 'user-1/test-audio.wav',
      duration: 3.5,
      createdAt: new Date(),
      recordedAt: new Date(),
      processingStatus: 'completed',
    },
  ])

  prisma.transcription.count.mockResolvedValue(1)

  prisma.transcription.create.mockResolvedValue({
    id: 1,
    userId: 1,
    transcriptText: 'New transcription',
    audioFileName: 'user-1/new-audio.wav',
    duration: 2.0,
    createdAt: new Date(),
    recordedAt: new Date(),
    processingStatus: 'completed',
  })

  prisma.user.update.mockImplementation(({ data }: any) => {
    return Promise.resolve({
      id: 1,
      email: 'test@example.com',
      firstName: data.firstName || 'Test',
      lastName: data.lastName || 'User',
      createdAt: new Date(),
      updatedAt: new Date(),
      ...data,
    })
  })
})

// Polyfill Request and Response if not available in test environment
if (typeof global.Request === 'undefined') {
  global.Request = class MockRequest {
    url: string
    method: string
    headers: Map<string, string>
    body?: any

    constructor(
      url: string,
      init?: {
        method?: string
        headers?: HeadersInit
        body?: BodyInit | null
      },
    ) {
      this.url = url
      this.method = init?.method || 'GET'
      this.headers = new Map()

      if (init?.headers) {
        if (init.headers instanceof Headers) {
          init.headers.forEach((value, key) => {
            this.headers.set(key, value)
          })
        } else if (Array.isArray(init.headers)) {
          init.headers.forEach(([key, value]) => {
            this.headers.set(key, value)
          })
        } else {
          Object.entries(init.headers).forEach(([key, value]) => {
            this.headers.set(key, value)
          })
        }
      }

      if (init?.body) {
        // Mock body handling - store as string for easy JSON parsing
        if (typeof init.body === 'string') {
          this.body = init.body
        } else {
          this.body = String(init.body)
        }
      }
    }

    async json() {
      if (this.body && typeof this.body === 'string') {
        try {
          return JSON.parse(this.body)
        } catch {
          return {}
        }
      }
      return {}
    }

    async text() {
      return ''
    }

    async formData() {
      return new FormData()
    }
  } as any
}

if (typeof global.Response === 'undefined') {
  global.Response = class MockResponse {
    status: number
    statusText: string
    headers: Map<string, string>
    body: any

    constructor(body?: BodyInit | null, init?: ResponseInit) {
      this.status = init?.status || 200
      this.statusText = init?.statusText || 'OK'
      this.headers = new Map()
      this.body = body

      if (init?.headers) {
        if (init.headers instanceof Headers) {
          init.headers.forEach((value, key) => {
            this.headers.set(key, value)
          })
        } else if (Array.isArray(init.headers)) {
          init.headers.forEach(([key, value]) => {
            this.headers.set(key, value)
          })
        } else {
          Object.entries(init.headers).forEach(([key, value]) => {
            this.headers.set(key, value)
          })
        }
      }
    }

    async json() {
      return typeof this.body === 'string' ? JSON.parse(this.body) : this.body
    }

    async text() {
      return typeof this.body === 'string'
        ? this.body
        : JSON.stringify(this.body)
    }

    static json(data: any, init?: ResponseInit) {
      return new MockResponse(JSON.stringify(data), {
        ...init,
        headers: {
          'Content-Type': 'application/json',
          ...init?.headers,
        },
      })
    }
  } as any
}

export {}
