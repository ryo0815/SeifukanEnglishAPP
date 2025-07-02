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
  console.log('OpenAI Transcribe API called - returning unavailable message')
  
  // OpenAI Whisper APIは無料でないため利用不可
  return NextResponse.json(
    { 
      error: 'OpenAI Whisper API is not available', 
      details: 'This service requires a paid OpenAI subscription. Using local speech recognition instead.' 
    },
    { status: 503 } // Service Unavailable
  )
} 