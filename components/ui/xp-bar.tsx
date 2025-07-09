"use client"

import { Progress } from "@/components/ui/progress"
import { useGame } from "@/contexts/game-context"
import { Star } from "lucide-react"

export function XPBar() {
  const { state } = useGame()

  // シンプルなレベル計算
  const level = Math.floor(state.totalXp / 100) + 1
  const xpInCurrentLevel = state.totalXp % 100
  const xpToNextLevel = 100 - xpInCurrentLevel

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg border border-blue-100">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
            <Star className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            レベル {level}
          </span>
        </div>
        <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
          {xpInCurrentLevel} / 100 XP
        </div>
      </div>
      
      <Progress value={xpInCurrentLevel} className="h-3 mb-3" />
      
      <div className="text-center">
        <p className="text-xs text-gray-600">
          次のレベルまで <span className="font-semibold text-blue-600">{xpToNextLevel} XP</span>
        </p>
      </div>
    </div>
  )
}
