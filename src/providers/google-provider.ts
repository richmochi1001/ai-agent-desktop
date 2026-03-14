interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export class GoogleProvider {
  static async chat(messages: Message[], apiKey: string): Promise<string> {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: messages
            .filter(m => m.role !== 'system')
            .map(m => ({
              role: m.role === 'assistant' ? 'model' : 'user',
              parts: [{ text: m.content }]
            })),
          systemInstruction: {
            parts: [{ text: messages.find(m => m.role === 'system')?.content || '' }]
          }
        })
      }
    )

    if (!response.ok) {
      throw new Error(`Google API error: ${response.statusText}`)
    }

    const data = await response.json()
    return data.candidates[0].content.parts[0].text
  }
}
