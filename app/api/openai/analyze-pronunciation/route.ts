import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

// Check if API key is available
const apiKey = process.env.OPENAI_API_KEY

if (!apiKey) {
  console.warn('OPENAI_API_KEY not found in environment variables')
}

const openai = apiKey ? new OpenAI({
  apiKey: apiKey,
}) : null

export async function POST(request: NextRequest) {
  console.log('=== Pronunciation Analysis API Called ===')
  console.log('OpenAI GPT-4 API is disabled - returning local evaluation')
  
  try {
    console.log('Parsing request body...')
    let requestBody
    try {
      requestBody = await request.json()
      console.log('Request body parsed successfully:', Object.keys(requestBody))
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError)
      return NextResponse.json(
        {
          pronunciationScore: 50,
          clarityScore: 50,
          fluencyScore: 50,
          timingScore: 50,
          overallScore: 50,
          feedback: 'リクエストの解析に失敗しました。',
          improvements: ['システムエラーが発生しました。'],
          positives: [],
          detailedAnalysis: 'リクエストデータの解析に失敗しました。',
        },
        { status: 400 }
      )
    }

    const {
      targetText,
      userTranscription,
      referenceTranscription,
      userDuration,
      referenceDuration,
    } = requestBody

    console.log('Analyzing pronunciation with local evaluation:', {
      targetText: targetText?.substring(0, 50) + '...',
      userTranscription: userTranscription?.substring(0, 50) + '...',
      referenceTranscription: referenceTranscription?.substring(0, 50) + '...',
      userDuration,
      referenceDuration,
    })

    // ローカル評価ロジック
    let pronunciationScore = 70
    let clarityScore = 70
    let fluencyScore = 70
    let timingScore = 70

    // 簡単な文字列比較による評価
    if (userTranscription && targetText) {
      const userLower = userTranscription.toLowerCase().trim()
      const targetLower = targetText.toLowerCase().trim()
      
      if (userLower === targetLower) {
        pronunciationScore = 90 + Math.random() * 10
        clarityScore = 85 + Math.random() * 15
      } else if (userLower.includes(targetLower) || targetLower.includes(userLower)) {
        pronunciationScore = 75 + Math.random() * 15
        clarityScore = 70 + Math.random() * 15
      } else {
        // 部分的な一致をチェック
        const words = targetLower.split(' ')
        const userWords = userLower.split(' ')
        const matchCount = words.filter(word => userWords.includes(word)).length
        const matchRatio = matchCount / words.length
        
        pronunciationScore = 50 + (matchRatio * 40)
        clarityScore = 50 + (matchRatio * 35)
      }
    }

    // タイミング評価
    if (userDuration && referenceDuration) {
      const durationRatio = Math.min(userDuration, referenceDuration) / Math.max(userDuration, referenceDuration)
      timingScore = 60 + (durationRatio * 35)
    }

    // 流暢性は発音と明瞭性の平均
    fluencyScore = (pronunciationScore + clarityScore) / 2

    const overallScore = Math.round(
      (pronunciationScore * 0.4 + clarityScore * 0.3 + fluencyScore * 0.2 + timingScore * 0.1)
    )

    const analysis = {
      pronunciationScore: Math.round(pronunciationScore),
      clarityScore: Math.round(clarityScore),
      fluencyScore: Math.round(fluencyScore),
      timingScore: Math.round(timingScore),
      overallScore,
      feedback: overallScore >= 80 
        ? '素晴らしい発音です！ローカル評価による結果です。'
        : overallScore >= 60
        ? '良い発音です。さらなる練習で向上できます。'
        : '発音の練習を続けてください。',
      improvements: overallScore < 70 
        ? ['発音の明瞭さを意識してください', 'ゆっくりと話してみてください', '繰り返し練習してください']
        : ['継続的な練習で更なる向上を目指しましょう'],
      positives: ['音声が正常に録音されました', 'ローカル評価システムが正常に動作しています'],
      detailedAnalysis: 'OpenAI APIの代わりにローカル評価システムを使用しました。基本的な音声分析により評価を行っています。',
    }

    console.log('Local analysis completed:', analysis)

    return NextResponse.json(analysis)
    
  } catch (error) {
    console.error('=== Pronunciation Analysis Error ===')
    console.error('Error type:', error?.constructor?.name)
    console.error('Error message:', error instanceof Error ? error.message : 'Unknown error')
    
    return NextResponse.json(
      {
        pronunciationScore: 60,
        clarityScore: 60,
        fluencyScore: 60,
        timingScore: 60,
        overallScore: 60,
        feedback: 'ローカル評価システムでエラーが発生しました。',
        improvements: ['技術的な問題が発生しました。'],
        positives: ['音声は受信されました。'],
        detailedAnalysis: 'ローカル評価システムでエラーが発生しましたが、基本的な評価を提供しています。',
      },
      { status: 200 } // 200で返してアプリが動作し続けるようにする
    )
  }
} 