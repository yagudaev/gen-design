// OPEN AI allows chunks of up to 4096 characters, however, vercel will timeout after 15 seconds
// We need to make this faster
export const CHUNK_SIZE = 1024

export function chunk(text: string, chunkSize: number = CHUNK_SIZE): string[] {
  // a chunk can only be up to 1024 characters, we want to end on a sentence, avoid splitting words and avoid cutting off right after a heading
  // split on new lines should handle things like this too: `   \n  \n` and `\n\n`
  const pieces = breakdownLongPieces([text], chunkSize)

  // combine paragraphs until we reach the max length
  const chunks = []
  let chunk = ''
  for (const piece of pieces) {
    if (piece.length === 0) continue

    if (chunk.length + piece.length <= chunkSize) {
      chunk += piece
    } else {
      // reached max length
      chunk.length > 0 && chunks.push(chunk)

      // start a new chunk
      chunk = piece
    }
  }

  // add final chunk, we start it but never add it
  if (chunk.length > 0) {
    chunks.push(chunk.trim())
  }

  return chunks
}

function breakdownLongPieces(pieces: string[], chunkSize: number): string[] {
  let newPieces = breakdownLongTexts(pieces, chunkSize)

  // TODO: This might be a bug here -- shouldn't it be "newPieces" instead of "pieces"?
  newPieces = breakdownLongParagraphs(pieces, chunkSize)
  newPieces = breakdownLongSentences(newPieces, chunkSize)
  newPieces = breakdownLongWords(newPieces, chunkSize)

  return newPieces
}

function breakdownLongTexts(pieces: string[], chunkSize: number): string[] {
  const newPieces = []
  for (const piece of pieces) {
    if (piece.length <= chunkSize) {
      newPieces.push(piece)
    } else {
      newPieces.push(...breakdownLongText(piece, chunkSize))
    }
  }

  return newPieces
}

// breakdown long text into paragraphs, if paragraph is too long we will take care of it later
// does not handle breaking down the long paragraphs, multiple paragraphs can be in one piece if they fit
function breakdownLongText(text: string, chunkSize: number): string[] {
  const paragraphs = text.split(/\n\s*\n/)
  if (paragraphs.length === 1) {
    return [text]
  }

  const chunks = []
  let chunk = ''
  for (const piece of paragraphs) {
    if (piece.length === 0) continue

    if (chunk.length + piece.length + 2 <= chunkSize) {
      chunk += piece + '\n\n'
    } else {
      // reached max length
      chunk.length > 0 && chunks.push(chunk)

      // start a new chunk
      chunk = piece + '\n\n'
    }
  }

  // add final chunk, we start it but never add it
  if (chunk.length > 0) {
    chunks.push(chunk.trim())
  }

  return chunks
}

function breakdownLongParagraph(
  paragraph: string,
  chunkSize: number,
): string[] {
  const sentences = paragraph.split('. ')
  if (sentences.length === 1) {
    return [paragraph]
  }

  const newPieces = []
  let newPiece = ''
  for (const sentence of sentences) {
    if (newPiece.length + sentence.length + 2 <= chunkSize) {
      newPiece += sentence + '. '
    } else {
      newPiece.length > 0 && newPieces.push(newPiece)
      newPiece = sentence + '. '
    }
  }

  if (newPiece.length > 0) {
    // add the last piece make sure to remove the period and space we added
    newPieces.push(newPiece.replace(/\. $/, ''))
  }

  return newPieces
}

function breakdownLongParagraphs(
  pieces: string[],
  chunkSize: number,
): string[] {
  const newPieces = []
  for (const piece of pieces) {
    if (piece.length <= chunkSize) {
      newPieces.push(piece)
    } else {
      newPieces.push(...breakdownLongParagraph(piece, chunkSize))
    }
  }

  return newPieces
}

function breakdownLongSentences(pieces: string[], chunkSize: number): string[] {
  const newPieces = []
  for (const piece of pieces) {
    if (piece.length <= chunkSize) {
      newPieces.push(piece)
    } else {
      newPieces.push(...breakdownLongSentence(piece, chunkSize))
    }
  }

  return newPieces
}

function breakdownLongSentence(sentence: string, chunkSize: number): string[] {
  const words = sentence.split(' ')
  if (words.length === 1) {
    return [sentence]
  }

  const newPieces = []
  let newPiece = ''
  for (const word of words) {
    if (newPiece.length + word.length + 2 <= chunkSize) {
      newPiece += word + ' '
    } else {
      newPiece.length > 0 && newPieces.push(newPiece)
      newPiece = word + ' '
    }
  }

  if (newPiece.length > 0) {
    newPieces.push(newPiece)
  }

  return newPieces
}

function breakdownLongWords(pieces: string[], chunkSize: number): string[] {
  const newPieces = []
  for (const piece of pieces) {
    if (piece.length <= chunkSize) {
      newPieces.push(piece)
    } else {
      newPieces.push(...breakdownLongWord(piece, chunkSize))
    }
  }

  return newPieces
}

function breakdownLongWord(word: string, chunkSize: number): string[] {
  const newPieces = []
  let newPiece = ''
  for (const letter of word) {
    if (newPiece.length + 1 <= chunkSize) {
      newPiece += letter
    } else {
      newPiece.length > 0 && newPieces.push(newPiece)
      newPiece = letter
    }
  }

  if (newPiece.length > 0) {
    newPieces.push(newPiece)
  }

  return newPieces
}
