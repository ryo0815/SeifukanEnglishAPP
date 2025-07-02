"use client"

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Mic, 
  MicOff, 
  Play,
  Square,
  Volume2,
  AlertCircle
} from "lucide-react"
import { useSound } from "@/contexts/sound-context"

interface SpeakingEvaluation {
  pronunciationScore?: number
  clarityScore?: number
  fluencyScore?: number
  grammarScore?: number
  wordOrderScore?: number
  vocabularyScore?: number
  pitchScore?: number
  volumeScore?: number
  stabilityScore?: number
  spectralScore?: number
  overallScore: number
  overallGrade: 'A' | 'B' | 'C' | 'D' | 'F'
  gradeDescription: string
  improvements: string[]
  positives: string[]
  errors?: string[]
  suggestions?: string[]
  feedback: string
  nativeLevel: number
  clientFeatures?: any
  waveformAnalysis?: {
    waveformSimilarity: number
    durationSimilarity: number
    energyPatternSimilarity: number
    waveformGrade: 'A' | 'B' | 'C' | 'D' | 'F'
    durationGrade: 'A' | 'B' | 'C' | 'D' | 'F'
    energyGrade: 'A' | 'B' | 'C' | 'D' | 'F'
  }
  referenceComparison?: {
    hasReference: boolean
    pitchDifference?: number
    volumeDifference?: number
    spectralDifference?: number
  }
}

interface AISpeakingPracticeProps {
  targetText: string
  targetPhonetic?: string
  targetMeaning: string
  evaluationType?: 'pronunciation' | 'grammar'
  onComplete: (score: number) => void
}

export function AISpeakingPractice({
  targetText,
  targetPhonetic,
  targetMeaning,
  evaluationType = 'pronunciation',
  onComplete
}: AISpeakingPracticeProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [transcription, setTranscription] = useState("")
  const [evaluation, setEvaluation] = useState<SpeakingEvaluation | null>(null)
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [hasRecorded, setHasRecorded] = useState(false)
  const [error, setError] = useState("")
  const [recognitionResult, setRecognitionResult] = useState("")

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const recordingTimerRef = useRef<NodeJS.Timeout | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const audioDataRef = useRef<Float32Array | null>(null)
  const speechRecognitionRef = useRef<any>(null)
  const { playSound } = useSound()

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current)
      }
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop()
      }
    }
  }, [])

  // Convert score to grade (5-level system) - balanced thresholds
  const scoreToGrade = (score: number): { grade: 'A' | 'B' | 'C' | 'D' | 'F', description: string } => {
    if (score >= 75) {
      return { grade: 'A', description: '優秀 - お手本とほぼ同じレベル' }
    } else if (score >= 60) {
      return { grade: 'B', description: '良好 - お手本に近い発音' }
    } else if (score >= 40) {
      return { grade: 'C', description: '普通 - 改善の余地あり' }
    } else if (score >= 25) {
      return { grade: 'D', description: '要改善 - 大幅な練習が必要' }
    } else {
      return { grade: 'F', description: '不合格 - お手本をよく聞いて再挑戦' }
    }
  }

  // Get grade color for display
  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'text-green-600 bg-green-100'
      case 'B': return 'text-blue-600 bg-blue-100'
      case 'C': return 'text-yellow-600 bg-yellow-100'
      case 'D': return 'text-orange-600 bg-orange-100'
      case 'F': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          sampleRate: 44100,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true
        } 
      })

      // Web Audio API setup for real-time analysis
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)()
      const source = audioContextRef.current.createMediaStreamSource(stream)
      analyserRef.current = audioContextRef.current.createAnalyser()
      
      analyserRef.current.fftSize = 2048
      analyserRef.current.smoothingTimeConstant = 0.8
      
      source.connect(analyserRef.current)
      
      // Setup audio data buffer for analysis
      const bufferLength = analyserRef.current.frequencyBinCount
      audioDataRef.current = new Float32Array(bufferLength)

      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      })
      
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorderRef.current.onstop = () => {
        stream.getTracks().forEach(track => track.stop())
        if (audioContextRef.current) {
          audioContextRef.current.close()
        }
        processRecording()
      }

      // Web Speech API setup for real-time recognition
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        speechRecognitionRef.current = new SpeechRecognition()
        speechRecognitionRef.current.lang = 'en-US'
        speechRecognitionRef.current.continuous = true
        speechRecognitionRef.current.interimResults = true
        speechRecognitionRef.current.maxAlternatives = 1

        speechRecognitionRef.current.onresult = (event: any) => {
          let finalTranscript = ''
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript
            }
          }
          if (finalTranscript) {
            console.log('Speech recognition result:', finalTranscript)
            setRecognitionResult(finalTranscript)
          }
        }

        speechRecognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error)
          if (event.error === 'network') {
            setError('音声認識でネットワークエラーが発生しました')
          }
        }

        try {
          speechRecognitionRef.current.start()
          console.log('Speech recognition started')
        } catch (speechError) {
          console.error('Failed to start speech recognition:', speechError)
        }
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
      setRecordingTime(0)
      setError("")
      setRecognitionResult("")

      // Start timer
      recordingTimerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)

      playSound('click')
      
    } catch (err) {
      console.error('Error starting recording:', err)
      setError("マイクへのアクセスが拒否されました。ブラウザの設定を確認してください。")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      setHasRecorded(true)
      
      if (recordingTimerRef.current) {
        clearInterval(recordingTimerRef.current)
      }

      // Stop speech recognition
      if (speechRecognitionRef.current) {
        try {
          speechRecognitionRef.current.stop()
          console.log('Speech recognition stopped')
        } catch (speechError) {
          console.error('Error stopping speech recognition:', speechError)
        }
      }

      playSound('click')
    }
  }

  // Audio analysis functions
  const calculateTotalEnergy = (audio: Float32Array): number => {
    let sum = 0
    for (let i = 0; i < audio.length; i++) {
      sum += audio[i] * audio[i]
    }
    return sum / audio.length
  }

  const estimatePitch = (buffer: Float32Array, sampleRate: number): number => {
    const minPeriod = Math.floor(sampleRate / 500) // 500 Hz max
    const maxPeriod = Math.floor(sampleRate / 80)  // 80 Hz min
    
    let bestCorrelation = -1
    let bestPeriod = minPeriod
    
    for (let period = minPeriod; period <= maxPeriod; period++) {
      let correlation = 0
      let normalizer = 0
      
      for (let i = 0; i < buffer.length - period; i++) {
        correlation += buffer[i] * buffer[i + period]
        normalizer += buffer[i] * buffer[i]
      }
      
      if (normalizer > 0) {
        correlation /= normalizer
        if (correlation > bestCorrelation) {
          bestCorrelation = correlation
          bestPeriod = period
        }
      }
    }
    
    return bestCorrelation > 0.3 ? sampleRate / bestPeriod : 0
  }

  const calculateRMS = (buffer: Float32Array): number => {
    let sum = 0
    for (let i = 0; i < buffer.length; i++) {
      sum += buffer[i] * buffer[i]
    }
    return Math.sqrt(sum / buffer.length)
  }

  const analyzeSpectrum = (buffer: Float32Array) => {
    // Simple FFT approximation using frequency domain analysis
    const fftSize = Math.min(2048, buffer.length)
    const spectrum = new Float32Array(fftSize / 2)
    
    // Calculate power spectrum
    for (let k = 0; k < spectrum.length; k++) {
      let real = 0
      let imag = 0
      
      for (let n = 0; n < fftSize; n++) {
        const angle = -2 * Math.PI * k * n / fftSize
        real += buffer[n] * Math.cos(angle)
        imag += buffer[n] * Math.sin(angle)
      }
      
      spectrum[k] = Math.sqrt(real * real + imag * imag)
    }
    
    const dominantFrequency = findDominantFrequency(spectrum)
    const spectralCentroid = calculateSpectralCentroid(spectrum)
    
    return {
      spectrum,
      dominantFrequency,
      spectralCentroid
    }
  }

  const findDominantFrequency = (spectrum: Float32Array): number => {
    let maxMagnitude = 0
    let dominantBin = 0
    
    for (let i = 1; i < spectrum.length; i++) {
      if (spectrum[i] > maxMagnitude) {
        maxMagnitude = spectrum[i]
        dominantBin = i
      }
    }
    
    // Convert bin to frequency (assuming 44.1kHz sample rate)
    return (dominantBin * 44100) / (spectrum.length * 2)
  }

  const calculateSpectralCentroid = (spectrum: Float32Array): number => {
    let weightedSum = 0
    let magnitudeSum = 0
    
    for (let i = 0; i < spectrum.length; i++) {
      const frequency = (i * 44100) / (spectrum.length * 2)
      weightedSum += frequency * spectrum[i]
      magnitudeSum += spectrum[i]
    }
    
    return magnitudeSum > 0 ? weightedSum / magnitudeSum : 0
  }

  const calculateStability = (buffer: Float32Array): number => {
    const windowSize = Math.floor(buffer.length / 10)
    const windows = []
    
    for (let i = 0; i < buffer.length - windowSize; i += windowSize) {
      const windowData = buffer.slice(i, i + windowSize)
      windows.push(calculateRMS(windowData))
    }
    
    if (windows.length < 2) return 0
    
    const mean = windows.reduce((sum, val) => sum + val, 0) / windows.length
    const variance = windows.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / windows.length
    const stdDev = Math.sqrt(variance)
    
    return mean > 0 ? 1 - (stdDev / mean) : 0
  }

  const processRecording = async () => {
    if (audioChunksRef.current.length === 0) {
      console.error('No audio chunks available')
      return
    }

    console.log('Starting recording processing...')
    setIsEvaluating(true)
    
    try {
      // Create audio blob
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm;codecs=opus' })
      console.log('Audio blob created, size:', audioBlob.size)
      
      // Convert audio to AudioBuffer for analysis
      const arrayBuffer = await audioBlob.arrayBuffer()
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
      console.log('Audio buffer decoded, duration:', audioBuffer.duration)
      
      // Extract audio data for analysis
      const audioData = audioBuffer.getChannelData(0) // Get mono channel
      const sampleRate = audioBuffer.sampleRate
      console.log('Audio data extracted, sample rate:', sampleRate, 'length:', audioData.length)
      
      // 基本的な音声検出を先に行う
      const totalEnergy = calculateTotalEnergy(audioData)
      const pitch = estimatePitch(audioData, sampleRate)
      const volume = calculateRMS(audioData)
      const spectralFeatures = analyzeSpectrum(audioData)
      const stability = calculateStability(audioData)
      
      console.log('Basic audio metrics:', { 
        totalEnergy, 
        pitch, 
        volume, 
        stability,
        spectralCentroid: spectralFeatures?.spectralCentroid,
        dominantFrequency: spectralFeatures?.dominantFrequency
      })
      
      // 音声が検出されない場合は即座にF評価
      const isSilent = totalEnergy < 0.0001
      const isValidSpeech = totalEnergy >= 0.002 && 
                          pitch >= 80 && pitch <= 500 && 
                          volume >= 0.008 && 
                          stability >= 0.4
      
      if (isSilent || !isValidSpeech) {
        console.log('No valid speech detected - returning F grade')
        const evaluation: SpeakingEvaluation = {
          overallScore: 0,
          overallGrade: 'F',
          gradeDescription: '音声未検出 - 発話が認識されませんでした',
          improvements: [
            'マイクに向かって、はっきりと大きな声で話してください',
            'マイクとの距離を10-20cm程度に保ってください',
            '雑音の少ない静かな環境で録音してください',
            'お手本の音声をよく聞いて、同じように発音してください'
          ],
          positives: [],
          feedback: '音声が検出されませんでした。マイクの設定を確認し、はっきりと話してください。',
          nativeLevel: 1
        }
        
        setEvaluation(evaluation)
        setTranscription('音声が検出されませんでした')
        onComplete(0)
        audioContext.close()
        return
      }
      
      // 音声認識結果を基に評価を決定
      let evaluation: SpeakingEvaluation
      
      if (recognitionResult && recognitionResult.length > 0) {
        console.log('Speech recognition result available:', recognitionResult)
        setTranscription(`認識結果: "${recognitionResult}"`)
        
        // 認識結果とターゲットテキストの比較
        const targetLower = targetText.toLowerCase().trim()
        const recognizedLower = recognitionResult.toLowerCase().trim()
        
        let contentAccuracy = 0
        let matchType = 'none'
        
        if (recognizedLower === targetLower) {
          contentAccuracy = 100
          matchType = 'perfect'
        } else if (recognizedLower.includes(targetLower) || targetLower.includes(recognizedLower)) {
          contentAccuracy = 80
          matchType = 'partial'
        } else {
          // 単語レベルでの一致をチェック
          const targetWords = targetLower.split(' ').filter(w => w.length > 2)
          const recognizedWords = recognizedLower.split(' ')
          const matchCount = targetWords.filter(word => recognizedWords.includes(word)).length
          
          if (targetWords.length > 0) {
            const matchRatio = matchCount / targetWords.length
            contentAccuracy = Math.round(matchRatio * 60) // 最大60%
            matchType = matchRatio > 0.5 ? 'word_match' : 'poor_match'
          } else {
            contentAccuracy = 0
            matchType = 'none'
          }
        }
        
        console.log('Content accuracy analysis:', { contentAccuracy, matchType, targetWords: targetLower, recognized: recognizedLower })
        
        // 音響品質スコア（最大30点）
        let acousticScore = 0
        if (pitch >= 100 && pitch <= 250) acousticScore += 8
        else if (pitch >= 80 && pitch <= 300) acousticScore += 6
        else if (pitch >= 70 && pitch <= 400) acousticScore += 4
        else acousticScore += 2
        
        if (volume >= 0.02 && volume <= 0.2) acousticScore += 8
        else if (volume >= 0.015 && volume <= 0.3) acousticScore += 6
        else if (volume >= 0.01 && volume <= 0.4) acousticScore += 4
        else acousticScore += 2
        
        if (spectralFeatures) {
          const centroid = spectralFeatures.spectralCentroid
          if (centroid >= 500 && centroid <= 2500) acousticScore += 7
          else if (centroid >= 400 && centroid <= 3000) acousticScore += 5
          else if (centroid >= 300 && centroid <= 3500) acousticScore += 3
          else acousticScore += 1
        }
        
        if (stability >= 0.7) acousticScore += 7
        else if (stability >= 0.6) acousticScore += 5
        else if (stability >= 0.5) acousticScore += 3
        else acousticScore += 1
        
        // 最終スコア計算（内容精度70% + 音響品質30%）
        const finalScore = Math.round((contentAccuracy * 0.7) + (acousticScore * 0.3))
        const gradeInfo = scoreToGrade(finalScore)
        
        evaluation = {
          overallScore: finalScore,
          overallGrade: gradeInfo.grade,
          gradeDescription: gradeInfo.description,
          improvements: generateContentBasedImprovements(matchType, contentAccuracy),
          positives: generateContentBasedPositives(matchType, contentAccuracy),
          feedback: generateContentBasedFeedback(matchType, contentAccuracy, recognitionResult),
          nativeLevel: Math.ceil(finalScore / 20),
          pronunciationScore: Math.round(acousticScore * 3.33), // Convert to 100 scale
          clarityScore: contentAccuracy,
          pitchScore: Math.round((pitch >= 100 && pitch <= 250) ? 85 : 60),
          volumeScore: Math.round((volume >= 0.02 && volume <= 0.2) ? 85 : 60),
          stabilityScore: Math.round(stability * 100)
        }
        
      } else {
        console.log('No speech recognition result - using acoustic-only evaluation with penalty')
        setTranscription('音声認識結果なし（音響分析のみ）')
        
        // 音声認識結果がない場合は大幅減点
        let acousticScore = 15 // 基本点を低く設定
        
        if (pitch >= 100 && pitch <= 250) acousticScore += 10
        else if (pitch >= 80 && pitch <= 300) acousticScore += 7
        else if (pitch >= 70 && pitch <= 400) acousticScore += 3
        
        if (volume >= 0.02 && volume <= 0.2) acousticScore += 10
        else if (volume >= 0.015) acousticScore += 7
        else acousticScore += 3
        
        if (spectralFeatures) {
          const centroid = spectralFeatures.spectralCentroid
          if (centroid >= 500 && centroid <= 2500) acousticScore += 8
          else if (centroid >= 400 && centroid <= 3000) acousticScore += 5
          else if (centroid >= 300 && centroid <= 3500) acousticScore += 2
        }
        
        if (stability >= 0.7) acousticScore += 7
        else if (stability >= 0.6) acousticScore += 4
        else acousticScore += 2
        
        // 音声認識失敗ペナルティ（最大でもD評価）
        const finalScore = Math.min(35, acousticScore) // 最大35点（D評価）
        const gradeInfo = scoreToGrade(finalScore)
        
        evaluation = {
          overallScore: finalScore,
          overallGrade: gradeInfo.grade,
          gradeDescription: gradeInfo.description,
          improvements: [
            '音声認識ができませんでした。より明瞭に発音してください',
            'お手本の音声を聞いて、正確な発音を身につけましょう',
            'マイクに近づいて、はっきりと話してください',
            '静かな環境で録音してください'
          ],
          positives: ['音声が検出されました'],
          feedback: '音声は検出されましたが、内容を正確に認識できませんでした。お手本をよく聞いて、明瞭に発音してください。',
          nativeLevel: 1,
          pronunciationScore: Math.round(acousticScore * 2),
          clarityScore: 20,
          pitchScore: Math.round((pitch >= 100 && pitch <= 250) ? 70 : 50),
          volumeScore: Math.round((volume >= 0.02) ? 70 : 50),
          stabilityScore: Math.round(stability * 100)
        }
      }
      
      console.log('Final evaluation:', evaluation)
      setEvaluation(evaluation)
      onComplete(evaluation.overallScore)
      
      // Cleanup
      audioContext.close()
      playSound('complete')
      
    } catch (err) {
      console.error('Error processing recording:', err)
      setError('音声の処理中にエラーが発生しました。もう一度お試しください。')
    } finally {
      setIsEvaluating(false)
    }
  }

  // Content-based improvement suggestions
  const generateContentBasedImprovements = (matchType: string, accuracy: number): string[] => {
    switch (matchType) {
      case 'perfect':
        return ['素晴らしい発音です！この調子で続けましょう']
      case 'partial':
        return [
          '発音は良好ですが、より正確に話してみましょう',
          'お手本の音声をもう一度聞いて、細かい発音を確認してください'
        ]
      case 'word_match':
        return [
          '一部の単語は正しく発音できています',
          '全体の流れを意識して、文章として話してみましょう',
          'お手本の音声を何度も聞いて練習してください'
        ]
      default:
        return [
          'お手本の音声をよく聞いて、同じように発音してください',
          '一つ一つの単語をはっきりと発音しましょう',
          'ゆっくりと、正確に話すことを心がけてください',
          '発音記号を確認して、正しい音を身につけましょう'
        ]
    }
  }

  // Content-based positive feedback
  const generateContentBasedPositives = (matchType: string, accuracy: number): string[] => {
    switch (matchType) {
      case 'perfect':
        return [
          '完璧な発音です！',
          'お手本と同じように話せています',
          '素晴らしい英語力です'
        ]
      case 'partial':
        return [
          '音声認識が成功しました',
          '発音の基礎ができています',
          '良い進歩です'
        ]
      case 'word_match':
        return [
          'いくつかの単語は正しく発音できています',
          '音声が明瞭に録音されています'
        ]
      default:
        return ['音声が検出されました']
    }
  }

  // Content-based feedback
  const generateContentBasedFeedback = (matchType: string, accuracy: number, recognized: string): string => {
    switch (matchType) {
      case 'perfect':
        return `完璧です！お手本と同じように「${recognized}」と正確に発音できました。`
      case 'partial':
        return `良い発音です。「${recognized}」と認識されました。さらに正確性を高めましょう。`
      case 'word_match':
        return `「${recognized}」と認識されました。一部の単語は正しく発音できていますが、全体の精度を向上させましょう。`
      default:
        return `「${recognized}」と認識されましたが、目標の発音とは異なります。お手本をよく聞いて練習してください。`
    }
  }

  const playTargetAudio = () => {
    const referenceAudioPath = getReferenceAudioPath(targetText)
    
    if (referenceAudioPath) {
      const audio = new Audio(referenceAudioPath)
      setIsPlaying(true)
      
      audio.onended = () => setIsPlaying(false)
      audio.onerror = () => {
        setIsPlaying(false)
        playWithWebSpeech()
      }
      
      audio.play().catch(() => {
        setIsPlaying(false)
        playWithWebSpeech()
      })
    } else {
      playWithWebSpeech()
    }
  }

  const getReferenceAudioPath = (text: string): string | null => {
    if (text === "Hello, how are you?") {
      return "/audio/hello-how-are-you.mp3"
    }
    return null
  }

  const playWithWebSpeech = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(targetText)
      utterance.lang = 'en-US'
      utterance.rate = 0.8
      speechSynthesis.speak(utterance)
    }
  }

  return (
    <Card className="p-6 space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold">発音練習</h3>
        <div className="space-y-1">
          <p className="text-2xl font-bold text-blue-600">{targetText}</p>
          {targetPhonetic && (
            <p className="text-sm text-gray-500 font-mono">{targetPhonetic}</p>
          )}
          <p className="text-gray-600">{targetMeaning}</p>
        </div>
      </div>

      <div className="flex justify-center">
        <Button
          onClick={playTargetAudio}
          disabled={isPlaying}
          variant="outline"
          className="flex items-center gap-2"
        >
          {isPlaying ? <Square className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          お手本を聞く
        </Button>
      </div>

      <div className="space-y-4">
        <div className="flex justify-center">
          <Button
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isEvaluating}
            size="lg"
            className={`flex items-center gap-2 ${
              isRecording 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {isRecording ? (
              <>
                <MicOff className="h-5 w-5" />
                録音を停止 ({recordingTime}s)
              </>
            ) : (
              <>
                <Mic className="h-5 w-5" />
                録音を開始
              </>
            )}
          </Button>
        </div>

        {isRecording && (
          <div className="text-center space-y-2">
            <div className="animate-pulse">
              <div className="w-4 h-4 bg-red-500 rounded-full mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">録音中... ({recordingTime}s)</p>
            </div>
            {recognitionResult && (
              <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">認識中:</span> "{recognitionResult}"
                </p>
              </div>
            )}
          </div>
        )}

        {isEvaluating && (
          <div className="text-center space-y-2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-sm text-gray-600">音声を分析中...</p>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
            <AlertCircle className="h-4 w-4 text-red-500" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}
      </div>

      {evaluation && (
        <div className={`mt-4 p-4 border rounded-lg ${
          evaluation.overallGrade === 'F' && evaluation.overallScore === 0
            ? 'bg-yellow-50 border-yellow-200' 
            : 'bg-green-50 border-green-200'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <h3 className={`text-lg font-semibold ${
              evaluation.overallGrade === 'F' && evaluation.overallScore === 0
                ? 'text-yellow-800' 
                : 'text-green-800'
            }`}>
              {evaluation.overallGrade === 'F' && evaluation.overallScore === 0 
                ? '音声が検出されませんでした' 
                : '評価完了！'
              }
            </h3>
            <div className={`flex items-center text-sm ${
              evaluation.overallGrade === 'F' && evaluation.overallScore === 0
                ? 'text-yellow-600' 
                : 'text-green-600'
            }`}>
              {evaluation.overallGrade === 'F' && evaluation.overallScore === 0 ? (
                <>
                  <AlertCircle className="w-4 h-4 mr-1" />
                  音声未検出
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {evaluation.waveformAnalysis ? 'AI分析完了' : 'ローカル分析完了'}
                </>
              )}
            </div>
          </div>
          <div className="mb-4">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(evaluation.overallGrade)}`}>
              グレード: {evaluation.overallGrade}
            </div>
            <p className={`text-sm mt-1 ${
              evaluation.overallGrade === 'F' && evaluation.overallScore === 0
                ? 'text-yellow-700' 
                : 'text-green-700'
            }`}>
              {evaluation.gradeDescription}
            </p>
          </div>
          
          {evaluation.feedback && (
            <div className="mb-3">
              <p className={`text-sm ${
                evaluation.overallGrade === 'F' && evaluation.overallScore === 0
                  ? 'text-yellow-800' 
                  : 'text-green-800'
              }`}>
                {evaluation.feedback}
              </p>
            </div>
          )}
          
          {evaluation.positives && evaluation.positives.length > 0 && (
            <div className="mb-3">
              <h4 className={`text-sm font-medium mb-1 ${
                evaluation.overallGrade === 'F' && evaluation.overallScore === 0
                  ? 'text-yellow-800' 
                  : 'text-green-800'
              }`}>
                良い点:
              </h4>
              <ul className={`text-sm space-y-1 ${
                evaluation.overallGrade === 'F' && evaluation.overallScore === 0
                  ? 'text-yellow-700' 
                  : 'text-green-700'
              }`}>
                {evaluation.positives.map((positive, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    {positive}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {evaluation.improvements && evaluation.improvements.length > 0 && (
            <div className="mb-4">
              <h4 className={`text-sm font-medium mb-1 ${
                evaluation.overallGrade === 'F' && evaluation.overallScore === 0
                  ? 'text-yellow-800' 
                  : 'text-green-800'
              }`}>
                {evaluation.overallGrade === 'F' && evaluation.overallScore === 0 
                  ? '確認事項:' 
                  : '改善点:'
                }
              </h4>
              <ul className={`text-sm space-y-1 ${
                evaluation.overallGrade === 'F' && evaluation.overallScore === 0
                  ? 'text-yellow-700' 
                  : 'text-green-700'
              }`}>
                {evaluation.improvements.map((improvement, index) => (
                  <li key={index} className="flex items-start">
                    <span className={`mr-2 ${
                      evaluation.overallGrade === 'F' && evaluation.overallScore === 0
                        ? 'text-yellow-500' 
                        : 'text-blue-500'
                    }`}>
                      {evaluation.overallGrade === 'F' && evaluation.overallScore === 0 ? '!' : '→'}
                    </span>
                    {improvement}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <button
            onClick={() => onComplete(evaluation.overallScore)}
            className={`w-full py-2 px-4 rounded-lg transition-all duration-200 font-medium ${
              evaluation.overallGrade === 'F' && evaluation.overallScore === 0
                ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-white hover:from-yellow-600 hover:to-yellow-700'
                : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700'
            }`}
          >
            {evaluation.overallGrade === 'F' && evaluation.overallScore === 0 ? 'もう一度挑戦' : '次のフレーズへ'}
          </button>
        </div>
      )}
    </Card>
  )
} 