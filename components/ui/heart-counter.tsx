"use client"

import { Heart } from "lucide-react"
import { useGame } from "@/contexts/game-context"

export function HeartCounter() {
  const { state } = useGame()

  return (
    <div className="flex items-center space-x-1">
      <Heart className="w-5 h-5 text-red-500" />
      <span className="font-medium text-red-600">{state.hearts}</span>
    </div>
  )
}
