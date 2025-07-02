"use client"

import { TopBar } from "@/components/layout/top-bar"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useGame } from "@/contexts/game-context"
import { Trophy, Users, Medal, Crown, Zap } from "lucide-react"
import { GreenBirdLogo } from "@/components/ui/green-bird-logo"

// Mock leaderboard data
const leaderboard = [
  { id: 1, name: "Emma Chen", xp: 2850, streak: 15, avatar: "👩‍🎓" },
  { id: 2, name: "You", xp: 0, streak: 0, avatar: <GreenBirdLogo className="w-8 h-8" /> },
  { id: 3, name: "Alex Kim", xp: 1920, streak: 8, avatar: "👨‍💼" },
  { id: 4, name: "Maria Silva", xp: 1680, streak: 12, avatar: "👩‍🎨" },
  { id: 5, name: "John Wright", xp: 1450, streak: 6, avatar: "👨‍🔬" },
  { id: 6, name: "Sara Johnson", xp: 1200, streak: 9, avatar: "👩‍💻" },
  { id: 7, name: "David Park", xp: 980, streak: 4, avatar: "👨‍🎓" },
  { id: 8, name: "Lisa Wang", xp: 750, streak: 7, avatar: "👩‍🏫" },
]

export default function SocialPage() {
  const { state } = useGame()

  // Update user's data in leaderboard
  const updatedLeaderboard = leaderboard
    .map((user) => (user.name === "You" ? { ...user, xp: state.totalXp, streak: state.streak } : user))
    .sort((a, b) => b.xp - a.xp)

  // Find user's rank
  const userRank = updatedLeaderboard.findIndex((user) => user.name === "You") + 1

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />
      case 3:
        return <Medal className="w-6 h-6 text-orange-600" />
      default:
        return <span className="text-lg font-bold text-gray-600">#{rank}</span>
    }
  }

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600"
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-500"
      case 3:
        return "bg-gradient-to-r from-orange-400 to-orange-600"
      default:
        return "bg-white"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />

      <div className="p-4 pb-20">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Leaderboard</h1>
          <p className="text-gray-600">Compete with learners worldwide</p>
        </div>

        {/* User's rank highlight */}
        <Card className="p-6 mb-6 bg-gradient-to-r from-green-400 to-green-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <GreenBirdLogo className="w-8 h-8" />
              </div>
              <div>
                <h2 className="text-lg font-bold">Your Rank</h2>
                <p className="text-green-100">
                  {state.totalXp} XP • {state.streak} day streak
                </p>
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">#{userRank}</div>
              <div className="text-xs text-green-100">This week</div>
            </div>
          </div>
        </Card>

        {/* League info */}
        <Card className="p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                <Trophy className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <div className="font-bold text-gray-800">Emerald League</div>
                <div className="text-sm text-gray-600">Top 10 advance to Diamond</div>
              </div>
            </div>
            <Button variant="outline" size="sm">
              View Rules
            </Button>
          </div>
        </Card>

        {/* Leaderboard */}
        <div className="space-y-3">
          {updatedLeaderboard.map((user, index) => {
            const rank = index + 1
            const isCurrentUser = user.name === "You"

            return (
              <Card
                key={user.id}
                className={`p-4 ${isCurrentUser ? "ring-2 ring-green-400 bg-green-50" : ""} ${
                  rank <= 3 ? getRankColor(rank) : "bg-white"
                } ${rank <= 3 ? "text-white" : ""}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-8">{getRankIcon(rank)}</div>

                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-lg">
                      {typeof user.avatar === "string" ? user.avatar : user.avatar}
                    </div>

                    <div>
                      <div
                        className={`font-bold ${rank <= 3 ? "text-white" : isCurrentUser ? "text-green-700" : "text-gray-800"}`}
                      >
                        {user.name}
                        {isCurrentUser && <span className="ml-2 text-sm font-normal">(You)</span>}
                      </div>
                      <div className={`text-sm ${rank <= 3 ? "text-white/80" : "text-gray-600"}`}>
                        {user.streak} day streak
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`flex items-center space-x-1 ${rank <= 3 ? "text-white" : "text-orange-600"}`}>
                      <Zap className="w-4 h-4" />
                      <span className="font-bold">{user.xp}</span>
                    </div>
                    <div className={`text-xs ${rank <= 3 ? "text-white/80" : "text-gray-500"}`}>XP</div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Friends section */}
        <Card className="p-6 mt-8">
          <div className="text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="font-bold text-gray-800 mb-2">Invite Friends</h3>
            <p className="text-gray-600 text-sm mb-4">
              Learning is more fun with friends! Invite them to join OwlLearn.
            </p>
            <Button className="bg-green-500 hover:bg-green-600">Invite Friends</Button>
          </div>
        </Card>

        {/* Competition info */}
        <Card className="p-6 mt-4 bg-gradient-to-r from-purple-400 to-purple-600 text-white">
          <h3 className="font-bold mb-2">Weekly Competition</h3>
          <p className="text-purple-100 text-sm mb-4">
            Compete with other learners in your league. Top performers advance to higher leagues!
          </p>
          <div className="flex justify-between text-sm">
            <span>Resets in:</span>
            <span className="font-bold">3 days 12 hours</span>
          </div>
        </Card>
      </div>

      <BottomNav />
    </div>
  )
}
