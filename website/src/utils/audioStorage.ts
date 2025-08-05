import fs from 'fs/promises'
import path from 'path'

export class AudioStorage {
  private static readonly UPLOAD_DIR = 'uploads/audio/transcriptions'
  private static readonly BASE_PATH = process.cwd()

  /**
   * Save an audio file for a user
   * @param userId User ID
   * @param audioBuffer Audio file data
   * @param recordedAt When the recording was made
   * @returns Relative file path for storage in database
   */
  static async saveAudioFile(
    userId: number,
    audioBuffer: Buffer,
    recordedAt: Date,
  ): Promise<string> {
    try {
      // Create user directory
      const userDir = path.join(
        this.BASE_PATH,
        this.UPLOAD_DIR,
        `user-${userId}`,
      )
      await fs.mkdir(userDir, { recursive: true })

      // Generate filename with timestamp and random suffix for uniqueness
      const timestamp = this.formatTimestamp(recordedAt)
      const randomSuffix = Math.floor(Math.random() * 1000000)
        .toString()
        .padStart(6, '0')
      const fileName = `${timestamp}-${randomSuffix}.wav`
      const filePath = path.join(userDir, fileName)

      // Write audio file
      await fs.writeFile(filePath, audioBuffer)

      // Return relative path for database storage
      return `user-${userId}/${fileName}`
    } catch (error) {
      throw new Error(
        `Failed to save audio file: ${error instanceof Error ? error.message : 'Unknown error'}`,
      )
    }
  }

  /**
   * Retrieve an audio file
   * @param fileName Relative file path from database
   * @returns Audio file buffer
   */
  static async getAudioFile(fileName: string): Promise<Buffer> {
    try {
      this.validateFilename(fileName)

      const filePath = path.join(this.BASE_PATH, this.UPLOAD_DIR, fileName)
      return await fs.readFile(filePath)
    } catch (error) {
      if (error instanceof Error && error.message.includes('ENOENT')) {
        throw new Error(`Audio file not found: ${fileName}`)
      }
      throw error
    }
  }

  /**
   * Delete an audio file
   * @param fileName Relative file path from database
   */
  static async deleteAudioFile(fileName: string): Promise<void> {
    try {
      this.validateFilename(fileName)

      const filePath = path.join(this.BASE_PATH, this.UPLOAD_DIR, fileName)
      await fs.unlink(filePath)
    } catch (error) {
      // Don't throw error if file doesn't exist
      if (error instanceof Error && !error.message.includes('ENOENT')) {
        throw error
      }
    }
  }

  /**
   * Check if an audio file exists
   * @param fileName Relative file path from database
   * @returns True if file exists
   */
  static async fileExists(fileName: string): Promise<boolean> {
    try {
      const filePath = path.join(this.BASE_PATH, this.UPLOAD_DIR, fileName)
      await fs.access(filePath)
      return true
    } catch {
      return false
    }
  }

  /**
   * Generate a public URL for an audio file
   * @param fileName Relative file path from database
   * @returns Public URL to access the audio file
   */
  static getAudioFileUrl(fileName: string): string {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    return `${baseUrl}/api/transcriptions/audio/${encodeURIComponent(fileName)}`
  }

  /**
   * Validate filename format for security
   * @param fileName File name to validate
   * @throws Error if filename is invalid
   */
  static validateFilename(fileName: string): void {
    if (!fileName || typeof fileName !== 'string') {
      throw new Error('Invalid audio filename format')
    }

    // Check for path traversal attempts
    if (
      fileName.includes('..') ||
      fileName.includes('/./') ||
      fileName.startsWith('/')
    ) {
      throw new Error('Invalid audio filename format')
    }

    // Validate expected format: user-{id}/YYYY-MM-DD-HHMMSS-{random}.wav
    const pattern = /^user-\d+\/\d{4}-\d{2}-\d{2}-\d{6}-\d{6}\.wav$/
    if (!pattern.test(fileName)) {
      throw new Error('Invalid audio filename format')
    }

    // Validate date components
    const parts = fileName.split('/')
    if (parts.length !== 2) {
      throw new Error('Invalid audio filename format')
    }

    const fileNamePart = parts[1]
    const dateMatch = fileNamePart.match(
      /^(\d{4})-(\d{2})-(\d{2})-(\d{6})-\d{6}\.wav$/,
    )

    if (!dateMatch) {
      throw new Error('Invalid audio filename format')
    }

    const [, year, month, day, time] = dateMatch
    const monthNum = parseInt(month, 10)
    const dayNum = parseInt(day, 10)
    const hour = parseInt(time.substring(0, 2), 10)
    const minute = parseInt(time.substring(2, 4), 10)
    const second = parseInt(time.substring(4, 6), 10)

    if (
      monthNum < 1 ||
      monthNum > 12 ||
      dayNum < 1 ||
      dayNum > 31 ||
      hour > 23 ||
      minute > 59 ||
      second > 59
    ) {
      throw new Error('Invalid audio filename format')
    }
  }

  /**
   * Format a timestamp for filename
   * @param date Date to format
   * @returns Formatted timestamp string
   */
  private static formatTimestamp(date: Date): string {
    const year = date.getFullYear()
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const hour = date.getHours().toString().padStart(2, '0')
    const minute = date.getMinutes().toString().padStart(2, '0')
    const second = date.getSeconds().toString().padStart(2, '0')

    return `${year}-${month}-${day}-${hour}${minute}${second}`
  }
}
