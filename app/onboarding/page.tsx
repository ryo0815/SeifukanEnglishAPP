"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { GreenBirdLogo } from "@/components/ui/green-bird-logo"
import { ChevronRight, Target, Trophy } from "lucide-react"

const onboardingSteps = [
  {
    title: "OwlLearnへようこそ！",
    description: "楽しくインタラクティブな方法で英語を学びましょう。ゲーム化されたレッスンでスキルを段階的に身につけます。",
    icon: <GreenBirdLogo className="w-20 h-20" />,
    color: "from-green-400 to-green-600",
  },
  {
    title: "デイリーゴールを設定",
    description: "毎日どのくらいの時間を学習に使いたいですか？",
    icon: <Target className="w-20 h-20 text-blue-500" />,
    color: "from-blue-400 to-blue-600",
    options: [
      { label: "5分", value: 5, description: undefined },
      { label: "10分", value: 10, description: undefined },
      { label: "15分", value: 15, description: undefined },
      { label: "20分", value: 20, description: undefined },
    ],
  },
  {
    title: "レベルを選択",
    description: "あなたの英語レベルに合わせてレッスンをカスタマイズします。",
    icon: <Trophy className="w-20 h-20 text-yellow-500" />,
    color: "from-yellow-400 to-yellow-600",
    options: [
      { label: "初級", value: "beginner", description: "英語を始めたばかり" },
      { label: "中級", value: "intermediate", description: "基本的な会話を理解できる" },
      { label: "上級", value: "advanced", description: "スキルを完璧にしたい" },
    ],
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedGoal, setSelectedGoal] = useState<number | null>(null)
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null)

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      // Complete onboarding
      localStorage.setItem("owllearn-onboarding-complete", "true")
      localStorage.setItem("owllearn-daily-goal", selectedGoal?.toString() || "10")
      localStorage.setItem("owllearn-level", selectedLevel || "beginner")
      router.push("/auth/signin")
    }
  }

  const canProceed = () => {
    if (currentStep === 0) return true
    if (currentStep === 1) return selectedGoal !== null
    if (currentStep === 2) return selectedLevel !== null
    return false
  }

  const step = onboardingSteps[currentStep]

  return (
    <div className={`min-h-screen bg-gradient-to-b ${step.color} flex flex-col`}>
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-white">
        <div className="w-full max-w-sm">
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm mb-2">
              <span>
                ステップ {currentStep + 1} / {onboardingSteps.length}
              </span>
              <span>{Math.round(((currentStep + 1) / onboardingSteps.length) * 100)}%</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div
                className="bg-white rounded-full h-2 transition-all duration-500"
                style={{ width: `${((currentStep + 1) / onboardingSteps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Content */}
          <div className="text-center animate-slide-up">
            <div className="flex justify-center mb-6">{step.icon}</div>

            <h1 className="text-2xl font-bold mb-4">{step.title}</h1>
            <p className="text-white/90 mb-8">{step.description}</p>

            {/* Options */}
            {step.options && (
              <div className="space-y-3 mb-8">
                {step.options.map((option) => (
                  <Card
                    key={option.value}
                    className={`p-4 cursor-pointer transition-all duration-200 ${
                      (currentStep === 1 && selectedGoal === option.value) ||
                      (currentStep === 2 && selectedLevel === option.value)
                        ? "bg-white text-gray-900 shadow-lg"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                    onClick={() => {
                      if (currentStep === 1) setSelectedGoal(option.value as number)
                      if (currentStep === 2) setSelectedLevel(option.value as string)
                    }}
                  >
                    <div className="text-left">
                      <div className="font-semibold">{option.label}</div>
                      {option.description && <div className="text-sm opacity-75 mt-1">{option.description}</div>}
                    </div>
                  </Card>
                ))}
              </div>
            )}

            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="w-full bg-white text-gray-900 hover:bg-gray-100 font-semibold py-3 rounded-xl"
            >
              {currentStep === onboardingSteps.length - 1 ? "始める" : "続行"}
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
