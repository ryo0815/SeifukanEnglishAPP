import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Check for API key
    if (!process.env.GOOGLE_CLOUD_API_KEY) {
      console.error('GOOGLE_CLOUD_API_KEY is not set')
      return NextResponse.json(
        { error: 'API configuration error' },
        { status: 500 }
      )
    }

    const formData = await request.formData()
    const audioFile = formData.get('audio') as File
    
    if (!audioFile) {
      return NextResponse.json(
        { error: 'Audio file is required' },
        { status: 400 }
      )
    }

    // Convert file to base64
    const arrayBuffer = await audioFile.arrayBuffer()
    const audioBytes = Buffer.from(arrayBuffer).toString('base64')

    // Google Cloud Speech-to-Text API request
    const response = await fetch(
      `https://speech.googleapis.com/v1/speech:recognize?key=${process.env.GOOGLE_CLOUD_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          config: {
            encoding: 'WEBM_OPUS',
            sampleRateHertz: 48000,
            languageCode: 'en-US',
            enableAutomaticPunctuation: true,
            model: 'latest_long',
          },
          audio: {
            content: audioBytes,
          },
        }),
      }
    )

    if (!response.ok) {
      throw new Error(`Google API error: ${response.statusText}`)
    }

    const data = await response.json()
    
    // Extract transcription
    const transcription = data.results?.[0]?.alternatives?.[0]?.transcript || ''
    
    return NextResponse.json({
      transcription,
      confidence: data.results?.[0]?.alternatives?.[0]?.confidence || 0,
    })
    
  } catch (error) {
    console.error('Transcription error:', error)
    return NextResponse.json(
      { error: 'Failed to transcribe audio' },
      { status: 500 }
    )
  }
} 