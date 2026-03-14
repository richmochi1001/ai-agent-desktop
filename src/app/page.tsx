'use client'

import Link from 'next/link'
import { Bot, MessageSquare, Settings, Sparkles } from 'lucide-react'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <header className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Bot className="w-12 h-12 text-blue-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              AI Agent Desktop
            </h1>
          </div>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            強大的 AI 助手桌面應用程式，支援多種 AI 模型、技能系統和智能對話
          </p>
        </header>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <FeatureCard
            icon={<Sparkles className="w-8 h-8" />}
            title="多模型支援"
            description="支援 OpenAI、Anthropic、Google Gemini 和 Mistral 等主流 AI 模型"
          />
          <FeatureCard
            icon={<MessageSquare className="w-8 h-8" />}
            title="智能對話"
            description="具備上下文理解的智能對話系統，支援多輪對話和技能調用"
          />
          <FeatureCard
            icon={<Settings className="w-8 h-8" />}
            title="技能系統"
            description="可擴展的技能系統，支援文件管理、文檔處理、網頁瀏覽等功能"
          />
        </div>

        {/* Navigation */}
        <div className="flex justify-center gap-4">
          <Link
            href="/chat"
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg font-medium transition-colors"
          >
            開始對話
          </Link>
          <Link
            href="/settings"
            className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
          >
            設置
          </Link>
        </div>
      </div>
    </main>
  )
}

function FeatureCard({
  icon,
  title,
  description
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="p-6 bg-gray-800 rounded-xl border border-gray-700">
      <div className="text-blue-400 mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  )
}
