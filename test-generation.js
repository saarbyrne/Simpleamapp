// Simple test to check if AI generation is working
async function testGeneration() {
  console.log('Testing AI Workspace generation...')

  try {
    const response = await fetch('http://localhost:3003/api/ai-workspace/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        workspaceId: 'test-workspace-id',
        message: 'Create a weekly wellness report',
      }),
    })

    console.log('Response status:', response.status)
    console.log('Response ok:', response.ok)

    if (!response.ok) {
      const text = await response.text()
      console.log('Error response:', text)
      return
    }

    const reader = response.body?.getReader()
    const decoder = new TextDecoder()

    if (!reader) {
      console.log('No response body')
      return
    }

    let buffer = ''
    let chunkCount = 0

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      chunkCount++
      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6))
            console.log('Chunk', chunkCount, ':', data.type, data.content?.substring(0, 50))
          } catch (e) {
            console.log('Failed to parse:', line)
          }
        }
      }
    }

    console.log('Stream complete. Total chunks:', chunkCount)
  } catch (error) {
    console.error('Test failed:', error)
  }
}

testGeneration()
