"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Mic, MessageCircle, Trophy, BarChart3, User } from "lucide-react"

const navItems = [
  { href: "/learn", icon: Mic, label: "発音練習" },
  { href: "/curriculum", icon: MessageCircle, label: "日常会話" },
  { href: "/leaderboard", icon: Trophy, label: "ランキング" },
  { href: "/stats", icon: BarChart3, label: "統計" },
  { href: "/profile", icon: User, label: "プロフィール" },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-200">
      <div className="flex items-center justify-around py-2">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center p-2 transition-colors ${
                isActive ? "text-green-600" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon className={`w-6 h-6 ${isActive ? "text-green-600" : ""}`} />
              <span className="text-xs mt-1">{label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
