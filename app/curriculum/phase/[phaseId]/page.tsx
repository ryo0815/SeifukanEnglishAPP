"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { TopBar } from "@/components/layout/top-bar"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AISpeakingPractice } from "@/components/ui/ai-speaking-practice"
import { useGame } from "@/contexts/game-context"
import { 
  ArrowLeft,
  Play,
  CheckCircle,
  Lock,
  Mic,
  Star,
  Trophy,
  Volume2
} from "lucide-react"

// フェーズ別ステージデータ
const phaseData = {
  1: {
    title: "基礎発音 & 自信構築",
    description: "英語の音に慣れ、自信を持って発声する",
    color: "from-blue-400 to-blue-600",
    stages: [
      {
        id: 1,
        title: "英語の音を知る",
        description: "英語特有の音の基礎を理解し、発音に慣れる",
        goal: "基本的な英語の音素を正確に発音できる",
        unlocked: true,
        completed: false,
        phrases: [
          { text: "Hello, how are you?", difficulty: 1 },
          { text: "Nice to meet you", difficulty: 1 },
          { text: "Thank you very much", difficulty: 2 },
          { text: "Excuse me", difficulty: 1 },
          { text: "I'm sorry", difficulty: 1 }
        ]
      },
      {
        id: 2,
        title: "日常挨拶マスター",
        description: "基本的な挨拶表現を自然に発音する",
        goal: "日常的な挨拶を自信を持って言える",
        unlocked: false,
        completed: false,
        phrases: [
          { text: "Good morning", difficulty: 1 },
          { text: "Have a nice day", difficulty: 2 },
          { text: "See you later", difficulty: 1 },
          { text: "Take care", difficulty: 2 },
          { text: "How's it going?", difficulty: 2 }
        ]
      }
    ]
  },
  2: {
    title: "実用表現 & コミュニケーション基礎",
    description: "日常生活で使える実践的な表現を習得",
    color: "from-green-400 to-green-600",
    stages: [
      {
        id: 1,
        title: "お店での注文",
        description: "カフェやレストランでの基本的な注文表現",
        goal: "自信を持って注文ができる",
        unlocked: false,
        completed: false,
        phrases: [
          { text: "Can I have a coffee, please?", difficulty: 2 },
          { text: "I'll take this one", difficulty: 2 },
          { text: "How much is it?", difficulty: 1 },
          { text: "Here you are", difficulty: 1 },
          { text: "Keep the change", difficulty: 2 }
        ]
      },
      {
        id: 2,
        title: "道案内・場所",
        description: "道を尋ねる・教える基本表現",
        goal: "道案内の基本的なやり取りができる",
        unlocked: false,
        completed: false,
        phrases: [
          { text: "Excuse me, where is the station?", difficulty: 3 },
          { text: "Go straight and turn left", difficulty: 3 },
          { text: "It's about 5 minutes walk", difficulty: 3 },
          { text: "You can't miss it", difficulty: 2 },
          { text: "Thank you for your help", difficulty: 2 }
        ]
      }
    ]
  }
}

export default function PhasePage() {
  const router = useRouter()
  const params = useParams()
  const { state, dispatch } = useGame()
  const phaseId = parseInt(params.phaseId as string)
  
  const [currentStage, setCurrentStage] = useState(1)
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0)
  const [practiceMode, setPracticeMode] = useState(false)
  const [stageProgress, setStageProgress] = useState<Record<number, number>>({
    1: 20, // モック進捗
    2: 0
  })

  const phase = phaseData[phaseId as keyof typeof phaseData]
  
  if (!phase) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">フェーズが見つかりません</h1>
          <Button onClick={() => router.push('/curriculum')}>
            カリキュラムに戻る
          </Button>
        </div>
      </div>
    )
  }

  const handleStageClick = (stageId: number) => {
    const stage = phase.stages.find(s => s.id === stageId)
    if (stage?.unlocked) {
      setCurrentStage(stageId)
      setCurrentPhraseIndex(0)
      setPracticeMode(true)
    }
  }

  const handlePracticeComplete = (results: any) => {
    // 発音練習完了後の処理
    const stage = phase.stages.find(s => s.id === currentStage)
    if (stage) {
      // 進捗を更新
      setStageProgress(prev => ({
        ...prev,
        [currentStage]: Math.min((prev[currentStage] || 0) + 20, 100)
      }))
      
      // XP 付与
      const bonusXp = Math.round(results.overallScore || 0)
      dispatch({ type: "GAIN_XP", amount: bonusXp })
      
      // 次のフレーズに進む
      if (currentPhraseIndex < stage.phrases.length - 1) {
        setCurrentPhraseIndex(prev => prev + 1)
      } else {
        // ステージ完了
        setPracticeMode(false)
        setCurrentPhraseIndex(0)
        
        // 次のステージを解放
        if (stageProgress[currentStage] >= 100) {
          const nextStage = phase.stages.find(s => s.id === currentStage + 1)
          if (nextStage) {
            nextStage.unlocked = true
          }
        }
      }
    }
  }

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1: return "bg-green-100 text-green-800"
      case 2: return "bg-yellow-100 text-yellow-800"
      case 3: return "bg-orange-100 text-orange-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  if (practiceMode) {
    const stage = phase.stages.find(s => s.id === currentStage)
    const currentPhrase = stage?.phrases[currentPhraseIndex]
    
    if (!currentPhrase) return null

    return (
      <div className="min-h-screen bg-gray-50">
        <TopBar />
        
        <div className="p-4 pb-20">
          <div className="flex items-center justify-between mb-6">
            <Button
              variant="ghost"
              onClick={() => setPracticeMode(false)}
              className="p-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            
            <div className="text-center">
              <h2 className="font-bold text-gray-800">{stage.title}</h2>
              <div className="text-sm text-gray-600">
                フレーズ {currentPhraseIndex + 1} / {stage.phrases.length}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge className={getDifficultyColor(currentPhrase.difficulty)}>
                レベル {currentPhrase.difficulty}
              </Badge>
            </div>
          </div>

                     <AISpeakingPractice
             targetText={currentPhrase.text}
             targetMeaning={`フレーズの意味: ${currentPhrase.text}`}
             onComplete={(score) => handlePracticeComplete({ overallScore: score })}
           />
        </div>
        
        <BottomNav />
      </div>
    )
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
            <h1 className="text-xl font-bold text-gray-800">
              フェーズ {phaseId}: {phase.title}
            </h1>
            <p className="text-sm text-gray-600">{phase.description}</p>
          </div>
        </div>

        {/* 進捗サマリー */}
        <Card className={`p-6 mb-6 bg-gradient-to-r ${phase.color} text-white`}>
          <div className="text-center mb-4">
            <h2 className="text-lg font-bold mb-2">フェーズ進捗</h2>
            <div className="text-3xl font-bold">
              {Math.round(Object.values(stageProgress).reduce((a, b) => a + b, 0) / phase.stages.length)}%
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-lg font-bold">{phase.stages.length}</div>
              <div className="text-xs opacity-90">ステージ数</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold">
                {phase.stages.reduce((acc, stage) => acc + stage.phrases.length, 0)}
              </div>
              <div className="text-xs opacity-90">練習フレーズ</div>
            </div>
          </div>
        </Card>

        {/* ステージ一覧 */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800">ステージ</h2>
          
          {phase.stages.map((stage, index) => {
            const progress = stageProgress[stage.id] || 0
            const isUnlocked = stage.unlocked
            const isCompleted = progress >= 100
            
            return (
              <Card 
                key={stage.id}
                className={`p-4 transition-all duration-300 ${
                  isUnlocked 
                    ? 'cursor-pointer hover:shadow-lg border-2 border-transparent hover:border-blue-300' 
                    : 'opacity-60 cursor-not-allowed'
                }`}
                onClick={() => handleStageClick(stage.id)}
              >
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      isCompleted 
                        ? 'bg-green-100' 
                        : isUnlocked 
                        ? 'bg-blue-100' 
                        : 'bg-gray-100'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6 text-green-600" />
                      ) : isUnlocked ? (
                        <Play className="w-6 h-6 text-blue-600" />
                      ) : (
                        <Lock className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    
                    {index < phase.stages.length - 1 && (
                      <div className="absolute top-12 left-1/2 w-0.5 h-8 bg-gray-200 transform -translate-x-1/2"></div>
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-bold text-gray-800">{stage.title}</h3>
                      {isCompleted && (
                        <Badge className="bg-green-100 text-green-800">完了</Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{stage.description}</p>
                    <p className="text-xs text-blue-600 mb-3">🎯 {stage.goal}</p>
                    
                    {isUnlocked && (
                      <div className="mb-3">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>進捗状況</span>
                          <span>{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Volume2 className="w-3 h-3" />
                          <span>{stage.phrases.length} フレーズ</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="w-3 h-3" />
                          <span>
                            {stage.phrases.reduce((acc, p) => acc + p.difficulty * 5, 0)} XP
                          </span>
                        </div>
                      </div>
                      
                      {isUnlocked && !isCompleted && (
                        <Button size="sm" className="text-xs">
                          <Mic className="w-3 h-3 mr-1" />
                          練習開始
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      <BottomNav />
    </div>
  )
} 