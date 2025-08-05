import { chunk } from './chunk'

describe('chunk', () => {
  it('should return an array with the original string if it is less than 1024 characters', () => {
    const text = 'a'.repeat(500)
    const chunks = chunk(text)

    expect(chunks.length).toBe(1)
    expect(chunks[0]).toBe(text)
  })

  it('should split a string into chunks of up to 1024 characters', () => {
    const text = 'a'.repeat(3000)
    const chunks = chunk(text)

    expect(chunks.length).toBe(3)
    expect(chunks[0].length).toBe(1024)
    expect(chunks[1].length).toBe(1024)
    expect(chunks[2].length).toBe(952)
  })

  it('should find a splitting point closest to a paragraph end ensuring 1024 characters or less', () => {
    const text = 'a'.repeat(1022) + '\n\n' + 'b'.repeat(1000)
    const chunks = chunk(text)

    expect(chunks.length).toBe(2)
    expect(chunks[0].length).toBe(1024)
    expect(chunks[1].length).toBe(1000)
  })

  it('should try splitting by sentence, if splitting by paragraph yields a chunk that is too long', () => {
    const text = 'a'.repeat(1022) + '. ' + 'b'.repeat(1000)
    const chunks = chunk(text)

    expect(chunks.length).toBe(2)
    expect(chunks[0].length).toBe(1024)
    expect(chunks[1].length).toBe(1000)
  })

  it('should try splitting by sentence, if splitting by paragraph yields a chunk that is too long and preserve the dot', () => {
    const text = 'a'.repeat(1022) + '. ' + 'b'.repeat(1000) + '.'
    const chunks = chunk(text)

    expect(chunks.length).toBe(2)
    expect(chunks[0].length).toBe(1024)
    expect(chunks[1].length).toBe(1001)
  })

  it('should avoid breaking up sentences if there exists a sentence with less than 1024 characters', () => {
    const text = 'a'.repeat(512) + '. ' + 'b'.repeat(600)
    const chunks = chunk(text)

    expect(chunks.length).toBe(2)
    expect(chunks[0].length).toBe(512 + 2)
    expect(chunks[1].length).toBe(600)
  })

  it('should try splitting by word, if splitting by sentence yields a chunk that is too long', () => {
    const text = 'a'.repeat(1022) + ' bb'
    const chunks = chunk(text)

    expect(chunks.length).toBe(2)
    expect(chunks[0].length).toBe(1023)
    expect(chunks[1].length).toBe(2)
  })
})
