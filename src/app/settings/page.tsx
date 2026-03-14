'use client'

import { useState } from 'react'
import { ArrowLeft, Save, Key, Bot } from 'lucide-react'
import Link from 'next/link'

export default function SettingsPage() {
  const [provider, setProvider] = useState('openai')
  const [apiKey, setApiKey] = useState('')

  const handleSave = () => {
    // Save settings
    localStorage.setItem('ai-provider', provider)
    localStorage.setItem('api-key', apiKey)
    alert('設置已保存')
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="flex items-center gap-4 px-6 py-4 border-b border-gray-800">
        <Link href="/" className="hover:text-gray-400">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-xl font-semibold">設置</h1>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-8 space-y-8">
        {/* Provider Selection */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-medium">AI 模型</h2>
          </div>
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
          >
            <option value="openai">OpenAI (GPT-4o)</option>
            <option value="anthropic">Anthropic (Claude)</option>
            <option value="google">Google (Gemini)</option>
            <option value="mistral">Mistral AI</option>
          </select>
        </div>

        {/* API Key */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-blue-400" />
            <h2 className="text-lg font-medium">API Key</h2>
          </div>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="輸入你的 API Key..."
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium transition-colors"
        >
          <Save className="w-5 h-5" />
          保存設置
        </button>
      </div>
    </div>
  )
}
