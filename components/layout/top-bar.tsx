"use client"

import { Heart, Flame, Gem } from "lucide-react"
import { useGame } from "@/contexts/game-context"

export function TopBar() {
  const { state } = useGame()

  return (
    <div className="flex items-center justify-between p-4 bg-white border-b border-gray-100">
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-lg">🎤</span>
        </div>
        <span className="text-lg font-bold text-blue-600">SpeakMaster</span>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1">
          <Flame className="w-5 h-5 text-orange-500" />
          <span className="font-bold text-orange-600">{state.streak}</span>
        </div>

        <div className="flex items-center space-x-1">
          <Gem className="w-5 h-5 text-blue-500" />
          <span className="font-bold text-blue-600">{state.gems}</span>
        </div>

        <div className="flex items-center space-x-1">
          <Heart className={`w-5 h-5 ${state.hearts > 0 ? "text-red-500" : "text-gray-300"}`} />
          <span className={`font-bold ${state.hearts > 0 ? "text-red-600" : "text-gray-400"}`}>{state.hearts}</span>
        </div>

        <div className="text-right">
          <div className="text-xs text-gray-500">XP</div>
          <div className="font-bold text-green-600">{state.totalXp}</div>
        </div>
      </div>
    </div>
  )
}
