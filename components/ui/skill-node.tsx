"use client"

import { cn } from "@/lib/utils"
import { Lock, Check, Play } from "lucide-react"
import { ProgressCircle } from "./progress-circle"

interface SkillNodeProps {
  stage: number
  subStage: number
  status: "locked" | "available" | "current" | "completed"
  progress?: number
  onClick?: () => void
  className?: string
}

export function SkillNode({ stage, subStage, status, progress = 0, onClick, className }: SkillNodeProps) {
  const isInteractive = status === "available" || status === "current"
  const isLocked = status === "locked"
  
  const getIcon = () => {
    switch (status) {
      case "locked":
        return <Lock className="w-6 h-6" />
      case "completed":
        return <Check className="w-6 h-6" />
      case "current":
        return <Play className="w-6 h-6" />
      default:
        return <span className="font-bold">{subStage}</span>
    }
  }

  const getColors = () => {
    switch (status) {
      case "locked":
        return "bg-gray-200 border-gray-300 text-gray-500"
      case "completed":
        return "bg-green-500 border-green-600 text-white shadow-lg"
      case "current":
        return "bg-blue-500 border-blue-600 text-white shadow-lg"
      default:
        return "bg-white border-green-400 text-green-600 hover:bg-green-50"
    }
  }

  return (
    <div className={cn("flex flex-col items-center space-y-2", className)}>
      {status === "current" && progress > 0 ? (
        <ProgressCircle progress={progress} size={64}>
          <button
            onClick={onClick}
            className={cn(
              "skill-node w-12 h-12 text-sm font-bold transition-all duration-300",
              getColors(),
              isInteractive && "hover:scale-105 cursor-pointer",
            )}
            disabled={isLocked}
          >
            {getIcon()}
          </button>
        </ProgressCircle>
      ) : (
        <button
          onClick={onClick}
          className={cn(
            "skill-node w-16 h-16 text-sm font-bold transition-all duration-300",
            getColors(),
            isInteractive && "hover:scale-105 cursor-pointer",
          )}
          disabled={isLocked}
        >
          {getIcon()}
        </button>
      )}

      <div className="text-center">
        <div className="text-xs font-medium text-gray-700">
          {stage}-{subStage}
        </div>
      </div>
    </div>
  )
}
