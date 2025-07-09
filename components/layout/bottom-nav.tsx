"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Mic, MessageCircle, Trophy, BarChart3, User } from "lucide-react"

const navItems = [
  { href: "/learn", icon: Mic, label: "学習" },
  { href: "/curriculum", icon: MessageCircle, label: "コース" },
  { href: "/leaderboard", icon: Trophy, label: "ランキング" },
  { href: "/stats", icon: BarChart3, label: "統計" },
  { href: "/profile", icon: User, label: "プロフィール" },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[430px] bg-gradient-to-r from-white to-gray-50 border-t border-gray-200 shadow-lg">
      <div className="flex items-center justify-around py-2">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center p-3 transition-all duration-200 transform hover:scale-105 ${
                isActive ? "text-blue-600" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className={`p-2 rounded-xl transition-all duration-200 ${
                isActive 
                  ? "bg-gradient-to-r from-blue-100 to-purple-100 shadow-md" 
                  : "hover:bg-gray-100"
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs mt-1 font-medium">{label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
