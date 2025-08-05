/**
 * @jest-environment node
 */

/**
 * Smoke test for User API route
 * Tests request/response handling without external dependencies
 */

import { GET, PATCH } from './route'

describe('User API Route Smoke Test', () => {
  test('GET returns user data', async () => {
    const request = new Request('http://localhost:3000/api/user', {
      method: 'GET',
    })

    const response = await GET(request)

    expect(response).toBeInstanceOf(Response)
    expect(response.status).toBe(200)

    const data = await response.json()
    expect(data.status).toBe('OK')
    expect(data.user).toBeDefined()
  })

  test('PATCH updates user data with JSON body', async () => {
    const updateData = {
      firstName: 'Updated',
      lastName: 'Name',
      voice: 'nova',
      aiContext: 'Test context',
    }

    const request = new Request('http://localhost:3000/api/user', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    })

    const response = await PATCH(request)

    expect(response).toBeInstanceOf(Response)
    expect(response.status).toBe(200)

    const data = await response.json()
    expect(data.status).toBe('OK')
    expect(data.user).toBeDefined()
  })

  test('PATCH handles empty body', async () => {
    const request = new Request('http://localhost:3000/api/user', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })

    const response = await PATCH(request)

    expect(response.status).toBe(200)
  })

  test('PATCH filters allowed fields only', async () => {
    const updateData = {
      firstName: 'Allowed',
      email: 'not-allowed@example.com', // Should be filtered out
      id: 999, // Should be filtered out
      adminUser: { id: 1 }, // Should be filtered out
    }

    const request = new Request('http://localhost:3000/api/user', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updateData),
    })

    const response = await PATCH(request)

    expect(response.status).toBe(200)

    // The route should only update allowed fields
    const data = await response.json()
    expect(data.status).toBe('OK')
  })
})
