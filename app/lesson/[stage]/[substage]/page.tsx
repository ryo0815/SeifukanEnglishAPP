"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { SoundButton } from "@/components/ui/sound-button"
import { AISpeakingPractice } from "@/components/ui/ai-speaking-practice"
import { useGame } from "@/contexts/game-context"
import { useSound } from "@/contexts/sound-context"
import { X, Check } from "lucide-react"
import { ProgressCircle } from "@/components/ui/progress-circle"

// Mock question data - in real app this would come from database
const generateQuestions = (stage: number, subStage: number) => {
  // Stage-based vocabulary progression
  const vocabularyByStage = {
    1: [
      { en: "school", ja: "学校", phonetic: "skuːl" },
      { en: "student", ja: "生徒", phonetic: "ˈstuːdənt" },
      { en: "teacher", ja: "先生", phonetic: "ˈtiːtʃər" },
      { en: "book", ja: "本", phonetic: "bʊk" },
      { en: "pen", ja: "ペン", phonetic: "pen" },
    ],
    2: [
      { en: "family", ja: "家族", phonetic: "ˈfæməli" },
      { en: "mother", ja: "母", phonetic: "ˈmʌðər" },
      { en: "father", ja: "父", phonetic: "ˈfɑːðər" },
      { en: "sister", ja: "姉妹", phonetic: "ˈsɪstər" },
      { en: "brother", ja: "兄弟", phonetic: "ˈbrʌðər" },
    ],
    3: [
      { en: "food", ja: "食べ物", phonetic: "fuːd" },
      { en: "apple", ja: "りんご", phonetic: "ˈæpəl" },
      { en: "bread", ja: "パン", phonetic: "bred" },
      { en: "water", ja: "水", phonetic: "ˈwɔːtər" },
      { en: "coffee", ja: "コーヒー", phonetic: "ˈkɔːfi" },
    ],
    4: [
      { en: "house", ja: "家", phonetic: "haʊs" },
      { en: "room", ja: "部屋", phonetic: "ruːm" },
      { en: "kitchen", ja: "台所", phonetic: "ˈkɪtʃən" },
      { en: "bedroom", ja: "寝室", phonetic: "ˈbedruːm" },
      { en: "bathroom", ja: "浴室", phonetic: "ˈbæθruːm" },
    ],
    5: [
      { en: "weather", ja: "天気", phonetic: "ˈweðər" },
      { en: "sunny", ja: "晴れ", phonetic: "ˈsʌni" },
      { en: "rainy", ja: "雨", phonetic: "ˈreɪni" },
      { en: "cloudy", ja: "曇り", phonetic: "ˈklaʊdi" },
      { en: "snowy", ja: "雪", phonetic: "ˈsnoʊi" },
    ],
  }

  // Stage-based sentences
  const sentencesByStage = {
    1: [
      { en: "I go to school every day", ja: "私は毎日学校に行きます" },
      { en: "The student is reading a book", ja: "生徒が本を読んでいます" },
      { en: "My teacher is very kind", ja: "私の先生はとても親切です" },
      { en: "I like to study English", ja: "私は英語を勉強するのが好きです" },
      { en: "Please give me a pen", ja: "ペンをください" },
    ],
    2: [
      { en: "I love my family", ja: "私は家族を愛しています" },
      { en: "My mother cooks dinner", ja: "母が夕食を作ります" },
      { en: "My father works hard", ja: "父は一生懸命働きます" },
      { en: "I have one sister", ja: "私には姉が一人います" },
      { en: "My brother plays soccer", ja: "兄はサッカーをします" },
    ],
    3: [
      { en: "I like to eat apples", ja: "私はりんごを食べるのが好きです" },
      { en: "Bread is delicious", ja: "パンは美味しいです" },
      { en: "I drink water every day", ja: "私は毎日水を飲みます" },
      { en: "Coffee smells good", ja: "コーヒーはいい匂いがします" },
      { en: "Food is important for health", ja: "食べ物は健康に大切です" },
    ],
    4: [
      { en: "My house is small", ja: "私の家は小さいです" },
      { en: "This room is comfortable", ja: "この部屋は快適です" },
      { en: "I cook in the kitchen", ja: "私は台所で料理をします" },
      { en: "I sleep in my bedroom", ja: "私は寝室で寝ます" },
      { en: "The bathroom is clean", ja: "浴室はきれいです" },
    ],
    5: [
      { en: "The weather is nice today", ja: "今日は天気がいいです" },
      { en: "It is sunny outside", ja: "外は晴れています" },
      { en: "I like rainy days", ja: "私は雨の日が好きです" },
      { en: "The sky is cloudy", ja: "空は曇っています" },
      { en: "It is snowy in winter", ja: "冬は雪が降ります" },
    ],
  }

  // Get vocabulary and sentences for current stage
  const currentVocab = vocabularyByStage[stage as keyof typeof vocabularyByStage] || vocabularyByStage[1]
  const currentSentences = sentencesByStage[stage as keyof typeof sentencesByStage] || sentencesByStage[1]
  
  // Select words and sentences based on substage
  const word1 = currentVocab[subStage - 1] || currentVocab[0]
  const word2 = currentVocab[subStage % currentVocab.length]
  const sentence = currentSentences[subStage - 1] || currentSentences[0]
  
  // Generate distractors from other stages for difficulty
  const allVocab = Object.values(vocabularyByStage).flat()
  const distractors = allVocab
    .filter(v => v.ja !== word1.ja && v.ja !== word2.ja)
    .slice(0, 3)
    .map(v => v.ja)

  return [
    {
      id: 1,
      type: "MEANING_MC",
      data: {
        prompt: word1.en,
        options: [word1.ja, ...distractors.slice(0, 3)],
        answer: word1.ja,
        audio: word1.en,
      },
    },
    {
      id: 2,
      type: "LISTENING_MC",
      data: {
        text: word2.en,
        options: [word2.ja, ...distractors.slice(1, 4)],
        answer: word2.ja,
        instruction: "音声を聞いて、正しい意味を選んでください",
      },
    },
    {
      id: 3,
      type: "WORD_ORDER",
      data: {
        prompt: "並べ替えて正しい英文にしてください:",
        words: sentence.en.split(' '),
        answer: sentence.en,
        translation: sentence.ja,
      },
    },
    {
      id: 4,
      type: "TYPE_HEAR",
      data: {
        text: word1.en,
        answer: word1.en.toLowerCase(),
        instruction: "音声を聞いて、聞こえた単語をタイプしてください",
        hints: `ヒント: ${word1.ja}`,
      },
    },
    {
      id: 5,
      type: "SENTENCE_LISTENING",
      data: {
        text: sentence.en,
        options: [sentence.ja, ...currentSentences.slice(1, 4).map(s => s.ja)],
        answer: sentence.ja,
        instruction: "文章を聞いて、正しい意味を選んでください",
      },
    },
    {
      id: 6,
      type: "PHONETIC_PRACTICE",
      data: {
        text: word1.en,
        phonetic: word1.phonetic,
        meaning: word1.ja,
        answer: "completed", // Always correct when completed
        instruction: "発音記号を参考に、正しく発音してみましょう",
      },
    },
    {
      id: 7,
      type: "SENTENCE_SPEAKING",
      data: {
        text: sentence.en,
        meaning: sentence.ja,
        answer: "completed",
        instruction: "以下の文章を正しい発音と文法で読んでください",
      },
    },
  ]
}

export default function LessonPage() {
  const router = useRouter()
  const params = useParams()
  const { state, dispatch } = useGame()
  const { playSound } = useSound()

  const stage = Number.parseInt(params.stage as string)
  const subStage = Number.parseInt(params.substage as string)

  const [questions] = useState(() => generateQuestions(stage, subStage))
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [userInput, setUserInput] = useState("")
  const [wordOrderAnswer, setWordOrderAnswer] = useState<string[]>([])
  const [mistakes, setMistakes] = useState(0)

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  useEffect(() => {
    if (state.hearts <= 0) {
      router.push("/shop")
    }
  }, [state.hearts, router])

  const handleAnswer = (answer: string) => {
    if (showResult) return

    setSelectedAnswer(answer)
    const correct = answer === currentQuestion.data.answer
    setIsCorrect(correct)
    setShowResult(true)

    if (correct) {
      playSound("correct")
      dispatch({ type: "GAIN_XP", amount: 10 })
    } else {
      playSound("incorrect")
      dispatch({ type: "LOSE_HEART" })
      setMistakes((prev) => prev + 1)
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
      setSelectedAnswer(null)
      setShowResult(false)
      setUserInput("")
      setWordOrderAnswer([])
    } else {
      // Lesson complete
      const lessonId = `${stage}-${subStage}`
      dispatch({ type: "COMPLETE_LESSON", lessonId })

      // Bonus XP for perfect score
      if (mistakes === 0) {
        dispatch({ type: "GAIN_XP", amount: 5 })
      }

      playSound("complete")
      router.push(`/lesson-complete?stage=${stage}&substage=${subStage}&mistakes=${mistakes}`)
    }
  }

  const renderQuestion = () => {
    switch (currentQuestion.type) {
      case "MEANING_MC":
        return (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800">{currentQuestion.data.prompt}</p>
              {currentQuestion.data.audio && (
                <div className="mt-4">
                  <SoundButton text={currentQuestion.data.audio} className="mx-auto" />
                </div>
              )}
            </div>

            <div className="space-y-3">
              {currentQuestion.data.options?.map((option: string, index: number) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  disabled={showResult}
                  className={`option-button ${
                    showResult
                      ? option === currentQuestion.data.answer
                        ? "correct"
                        : option === selectedAnswer
                          ? "incorrect"
                          : ""
                      : selectedAnswer === option
                        ? "selected"
                        : ""
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )

      case "LISTENING_MC":
        return (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-lg font-medium text-gray-700 mb-4">
                {currentQuestion.data.instruction || "音声を聞いて、正しい意味を選んでください"}
              </p>
              <SoundButton text={currentQuestion.data.text} autoPlay className="mx-auto mb-4" />
              <p className="text-sm text-gray-500">🔄 音声ボタンをクリックしてもう一度聞けます</p>
            </div>

            <div className="space-y-3">
              {currentQuestion.data.options?.map((option: string, index: number) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  disabled={showResult}
                  className={`option-button ${
                    showResult
                      ? option === currentQuestion.data.answer
                        ? "correct"
                        : option === selectedAnswer
                          ? "incorrect"
                          : ""
                      : selectedAnswer === option
                        ? "selected"
                        : ""
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )

      case "SENTENCE_LISTENING":
        return (
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-lg font-medium text-gray-700 mb-4">
                {currentQuestion.data.instruction || "文章を聞いて、正しい意味を選んでください"}
              </p>
              <SoundButton 
                text={currentQuestion.data.text} 
                autoPlay 
                rate={0.7} 
                className="mx-auto mb-4" 
              />
              <p className="text-sm text-gray-500">🔄 音声ボタンをクリックしてもう一度聞けます</p>
            </div>

            <div className="space-y-3">
              {currentQuestion.data.options?.map((option: string, index: number) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  disabled={showResult}
                  className={`option-button ${
                    showResult
                      ? option === currentQuestion.data.answer
                        ? "correct"
                        : option === selectedAnswer
                          ? "incorrect"
                          : ""
                      : selectedAnswer === option
                        ? "selected"
                        : ""
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        )

      case "WORD_ORDER":
        return (
          <div className="space-y-6">
            <p className="text-lg font-medium text-gray-700 text-center">{currentQuestion.data.prompt}</p>
            {currentQuestion.data.translation && (
              <p className="text-sm text-gray-500 text-center">意味: {currentQuestion.data.translation}</p>
            )}

            {/* Current answer area */}
            <div className="min-h-[60px] p-4 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50">
              <div className="flex flex-wrap gap-2">
                {wordOrderAnswer.map((word, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      const newAnswer = [...wordOrderAnswer]
                      newAnswer.splice(index, 1)
                      setWordOrderAnswer(newAnswer)
                    }}
                    className="px-3 py-2 bg-blue-500 text-white rounded-lg font-medium"
                  >
                    {word}
                  </button>
                ))}
              </div>
            </div>

            {/* Available words */}
            <div className="flex flex-wrap gap-2 justify-center">
              {currentQuestion.data.words
                ?.filter((word: string) => !wordOrderAnswer.includes(word))
                .map((word: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setWordOrderAnswer([...wordOrderAnswer, word])}
                    className="px-4 py-2 bg-white border-2 border-gray-300 rounded-lg font-medium hover:border-blue-400 transition-colors"
                  >
                    {word}
                  </button>
                ))}
            </div>

            {wordOrderAnswer.length === (currentQuestion.data.words?.length || 0) && !showResult && (
              <Button
                onClick={() => handleAnswer(wordOrderAnswer.join(" "))}
                className="w-full bg-green-500 hover:bg-green-600"
              >
                答えを確認
              </Button>
            )}
          </div>
        )

      case "TYPE_HEAR":
        return (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-lg font-medium text-gray-700 mb-4">
                {currentQuestion.data.instruction || "音声を聞いて、聞こえた単語をタイプしてください"}
              </p>
              <SoundButton text={currentQuestion.data.text} autoPlay className="mx-auto mb-2" />
              {currentQuestion.data.hints && (
                <p className="text-sm text-blue-600">{currentQuestion.data.hints}</p>
              )}
            </div>

            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="w-full p-4 text-lg border-2 border-gray-300 rounded-xl focus:border-blue-500 focus:outline-none"
              placeholder="ここにタイプしてください..."
              disabled={showResult}
            />

            {userInput.trim() && !showResult && (
              <Button
                onClick={() => handleAnswer(userInput.trim().toLowerCase())}
                className="w-full bg-green-500 hover:bg-green-600"
              >
                答えを確認
              </Button>
            )}
          </div>
        )

      case "PHONETIC_PRACTICE":
        return (
          <AISpeakingPractice
            targetText={currentQuestion.data.text || ""}
            targetPhonetic={currentQuestion.data.phonetic || ""}
            targetMeaning={currentQuestion.data.meaning || ""}
            evaluationType="pronunciation"
            onComplete={(score) => {
              // Award extra XP based on AI evaluation score
              const bonusXP = Math.floor(score / 10) // 0-10 bonus XP based on score
              dispatch({ type: "GAIN_XP", amount: bonusXP })
              handleAnswer("completed")
            }}
          />
        )

      case "SENTENCE_SPEAKING":
        return (
          <AISpeakingPractice
            targetText={currentQuestion.data.text || ""}
            targetMeaning={currentQuestion.data.meaning || ""}
            evaluationType="grammar"
            onComplete={(score) => {
              // Award extra XP based on AI evaluation score
              const bonusXP = Math.floor(score / 10) // 0-10 bonus XP based on score
              dispatch({ type: "GAIN_XP", amount: bonusXP })
              handleAnswer("completed")
            }}
          />
        )

      default:
        return <div>不明な問題タイプです</div>
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Custom top bar for lesson */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-100">
        <button onClick={() => router.push("/learn")} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <X className="w-6 h-6 text-gray-600" />
        </button>

        <div className="flex-1 mx-4">
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-green-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2 text-red-600">
          <span className="font-bold">{state.hearts}</span>
          <div className="text-red-500">❤️</div>
        </div>
      </div>

      <div className="p-6">
        <Card className="question-card max-w-md mx-auto">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-sm font-medium text-gray-500">
                質問 {currentQuestionIndex + 1} / {questions.length}
              </span>
              <ProgressCircle progress={progress} size={40} strokeWidth={4} />
            </div>
          </div>

          {renderQuestion()}

          {showResult && (
            <div
              className={`mt-6 p-4 rounded-xl ${isCorrect ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}
            >
              <div className="flex items-center space-x-2 mb-2">
                {isCorrect ? <Check className="w-5 h-5 text-green-600" /> : <X className="w-5 h-5 text-red-600" />}
                <span className={`font-bold ${isCorrect ? "text-green-600" : "text-red-600"}`}>
                  {isCorrect ? "正解！" : "不正解"}
                </span>
              </div>

              {!isCorrect && (
                <p className="text-gray-600">
                  正解は: <span className="font-bold">{currentQuestion.data.answer}</span>
                </p>
              )}

              <Button
                onClick={handleNext}
                className={`w-full mt-4 ${isCorrect ? "bg-green-500 hover:bg-green-600" : "bg-blue-500 hover:bg-blue-600"}`}
              >
                {currentQuestionIndex < questions.length - 1 ? "続ける" : "レッスン完了"}
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
