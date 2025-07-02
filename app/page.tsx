"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // 直接学習ページへリダイレクト
    router.push("/learn")
  }, [router])

  // リダイレクト中の表示
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-400 to-green-600 flex items-center justify-center">
      <Card className="p-8 bg-white rounded-3xl shadow-2xl">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
            <span className="text-4xl">🦉</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">OwlLearn</h1>
          <p className="text-gray-600">学習ページを準備中...</p>
        </div>
      </Card>
    </div>
  )
}
