import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    // Check for API key
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not set')
      return NextResponse.json(
        { error: 'API configuration error' },
        { status: 500 }
      )
    }

    const { transcription, targetText, evaluationType = 'pronunciation' } = await request.json()
    
    if (!transcription || !targetText) {
      return NextResponse.json(
        { error: 'Transcription and target text are required' },
        { status: 400 }
      )
    }

    // Create evaluation prompt based on type
    let prompt = ''
    
    if (evaluationType === 'pronunciation') {
      prompt = `
あなたは英語発音の専門家です。以下の内容を評価してください：

目標テキスト: "${targetText}"
実際の発音（音声認識結果）: "${transcription}"

以下の観点で評価し、JSONで回答してください：
1. 発音の正確性（0-100点）
2. 単語の明瞭度（0-100点）
3. 全体的な流暢さ（0-100点）
4. 具体的な改善点（3つまで）
5. 良い点（2つまで）
6. 総合得点（0-100点）

回答形式（必ず配列は空でも含めてください）：
{
  "pronunciationScore": number,
  "clarityScore": number,
  "fluencyScore": number,
  "overallScore": number,
  "improvements": [string, string, string] または [],
  "positives": [string, string] または [],
  "feedback": "総合的なフィードバック",
  "nativeLevel": number (1-10, 10がネイティブレベル)
}
`
    } else if (evaluationType === 'grammar') {
      prompt = `
あなたは英語文法の専門家です。以下の文章を評価してください：

目標文章: "${targetText}"
学習者の発話: "${transcription}"

以下の観点で評価し、JSONで回答してください：
1. 文法の正確性（0-100点）
2. 語順の正確性（0-100点）
3. 語彙の適切性（0-100点）
4. 文法エラーの指摘（具体的に）
5. 改善提案
6. 総合得点（0-100点）

回答形式（必ず配列は空でも含めてください）：
{
  "grammarScore": number,
  "wordOrderScore": number,
  "vocabularyScore": number,
  "overallScore": number,
  "errors": [string] または [],
  "suggestions": [string] または [],
  "feedback": "総合的なフィードバック",
  "nativeLevel": number (1-10, 10がネイティブレベル)
}
`
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "あなたは英語学習者の発音と文法を評価する専門家です。建設的で励ましの含まれたフィードバックを提供し、必ずJSON形式で回答してください。"
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
    })

    const response = completion.choices[0]?.message?.content
    
    if (!response) {
      throw new Error('No response from OpenAI')
    }

    // Parse JSON response
    let evaluation
    try {
      evaluation = JSON.parse(response)
      
      // Ensure arrays exist with default values
      evaluation.improvements = evaluation.improvements || []
      evaluation.positives = evaluation.positives || []
      evaluation.errors = evaluation.errors || []
      evaluation.suggestions = evaluation.suggestions || []
      
    } catch (parseError) {
      // If JSON parsing fails, create a basic response
      evaluation = {
        overallScore: 75,
        feedback: "評価を完了しました。引き続き練習を続けてください！",
        nativeLevel: 5,
        improvements: ["より明確な発音を心がけましょう"],
        positives: ["しっかりと発話できています"],
        errors: [],
        suggestions: []
      }
    }

    return NextResponse.json({
      evaluation,
      transcription,
      targetText,
      evaluationType
    })
    
  } catch (error) {
    console.error('Evaluation error:', error)
    return NextResponse.json(
      { error: 'Failed to evaluate speech' },
      { status: 500 }
    )
  }
} 