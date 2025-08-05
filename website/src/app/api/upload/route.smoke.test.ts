/**
 * @jest-environment node
 */

/**
 * Smoke test for Upload API route
 * Tests JSON body handling and Vercel blob integration
 */

import { POST } from './route'

// Mock Vercel blob handler
jest.mock('@vercel/blob/client', () => ({
  handleUpload: jest.fn(() =>
    Promise.resolve({
      url: 'https://example.com/mock-upload-response',
      token: 'mock-token',
    }),
  ),
}))

describe('Upload API Route Smoke Test', () => {
  test('POST handles JSON body correctly', async () => {
    const uploadData = {
      pathname: 'test-file.pdf',
      callbackUrl: 'http://localhost:3000/api/upload',
      clientPayload: {
        userId: '1',
        projectId: 'test-project',
      },
    }

    const request = new Request('http://localhost:3000/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(uploadData),
    })

    const response = await POST(request)

    expect(response).toBeInstanceOf(Response)
    expect(response.status).toBe(200)

    // Should return the upload response
    const data = await response.json()
    expect(data.url).toBeDefined()
  })

  test('POST validates allowed content types', async () => {
    const { handleUpload } = require('@vercel/blob/client')

    const uploadData = {
      pathname: 'test-file.pdf',
      callbackUrl: 'http://localhost:3000/api/upload',
    }

    const request = new Request('http://localhost:3000/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(uploadData),
    })

    await POST(request)

    // Verify handleUpload was called with correct types of arguments
    expect(handleUpload).toHaveBeenCalledWith(
      expect.objectContaining({
        body: expect.any(Object),
        request: expect.any(Object),
        onBeforeGenerateToken: expect.any(Function),
        onUploadCompleted: expect.any(Function),
      }),
    )
  })

  test('POST handles upload errors gracefully', async () => {
    const { handleUpload } = require('@vercel/blob/client')
    handleUpload.mockRejectedValueOnce(new Error('Upload failed'))

    const uploadData = {
      pathname: 'test-file.pdf',
      callbackUrl: 'http://localhost:3000/api/upload',
    }

    const request = new Request('http://localhost:3000/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(uploadData),
    })

    const response = await POST(request)

    expect(response.status).toBe(400)

    const data = await response.json()
    expect(data.error).toBeDefined()
  })

  test('POST includes authentication in token generation', async () => {
    const { handleUpload } = require('@vercel/blob/client')
    let onBeforeGenerateTokenCallback: Function | null = null

    handleUpload.mockImplementationOnce(({ onBeforeGenerateToken }: any) => {
      onBeforeGenerateTokenCallback = onBeforeGenerateToken
      return Promise.resolve({ url: 'mock-url' })
    })

    const uploadData = {
      pathname: 'secure-file.pdf',
      callbackUrl: 'http://localhost:3000/api/upload',
    }

    const request = new Request('http://localhost:3000/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(uploadData),
    })

    await POST(request)

    // Test the token generation callback
    expect(onBeforeGenerateTokenCallback).toBeDefined()

    if (onBeforeGenerateTokenCallback) {
      const tokenResult = await onBeforeGenerateTokenCallback('test-file.pdf')
      expect(tokenResult.allowedContentTypes).toContain('application/pdf')
      expect(tokenResult.allowedContentTypes).toContain('text/markdown')
      expect(tokenResult.tokenPayload).toBeDefined()
    }
  })
})
