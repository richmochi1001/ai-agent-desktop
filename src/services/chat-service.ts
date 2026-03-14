import { OpenAIProvider } from '@/providers/openai-provider'
import { AnthropicProvider } from '@/providers/anthropic-provider'
import { GoogleProvider } from '@/providers/google-provider'
import { MistralProvider } from '@/providers/mistral-provider'

type Provider = 'openai' | 'anthropic' | 'google' | 'mistral'

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export class ChatService {
  private static provider: Provider = 'openai'
  private static apiKey: string = ''

  static setProvider(provider: Provider) {
    this.provider = provider
  }

  static setApiKey(key: string) {
    this.apiKey = key
  }

  static async sendMessage(
    content: string,
    history: Message[]
  ): Promise<string> {
    const messages: Message[] = [
      {
        role: 'system',
        content: '你是一個有用的 AI 助手。請用繁體中文回答問題。'
      },
      ...history,
      { role: 'user', content }
    ]

    switch (this.provider) {
      case 'openai':
        return OpenAIProvider.chat(messages, this.apiKey)
      case 'anthropic':
        return AnthropicProvider.chat(messages, this.apiKey)
      case 'google':
        return GoogleProvider.chat(messages, this.apiKey)
      case 'mistral':
        return MistralProvider.chat(messages, this.apiKey)
      default:
        throw new Error(`Unknown provider: ${this.provider}`)
    }
  }
}
