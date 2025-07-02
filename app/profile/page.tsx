"use client"

import { useState } from "react"
import { TopBar } from "@/components/layout/top-bar"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Card } from "@/components/ui/card"
import { useGame } from "@/contexts/game-context"
import { GreenBirdLogo } from "@/components/ui/green-bird-logo"
import { Settings, Trophy, Calendar, BookOpen, Zap } from "lucide-react"

export default function ProfilePage() {
  const { state } = useGame()
  const [showSettings, setShowSettings] = useState(false)

  const level = Math.floor(state.totalXp / 100) + 1
  const xpForNextLevel = level * 100 - state.totalXp
  const completedLessons = Array.from(state.completedLessons).length

  const stats = [
    {
      icon: BookOpen,
      label: "Lessons Completed",
      value: completedLessons,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      icon: Zap,
      label: "Total XP",
      value: state.totalXp,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50",
    },
    {
      icon: Calendar,
      label: "Day Streak",
      value: state.streak,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
    },
    {
      icon: Trophy,
      label: "Current Level",
      value: level,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />

      <div className="p-4 pb-20">
        {/* Profile Header */}
        <Card className="p-6 mb-6 bg-gradient-to-r from-green-400 to-green-600 text-white">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
              <GreenBirdLogo className="w-12 h-12" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">English Learner</h2>
              <p className="text-green-100">
                Level {level} • {completedLessons} lessons completed
              </p>
            </div>
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>

          {/* Level Progress */}
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span>Level {level}</span>
              <span>Level {level + 1}</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <div
                className="bg-white rounded-full h-3 transition-all duration-500"
                style={{ width: `${((state.totalXp % 100) / 100) * 100}%` }}
              />
            </div>
            <p className="text-xs text-green-100 mt-1">{xpForNextLevel} XP to next level</p>
          </div>
        </Card>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <Card key={index} className="p-4 text-center">
                <div className={`w-12 h-12 mx-auto mb-3 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                <div className="text-xs text-gray-500">{stat.label}</div>
              </Card>
            )
          })}
        </div>

        {/* Achievements */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Achievements</h3>
          <div className="space-y-3">
            {state.streak >= 7 && (
              <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-xl">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-bold text-orange-700">Week Warrior</div>
                  <div className="text-sm text-orange-600">7 day learning streak</div>
                </div>
              </div>
            )}

            {completedLessons >= 10 && (
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-xl">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-bold text-blue-700">Lesson Master</div>
                  <div className="text-sm text-blue-600">Completed 10 lessons</div>
                </div>
              </div>
            )}

            {state.totalXp >= 500 && (
              <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-xl">
                <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-bold text-purple-700">XP Champion</div>
                  <div className="text-sm text-purple-600">Earned 500+ XP</div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Learning Progress */}
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Learning Progress</h3>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Beginner (Stages 1-4)</span>
                <span>{Math.min(Math.max(state.currentStage - 1, 0), 4)}/4</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${(Math.min(Math.max(state.currentStage - 1, 0), 4) / 4) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Intermediate (Stages 5-12)</span>
                <span>{Math.min(Math.max(state.currentStage - 5, 0), 8)}/8</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${(Math.min(Math.max(state.currentStage - 5, 0), 8) / 8) * 100}%` }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm text-gray-600 mb-2">
                <span>Advanced (Stages 13-20)</span>
                <span>{Math.min(Math.max(state.currentStage - 13, 0), 8)}/8</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full"
                  style={{ width: `${(Math.min(Math.max(state.currentStage - 13, 0), 8) / 8) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>

      <BottomNav />

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/50 flex items-end z-50">
          <div className="w-full max-w-[430px] mx-auto bg-white rounded-t-3xl p-6 animate-slide-up">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold">Settings</h3>
              <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-gray-100 rounded-full">
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <button className="w-full text-left p-4 hover:bg-gray-50 rounded-xl">Sound Effects</button>
              <button className="w-full text-left p-4 hover:bg-gray-50 rounded-xl">Notifications</button>
              <button className="w-full text-left p-4 hover:bg-gray-50 rounded-xl">Daily Goal</button>
              <button className="w-full text-left p-4 hover:bg-gray-50 rounded-xl">Privacy Policy</button>
              <button className="w-full text-left p-4 hover:bg-gray-50 rounded-xl text-red-600">Reset Progress</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
