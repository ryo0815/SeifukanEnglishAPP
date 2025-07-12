"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { 
  Target, 
  Trophy, 
  Users, 
  Zap, 
  ArrowRight,
  Play
} from "lucide-react"

export default function Home() {
  const router = useRouter()

  const handleGetStarted = () => {
    router.push("/learn")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teen-blue/20 via-teen-purple/20 to-teen-pink/20">
      {/* Header */}
      <header className="p-6 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-teen rounded-full flex items-center justify-center shadow-lg animate-float">
            <span className="text-white font-bold text-lg">🦉</span>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-teen bg-clip-text text-transparent">OwlLearn</h1>
        </div>
        
        <Button onClick={handleGetStarted} className="bg-gradient-teen hover:opacity-90 text-white border-0 shadow-lg" size="sm">
          <Play className="w-4 h-4 mr-2" />
          学習開始
        </Button>
      </header>

      {/* Hero Section */}
      <div className="text-center py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-bold text-gray-800 mb-6">
            発音練習で
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              英語力向上
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            AI音声分析とゲーミフィケーションで楽しく学習。
            毎日少しずつ、確実に英語力を向上させましょう。
          </p>
          <Button 
            onClick={handleGetStarted}
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-4 text-lg"
          >
            無料で始める
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>

      {/* Features */}
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              発音練習
            </h3>
            <p className="text-gray-600 text-sm">
              AI音声分析による正確な発音フィードバック
            </p>
          </Card>
          
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              ゲーミフィケーション
            </h3>
            <p className="text-gray-600 text-sm">
              XP、ストリーク、レベルアップで楽しく継続
            </p>
          </Card>
          
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              実践的な会話
            </h3>
            <p className="text-gray-600 text-sm">
              日常会話から始める実用的な英語表現
            </p>
          </Card>
          
          <Card className="p-6 text-center hover:shadow-lg transition-shadow">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              段階的学習
            </h3>
            <p className="text-gray-600 text-sm">
              12のカテゴリーで体系的にスキルアップ
            </p>
      </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-3xl font-bold text-white mb-6">
            今すぐ始めて、英語力を向上させましょう
          </h3>
          <p className="text-blue-100 text-lg mb-8">
            無料で今すぐ学習を開始できます！
          </p>
          <Button 
            onClick={handleGetStarted}
            size="lg"
            variant="secondary"
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg"
          >
            無料で始める
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}
