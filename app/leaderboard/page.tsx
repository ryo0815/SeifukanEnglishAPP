"use client"

import { useState, useEffect } from "react"
import { TopBar } from "@/components/layout/top-bar"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useGame } from "@/contexts/game-context"
import { 
  Trophy, 
  Medal, 
  Crown,
  Star,
  Mic,
  TrendingUp,
  Users,
  Calendar,
  Award,
  Flame
} from "lucide-react"

export default function LeaderboardPage() {
  const { state } = useGame()
  
  // モックデータ - 実際のアプリではAPIから取得
  const [leaderboards, setLeaderboards] = useState({
    weekly: [
      { rank: 1, name: "田中太郎", score: 92.5, streak: 15, avatar: "🧑‍💼", change: 2 },
      { rank: 2, name: "佐藤花子", score: 89.2, streak: 12, avatar: "👩‍🎓", change: -1 },
      { rank: 3, name: "山田次郎", score: 86.8, streak: 8, avatar: "👨‍💻", change: 1 },
      { rank: 4, name: "あなた", score: 78.5, streak: state.streak, avatar: "👤", change: 0, isCurrentUser: true },
      { rank: 5, name: "鈴木一郎", score: 76.3, streak: 6, avatar: "👨‍🎨", change: -2 },
      { rank: 6, name: "高橋美咲", score: 74.1, streak: 9, avatar: "👩‍🏫", change: 3 },
      { rank: 7, name: "伊藤健太", score: 72.8, streak: 4, avatar: "🧑‍🔬", change: 1 },
      { rank: 8, name: "渡辺愛", score: 71.5, streak: 7, avatar: "👩‍⚕️", change: -1 }
    ],
    monthly: [
      { rank: 1, name: "佐藤花子", score: 91.8, streak: 28, avatar: "👩‍🎓", change: 1 },
      { rank: 2, name: "田中太郎", score: 90.3, streak: 25, avatar: "🧑‍💼", change: -1 },
      { rank: 3, name: "山田次郎", score: 87.5, streak: 22, avatar: "👨‍💻", change: 0 },
      { rank: 4, name: "高橋美咲", score: 82.1, streak: 20, avatar: "👩‍🏫", change: 2 },
      { rank: 5, name: "あなた", score: 78.5, streak: state.streak, avatar: "👤", change: 1, isCurrentUser: true },
      { rank: 6, name: "鈴木一郎", score: 77.9, streak: 18, avatar: "👨‍🎨", change: -2 },
      { rank: 7, name: "伊藤健太", score: 75.2, streak: 15, avatar: "🧑‍🔬", change: 0 },
      { rank: 8, name: "渡辺愛", score: 73.8, streak: 16, avatar: "👩‍⚕️", change: 1 }
    ],
    allTime: [
      { rank: 1, name: "佐藤花子", score: 94.2, streak: 45, avatar: "👩‍🎓", change: 0 },
      { rank: 2, name: "田中太郎", score: 92.8, streak: 38, avatar: "🧑‍💼", change: 0 },
      { rank: 3, name: "山田次郎", score: 89.6, streak: 35, avatar: "👨‍💻", change: 0 },
      { rank: 4, name: "高橋美咲", score: 85.4, streak: 32, avatar: "👩‍🏫", change: 1 },
      { rank: 5, name: "鈴木一郎", score: 83.7, streak: 28, avatar: "👨‍🎨", change: -1 },
      { rank: 6, name: "あなた", score: 78.5, streak: state.streak, avatar: "👤", change: 2, isCurrentUser: true },
      { rank: 7, name: "伊藤健太", score: 77.1, streak: 25, avatar: "🧑‍🔬", change: 0 },
      { rank: 8, name: "渡辺愛", score: 75.9, streak: 24, avatar: "👩‍⚕️", change: -1 }
    ]
  })

  const [achievements, setAchievements] = useState([
    { title: "発音マスター", description: "90点以上を10回達成", icon: "🎯", rarity: "legendary" },
    { title: "継続は力なり", description: "30日連続学習達成", icon: "🔥", rarity: "epic" },
    { title: "スピーキング王", description: "1000回発音練習達成", icon: "👑", rarity: "rare" },
    { title: "日常会話の達人", description: "全カテゴリ80点以上", icon: "💬", rarity: "common" }
  ])

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-6 h-6 text-yellow-500" />
      case 2: return <Medal className="w-6 h-6 text-gray-400" />
      case 3: return <Medal className="w-6 h-6 text-orange-600" />
      default: return <div className="w-6 h-6 flex items-center justify-center text-sm font-bold text-gray-600">{rank}</div>
    }
  }

  const getChangeIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-green-500" />
    if (change < 0) return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />
    return <div className="w-4 h-4" />
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "legendary": return "bg-gradient-to-r from-purple-500 to-pink-500 text-white"
      case "epic": return "bg-gradient-to-r from-blue-500 to-purple-500 text-white"
      case "rare": return "bg-gradient-to-r from-green-500 to-blue-500 text-white"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const renderLeaderboard = (data: any[]) => (
    <div className="space-y-3">
      {data.map((user, index) => (
        <Card 
          key={index} 
          className={`p-4 transition-all duration-300 ${
            user.isCurrentUser 
              ? 'border-2 border-blue-400 bg-blue-50 shadow-lg' 
              : 'hover:shadow-md'
          }`}
        >
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              {getRankIcon(user.rank)}
            </div>
            
            <div className="flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-2xl">
                {user.avatar}
              </div>
            </div>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className={`font-bold ${user.isCurrentUser ? 'text-blue-800' : 'text-gray-800'}`}>
                  {user.name}
                </h3>
                {user.isCurrentUser && (
                  <Badge className="bg-blue-100 text-blue-800">あなた</Badge>
                )}
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span>{user.score}点</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Flame className="w-4 h-4 text-orange-500" />
                  <span>{user.streak}日</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {getChangeIcon(user.change)}
              {user.change !== 0 && (
                <span className={`text-sm font-medium ${
                  user.change > 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {Math.abs(user.change)}
                </span>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />

      <div className="p-4 pb-20">
        {/* ヘッダー */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            ランキング
      </h1>
          <p className="text-gray-600">
            他の学習者と競い合って発音を向上させよう
          </p>
        </div>

        {/* あなたの順位カード */}
        <Card className="p-6 mb-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <div className="text-center mb-4">
            <h2 className="text-lg font-bold mb-2">あなたの今週の順位</h2>
            <div className="text-4xl font-bold">#{leaderboards.weekly.find(u => u.isCurrentUser)?.rank}</div>
            <div className="text-sm opacity-90">週間ランキング</div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold">{leaderboards.weekly.find(u => u.isCurrentUser)?.score}</div>
              <div className="text-xs opacity-90">平均スコア</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">{state.streak}</div>
              <div className="text-xs opacity-90">連続学習日</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">{state.totalXp}</div>
              <div className="text-xs opacity-90">総XP</div>
            </div>
          </div>
        </Card>

        {/* ランキングタブ */}
        <Tabs defaultValue="weekly" className="mb-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="weekly">週間</TabsTrigger>
            <TabsTrigger value="monthly">月間</TabsTrigger>
            <TabsTrigger value="allTime">総合</TabsTrigger>
          </TabsList>
          
          <TabsContent value="weekly" className="mt-4">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800">週間ランキング</h3>
                <Calendar className="w-5 h-5 text-blue-500" />
              </div>
              {renderLeaderboard(leaderboards.weekly)}
            </Card>
          </TabsContent>
          
          <TabsContent value="monthly" className="mt-4">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800">月間ランキング</h3>
                <Calendar className="w-5 h-5 text-green-500" />
              </div>
              {renderLeaderboard(leaderboards.monthly)}
            </Card>
          </TabsContent>
          
          <TabsContent value="allTime" className="mt-4">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800">総合ランキング</h3>
                <Trophy className="w-5 h-5 text-yellow-500" />
              </div>
              {renderLeaderboard(leaderboards.allTime)}
            </Card>
          </TabsContent>
        </Tabs>

        {/* 実績・バッジ */}
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">実績・バッジ</h3>
            <Award className="w-5 h-5 text-purple-500" />
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {achievements.map((achievement, index) => (
              <div 
                key={index}
                className={`p-4 rounded-lg text-center ${getRarityColor(achievement.rarity)}`}
              >
                <div className="text-2xl mb-2">{achievement.icon}</div>
                <div className="font-bold text-sm mb-1">{achievement.title}</div>
                <div className="text-xs opacity-90">{achievement.description}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* 競争相手 */}
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">近い順位の競争相手</h3>
            <Users className="w-5 h-5 text-orange-500" />
          </div>
          
          <div className="space-y-3">
            {leaderboards.weekly.slice(2, 6).map((user, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="text-lg">{user.avatar}</div>
                  <div>
                    <div className="font-medium text-gray-800">{user.name}</div>
                    <div className="text-sm text-gray-600">#{user.rank} - {user.score}点</div>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  挑戦
                </Button>
              </div>
            ))}
          </div>
        </Card>

        {/* アクションボタン */}
        <div className="space-y-3">
          <Button className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 rounded-xl">
            <Mic className="w-5 h-5 mr-2" />
            発音練習でスコアアップ
          </Button>
          
          <Button variant="outline" className="w-full py-3">
            <Trophy className="w-4 h-4 mr-2" />
            友達を招待してボーナスXP獲得
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
