"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { TopBar } from "@/components/layout/top-bar"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useGame } from "@/contexts/game-context"
import { 
  ArrowLeft,
  Trophy,
  CheckCircle,
  Clock,
  Star,
  Filter,
  Calendar,
  Target
} from "lucide-react"

// ミッションカテゴリ
const categories = [
  { key: "ALL", label: "全て", icon: "📝" },
  { key: "DAILY_LIFE", label: "日常生活", icon: "🏠" },
  { key: "WORK_STUDY", label: "仕事・勉強", icon: "💼" },
  { key: "SOCIAL", label: "社交", icon: "👥" },
  { key: "TRAVEL", label: "旅行", icon: "✈️" },
  { key: "BUSINESS", label: "ビジネス", icon: "🏢" },
  { key: "CREATIVE", label: "創作活動", icon: "🎨" }
]

// モックミッションデータ
const mockMissions = [
  {
    id: 1,
    label: "英語で挨拶してみよう",
    description: "今日一日、出会った人に英語で挨拶をしてみましょう",
    category: "DAILY_LIFE",
    phase: 1,
    difficulty: 1,
    reward: 15,
    isDone: false,
    dueDate: "2024-06-25",
    estimatedTime: "10分"
  },
  {
    id: 2,
    label: "鏡に向かって自己紹介",
    description: "鏡に向かって英語で自己紹介を3回言ってみましょう",
    category: "DAILY_LIFE",
    phase: 1,
    difficulty: 1,
    reward: 10,
    isDone: true,
    completedAt: "2024-06-23",
    estimatedTime: "5分"
  },
  {
    id: 3,
    label: "カフェで英語で注文",
    description: "カフェやコンビニで英語で注文してみましょう",
    category: "DAILY_LIFE",
    phase: 2,
    difficulty: 2,
    reward: 25,
    isDone: false,
    dueDate: "2024-06-26",
    estimatedTime: "15分"
  },
  {
    id: 4,
    label: "外国人観光客に道案内",
    description: "困っている外国人観光客に英語で道案内をしてみましょう",
    category: "SOCIAL",
    phase: 2,
    difficulty: 3,
    reward: 30,
    isDone: false,
    dueDate: "2024-06-28",
    estimatedTime: "20分"
  },
  {
    id: 5,
    label: "英語自己紹介動画作成",
    description: "1分間の英語自己紹介動画を作成してSNSに投稿",
    category: "CREATIVE",
    phase: 3,
    difficulty: 3,
    reward: 35,
    isDone: false,
    dueDate: "2024-06-30",
    estimatedTime: "30分"
  },
  {
    id: 6,
    label: "英語でメール送信",
    description: "外国の友人や先生に英語でメールを送ってみましょう",
    category: "WORK_STUDY",
    phase: 3,
    difficulty: 2,
    reward: 20,
    isDone: false,
    dueDate: "2024-07-01",
    estimatedTime: "25分"
  },
  {
    id: 7,
    label: "英語で3分間スピーチ",
    description: "好きなトピックで3分間の英語スピーチを録画",
    category: "CREATIVE",
    phase: 4,
    difficulty: 4,
    reward: 45,
    isDone: false,
    dueDate: "2024-07-05",
    estimatedTime: "45分"
  },
  {
    id: 8,
    label: "英語討論に参加",
    description: "オンライン英語討論会や英会話サークルに参加",
    category: "SOCIAL",
    phase: 4,
    difficulty: 4,
    reward: 50,
    isDone: false,
    dueDate: "2024-07-10",
    estimatedTime: "60分"
  }
]

export default function MissionsPage() {
  const router = useRouter()
  const { state, dispatch } = useGame()
  
  const [missions, setMissions] = useState(mockMissions)
  const [selectedCategory, setSelectedCategory] = useState("ALL")
  const [filterStatus, setFilterStatus] = useState<"ALL" | "PENDING" | "COMPLETED">("ALL")

  const filteredMissions = missions.filter(mission => {
    const categoryMatch = selectedCategory === "ALL" || mission.category === selectedCategory
    const statusMatch = 
      filterStatus === "ALL" || 
      (filterStatus === "COMPLETED" && mission.isDone) ||
      (filterStatus === "PENDING" && !mission.isDone)
    
    return categoryMatch && statusMatch
  })

  const completedCount = missions.filter(m => m.isDone).length
  const totalXp = missions.filter(m => m.isDone).reduce((acc, m) => acc + m.reward, 0)

  const handleMissionComplete = (missionId: number) => {
    setMissions(prev => 
      prev.map(mission => 
        mission.id === missionId 
          ? { ...mission, isDone: true, completedAt: new Date().toISOString().split('T')[0] }
          : mission
      )
    )
    
    const mission = missions.find(m => m.id === missionId)
    if (mission) {
      dispatch({ type: "GAIN_XP", amount: mission.reward })
    }
  }

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.key === category)
    return cat ? cat.icon : "📝"
  }

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return "bg-green-100 text-green-800"
      case 2: return "bg-yellow-100 text-yellow-800"
      case 3: return "bg-orange-100 text-orange-800"
      case 4: return "bg-red-100 text-red-800"
      case 5: return "bg-purple-100 text-purple-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getPhaseColor = (phase: number) => {
    const colors = [
      "bg-blue-100 text-blue-800",
      "bg-green-100 text-green-800", 
      "bg-purple-100 text-purple-800",
      "bg-orange-100 text-orange-800",
      "bg-red-100 text-red-800",
      "bg-indigo-100 text-indigo-800"
    ]
    return colors[phase - 1] || "bg-gray-100 text-gray-800"
  }

  const getDaysUntilDue = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />

      <div className="p-4 pb-20">
        {/* ヘッダー */}
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push('/curriculum')}
            className="p-2 mr-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-800">ミッション</h1>
            <p className="text-sm text-gray-600">実践的な英語チャレンジ</p>
          </div>
        </div>

        {/* 統計カード */}
        <Card className="p-6 mb-6 bg-gradient-to-r from-green-500 to-green-600 text-white">
          <div className="text-center mb-4">
            <h2 className="text-lg font-bold mb-2">ミッション実績</h2>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{completedCount}</div>
              <div className="text-xs opacity-90">完了済み</div>
              <CheckCircle className="w-4 h-4 mx-auto mt-1" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{missions.length - completedCount}</div>
              <div className="text-xs opacity-90">進行中</div>
              <Clock className="w-4 h-4 mx-auto mt-1" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{totalXp}</div>
              <div className="text-xs opacity-90">獲得XP</div>
              <Trophy className="w-4 h-4 mx-auto mt-1" />
            </div>
          </div>
        </Card>

        {/* フィルター */}
        <div className="space-y-4 mb-6">
          {/* カテゴリフィルター */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">カテゴリ</h3>
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <Button
                  key={category.key}
                  variant={selectedCategory === category.key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.key)}
                  className="flex-shrink-0"
                >
                  <span className="mr-1">{category.icon}</span>
                  {category.label}
                </Button>
              ))}
            </div>
          </div>

          {/* ステータスフィルター */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">ステータス</h3>
            <div className="flex space-x-2">
              {[
                { key: "ALL", label: "全て" },
                { key: "PENDING", label: "進行中" },
                { key: "COMPLETED", label: "完了済み" }
              ].map((status) => (
                <Button
                  key={status.key}
                  variant={filterStatus === status.key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFilterStatus(status.key as any)}
                >
                  {status.label}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* ミッション一覧 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800">
              ミッション一覧 ({filteredMissions.length})
            </h2>
          </div>
          
          {filteredMissions.map((mission) => {
            const daysUntilDue = mission.dueDate ? getDaysUntilDue(mission.dueDate) : null
            const isOverdue = daysUntilDue !== null && daysUntilDue < 0
            const isDueSoon = daysUntilDue !== null && daysUntilDue <= 2 && daysUntilDue >= 0
            
            return (
              <Card key={mission.id} className={`p-4 ${
                mission.isDone ? 'bg-green-50 border-green-200' : 
                isOverdue ? 'bg-red-50 border-red-200' :
                isDueSoon ? 'bg-yellow-50 border-yellow-200' : ''
              }`}>
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="text-2xl">{getCategoryIcon(mission.category)}</div>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2 flex-wrap">
                      <h3 className="font-semibold text-gray-800 truncate">
                        {mission.label}
                      </h3>
                      
                      <div className="flex items-center space-x-1 flex-shrink-0">
                        <Badge className={getPhaseColor(mission.phase)}>
                          P{mission.phase}
                        </Badge>
                        <Badge className={getDifficultyColor(mission.difficulty)}>
                          L{mission.difficulty}
                        </Badge>
                      </div>
                      
                      {mission.isDone && (
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-3">{mission.description}</p>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{mission.estimatedTime}</span>
                        </div>
                        
                        {mission.dueDate && !mission.isDone && (
                          <div className={`flex items-center space-x-1 ${
                            isOverdue ? 'text-red-600' : isDueSoon ? 'text-yellow-600' : ''
                          }`}>
                            <Calendar className="w-3 h-3" />
                            <span>
                              {isOverdue 
                                ? `${Math.abs(daysUntilDue)}日超過` 
                                : daysUntilDue === 0 
                                ? '今日まで' 
                                : `あと${daysUntilDue}日`
                              }
                            </span>
                          </div>
                        )}
                        
                        {mission.completedAt && (
                          <div className="text-green-600">
                            {mission.completedAt} 完了
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          <Trophy className="w-3 h-3" />
                          <span>{mission.reward} XP</span>
                        </div>
                      </div>
                    </div>
                    
                    {!mission.isDone && (
                      <div className="flex space-x-2">
                        <Button 
                          size="sm"
                          onClick={() => handleMissionComplete(mission.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Target className="w-3 h-3 mr-1" />
                          完了報告
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            )
          })}
          
          {filteredMissions.length === 0 && (
            <Card className="p-8 text-center">
              <div className="text-gray-400 mb-2">
                <Filter className="w-8 h-8 mx-auto" />
              </div>
              <p className="text-gray-600">該当するミッションがありません</p>
            </Card>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  )
} 