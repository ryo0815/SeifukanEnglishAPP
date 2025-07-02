"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { TopBar } from "@/components/layout/top-bar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AISpeakingPractice } from "@/components/ui/ai-speaking-practice"

import { useGame } from "@/contexts/game-context"
import { 
  ArrowLeft, 
  Volume2, 
  Mic, 
  Star, 
  Trophy,
  Target,
  CheckCircle,
  RotateCcw,
  Flame,
  Square
} from "lucide-react"

// 発音練習用のレッスンデータ（実際の音声ファイルに対応）
const pronunciationLessons = [
  {
    id: 1,
    title: "基本の挨拶",
    category: "greetings",
    icon: "👋",
    difficulty: 1,
    phrases: [
      { 
        id: 1,
        text: "Hello, how are you?", 
        meaning: "こんにちは、元気ですか？",
        phonetic: "/həˈloʊ, haʊ ɑːr juː/",
        audioFile: "/audio/hello-how-are-you.mp3", // 実際の音声ファイル
        tips: [
          "「Hello」は「ヘロー」ではなく「ハロー」に近い発音",
          "「how」の「ow」は「アウ」の音",
          "「are」は「アー」で短く",
          "「you」は「ユー」で伸ばす"
        ]
      },
      { 
        id: 2,
        text: "Nice to meet you", 
        meaning: "はじめまして",
        phonetic: "/naɪs tuː miːt juː/",
        audioFile: null, // 音声ファイルなし
        tips: [
          "「Nice」の「i」は「アイ」の音",
          "「meet」は「ミート」で長く",
          "全体的にスムーズに繋げて発音"
        ]
      },
      { 
        id: 3,
        text: "Good morning", 
        meaning: "おはようございます",
        phonetic: "/ɡʊd ˈmɔːrnɪŋ/",
        audioFile: null, // 音声ファイルなし
        tips: [
          "「Good」の「oo」は短い「ウ」",
          "「morning」の「or」は「オー」で長く",
          "「ing」は「イング」ではなく「イン」"
        ]
      },
      { 
        id: 4,
        text: "Have a nice day", 
        meaning: "良い一日を",
        phonetic: "/hæv ə naɪs deɪ/",
        audioFile: null, // 音声ファイルなし
        tips: [
          "「Have」の「a」は「ハ」の音",
          "「nice」の「i」は「アイ」",
          "「day」は「デイ」で二重母音"
        ]
      }
    ]
  }
]

export default function PronunciationPracticePage() {
  const router = useRouter()
  const params = useParams()
  const { dispatch } = useGame()
  const lessonId = parseInt(params.lessonId as string)
  
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0)
  const [completedPhrases, setCompletedPhrases] = useState<Set<number>>(new Set())
  const [lessonCompleted, setLessonCompleted] = useState(false)
  const [totalScore, setTotalScore] = useState(0)
  const [practiceMode, setPracticeMode] = useState<'guided' | 'free'>('guided')
  const [showNextButton, setShowNextButton] = useState(false)


  const lesson = pronunciationLessons[lessonId - 1]
  
  if (!lesson) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-6 text-center">
          <h2 className="text-xl font-bold mb-4">レッスンが見つかりません</h2>
          <Button onClick={() => router.push('/learn')}>
            学習ページに戻る
          </Button>
        </Card>
      </div>
    )
  }

  const currentPhrase = lesson.phrases[currentPhraseIndex]
  const progress = (completedPhrases.size / lesson.phrases.length) * 100

  const handlePhraseCompleted = (score: number) => {
    const newCompleted = new Set(completedPhrases)
    newCompleted.add(currentPhraseIndex)
    setCompletedPhrases(newCompleted)
    setTotalScore(prev => prev + score)

    // XP付与
    const xpGained = Math.floor(score / 10) * lesson.difficulty
    dispatch({ type: "GAIN_XP", amount: xpGained })

    // 次へ進むボタンを表示
    setShowNextButton(true)
  }

  const handleNextPhrase = () => {
    setShowNextButton(false)
    
    if (currentPhraseIndex < lesson.phrases.length - 1) {
      setCurrentPhraseIndex(prev => prev + 1)
    } else {
      // レッスン完了
      setLessonCompleted(true)
      // ボーナスXP
      const bonusXP = Math.floor(totalScore / lesson.phrases.length / 5) * lesson.difficulty
      dispatch({ type: "GAIN_XP", amount: bonusXP })
    }
  }

  const resetLesson = () => {
    setCurrentPhraseIndex(0)
    setCompletedPhrases(new Set())
    setLessonCompleted(false)
    setTotalScore(0)
  }

  const playAudio = (text: string) => {
    // "Hello, how are you?"の場合は音声ファイルを使用
    if (text === "Hello, how are you?") {
      const audio = new Audio("/audio/hello-how-are-you.mp3")
      audio.play().catch(error => {
        console.error('音声再生エラー:', error)
        // フォールバック: Web Speech API
        playWebSpeechAudio(text)
      })
    } else {
      // その他のテキストはWeb Speech APIを使用
      playWebSpeechAudio(text)
    }
  }

  const playWebSpeechAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'en-US'
      utterance.rate = 0.8
      speechSynthesis.speak(utterance)
    }
  }

  // お手本音声再生
  const playExampleAudio = () => {
    if (!currentPhrase) return

    // 実際の音声ファイルがある場合は再生
    if (currentPhrase.audioFile) {
      const audio = new Audio(currentPhrase.audioFile)
      audio.play().catch(error => {
        console.error('音声再生エラー:', error)
        // フォールバック: Web Speech API
        playWebSpeechExample()
      })
    } else {
      // 音声ファイルがない場合は無効化
      console.log('この音声はまだ準備中です。「Hello, how are you?」のみ利用可能です。')
    }
  }

  // Web Speech API でのお手本音声（フォールバック）
  const playWebSpeechExample = () => {
    if (!currentPhrase) return

    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentPhrase.text)
      utterance.lang = 'en-US'
      utterance.rate = 0.8
      utterance.pitch = 1
      speechSynthesis.speak(utterance)
    }
  }



  if (lessonCompleted) {
    const averageScore = totalScore / lesson.phrases.length
    const stars = Math.floor(averageScore / 25) + 1
    
    return (
      <div className="min-h-screen bg-gray-50">
        <TopBar />
        
        <div className="p-4 pb-20">
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              レッスン完了！
            </h1>
            <p className="text-gray-600 mb-6">
              {lesson.title}をマスターしました
            </p>

            {/* 結果カード */}
            <Card className="p-6 mb-6 bg-gradient-to-r from-green-500 to-green-600 text-white">
              <div className="text-center mb-4">
                <h2 className="text-xl font-bold mb-2">発音スコア</h2>
                <div className="text-4xl font-bold">{averageScore.toFixed(1)}</div>
                <div className="flex justify-center mt-2">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star 
                      key={i} 
                      className={`w-6 h-6 ${i < stars ? 'text-yellow-300 fill-current' : 'text-green-300'}`} 
                    />
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-lg font-bold">{lesson.phrases.length}</div>
                  <div className="text-xs opacity-90">練習フレーズ</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold">{Math.floor(totalScore / lesson.phrases.length / 5) * lesson.difficulty}</div>
                  <div className="text-xs opacity-90">獲得XP</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold">{stars}</div>
                  <div className="text-xs opacity-90">スター</div>
                </div>
              </div>
            </Card>

            {/* フレーズ復習 */}
            <Card className="p-4 mb-6">
              <h3 className="font-bold text-gray-800 mb-4">学習したフレーズ</h3>
              <div className="space-y-3">
                {lesson.phrases.map((phrase, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1 text-left">
                      <div className="font-medium text-gray-800">{phrase.text}</div>
                      <div className="text-sm text-gray-600">{phrase.meaning}</div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => playAudio(phrase.text)}
                    >
                      <Volume2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </Card>

            {/* アクションボタン */}
            <div className="space-y-3">
              <Button
                onClick={() => router.push('/learn')}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 rounded-xl"
              >
                <Trophy className="w-5 h-5 mr-2" />
                次のレッスンへ
              </Button>
              
              <Button
                onClick={resetLesson}
                variant="outline"
                className="w-full py-3"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                もう一度練習
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />
      
      <div className="p-4 pb-20">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push('/learn')}
            className="p-2"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          
          <div className="text-center flex-1">
            <h1 className="text-lg font-bold text-gray-800">{lesson.title}</h1>
            <div className="flex items-center justify-center space-x-2 mt-1">
              <Badge className="bg-blue-100 text-blue-800">
                レベル {lesson.difficulty}
              </Badge>
              <span className="text-sm text-gray-600">
                {currentPhraseIndex + 1} / {lesson.phrases.length}
              </span>
            </div>
          </div>
          
          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* 進捗バー */}
        <Card className="p-4 mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">レッスン進捗</span>
            <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </Card>

        {/* 現在のフレーズカード */}
        <Card className="p-6 mb-6 bg-gradient-to-r from-indigo-50 to-purple-50">
          <div className="text-center mb-6">
            <div className="text-4xl mb-4">{lesson.icon}</div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              {currentPhrase.text}
            </h2>
            <p className="text-gray-600 mb-3">{currentPhrase.meaning}</p>
            <p className="text-sm text-gray-500 mb-4">{currentPhrase.phonetic}</p>
            
            <Button
              onClick={() => playAudio(currentPhrase.text)}
              className="mb-4"
              variant="outline"
            >
              <Volume2 className="w-4 h-4 mr-2" />
              お手本を聞く
            </Button>
            
            <div className="bg-blue-50 p-3 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Target className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-blue-800">発音のコツ</span>
              </div>
              <div className="space-y-1">
                {currentPhrase.tips.slice(0, 2).map((tip, index) => (
                  <p key={index} className="text-sm text-blue-700">• {tip}</p>
                ))}
              </div>
            </div>
          </div>
        </Card>



        {/* 練習モード切替 */}
        <Card className="p-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-700">練習モード</span>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant={practiceMode === 'guided' ? 'default' : 'outline'}
                onClick={() => setPracticeMode('guided')}
              >
                ガイド付き
              </Button>
              <Button
                size="sm"
                variant={practiceMode === 'free' ? 'default' : 'outline'}
                onClick={() => setPracticeMode('free')}
              >
                自由練習
              </Button>
            </div>
          </div>
        </Card>

        {/* 完了済みフレーズ表示 */}
        {completedPhrases.size > 0 && (
          <Card className="p-4">
            <h3 className="font-bold text-gray-800 mb-3">完了したフレーズ</h3>
            <div className="space-y-2">
              {lesson.phrases.map((phrase, index) => (
                completedPhrases.has(index) && (
                  <div key={index} className="flex items-center p-2 bg-green-50 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                    <span className="text-sm text-green-800">{phrase.text}</span>
                  </div>
                )
              ))}
            </div>
          </Card>
        )}

        {/* お手本音声再生 */}
        <Card className="p-6 mb-6 bg-gradient-to-r from-green-500 to-green-600 text-white">
          <div className="text-center">
            <h3 className="text-lg font-bold mb-4">お手本を聞く</h3>
            <Button
              onClick={playExampleAudio}
              disabled={!currentPhrase?.audioFile}
              className="bg-white text-green-600 hover:bg-green-50 font-bold py-3 px-6 rounded-full"
            >
              <Volume2 className="w-5 h-5 mr-2" />
              {currentPhrase?.audioFile ? 'お手本を再生' : '音声準備中'}
            </Button>
            {!currentPhrase?.audioFile && (
              <p className="text-sm mt-2 text-green-100">
                現在「Hello, how are you?」のみ利用可能
              </p>
            )}
          </div>
        </Card>

        {/* 発音のコツ */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2 text-blue-500" />
            発音のコツ
          </h3>
          <div className="space-y-2">
            {currentPhrase?.tips.map((tip, index) => (
              <div key={index} className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                <p className="text-gray-700">{tip}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* AI発音評価セクション */}
        <Card className="p-6 mb-6">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <Mic className="w-5 h-5 mr-2 text-red-500" />
            AI発音評価
          </h3>
          
          {currentPhrase?.audioFile ? (
            <AISpeakingPractice
              targetText={currentPhrase.text}
              targetPhonetic={currentPhrase.phonetic}
              targetMeaning={currentPhrase.meaning}
              evaluationType="pronunciation"
              onComplete={handlePhraseCompleted}
            />
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <Mic className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 font-medium">音声評価準備中</p>
              <p className="text-sm text-gray-500 mt-1">
                現在「Hello, how are you?」のみ利用可能
              </p>
            </div>
          )}
        </Card>

        {/* 次へ進むボタン */}
        {showNextButton && (
          <Card className="p-6 mb-6 bg-gradient-to-r from-green-500 to-green-600 text-white">
            <div className="text-center">
              <CheckCircle className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-lg font-bold mb-2">評価完了！</h3>
              <p className="text-sm mb-4 opacity-90">
                {currentPhraseIndex < lesson.phrases.length - 1 
                  ? '次のフレーズに進みますか？' 
                  : 'レッスンを完了しますか？'}
              </p>
              <Button
                onClick={handleNextPhrase}
                className="bg-white text-green-600 hover:bg-green-50 font-bold py-3 px-6 rounded-full"
              >
                {currentPhraseIndex < lesson.phrases.length - 1 ? (
                  <>
                    次のフレーズへ
                    <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                  </>
                ) : (
                  <>
                    レッスン完了
                    <Trophy className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
} 