"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { HeartCounter } from "@/components/ui/heart-counter"
import { XPBar } from "@/components/ui/xp-bar"
import { useGame } from "@/contexts/game-context"
import { 
  Settings, 
  Home,
  Menu,
  X
} from "lucide-react"

export function TopBar() {
  const router = useRouter()
  const { state } = useGame()
  const [showMenu, setShowMenu] = useState(false)

  return (
    <div className="fixed top-0 left-1/2 transform -translate-x-1/2 w-full max-w-[430px] bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/")}
            className="w-8 h-8"
          >
            <Home className="w-4 h-4" />
          </Button>
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">🦉</span>
            </div>
            <span className="font-semibold text-gray-800">OwlLearn</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <HeartCounter />
          <XPBar />
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowMenu(!showMenu)}
            className="w-8 h-8"
          >
            {showMenu ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </Button>
        </div>
      </div>
      
      {showMenu && (
        <div className="absolute right-4 top-16 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-2">
            <Button
              variant="ghost"
              onClick={() => {
                router.push("/settings")
                setShowMenu(false)
              }}
              className="w-full justify-start"
            >
              <Settings className="w-4 h-4 mr-2" />
              設定
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                router.push("/")
                setShowMenu(false)
              }}
              className="w-full justify-start"
            >
              <Home className="w-4 h-4 mr-2" />
              ホーム
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
