"use client"

import { cn } from "@/lib/utils"

interface XPBarProps {
  currentXP: number
  nextLevelXP: number
  className?: string
}

export function XPBar({ currentXP, nextLevelXP, className }: XPBarProps) {
  const progress = (currentXP / nextLevelXP) * 100

  return (
    <div className={cn("w-full", className)}>
      <div className="flex justify-between text-sm text-gray-600 mb-1">
        <span>{currentXP} XP</span>
        <span>{nextLevelXP} XP</span>
      </div>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${Math.min(progress, 100)}%` }} />
      </div>
    </div>
  )
}
