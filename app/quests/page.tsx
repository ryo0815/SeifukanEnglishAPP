"use client"

import { TopBar } from "@/components/layout/top-bar"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useGame } from "@/contexts/game-context"
import { Trophy, Target, Clock, CheckCircle, Gem } from "lucide-react"

const dailyQuests = [
  {
    id: "complete-lesson",
    title: "Complete a Lesson",
    description: "Finish any lesson today",
    reward: 20,
    progress: 0,
    target: 1,
    icon: Target,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    id: "earn-xp",
    title: "Earn 50 XP",
    description: "Get 50 XP from lessons",
    reward: 15,
    progress: 0,
    target: 50,
    icon: Trophy,
    color: "text-yellow-500",
    bgColor: "bg-yellow-50",
  },
  {
    id: "perfect-lesson",
    title: "Perfect Lesson",
    description: "Complete a lesson with no mistakes",
    reward: 30,
    progress: 0,
    target: 1,
    icon: CheckCircle,
    color: "text-green-500",
    bgColor: "bg-green-50",
  },
]

const weeklyQuests = [
  {
    id: "week-streak",
    title: "Week Warrior",
    description: "Maintain a 7-day streak",
    reward: 100,
    progress: 0,
    target: 7,
    icon: Clock,
    color: "text-purple-500",
    bgColor: "bg-purple-50",
  },
  {
    id: "complete-stage",
    title: "Stage Master",
    description: "Complete an entire stage",
    reward: 150,
    progress: 0,
    target: 1,
    icon: Trophy,
    color: "text-orange-500",
    bgColor: "bg-orange-50",
  },
]

export default function QuestsPage() {
  const { state } = useGame()

  const QuestCard = ({ quest, isWeekly = false }: { quest: any; isWeekly?: boolean }) => {
    const Icon = quest.icon
    const isCompleted = quest.progress >= quest.target
    const progressPercent = Math.min((quest.progress / quest.target) * 100, 100)

    return (
      <Card className="p-6">
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 rounded-xl ${quest.bgColor} flex items-center justify-center`}>
            <Icon className={`w-6 h-6 ${quest.color}`} />
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-gray-800">{quest.title}</h3>
              {isWeekly && (
                <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full">WEEKLY</span>
              )}
            </div>
            <p className="text-gray-600 text-sm mb-3">{quest.description}</p>

            {/* Progress bar */}
            <div className="mb-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>
                  {quest.progress}/{quest.target}
                </span>
                <span>{Math.round(progressPercent)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-500 ${
                    isCompleted ? "bg-green-500" : quest.color.replace("text-", "bg-")
                  }`}
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Reward */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <Gem className="w-4 h-4 text-blue-500" />
                <span className="font-bold text-blue-600">{quest.reward} gems</span>
              </div>

              {isCompleted ? (
                <Button size="sm" className="bg-green-500 hover:bg-green-600">
                  Claim
                </Button>
              ) : (
                <div className="text-xs text-gray-500">In progress...</div>
              )}
            </div>
          </div>
        </div>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />

      <div className="p-4 pb-20">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Quests</h1>
          <p className="text-gray-600">Complete challenges to earn bonus gems</p>
        </div>

        {/* Daily Quests */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-blue-500" />
            Daily Quests
          </h2>
          <div className="space-y-4">
            {dailyQuests.map((quest) => (
              <QuestCard key={quest.id} quest={quest} />
            ))}
          </div>
        </div>

        {/* Weekly Quests */}
        <div>
          <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-purple-500" />
            Weekly Quests
          </h2>
          <div className="space-y-4">
            {weeklyQuests.map((quest) => (
              <QuestCard key={quest.id} quest={quest} isWeekly />
            ))}
          </div>
        </div>

        {/* Quest tips */}
        <Card className="p-6 mt-8 bg-gradient-to-r from-green-400 to-green-600 text-white">
          <h3 className="text-lg font-bold mb-2">Quest Tips</h3>
          <ul className="space-y-1 text-sm text-green-100">
            <li>• Complete lessons daily to earn the most gems</li>
            <li>• Perfect scores give bonus quest progress</li>
            <li>• Weekly quests reset every Monday</li>
            <li>• Use gems in the shop for power-ups</li>
          </ul>
        </Card>
      </div>

      <BottomNav />
    </div>
  )
}
