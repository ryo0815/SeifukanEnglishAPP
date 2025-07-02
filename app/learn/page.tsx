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
  Mic, 
  Target, 
  Star, 
  ChevronRight,
  CheckCircle,
  Lock,
  Flame,
  Volume2,
  Play,
  Trophy,
  MessageCircle,
  Users,
  Coffee
} from "lucide-react"

// 発音・日常会話特化の学習コンテンツ
const dailyConversationLessons = [
  {
    id: 1,
    title: "基本の挨拶",
    category: "greetings",
    icon: "👋",
    difficulty: 1,
    phrases: [
      { text: "Hello, how are you?", meaning: "こんにちは、元気ですか？" },
      { text: "Nice to meet you", meaning: "はじめまして" },
      { text: "Good morning", meaning: "おはようございます" },
      { text: "Have a nice day", meaning: "良い一日を" }
    ],
    unlocked: true,
    completed: false
  },
  {
    id: 2,
    title: "カフェでの注文",
    category: "ordering",
    icon: "☕",
    difficulty: 2,
    phrases: [
      { text: "Can I have a coffee, please?", meaning: "コーヒーをお願いします" },
      { text: "I'll take this one", meaning: "これにします" },
      { text: "How much is it?", meaning: "いくらですか？" },
      { text: "Here you are", meaning: "はい、どうぞ" }
    ],
    unlocked: false,
    completed: false,
    comingSoon: true
  },
  {
    id: 3,
    title: "道案内・場所",
    category: "directions",
    icon: "🗺️",
    difficulty: 2,
    phrases: [
      { text: "Excuse me, where is the station?", meaning: "すみません、駅はどこですか？" },
      { text: "Go straight and turn left", meaning: "まっすぐ行って左に曲がって" },
      { text: "It's about 5 minutes walk", meaning: "歩いて約5分です" },
      { text: "Thank you for your help", meaning: "助けてくれてありがとう" }
    ],
    unlocked: false,
    completed: false,
    comingSoon: true
  },
  {
    id: 4,
    title: "自己紹介",
    category: "introduction",
    icon: "👤",
    difficulty: 2,
    phrases: [
      { text: "Let me introduce myself", meaning: "自己紹介させてください" },
      { text: "I work as a...", meaning: "私は...として働いています" },
      { text: "I'm interested in...", meaning: "私は...に興味があります" },
      { text: "Nice talking with you", meaning: "お話しできて良かったです" }
    ],
    unlocked: false,
    completed: false,
    comingSoon: true
  },
  {
    id: 5,
    title: "感情表現",
    category: "emotions",
    icon: "😊",
    difficulty: 3,
    phrases: [
      { text: "I'm so excited!", meaning: "とてもワクワクしています！" },
      { text: "That sounds great", meaning: "それは素晴らしいですね" },
      { text: "I'm a bit worried", meaning: "少し心配です" },
      { text: "Don't worry about it", meaning: "心配しないで" }
    ],
    unlocked: false,
    completed: false,
    comingSoon: true
  },
  {
    id: 6,
    title: "電話での会話",
    category: "phone",
    icon: "📞",
    difficulty: 3,
    phrases: [
      { text: "This is... speaking", meaning: "...です（電話で）" },
      { text: "Could you hold on a moment?", meaning: "少々お待ちください" },
      { text: "I'll get back to you", meaning: "後でご連絡します" },
      { text: "Thank you for calling", meaning: "お電話ありがとうございます" }
    ],
    unlocked: false,
    completed: false,
    comingSoon: true
  }
]

export default function LearnPage() {
  const router = useRouter()
  const { state, dispatch } = useGame()
  const [dailyGoalProgress, setDailyGoalProgress] = useState(0)
  const [lessons, setLessons] = useState(dailyConversationLessons)

  // モックデータ - 実際のアプリでは API から取得
  const [userStats, setUserStats] = useState({
    speakingCount: 45,
    practiceCount: 128,
    pronunciationScore: 78.5,
    completedLessons: 2
  })

  useEffect(() => {
    // Update streak on daily visit
    dispatch({ type: "UPDATE_STREAK" })

    // Calculate daily goal progress based on speaking practice
    const dailyGoal = 5 // 1日5フレーズの発音練習
    const todaysPractice = userStats.speakingCount % 10 // モック: 今日の練習回数
    setDailyGoalProgress(Math.min((todaysPractice / dailyGoal) * 100, 100))
  }, [dispatch, userStats.speakingCount])

  const handleLessonClick = (lessonId: number) => {
    const lesson = lessons.find(l => l.id === lessonId)
    if (!lesson?.unlocked) return

    if (state.hearts <= 0) {
      router.push("/shop")
      return
    }

    // 発音練習ページに移動
    router.push(`/pronunciation-practice/${lessonId}`)
  }

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return "bg-green-100 text-green-800"
      case 2: return "bg-yellow-100 text-yellow-800"
      case 3: return "bg-orange-100 text-orange-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "greetings": return MessageCircle
      case "ordering": return Coffee
      case "directions": return Target
      case "introduction": return Users
      case "emotions": return Star
      case "phone": return Volume2
      default: return Mic
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />

      <div className="p-4 pb-20">
        {/* ヘッダー */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            発音・日常会話マスター
          </h1>
          <p className="text-gray-600">
            実践的な英語フレーズで自信をつけよう
          </p>
        </div>

        {/* Daily Progress Card */}
        <Card className="p-6 mb-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold">今日の発音練習</h2>
              <p className="text-indigo-100">目標: 5フレーズの発音練習</p>
            </div>
            <Mic className="w-8 h-8 text-indigo-200" />
          </div>

          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span>{Math.round(dailyGoalProgress)}% 完了</span>
              <span>{state.streak} 日間ストリーク 🔥</span>
            </div>
            <div className="w-full bg-indigo-300/30 rounded-full h-3">
              <div
                className="bg-white rounded-full h-3 transition-all duration-500"
                style={{ width: `${dailyGoalProgress}%` }}
              />
            </div>
          </div>
        </Card>

        {/* 発音統計カード */}
        <Card className="p-6 mb-6 bg-gradient-to-r from-green-500 to-green-600 text-white">
          <div className="text-center mb-4">
            <h2 className="text-lg font-bold mb-2">あなたの発音レベル</h2>
            <div className="text-3xl font-bold">{userStats.pronunciationScore.toFixed(1)}</div>
            <div className="text-sm opacity-90">平均発音スコア</div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold">{userStats.speakingCount}</div>
              <div className="text-xs opacity-90">発音練習回数</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">{userStats.practiceCount}</div>
              <div className="text-xs opacity-90">総練習回数</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">{userStats.completedLessons}</div>
              <div className="text-xs opacity-90">完了レッスン</div>
            </div>
          </div>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <Card className="p-4 text-center">
            <Mic className="w-6 h-6 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">{userStats.speakingCount}</div>
            <div className="text-xs text-gray-500">発音練習</div>
          </Card>

          <Card className="p-4 text-center">
            <Trophy className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-600">{state.totalXp}</div>
            <div className="text-xs text-gray-500">総XP</div>
          </Card>

          <Card className="p-4 text-center">
            <Star className="w-6 h-6 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">{Math.floor(userStats.pronunciationScore / 20)}</div>
            <div className="text-xs text-gray-500">発音レベル</div>
          </Card>
        </div>

        {/* 日常会話レッスン */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">日常会話レッスン</h2>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => router.push('/curriculum')}
            >
              全コース
            </Button>
              </div>

          {lessons.map((lesson, index) => {
            const CategoryIcon = getCategoryIcon(lesson.category)
            const isUnlocked = lesson.unlocked || index <= userStats.completedLessons
            const isComingSoon = lesson.comingSoon

                  return (
              <Card 
                key={lesson.id}
                className={`p-4 transition-all duration-300 ${
                  isComingSoon
                    ? 'opacity-60 cursor-not-allowed bg-gray-50'
                    : isUnlocked 
                    ? 'cursor-pointer hover:shadow-lg border-2 border-transparent hover:border-blue-300' 
                    : 'opacity-60 cursor-not-allowed'
                }`}
                onClick={() => !isComingSoon && isUnlocked && handleLessonClick(lesson.id)}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${
                      lesson.completed 
                        ? 'bg-green-100' 
                        : isComingSoon
                        ? 'bg-gray-100'
                        : isUnlocked 
                        ? 'bg-blue-100' 
                        : 'bg-gray-100'
                    }`}>
                      {lesson.completed ? (
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      ) : isComingSoon ? (
                        <div className="text-2xl opacity-50">{lesson.icon}</div>
                      ) : isUnlocked ? (
                        <div className="text-2xl">{lesson.icon}</div>
                      ) : (
                        <Lock className="w-8 h-8 text-gray-400" />
                      )}
                        </div>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className={`font-bold ${isComingSoon ? 'text-gray-500' : 'text-gray-800'}`}>
                        {lesson.title}
                      </h3>
                      {isComingSoon ? (
                        <Badge className="bg-gray-200 text-gray-600">
                          Coming Soon
                        </Badge>
                      ) : (
                        <Badge className={getDifficultyColor(lesson.difficulty)}>
                          レベル {lesson.difficulty}
                        </Badge>
                      )}
                      {lesson.completed && (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      {lesson.phrases.slice(0, 2).map((phrase, phraseIndex) => (
                        <div key={phraseIndex} className={`text-xs p-2 rounded ${
                          isComingSoon ? 'bg-gray-100 text-gray-400' : 'bg-gray-50'
                        }`}>
                          <div className={`font-medium ${isComingSoon ? 'text-gray-400' : 'text-gray-700'}`}>
                            {phrase.text}
                          </div>
                          <div className={`${isComingSoon ? 'text-gray-300' : 'text-gray-500'}`}>
                            {phrase.meaning}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className={`flex items-center space-x-4 text-xs ${
                        isComingSoon ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                        <div className="flex items-center space-x-1">
                          <Volume2 className="w-3 h-3" />
                          <span>{lesson.phrases.length} フレーズ</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3" />
                          <span>{lesson.difficulty * 10} XP</span>
                        </div>
                      </div>
                      
                      {isComingSoon ? (
                        <Badge variant="outline" className="text-xs text-gray-400 border-gray-300">
                          準備中
                        </Badge>
                      ) : isUnlocked && !lesson.completed ? (
                        <Button size="sm" className="text-xs">
                          <Play className="w-3 h-3 mr-1" />
                          練習開始
                        </Button>
                      ) : null}
                    </div>
              </div>

                  {!isComingSoon && isUnlocked && <ChevronRight className="w-5 h-5 text-gray-400" />}
                </div>
              </Card>
            )
          })}
        </div>

        {/* 学習継続ボタン */}
          <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 w-full max-w-[390px] px-4">
            <Button
            onClick={() => {
              const nextLesson = lessons.find(l => l.unlocked && !l.completed)
              if (nextLesson) {
                handleLessonClick(nextLesson.id)
              }
            }}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 rounded-xl shadow-lg"
          >
            <Flame className="w-5 h-5 mr-2" />
            発音練習を続ける
            </Button>
          </div>
      </div>

      <BottomNav />
    </div>
  )
}
