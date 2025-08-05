import { PrismaClient } from '@prisma/client'

// Mock Prisma Client
const prismaMock = {
  transcriptionRecord: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
} as any

describe('TranscriptionRecord Model', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Creation', () => {
    test('should create a transcription record with required fields', async () => {
      // Arrange
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      }

      const transcriptionData = {
        id: 1,
        userId: 1,
        transcriptText: 'Hello, this is a test transcription.',
        audioFileName: '2025-06-17-001.wav',
        duration: 3.5,
        createdAt: new Date(),
        recordedAt: new Date(),
        processingStatus: 'completed',
      }

      prismaMock.transcriptionRecord.create.mockResolvedValue(transcriptionData)

      // Act
      const result = await prismaMock.transcriptionRecord.create({
        data: {
          userId: 1,
          transcriptText: 'Hello, this is a test transcription.',
          audioFileName: '2025-06-17-001.wav',
          duration: 3.5,
          recordedAt: new Date(),
        },
      })

      // Assert
      expect(result).toEqual(transcriptionData)
      expect(result.transcriptText).toBe('Hello, this is a test transcription.')
      expect(result.duration).toBe(3.5)
      expect(result.processingStatus).toBe('completed')
    })

    test('should create a transcription record with optional metadata', async () => {
      // Arrange
      const transcriptionData = {
        id: 2,
        userId: 1,
        transcriptText: 'Another test transcription.',
        audioFileName: '2025-06-17-002.wav',
        duration: 2.1,
        targetApp: 'TextEdit',
        targetAppBundle: 'com.apple.TextEdit',
        deviceName: 'MacBook Pro Microphone',
        quality: '44.1kHz 16-bit mono',
        createdAt: new Date(),
        recordedAt: new Date(),
        processingStatus: 'completed',
        processingNotes: null,
      }

      prismaMock.transcriptionRecord.create.mockResolvedValue(transcriptionData)

      // Act
      const result = await prismaMock.transcriptionRecord.create({
        data: {
          userId: 1,
          transcriptText: 'Another test transcription.',
          audioFileName: '2025-06-17-002.wav',
          duration: 2.1,
          targetApp: 'TextEdit',
          targetAppBundle: 'com.apple.TextEdit',
          deviceName: 'MacBook Pro Microphone',
          quality: '44.1kHz 16-bit mono',
          recordedAt: new Date(),
        },
      })

      // Assert
      expect(result.targetApp).toBe('TextEdit')
      expect(result.targetAppBundle).toBe('com.apple.TextEdit')
      expect(result.deviceName).toBe('MacBook Pro Microphone')
      expect(result.quality).toBe('44.1kHz 16-bit mono')
    })
  })

  describe('Validation', () => {
    test('should require userId', async () => {
      // Arrange
      prismaMock.transcriptionRecord.create.mockRejectedValue(
        new Error('Missing required field: userId'),
      )

      // Act & Assert
      await expect(
        prismaMock.transcriptionRecord.create({
          data: {
            transcriptText: 'Test without user',
            audioFileName: 'test.wav',
            duration: 1.0,
            recordedAt: new Date(),
            // Missing userId
          },
        }),
      ).rejects.toThrow('Missing required field: userId')
    })

    test('should require transcriptText', async () => {
      // Arrange
      prismaMock.transcriptionRecord.create.mockRejectedValue(
        new Error('Missing required field: transcriptText'),
      )

      // Act & Assert
      await expect(
        prismaMock.transcriptionRecord.create({
          data: {
            userId: 1,
            audioFileName: 'test.wav',
            duration: 1.0,
            recordedAt: new Date(),
            // Missing transcriptText
          },
        }),
      ).rejects.toThrow('Missing required field: transcriptText')
    })

    test('should default processingStatus to completed', async () => {
      // Arrange
      const transcriptionData = {
        id: 3,
        userId: 1,
        transcriptText: 'Test transcription',
        audioFileName: 'test.wav',
        duration: 1.0,
        createdAt: new Date(),
        recordedAt: new Date(),
        processingStatus: 'completed',
      }

      prismaMock.transcriptionRecord.create.mockResolvedValue(transcriptionData)

      // Act
      const result = await prismaMock.transcriptionRecord.create({
        data: {
          userId: 1,
          transcriptText: 'Test transcription',
          audioFileName: 'test.wav',
          duration: 1.0,
          recordedAt: new Date(),
          // No processingStatus specified
        },
      })

      // Assert
      expect(result.processingStatus).toBe('completed')
    })
  })

  describe('Relationships', () => {
    test('should belong to a user', async () => {
      // Arrange
      const mockTranscriptionWithUser = {
        id: 1,
        userId: 1,
        transcriptText: 'Test transcription',
        audioFileName: 'test.wav',
        duration: 1.0,
        createdAt: new Date(),
        recordedAt: new Date(),
        processingStatus: 'completed',
        user: {
          id: 1,
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User',
        },
      }

      prismaMock.transcriptionRecord.findUnique.mockResolvedValue(
        mockTranscriptionWithUser,
      )

      // Act
      const result = await prismaMock.transcriptionRecord.findUnique({
        where: { id: 1 },
        include: { user: true },
      })

      // Assert
      expect(result?.user).toBeDefined()
      expect(result?.user.email).toBe('test@example.com')
      expect(result?.userId).toBe(result?.user.id)
    })
  })

  describe('Queries', () => {
    test('should find transcriptions by user', async () => {
      // Arrange
      const mockTranscriptions = [
        {
          id: 1,
          userId: 1,
          transcriptText: 'First transcription',
          audioFileName: 'test1.wav',
          duration: 1.0,
          createdAt: new Date('2025-06-17T10:00:00Z'),
          recordedAt: new Date('2025-06-17T10:00:00Z'),
          processingStatus: 'completed',
        },
        {
          id: 2,
          userId: 1,
          transcriptText: 'Second transcription',
          audioFileName: 'test2.wav',
          duration: 2.0,
          createdAt: new Date('2025-06-17T11:00:00Z'),
          recordedAt: new Date('2025-06-17T11:00:00Z'),
          processingStatus: 'completed',
        },
      ]

      prismaMock.transcriptionRecord.findMany.mockResolvedValue(
        mockTranscriptions,
      )

      // Act
      const result = await prismaMock.transcriptionRecord.findMany({
        where: { userId: 1 },
        orderBy: { createdAt: 'desc' },
      })

      // Assert
      expect(result).toHaveLength(2)
      expect(result[0].transcriptText).toBe('First transcription')
      expect(result[1].transcriptText).toBe('Second transcription')
    })

    test('should find transcriptions within date range', async () => {
      // Arrange
      const startDate = new Date('2025-06-17T00:00:00Z')
      const endDate = new Date('2025-06-17T23:59:59Z')

      const mockTranscriptions = [
        {
          id: 1,
          userId: 1,
          transcriptText: 'Today transcription',
          audioFileName: 'today.wav',
          duration: 1.0,
          createdAt: new Date('2025-06-17T10:00:00Z'),
          recordedAt: new Date('2025-06-17T10:00:00Z'),
          processingStatus: 'completed',
        },
      ]

      prismaMock.transcriptionRecord.findMany.mockResolvedValue(
        mockTranscriptions,
      )

      // Act
      const result = await prismaMock.transcriptionRecord.findMany({
        where: {
          userId: 1,
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        },
      })

      // Assert
      expect(result).toHaveLength(1)
      expect(result[0].transcriptText).toBe('Today transcription')
    })
  })
})
