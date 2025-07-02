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
  Target, 
  Mic, 
  Book, 
  Trophy, 
  Star, 
  ChevronRight,
  CheckCircle,
  Lock,
  Flame,
  Globe
} from "lucide-react"

// 青楓館式カリキュラム フェーズ構成
const phases = [
  {
    id: 1,
    title: "基礎発音 & 自信構築",
    description: "英語の音に慣れ、自信を持って発声する",
    color: "from-blue-400 to-blue-600",
    icon: Mic,
    stages: [
      { id: 1, title: "英語の音を知る", unlocked: true },
      { id: 2, title: "日常挨拶マスター", unlocked: false }
    ]
  },
  {
    id: 2,
    title: "実用表現 & コミュニケーション基礎",
    description: "日常生活で使える実践的な表現を習得",
    color: "from-green-400 to-green-600",
    icon: Globe,
    stages: [
      { id: 1, title: "お店での注文", unlocked: false },
      { id: 2, title: "道案内・場所", unlocked: false }
    ]
  },
  {
    id: 3,
    title: "ビジネス基礎 & 自己表現",
    description: "職場やビジネスシーンで活用できるスキル",
    color: "from-purple-400 to-purple-600",
    icon: Target,
    stages: [
      { id: 1, title: "自己紹介・職業", unlocked: false },
      { id: 2, title: "電話・メール対応", unlocked: false }
    ]
  },
  {
    id: 4,
    title: "アカデミック英語 & プレゼンテーション",
    description: "学術的な場面での英語コミュニケーション",
    color: "from-orange-400 to-orange-600",
    icon: Book,
    stages: [
      { id: 1, title: "意見表明・議論", unlocked: false },
      { id: 2, title: "プレゼンテーション基礎", unlocked: false }
    ]
  },
  {
    id: 5,
    title: "高度なコミュニケーション",
    description: "交渉・説得・文化理解の高度なスキル",
    color: "from-red-400 to-red-600",
    icon: Trophy,
    stages: [
      { id: 1, title: "交渉・説得", unlocked: false },
      { id: 2, title: "文化理解・国際感覚", unlocked: false }
    ]
  },
  {
    id: 6,
    title: "実践応用 & 海外進学準備",
    description: "海外大学進学・海外生活への最終準備",
    color: "from-indigo-400 to-indigo-600",
    icon: Star,
    stages: [
      { id: 1, title: "アカデミックライティング", unlocked: false },
      { id: 2, title: "海外生活準備", unlocked: false }
    ]
  }
]

// モックミッションデータ
const mockMissions = [
  {
    id: 1,
    label: "英語で挨拶してみよう",
    description: "今日一日、出会った人に英語で挨拶をしてみましょう",
    category: "DAILY_LIFE",
    difficulty: 1,
    reward: 15,
    isDone: false
  },
  {
    id: 2,
    label: "鏡に向かって自己紹介",
    description: "鏡に向かって英語で自己紹介を3回言ってみましょう",
    category: "DAILY_LIFE",
    difficulty: 1,
    reward: 10,
    isDone: true
  },
  {
    id: 3,
    label: "カフェで英語で注文",
    description: "カフェやコンビニで英語で注文してみましょう",
    category: "DAILY_LIFE",
    difficulty: 2,
    reward: 25,
    isDone: false
  }
]

export default function CurriculumPage() {
  const router = useRouter()
  const { state, dispatch } = useGame()
  
  // モックデータ - 実際のアプリでは API から取得
  const [userStats, setUserStats] = useState({
    currentPhase: 1,
    speakingCount: 45,
    practiceCount: 128,
    missionCount: 8,
    motivationLevel: 3,
    pronunciationScore: 78.5
  })
  
  const [missions, setMissions] = useState(mockMissions)

  const handlePhaseClick = (phaseId: number) => {
    if (phaseId <= userStats.currentPhase) {
      router.push(`/curriculum/phase/${phaseId}`)
    }
  }

  const handleMissionComplete = (missionId: number) => {
    setMissions(prev => 
      prev.map(mission => 
        mission.id === missionId 
          ? { ...mission, isDone: true }
          : mission
      )
    )
    
    // XP とカウンターを更新
    setUserStats(prev => ({
      ...prev,
      missionCount: prev.missionCount + 1
    }))
    
    dispatch({ type: "GAIN_XP", amount: 25 })
  }

  const getPhaseProgress = (phaseId: number) => {
    if (phaseId < userStats.currentPhase) return 100
    if (phaseId === userStats.currentPhase) return 45 // モック進捗
    return 0
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "DAILY_LIFE": return "🏠"
      case "WORK_STUDY": return "💼"
      case "SOCIAL": return "👥"
      case "TRAVEL": return "✈️"
      case "BUSINESS": return "🏢"
      case "CREATIVE": return "🎨"
      default: return "📝"
    }
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

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />

      <div className="p-4 pb-20">
        {/* ヘッダー */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            日常会話カリキュラム
          </h1>
          <p className="text-gray-600">
            発音特化 × モチベーション重視の実践的学習
          </p>
        </div>

        {/* KPI ダッシュボード */}
        <Card className="p-6 mb-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <div className="text-center mb-4">
            <h2 className="text-xl font-bold mb-2">あなたの進捗</h2>
            <div className="text-sm opacity-90">フェーズ {userStats.currentPhase} - 基礎発音 & 自信構築</div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{userStats.speakingCount}</div>
              <div className="text-xs opacity-90">声を出した回数</div>
              <Mic className="w-4 h-4 mx-auto mt-1" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{userStats.practiceCount}</div>
              <div className="text-xs opacity-90">練習回数</div>
              <Book className="w-4 h-4 mx-auto mt-1" />
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{userStats.missionCount}</div>
              <div className="text-xs opacity-90">ミッション完了</div>
              <Target className="w-4 h-4 mx-auto mt-1" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold">{userStats.pronunciationScore.toFixed(1)}</div>
              <div className="text-xs opacity-90">発音スコア平均</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${
                      i < userStats.motivationLevel 
                        ? 'text-yellow-300 fill-current' 
                        : 'text-gray-300'
                    }`} 
                  />
                ))}
              </div>
              <div className="text-xs opacity-90">モチベーション</div>
            </div>
          </div>
        </Card>

        {/* フェーズ一覧 */}
        <div className="space-y-4 mb-6">
          <h2 className="text-xl font-bold text-gray-800">学習フェーズ</h2>
          
          {phases.map((phase) => {
            const PhaseIcon = phase.icon
            const isUnlocked = phase.id <= userStats.currentPhase
            const isCurrent = phase.id === userStats.currentPhase
            const progress = getPhaseProgress(phase.id)
            
            return (
              <Card 
                key={phase.id}
                className={`p-4 cursor-pointer transition-all duration-300 ${
                  isUnlocked 
                    ? 'hover:shadow-lg border-2 border-transparent hover:border-blue-300' 
                    : 'opacity-60 cursor-not-allowed'
                }`}
                onClick={() => handlePhaseClick(phase.id)}
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-full bg-gradient-to-r ${phase.color} text-white`}>
                    {isUnlocked ? <PhaseIcon className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-bold text-gray-800">
                        フェーズ {phase.id}: {phase.title}
                      </h3>
                      {isCurrent && <Badge className="bg-blue-100 text-blue-800">現在</Badge>}
                      {progress === 100 && <CheckCircle className="w-5 h-5 text-green-500" />}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{phase.description}</p>
                    
                    {isUnlocked && (
                      <div className="mb-2">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>進捗状況</span>
                          <span>{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    )}
                    
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span>{phase.stages.length} ステージ</span>
                    </div>
                  </div>
                  
                  {isUnlocked && <ChevronRight className="w-5 h-5 text-gray-400" />}
                </div>
              </Card>
            )
          })}
        </div>

        {/* 今日のミッション */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">今日のミッション</h2>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => router.push('/curriculum/missions')}
            >
              全て見る
            </Button>
          </div>
          
          {missions.slice(0, 3).map((mission) => (
            <Card key={mission.id} className="p-4">
              <div className="flex items-start space-x-3">
                <div className="text-2xl">{getCategoryIcon(mission.category)}</div>
                
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="font-semibold text-gray-800">{mission.label}</h3>
                    <Badge className={getDifficultyColor(mission.difficulty)}>
                      レベル {mission.difficulty}
                    </Badge>
                    {mission.isDone && <CheckCircle className="w-5 h-5 text-green-500" />}
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{mission.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <Trophy className="w-4 h-4" />
                      <span>{mission.reward} XP</span>
                    </div>
                    
                    {!mission.isDone && (
                      <Button 
                        size="sm"
                        onClick={() => handleMissionComplete(mission.id)}
                      >
                        完了
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* 学習継続ボタン */}
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 w-full max-w-[390px] px-4">
          <Button
            onClick={() => router.push(`/curriculum/phase/${userStats.currentPhase}`)}
            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-4 rounded-xl shadow-lg"
          >
            <Flame className="w-5 h-5 mr-2" />
            学習を続ける
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  )
} 