"use client"

import { useEffect, useState } from "react"

interface LoadingProps {
  message?: string
  variant?: "default" | "minimal" | "success"
  size?: "sm" | "md" | "lg"
}

export function Loading({ 
  message = "読み込み中...", 
  variant = "default",
  size = "md" 
}: LoadingProps) {
  const [dots, setDots] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => (prev + 1) % 4)
    }, 500)
    
    return () => clearInterval(interval)
  }, [])

  const sizeClasses = {
    sm: "w-6 h-6",
    md: "w-10 h-10", 
    lg: "w-16 h-16"
  }

  const containerClasses = {
    sm: "p-4",
    md: "p-6",
    lg: "p-8"
  }

  const textClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  }

  if (variant === "minimal") {
    return (
      <div className="flex items-center justify-center space-x-2">
        <div className={`${sizeClasses[size]} relative`}>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-20 animate-pulse" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-spin">
            <div className="absolute inset-1 bg-white rounded-full" />
          </div>
        </div>
        <span className={`${textClasses[size]} text-gray-600`}>
          {message}{".".repeat(dots)}
        </span>
      </div>
    )
  }

  if (variant === "success") {
    return (
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center animate-bounce">
          <span className="text-2xl">🎉</span>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-green-600">{message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        {/* 外側の円 */}
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center animate-pulse">
          <span className="text-2xl">🦉</span>
        </div>
        
        {/* 回転する円 */}
        <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 rounded-full animate-spin" />
        
        {/* キラキラ効果 */}
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-yellow-400 rounded-full animate-ping" />
        <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-pink-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
      </div>
      
      <div className="text-center">
        <p className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {message}{".".repeat(dots)}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          少々お待ちください
        </p>
      </div>
    </div>
  )
} 