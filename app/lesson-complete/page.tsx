"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Trophy, Star, Zap, ArrowRight } from "lucide-react"
import { useGame } from "@/contexts/game-context"
import { useSound } from "@/contexts/sound-context"

export default function LessonCompletePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { state } = useGame()
  const { playSound } = useSound()

  const [showAnimation, setShowAnimation] = useState(false)

  const stage = searchParams.get("stage")
  const subStage = searchParams.get("substage")
  const mistakes = Number.parseInt(searchParams.get("mistakes") || "0")

  const xpEarned = mistakes === 0 ? 15 : 10 // Bonus for perfect score
  const isPerfect = mistakes === 0

  // Check if this completion unlocks next stage
  const currentStageNum = Number(stage)
  const currentSubStageNum = Number(subStage)
  const isLastSubStage = currentSubStageNum === 5
  const nextStageUnlocked = isLastSubStage

  // Check current stage completion
  const currentStageCompleted = Array.from({ length: 5 }, (_, i) => i + 1)
    .every(subStageIndex => 
      state.completedLessons.has(`${currentStageNum}-${subStageIndex}`) || 
      (currentStageNum === Number(stage) && subStageIndex === Number(subStage))
    )

  useEffect(() => {
    setShowAnimation(true)
    playSound("complete")
  }, [playSound])

  const handleContinue = () => {
    router.push("/learn")
  }

  const getStageTheme = (stageNum: number) => {
    const themes = {
      1: "学校",
      2: "家族", 
      3: "食べ物",
      4: "家",
      5: "天気"
    }
    return themes[stageNum as keyof typeof themes] || "英語"
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-400 to-green-600 flex items-center justify-center p-6">
      <Card className="w-full max-w-sm p-8 text-center bg-white rounded-3xl shadow-2xl">
        <div className={`transition-all duration-1000 ${showAnimation ? "animate-bounce-in" : "opacity-0 scale-50"}`}>
          {/* Trophy Icon */}
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto bg-yellow-100 rounded-full flex items-center justify-center mb-4">
              <Trophy className="w-12 h-12 text-yellow-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {currentStageCompleted ? "ステージ完了!" : "レッスン完了!"}
            </h1>
            <p className="text-gray-600">
              ステージ {stage} - レッスン {subStage} ({getStageTheme(currentStageNum)})
            </p>
            {currentStageCompleted && (
              <p className="text-green-600 font-semibold mt-2">
                🎉 ステージ {currentStageNum} を完全クリア!
              </p>
            )}
          </div>

          {/* Stage Progress or Unlock Notification */}
          {nextStageUnlocked && currentStageCompleted && (
            <div className="mb-6 p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
              <div className="flex items-center justify-center mb-2">
                <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                  <Star className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="font-bold text-blue-800 mb-1">新しいステージがアンロック!</h3>
              <p className="text-sm text-blue-600">
                ステージ {currentStageNum + 1}: {getStageTheme(currentStageNum + 1)}
              </p>
            </div>
          )}

          {/* Results */}
          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800">XP Earned</span>
              </div>
              <span className="text-2xl font-bold text-green-600">+{xpEarned}</span>
            </div>

            {isPerfect && (
              <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-xl">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-yellow-600" />
                  <span className="font-medium text-yellow-800">Perfect!</span>
                </div>
                <span className="text-sm font-bold text-yellow-600">+5 Bonus XP</span>
              </div>
            )}

            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="text-sm text-gray-600 mb-1">Accuracy</div>
              <div className="text-2xl font-bold text-gray-800">{Math.round(((6 - mistakes) / 6) * 100)}%</div>
            </div>
          </div>

          {/* Continue Button */}
          <Button
            onClick={handleContinue}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl shadow-lg"
          >
            {nextStageUnlocked && currentStageCompleted 
              ? `ステージ ${currentStageNum + 1} を開始`
              : "学習を続ける"
            }
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </Card>
    </div>
  )
}
