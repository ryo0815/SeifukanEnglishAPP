// Azure Speech Service Configuration
export const AZURE_SPEECH_CONFIG = {
  key: process.env.AZURE_SPEECH_KEY || '6efG0moi4cGbr9kRJ6RUGUB5EVfxAjwl1lUxHXaT2xpke7AETDAEJQQJ99BGACxCCsyXJ3w3AAAYACOGFUjj',
  region: process.env.AZURE_SPEECH_REGION || 'japanwest',
  endpoint: process.env.AZURE_SPEECH_ENDPOINT || 'https://japanwest.api.cognitive.microsoft.com/'
}

export interface PronunciationAssessmentConfig {
  referenceText: string
  gradingSystem: 'FivePoint' | 'HundredMark'
  granularity: 'Phoneme' | 'Word' | 'FullText'
  dimension: 'Basic' | 'Comprehensive'
  enableMiscue: boolean
}

export interface AzurePronunciationResult {
  NBest: Array<{
    Confidence: number
    Lexical: string
    ITN: string
    MaskedITN: string
    Display: string
    PronunciationAssessment: {
      AccuracyScore: number
      FluencyScore: number
      CompletenessScore: number
      PronunciationScore: number
    }
    Words: Array<{
      Word: string
      Offset: number
      Duration: number
      PronunciationAssessment: {
        AccuracyScore: number
        ErrorType: 'None' | 'Omission' | 'Insertion' | 'Mispronunciation'
      }
      Syllables?: Array<{
        Syllable: string
        PronunciationAssessment: {
          AccuracyScore: number
        }
        Phonemes?: Array<{
          Phoneme: string
          PronunciationAssessment: {
            AccuracyScore: number
          }
        }>
      }>
    }>
  }>
  RecognitionStatus: string
  Offset: number
  Duration: number
}

export function createPronunciationAssessmentConfig(
  referenceText: string,
  options: Partial<PronunciationAssessmentConfig> = {}
): PronunciationAssessmentConfig {
  return {
    referenceText,
    gradingSystem: options.gradingSystem || 'HundredMark',
    granularity: options.granularity || 'Phoneme',
    dimension: options.dimension || 'Comprehensive',
    enableMiscue: options.enableMiscue || false
  }
}

export function createAzureHeaders(config: PronunciationAssessmentConfig) {
  const headers = new Headers()
  headers.append('Ocp-Apim-Subscription-Key', AZURE_SPEECH_CONFIG.key)
  headers.append('Content-Type', 'audio/wav; codecs=audio/pcm; samplerate=16000')
  headers.append('Accept', 'application/json')
  
  const pronunciationAssessmentParams = {
    ReferenceText: config.referenceText,
    GradingSystem: config.gradingSystem,
    Granularity: config.granularity,
    Dimension: config.dimension,
    EnableMiscue: config.enableMiscue
  }
  
  headers.append('Pronunciation-Assessment', JSON.stringify(pronunciationAssessmentParams))
  
  return headers
}

export function createAzureUrl(language: string = 'en-US') {
  const url = new URL(AZURE_SPEECH_CONFIG.endpoint)
  url.searchParams.append('language', language)
  url.searchParams.append('format', 'detailed')
  return url
}

export function processAzureResult(result: AzurePronunciationResult, referenceText: string) {
  const nBest = result.NBest?.[0]
  const pronunciationAssessment = nBest?.PronunciationAssessment
  
  if (!pronunciationAssessment) {
    return {
      error: 'No pronunciation assessment data received',
      overallScore: 0,
      overallGrade: 'F' as const,
      gradeDescription: 'エラー - 音声を認識できませんでした',
      improvements: ['もう一度録音してください'],
      positives: [],
      feedback: '音声が正しく認識されませんでした。'
    }
  }

  const accuracyScore = pronunciationAssessment.AccuracyScore || 0
  const fluencyScore = pronunciationAssessment.FluencyScore || 0
  const completenessScore = pronunciationAssessment.CompletenessScore || 0
  const pronunciationScore = pronunciationAssessment.PronunciationScore || 0
  
  const overallScore = Math.round(pronunciationScore)
  const gradeResult = scoreToGrade(overallScore)
  
  const words = nBest?.Words || []
  const wordDetails = words.map(word => ({
    word: word.Word,
    accuracy: word.PronunciationAssessment?.AccuracyScore || 0,
    errorType: word.PronunciationAssessment?.ErrorType || 'None'
  }))
  
  const improvements = generateImprovements(accuracyScore, fluencyScore, completenessScore, wordDetails)
  const positives = generatePositives(accuracyScore, fluencyScore, completenessScore)
  const feedback = generateFeedback(overallScore, accuracyScore, fluencyScore, referenceText)
  
  return {
    overallScore,
    overallGrade: gradeResult.grade,
    gradeDescription: gradeResult.description,
    pronunciationScore,
    accuracyScore,
    fluencyScore,
    completenessScore,
    recognizedText: nBest?.Display || '',
    wordDetails,
    improvements,
    positives,
    feedback
  }
}

function scoreToGrade(score: number): { grade: 'A' | 'B' | 'C' | 'D' | 'F', description: string } {
  if (score >= 80) {
    return { grade: 'A', description: '優秀 - ネイティブレベルの発音' }
  } else if (score >= 70) {
    return { grade: 'B', description: '良好 - 自然な発音' }
  } else if (score >= 60) {
    return { grade: 'C', description: '普通 - 理解できる発音' }
  } else if (score >= 40) {
    return { grade: 'D', description: '要改善 - 練習が必要' }
  } else {
    return { grade: 'F', description: '不合格 - 大幅な改善が必要' }
  }
}

function generateImprovements(accuracy: number, fluency: number, completeness: number, wordDetails: any[]): string[] {
  const improvements = []
  
  if (accuracy < 70) {
    improvements.push('単語の発音をもっと正確に')
  }
  
  if (fluency < 70) {
    improvements.push('もっと自然な話し方で')
  }
  
  if (completeness < 90) {
    improvements.push('最後まで完全に発音しましょう')
  }
  
  const problemWords = wordDetails.filter(w => w.accuracy < 60)
  if (problemWords.length > 0) {
    improvements.push(`特に「${problemWords[0].word}」の発音を練習してください`)
  }
  
  if (improvements.length === 0) {
    improvements.push('さらなる練習で完璧を目指しましょう')
  }
  
  return improvements
}

function generatePositives(accuracy: number, fluency: number, completeness: number): string[] {
  const positives = []
  
  if (accuracy >= 80) {
    positives.push('発音の正確性が素晴らしい！')
  }
  
  if (fluency >= 80) {
    positives.push('自然な流暢さです！')
  }
  
  if (completeness >= 90) {
    positives.push('最後まで完璧に発音できました！')
  }
  
  if (positives.length === 0 && accuracy >= 60) {
    positives.push('良い発音です！')
  }
  
  return positives
}

function generateFeedback(overallScore: number, accuracy: number, fluency: number, referenceText: string): string {
  if (overallScore >= 80) {
    return `素晴らしい発音です！「${referenceText}」を${overallScore}点で発音できました。`
  } else if (overallScore >= 60) {
    return `良い発音です！「${referenceText}」をもう少し練習すると更に良くなります。`
  } else {
    return `「${referenceText}」の発音を練習しましょう。お手本をよく聞いて再挑戦してください。`
  }
} 