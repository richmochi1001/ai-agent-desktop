'use client'

import { useState, useCallback } from 'react'
import { ChatService } from '@/services/chat-service'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim()) return

    setIsLoading(true)
    setError(null)

    // Add user message
    const userMessage: Message = { role: 'user', content }
    setMessages(prev => [...prev, userMessage])

    try {
      const response = await ChatService.sendMessage(content, messages)

      // Add assistant message
      const assistantMessage: Message = { role: 'assistant', content: response }
      setMessages(prev => [...prev, assistantMessage])
    } catch (err) {
      setError((err as Error).message)
      // Remove the user message on error
      setMessages(prev => prev.slice(0, -1))
    } finally {
      setIsLoading(false)
    }
  }, [messages])

  const clearMessages = useCallback(() => {
    setMessages([])
    setError(null)
  }, [])

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages
  }
}
