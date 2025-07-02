"use client"

import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"

interface HeartCounterProps {
  hearts: number
  maxHearts?: number
  className?: string
}

export function HeartCounter({ hearts, maxHearts = 5, className }: HeartCounterProps) {
  return (
    <div className={cn("flex items-center space-x-1", className)}>
      {Array.from({ length: maxHearts }).map((_, index) => (
        <Heart
          key={index}
          className={cn(
            "w-6 h-6 transition-colors duration-200",
            index < hearts ? "text-red-500 fill-red-500" : "text-gray-300 fill-gray-300",
          )}
        />
      ))}
    </div>
  )
}
