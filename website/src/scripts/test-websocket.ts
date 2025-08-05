import WebSocket from 'ws'

function testWebSocket(url: string, timeout = 5000): Promise<boolean> {
  return new Promise((resolve) => {
    const ws = new WebSocket(url)
    const timer = setTimeout(() => {
      ws.close()
      resolve(false)
    }, timeout)

    ws.on('open', () => {
      clearTimeout(timer)
      ws.close()
      resolve(true)
    })

    ws.on('error', () => {
      clearTimeout(timer)
      resolve(false)
    })
  })
}

async function main() {
  const url = process.argv[2]
  if (!url) {
    console.error('Please provide a WebSocket URL as an argument')
    process.exit(1)
  }

  console.log(`Testing WebSocket connection to ${url}...`)
  const isReachable = await testWebSocket(url)

  if (isReachable) {
    console.log('WebSocket is reachable!')
  } else {
    console.log('WebSocket is not reachable.')
  }
}

main().catch(console.error)
