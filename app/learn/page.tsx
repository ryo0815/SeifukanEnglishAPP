"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TopBar } from "@/components/layout/top-bar"
import { BottomNav } from "@/components/layout/bottom-nav"
import { useGame } from "@/contexts/game-context"
import { 
  CheckCircle, 
  Lock, 
  Play, 
  Target, 
  Mic,
  RotateCcw,
  Gift
} from "lucide-react"

// 新しい学習内容に基づく12のカテゴリー（順次解放システム付き）
const learningCategories = [
  {
    id: 1,
    title: "あいさつ",
    icon: "👋",
    description: "基本的な挨拶表現",
    difficulty: 1,
    phrases: [
      { en: "Hey! How's it going?", ja: "やあ、調子どう？" },
      { en: "Good to see you!", ja: "会えて嬉しい！" },
      { en: "Long time no see!", ja: "久しぶり！" },
      { en: "What's up?", ja: "元気してた？" },
      { en: "Have a nice day!", ja: "よい一日を！" }
    ],
    unlocked: true, // 最初のカテゴリーは常に解放
    completed: false,
    gradient: "from-blue-400 to-purple-400"
  },
  {
    id: 2,
    title: "自己紹介・趣味",
    icon: "🎸",
    description: "自分について話す表現",
    difficulty: 1,
    phrases: [
      { en: "I'm into music these days.", ja: "最近音楽にハマってる。" },
      { en: "I love taking photos.", ja: "写真を撮るのが好きなんだ。" },
      { en: "I play the guitar for fun.", ja: "趣味でギター弾いてます。" },
      { en: "I'm learning English now.", ja: "今英語を勉強してます。" },
      { en: "I go jogging every morning.", ja: "毎朝ジョギングしてます。" }
    ],
    unlocked: false,
    completed: false,
    gradient: "from-green-400 to-blue-400"
  },
  {
    id: 3,
    title: "感謝・謝罪",
    icon: "🙏",
    description: "感謝の気持ちや謝罪の表現",
    difficulty: 1,
    phrases: [
      { en: "Thanks a lot!", ja: "ありがとう！" },
      { en: "I really appreciate it.", ja: "本当に感謝してます。" },
      { en: "Sorry about that.", ja: "申し訳ありません。" },
      { en: "My bad.", ja: "私のせいです。" },
      { en: "No worries.", ja: "心配しないで。" }
    ],
    unlocked: false,
    completed: false,
    gradient: "from-pink-400 to-red-400"
  },
  {
    id: 4,
    title: "リアクション",
    icon: "😊",
    description: "相手の話に対する反応",
    difficulty: 1,
    phrases: [
      { en: "That's amazing!", ja: "すごいね！" },
      { en: "Sounds good!", ja: "いいね！" },
      { en: "I like that idea.", ja: "そのアイデアいいね。" },
      { en: "That makes sense.", ja: "なるほど。" },
      { en: "You're right.", ja: "その通りだね。" }
    ],
    unlocked: false,
    completed: false,
    gradient: "from-yellow-400 to-orange-400"
  },
  {
    id: 5,
    title: "お願い・依頼",
    icon: "🙌",
    description: "何かを頼む時の表現",
    difficulty: 2,
    phrases: [
      { en: "Can you help me?", ja: "手伝ってくれる？" },
      { en: "Could you say that again?", ja: "もう一度言ってくれる？" },
      { en: "Let's take a break.", ja: "休憩しましょう。" },
      { en: "Please wait a moment.", ja: "少し待ってください。" },
      { en: "Let's meet at 3.", ja: "3時に会いましょう。" }
    ],
    unlocked: false,
    completed: false,
    gradient: "from-teal-400 to-cyan-400"
  },
  {
    id: 6,
    title: "提案・同意",
    icon: "💡",
    description: "提案や同意を表す表現",
    difficulty: 2,
    phrases: [
      { en: "How about lunch?", ja: "昼食はどう？" },
      { en: "Let's do it!", ja: "やろう！" },
      { en: "I totally agree.", ja: "完全に同意します。" },
      { en: "That's a great idea!", ja: "それは素晴らしいアイデア！" },
      { en: "Why not?", ja: "なんでダメなの？" }
    ],
    unlocked: false,
    completed: false,
    gradient: "from-indigo-400 to-purple-400"
  },
  {
    id: 7,
    title: "感情・気持ち",
    icon: "💖",
    description: "感情や気持ちを表す表現",
    difficulty: 2,
    phrases: [
      { en: "I'm so excited!", ja: "とても興奮してる！" },
      { en: "I was nervous.", ja: "緊張していました。" },
      { en: "I feel happy today.", ja: "今日は幸せな気分。" },
      { en: "I'm a bit tired.", ja: "少し疲れてる。" },
      { en: "That made me smile.", ja: "それで笑顔になった。" }
    ],
    unlocked: false,
    completed: false,
    gradient: "from-rose-400 to-pink-400"
  },
  {
    id: 8,
    title: "カフェ・買い物",
    icon: "☕",
    description: "カフェや買い物での表現",
    difficulty: 2,
    phrases: [
      { en: "I'll have a coffee, please.", ja: "コーヒーをお願いします。" },
      { en: "Is this seat taken?", ja: "この席は空いてますか？" },
      { en: "How much is it?", ja: "いくらですか？" },
      { en: "Can I try this on?", ja: "これを試着できますか？" },
      { en: "Do you have this in a larger size?", ja: "これの大きいサイズはありますか？" }
    ],
    unlocked: false,
    completed: false,
    gradient: "from-amber-400 to-orange-400"
  },
  {
    id: 9,
    title: "学校・学び",
    icon: "📚",
    description: "学校や勉強に関する表現",
    difficulty: 3,
    phrases: [
      { en: "I'm studying hard.", ja: "一生懸命勉強してる。" },
      { en: "I finished my homework.", ja: "宿題を終わらせた。" },
      { en: "I have a test tomorrow.", ja: "明日テストがある。" },
      { en: "What does this word mean?", ja: "この単語の意味は？" },
      { en: "Let's study together.", ja: "一緒に勉強しよう。" }
    ],
    unlocked: false,
    completed: false,
    gradient: "from-emerald-400 to-teal-400"
  },
  {
    id: 10,
    title: "電話・連絡",
    icon: "📞",
    description: "電話や連絡に関する表現",
    difficulty: 3,
    phrases: [
      { en: "Can I call you later?", ja: "あとで電話してもいい？" },
      { en: "I'll text you.", ja: "メッセージ送るね。" },
      { en: "Sorry, I missed your call.", ja: "ごめん、電話に出れなかった。" },
      { en: "Let me check my schedule.", ja: "スケジュールを確認するね。" },
      { en: "I'll get back to you.", ja: "また連絡するね。" }
    ],
    unlocked: false,
    completed: false,
    gradient: "from-sky-400 to-blue-400"
  },
  {
    id: 11,
    title: "別れ・終了",
    icon: "👋",
    description: "別れの挨拶や終了の表現",
    difficulty: 3,
    phrases: [
      { en: "See you soon!", ja: "また近いうちに！" },
      { en: "Take care!", ja: "気をつけて！" },
      { en: "Have a good night!", ja: "おやすみなさい！" },
      { en: "It was nice talking to you.", ja: "話せて良かった。" },
      { en: "Let's talk again.", ja: "また話しましょう。" }
    ],
    unlocked: false,
    completed: false,
    gradient: "from-purple-400 to-indigo-400"
  },
  {
    id: 12,
    title: "応援・共感",
    icon: "💪",
    description: "応援や共感を表す表現",
    difficulty: 3,
    phrases: [
      { en: "You can do it!", ja: "君ならできる！" },
      { en: "I'm rooting for you.", ja: "応援してるよ！" },
      { en: "That sounds tough.", ja: "大変だったね。" },
      { en: "Hang in there!", ja: "頑張って！" },
      { en: "I'm proud of you!", ja: "誇りに思うよ！" }
    ],
    unlocked: false,
    completed: false,
    gradient: "from-violet-400 to-purple-400"
  }
]

export default function LearnPage() {
  const router = useRouter()
  const { state, dispatch } = useGame()
  const [dailyGoalProgress, setDailyGoalProgress] = useState(0)
  const [lessons, setLessons] = useState(learningCategories)
  
  // 進捗データを管理（実際のアプリでは API から取得）
  const [completedLessons, setCompletedLessons] = useState<number[]>([])
  const [isLoadingProgress, setIsLoadingProgress] = useState(false)

  // ローカルストレージから学習記録を読み込み
  useEffect(() => {
    const savedProgress = localStorage.getItem('pronunciation-completed-lessons')
    if (savedProgress) {
      const completed = JSON.parse(savedProgress)
      setCompletedLessons(completed)
    }
  }, [])

  // 学習記録の更新
  const updateLearningProgress = (lessonId: number) => {
    const newCompleted = [...completedLessons, lessonId]
    setCompletedLessons(newCompleted)
    localStorage.setItem('pronunciation-completed-lessons', JSON.stringify(newCompleted))
  }

  // 進捗の計算
  const calculateProgress = () => {
    const totalLessons = lessons.length
    const completedCount = completedLessons.length
    return Math.round((completedCount / totalLessons) * 100)
  }

  // デイリーゴールの計算
  const calculateDailyGoal = () => {
    const today = new Date().toDateString()
    const todayLessons = JSON.parse(localStorage.getItem(`daily-progress-${today}`) || '0')
    return Math.min(todayLessons * 20, 100) // 1レッスン = 20%
  }

  // レッスンの解放状態を更新
  const updateLessonAvailability = () => {
    const updatedLessons = lessons.map((lesson, index) => {
      const isCompleted = completedLessons.includes(lesson.id)
      const isUnlocked = index === 0 || completedLessons.includes(lessons[index - 1].id)
      
      return {
        ...lesson,
        completed: isCompleted,
        unlocked: isUnlocked
      }
    })
    
    setLessons(updatedLessons)
  }

  // 進捗が更新されたら解放状態を更新
  useEffect(() => {
    updateLessonAvailability()
    setDailyGoalProgress(calculateDailyGoal())
  }, [completedLessons])

  const handleLessonClick = (lesson: any) => {
    if (!lesson.unlocked) {
      return // ロックされたレッスンはクリックできない
    }

    // 発音練習ページに遷移
    router.push(`/pronunciation-practice/${lesson.id}`)
  }

  const handleResetProgress = () => {
    if (confirm('学習記録をリセットしますか？この操作は取り消せません。')) {
      setCompletedLessons([])
      localStorage.removeItem('pronunciation-completed-lessons')
      
      // 今日の進捗もリセット
      const today = new Date().toDateString()
      localStorage.removeItem(`daily-progress-${today}`)
      setDailyGoalProgress(0)
    }
  }

  const progress = calculateProgress()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      <TopBar />
      
      <div className="pt-16 pb-20 px-4">
        <div className="max-w-4xl mx-auto">
          
          {/* 進捗サマリー */}
          <div className="mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">学習進捗</h2>
                  <p className="text-gray-600">{completedLessons.length}/{lessons.length} カテゴリー完了</p>
                </div>
                <div className="flex items-center space-x-4">
                  <Badge variant="secondary" className="text-sm">
                    {progress}% 完了
                  </Badge>
                  <Button 
                    onClick={handleResetProgress}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    リセット
                  </Button>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">全体進捗</span>
                    <span className="text-sm text-gray-500">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">今日の目標</span>
                    <span className="text-sm text-gray-500">{dailyGoalProgress}%</span>
                  </div>
                  <Progress value={dailyGoalProgress} className="h-2 bg-green-100">
                    <div 
                      className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-300"
                      style={{ width: `${dailyGoalProgress}%` }}
                    />
                  </Progress>
                </div>
              </div>
            </Card>
          </div>

          {/* 学習カテゴリー */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {lessons.map((lesson) => (
              <Card 
                key={lesson.id}
                className={`p-6 cursor-pointer transform transition-all duration-300 hover:scale-105 ${
                  lesson.unlocked ? 'hover:shadow-lg' : 'opacity-50 cursor-not-allowed'
                } ${lesson.completed ? 'ring-2 ring-green-400' : ''}`}
                onClick={() => handleLessonClick(lesson)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl bg-gradient-to-r ${lesson.gradient}`}>
                      {lesson.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{lesson.title}</h3>
                      <p className="text-sm text-gray-600">{lesson.description}</p>
                    </div>
                  </div>
                  
                  {lesson.completed ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : lesson.unlocked ? (
                    <Play className="w-6 h-6 text-blue-500" />
                  ) : (
                    <Lock className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">難易度</span>
                    <div className="flex space-x-1">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full ${
                            i < lesson.difficulty ? 'bg-blue-500' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">フレーズ数</span>
                    <span className="text-sm text-gray-500">{lesson.phrases.length}個</span>
                  </div>
                </div>
                
                {lesson.unlocked && (
                  <div className="mt-4 flex items-center space-x-2">
                    <Mic className="w-4 h-4 text-blue-500" />
                    <span className="text-sm text-blue-600">発音練習開始</span>
                  </div>
                )}
              </Card>
            ))}
          </div>

          {/* 特典情報 */}
          <div className="mt-8">
            <Card className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                  <Gift className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">特典解放</h3>
                  <p className="text-sm text-gray-600">
                    3つのカテゴリーを完了すると特別な発音チャレンジが解放されます！
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
      
      <BottomNav />
    </div>
  )
}
