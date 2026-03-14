interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export class MistralProvider {
  static async chat(messages: Message[], apiKey: string): Promise<string> {
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'mistral-large-latest',
        messages
      })
    })

    if (!response.ok) {
      throw new Error(`Mistral API error: ${response.statusText}`)
    }

    const data = await response.json()
    return data.choices[0].message.content
  }
}
