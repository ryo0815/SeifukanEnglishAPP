import { NextRequest, NextResponse } from 'next/server'

// 音響特徴分析用のヘルパー関数
function analyzeAudioFeatures(audioBuffer: Float32Array, sampleRate: number) {
  // ピッチ分析（基本周波数検出）
  const pitch = estimatePitch(audioBuffer, sampleRate)
  
  // 音量分析（RMS）
  const volume = calculateRMS(audioBuffer)
  
  // スペクトル分析
  const spectralFeatures = analyzeSpectrum(audioBuffer)
  
  // 音声の安定性（ジッター）
  const stability = calculateStability(audioBuffer)
  
  return {
    pitch,
    volume,
    spectralFeatures,
    stability
  }
}

// ピッチ推定（オートコリレーション法）
function estimatePitch(buffer: Float32Array, sampleRate: number): number {
  const minPeriod = Math.floor(sampleRate / 800) // 最高800Hz
  const maxPeriod = Math.floor(sampleRate / 50)  // 最低50Hz
  
  let bestCorrelation = 0
  let bestPeriod = 0
  
  for (let period = minPeriod; period < maxPeriod; period++) {
    let correlation = 0
    for (let i = 0; i < buffer.length - period; i++) {
      correlation += buffer[i] * buffer[i + period]
    }
    
    if (correlation > bestCorrelation) {
      bestCorrelation = correlation
      bestPeriod = period
    }
  }
  
  return bestPeriod > 0 ? sampleRate / bestPeriod : 0
}

// RMS音量計算
function calculateRMS(buffer: Float32Array): number {
  let sum = 0
  for (let i = 0; i < buffer.length; i++) {
    sum += buffer[i] * buffer[i]
  }
  return Math.sqrt(sum / buffer.length)
}

// スペクトル分析（簡易FFT）
function analyzeSpectrum(buffer: Float32Array) {
  const fftSize = 2048
  const spectrum = new Float32Array(fftSize / 2)
  
  // 簡易FFT実装（実際のプロジェクトではライブラリを使用）
  for (let k = 0; k < spectrum.length; k++) {
    let real = 0
    let imag = 0
    
    for (let n = 0; n < Math.min(buffer.length, fftSize); n++) {
      const angle = -2 * Math.PI * k * n / fftSize
      real += buffer[n] * Math.cos(angle)
      imag += buffer[n] * Math.sin(angle)
    }
    
    spectrum[k] = Math.sqrt(real * real + imag * imag)
  }
  
  return {
    spectrum: Array.from(spectrum),
    dominantFrequency: findDominantFrequency(spectrum),
    spectralCentroid: calculateSpectralCentroid(spectrum)
  }
}

// 主要周波数検出
function findDominantFrequency(spectrum: Float32Array): number {
  let maxMagnitude = 0
  let dominantIndex = 0
  
  for (let i = 1; i < spectrum.length; i++) {
    if (spectrum[i] > maxMagnitude) {
      maxMagnitude = spectrum[i]
      dominantIndex = i
    }
  }
  
  return dominantIndex
}

// スペクトル重心計算
function calculateSpectralCentroid(spectrum: Float32Array): number {
  let weightedSum = 0
  let magnitudeSum = 0
  
  for (let i = 0; i < spectrum.length; i++) {
    weightedSum += i * spectrum[i]
    magnitudeSum += spectrum[i]
  }
  
  return magnitudeSum > 0 ? weightedSum / magnitudeSum : 0
}

// 音声安定性計算
function calculateStability(buffer: Float32Array): number {
  let variability = 0
  const windowSize = 1024
  const numWindows = Math.floor(buffer.length / windowSize)
  
  if (numWindows < 2) return 1.0
  
  const windowRMS = []
  for (let i = 0; i < numWindows; i++) {
    const start = i * windowSize
    const end = start + windowSize
    const windowData = buffer.slice(start, end)
    windowRMS.push(calculateRMS(windowData))
  }
  
  // RMSの標準偏差を計算
  const mean = windowRMS.reduce((a, b) => a + b, 0) / windowRMS.length
  const variance = windowRMS.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / windowRMS.length
  const stdDev = Math.sqrt(variance)
  
  return Math.max(0, 1 - (stdDev / mean)) // 0-1の範囲で安定性を表現
}

// 音響特徴に基づく評価
function evaluateAcousticFeatures(features: any, targetWord: string): any {
  // 基準値（理想的な英語発音の音響特徴）
  const referenceFeatures = {
    pitch: { min: 80, max: 300, ideal: 150 },
    volume: { min: 0.01, max: 0.5, ideal: 0.1 },
    stability: { min: 0.6, max: 1.0, ideal: 0.8 }
  }
  
  // ピッチ評価
  const pitchScore = evaluateFeature(features.pitch, referenceFeatures.pitch)
  
  // 音量評価
  const volumeScore = evaluateFeature(features.volume, referenceFeatures.volume)
  
  // 安定性評価
  const stabilityScore = features.stability * 100
  
  // スペクトル品質評価
  const spectralScore = evaluateSpectralQuality(features.spectralFeatures)
  
  // 総合評価
  const overallScore = Math.round(
    (pitchScore * 0.3 + volumeScore * 0.2 + stabilityScore * 0.3 + spectralScore * 0.2)
  )
  
  return {
    pitchScore: Math.round(pitchScore),
    volumeScore: Math.round(volumeScore),
    stabilityScore: Math.round(stabilityScore),
    spectralScore: Math.round(spectralScore),
    overallScore,
    feedback: generateAcousticFeedback(features, overallScore),
    improvements: generateImprovements(features),
    positives: generatePositives(features),
    nativeLevel: Math.min(10, Math.max(1, Math.round(overallScore / 10)))
  }
}

function evaluateFeature(value: number, reference: any): number {
  if (value < reference.min || value > reference.max) {
    return Math.max(0, 60 - Math.abs(value - reference.ideal) / reference.ideal * 40)
  }
  
  const deviation = Math.abs(value - reference.ideal) / reference.ideal
  return Math.max(70, 100 - deviation * 30)
}

function evaluateSpectralQuality(spectralFeatures: any): number {
  const { spectralCentroid, dominantFrequency } = spectralFeatures
  
  // スペクトル重心の評価（明瞭性の指標）
  const centroidScore = spectralCentroid > 0 && spectralCentroid < 1000 ? 
    Math.max(50, 100 - Math.abs(spectralCentroid - 500) / 10) : 60
  
  // 主要周波数の評価
  const dominantScore = dominantFrequency > 0 ? 
    Math.min(100, 60 + dominantFrequency / 20) : 50
  
  return (centroidScore + dominantScore) / 2
}

function generateAcousticFeedback(features: any, score: number): string {
  if (score >= 90) {
    return "素晴らしい発音です！音響特徴が非常に優秀で、ネイティブレベルに近い品質です。"
  } else if (score >= 80) {
    return "良い発音です。音響特徴は安定しており、さらなる向上が期待できます。"
  } else if (score >= 70) {
    return "発音は理解できるレベルです。音響特徴の改善により、より自然な発音になります。"
  } else {
    return "発音の改善が必要です。音響特徴を意識した練習を続けてください。"
  }
}

function generateImprovements(features: any): string[] {
  const improvements = []
  
  if (features.pitch < 80 || features.pitch > 300) {
    improvements.push("ピッチの調整：より自然な音程で発声してください")
  }
  
  if (features.volume < 0.01) {
    improvements.push("音量の向上：もう少し大きな声で発声してください")
  }
  
  if (features.stability < 0.6) {
    improvements.push("安定性の向上：一定のペースで発声してください")
  }
  
  if (improvements.length === 0) {
    improvements.push("継続的な練習で更なる向上を目指しましょう")
  }
  
  return improvements
}

function generatePositives(features: any): string[] {
  const positives = []
  
  if (features.pitch >= 80 && features.pitch <= 300) {
    positives.push("ピッチが自然な範囲内です")
  }
  
  if (features.volume >= 0.05) {
    positives.push("適切な音量で発声できています")
  }
  
  if (features.stability >= 0.7) {
    positives.push("安定した発声ができています")
  }
  
  if (positives.length === 0) {
    positives.push("発声に取り組む姿勢が素晴らしいです")
  }
  
  return positives
}

export async function POST(request: NextRequest) {
  console.log('=== Audio Analysis API Called ===')
  
  try {
    console.log('Parsing form data...')
    const formData = await request.formData()
    console.log('Form data parsed successfully')
    
    const audioFile = formData.get('audio') as File
    const targetText = formData.get('targetText') as string
    
    console.log('Request parameters:', {
      hasAudioFile: !!audioFile,
      audioFileSize: audioFile?.size || 0,
      audioFileType: audioFile?.type || 'unknown',
      targetText: targetText?.substring(0, 50) + '...' || 'not provided'
    })
    
    if (!audioFile) {
      console.error('No audio file provided')
      return NextResponse.json(
        { error: 'Audio file is required' },
        { status: 400 }
      )
    }

    console.log('Converting audio file to ArrayBuffer...')
    let arrayBuffer
    try {
      arrayBuffer = await audioFile.arrayBuffer()
      console.log('Audio conversion successful, size:', arrayBuffer.byteLength)
    } catch (conversionError) {
      console.error('Failed to convert audio file:', conversionError)
      return NextResponse.json(
        { error: 'Failed to process audio file' },
        { status: 400 }
      )
    }
    
    // Web Audio APIでの処理をシミュレート（実際はクライアント側で処理）
    // ここでは簡易的な音声データ分析を実装
    console.log('Creating audio data array...')
    const audioData = new Float32Array(arrayBuffer)
    const sampleRate = 44100 // 一般的なサンプルレート
    
    console.log('Audio data created:', {
      length: audioData.length,
      sampleRate,
      duration: audioData.length / sampleRate
    })
    
    // 音響特徴分析
    console.log('Analyzing acoustic features...')
    let acousticFeatures
    try {
      acousticFeatures = analyzeAudioFeatures(audioData, sampleRate)
      console.log('Acoustic analysis completed:', Object.keys(acousticFeatures))
    } catch (analysisError) {
      console.error('Acoustic analysis failed:', analysisError)
      return NextResponse.json(
        { error: 'Failed to analyze audio features' },
        { status: 500 }
      )
    }
    
    // 評価実行
    console.log('Evaluating acoustic features...')
    let evaluation
    try {
      evaluation = evaluateAcousticFeatures(acousticFeatures, targetText)
      console.log('Evaluation completed, overall score:', evaluation.overallScore)
    } catch (evaluationError) {
      console.error('Evaluation failed:', evaluationError)
      return NextResponse.json(
        { error: 'Failed to evaluate audio' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      evaluation,
      acousticFeatures,
      targetText,
      evaluationType: 'acoustic'
    })
    
  } catch (error) {
    console.error('=== Audio Analysis Error ===')
    console.error('Error type:', error?.constructor?.name)
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown error')
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    console.error('Full error object:', error)
    
    return NextResponse.json(
      { error: 'Failed to analyze audio' },
      { status: 500 }
    )
  }
} 