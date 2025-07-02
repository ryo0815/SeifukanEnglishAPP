"use client"

import { useState, useEffect } from "react"
import { TopBar } from "@/components/layout/top-bar"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useGame } from "@/contexts/game-context"
import { 
  Mic, 
  TrendingUp, 
  Calendar, 
  Star,
  Volume2,
  BarChart3,
  Target,
  Award,
  MessageCircle,
  Clock,
  Flame
} from "lucide-react"

export default function StatsPage() {
  const { state } = useGame()
  
  // モックデータ - 実際のアプリではAPIから取得
  const [stats, setStats] = useState({
    totalSpeakingTime: 2340, // 秒
    pronunciationScore: 78.5,
    averageSessionTime: 180, // 秒
    completedLessons: 12,
    streakDays: state.streak,
    weeklyProgress: [65, 72, 78, 81, 76, 82, 85],
    recentScores: [
      { date: "2024-01-15", lesson: "基本の挨拶", score: 85 },
      { date: "2024-01-14", lesson: "カフェでの注文", score: 78 },
      { date: "2024-01-13", lesson: "道案内・場所", score: 82 },
      { date: "2024-01-12", lesson: "自己紹介", score: 76 },
      { date: "2024-01-11", lesson: "感情表現", score: 88 }
    ],
    categoryScores: [
      { category: "挨拶", score: 85, lessons: 4 },
      { category: "注文・買い物", score: 78, lessons: 3 },
      { category: "道案内", score: 82, lessons: 2 },
      { category: "自己紹介", score: 76, lessons: 2 },
      { category: "感情表現", score: 88, lessons: 1 }
    ],
    acousticAnalysis: {
      pitchStability: 82,
      volumeConsistency: 76,
      speechClarity: 84,
      rhythm: 78
    }
  })

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}時間${minutes}分`
    }
    return `${minutes}分`
  }

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600"
    if (score >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 85) return "bg-green-100"
    if (score >= 70) return "bg-yellow-100"
    return "bg-red-100"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />

      <div className="p-4 pb-20">
        {/* ヘッダー */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            発音統計
          </h1>
          <p className="text-gray-600">
            あなたの発音学習の進捗を確認しましょう
          </p>
        </div>

        {/* 総合スコアカード */}
        <Card className="p-6 mb-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <div className="text-center mb-4">
            <h2 className="text-lg font-bold mb-2">総合発音スコア</h2>
            <div className="text-4xl font-bold">{stats.pronunciationScore.toFixed(1)}</div>
            <div className="text-sm opacity-90">100点満点中</div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold">{formatTime(stats.totalSpeakingTime)}</div>
              <div className="text-xs opacity-90">総練習時間</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">{stats.completedLessons}</div>
              <div className="text-xs opacity-90">完了レッスン</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">{stats.streakDays}</div>
              <div className="text-xs opacity-90">連続学習日</div>
            </div>
          </div>
        </Card>

        {/* 週間進捗 */}
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">週間進捗</h3>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          
          <div className="space-y-3">
            {stats.weeklyProgress.map((score, index) => {
              const days = ['月', '火', '水', '木', '金', '土', '日']
              return (
                <div key={index} className="flex items-center space-x-3">
                  <div className="w-8 text-sm text-gray-600">{days[index]}</div>
                  <div className="flex-1">
                    <Progress value={score} className="h-2" />
                  </div>
                  <div className="w-12 text-sm text-gray-700">{score}点</div>
                </div>
              )
            })}
          </div>
        </Card>

        {/* 音響分析結果 */}
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">音響分析結果</h3>
            <Volume2 className="w-5 h-5 text-blue-500" />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">音程安定性</span>
                  <span className="text-sm font-medium">{stats.acousticAnalysis.pitchStability}%</span>
                </div>
                <Progress value={stats.acousticAnalysis.pitchStability} className="h-2" />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">音量一貫性</span>
                  <span className="text-sm font-medium">{stats.acousticAnalysis.volumeConsistency}%</span>
                </div>
                <Progress value={stats.acousticAnalysis.volumeConsistency} className="h-2" />
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">発音明瞭度</span>
                  <span className="text-sm font-medium">{stats.acousticAnalysis.speechClarity}%</span>
                </div>
                <Progress value={stats.acousticAnalysis.speechClarity} className="h-2" />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-600">リズム感</span>
                  <span className="text-sm font-medium">{stats.acousticAnalysis.rhythm}%</span>
                </div>
                <Progress value={stats.acousticAnalysis.rhythm} className="h-2" />
              </div>
            </div>
          </div>
        </Card>

        {/* カテゴリ別スコア */}
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">カテゴリ別スコア</h3>
            <BarChart3 className="w-5 h-5 text-purple-500" />
          </div>
          
          <div className="space-y-3">
            {stats.categoryScores.map((category, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{category.category}</div>
                  <div className="text-sm text-gray-600">{category.lessons} レッスン完了</div>
                </div>
                <div className="text-center">
                  <div className={`text-lg font-bold ${getScoreColor(category.score)}`}>
                    {category.score}
                  </div>
                  <div className="text-xs text-gray-500">点</div>
                </div>
                <div className="w-16 ml-3">
                  <Progress value={category.score} className="h-2" />
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* 最近の練習履歴 */}
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">最近の練習履歴</h3>
            <Clock className="w-5 h-5 text-orange-500" />
          </div>
          
          <div className="space-y-3">
            {stats.recentScores.map((session, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{session.lesson}</div>
                  <div className="text-sm text-gray-600">{session.date}</div>
                </div>
                <Badge className={`${getScoreBgColor(session.score)} ${getScoreColor(session.score)}`}>
                  {session.score}点
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* 学習目標 */}
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-gray-800">今週の目標</h3>
            <Target className="w-5 h-5 text-green-500" />
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">発音練習時間</span>
                <span className="text-sm font-medium">{formatTime(stats.totalSpeakingTime)} / 30分</span>
              </div>
              <Progress value={(stats.totalSpeakingTime / 1800) * 100} className="h-2" />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">連続学習日数</span>
                <span className="text-sm font-medium">{stats.streakDays} / 7日</span>
              </div>
              <Progress value={(stats.streakDays / 7) * 100} className="h-2" />
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">平均スコア</span>
                <span className="text-sm font-medium">{stats.pronunciationScore.toFixed(1)} / 85点</span>
              </div>
              <Progress value={(stats.pronunciationScore / 85) * 100} className="h-2" />
            </div>
          </div>
        </Card>

        {/* アクションボタン */}
        <div className="space-y-3">
          <Button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 rounded-xl">
            <Mic className="w-5 h-5 mr-2" />
            発音練習を開始
          </Button>
          
          <Button variant="outline" className="w-full py-3">
            <Award className="w-4 h-4 mr-2" />
            詳細な分析レポートを見る
          </Button>
        </div>
      </div>

      <BottomNav />
    </div>
  )
} 