/**
 * WebM音声をWAV形式に変換
 */
export async function convertWebMToWav(webmBlob: Blob): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = () => {
      const arrayBuffer = reader.result as ArrayBuffer
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      
      audioContext.decodeAudioData(arrayBuffer)
        .then(audioBuffer => {
          // 16kHzにリサンプリング（Azure Speech Serviceの推奨）
          const resampledBuffer = resampleAudioBuffer(audioBuffer, 16000)
          const wavBlob = audioBufferToWav(resampledBuffer)
          resolve(wavBlob)
        })
        .catch(reject)
    }
    
    reader.onerror = reject
    reader.readAsArrayBuffer(webmBlob)
  })
}

/**
 * AudioBufferを指定したサンプルレートにリサンプリング
 */
function resampleAudioBuffer(audioBuffer: AudioBuffer, targetSampleRate: number): AudioBuffer {
  if (audioBuffer.sampleRate === targetSampleRate) {
    return audioBuffer
  }
  
  const ratio = audioBuffer.sampleRate / targetSampleRate
  const newLength = Math.round(audioBuffer.length / ratio)
  
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  const newBuffer = audioContext.createBuffer(1, newLength, targetSampleRate)
  
  const oldData = audioBuffer.getChannelData(0)
  const newData = newBuffer.getChannelData(0)
  
  for (let i = 0; i < newLength; i++) {
    const oldIndex = Math.round(i * ratio)
    newData[i] = oldData[oldIndex] || 0
  }
  
  return newBuffer
}

/**
 * AudioBufferをWAV形式のBlobに変換
 */
export function audioBufferToWav(audioBuffer: AudioBuffer): Blob {
  const numChannels = 1 // モノラル
  const sampleRate = audioBuffer.sampleRate
  const format = 1 // PCM
  const bitDepth = 16
  
  const bytesPerSample = bitDepth / 8
  const blockAlign = numChannels * bytesPerSample
  const dataSize = audioBuffer.length * bytesPerSample
  const bufferSize = 44 + dataSize
  
  const buffer = new ArrayBuffer(bufferSize)
  const view = new DataView(buffer)
  
  // WAVヘッダーを書き込み
  writeString(view, 0, 'RIFF')
  view.setUint32(4, bufferSize - 8, true)
  writeString(view, 8, 'WAVE')
  writeString(view, 12, 'fmt ')
  view.setUint32(16, 16, true) // フォーマットチャンクサイズ
  view.setUint16(20, format, true) // PCM = 1
  view.setUint16(22, numChannels, true)
  view.setUint32(24, sampleRate, true)
  view.setUint32(28, sampleRate * blockAlign, true) // バイト/秒
  view.setUint16(32, blockAlign, true)
  view.setUint16(34, bitDepth, true)
  writeString(view, 36, 'data')
  view.setUint32(40, dataSize, true)
  
  // 音声データを書き込み
  const channelData = audioBuffer.getChannelData(0)
  let offset = 44
  
  for (let i = 0; i < channelData.length; i++) {
    const sample = Math.max(-1, Math.min(1, channelData[i]))
    const intSample = sample < 0 ? sample * 0x8000 : sample * 0x7FFF
    view.setInt16(offset, intSample, true)
    offset += 2
  }
  
  return new Blob([buffer], { type: 'audio/wav' })
}

/**
 * DataViewに文字列を書き込み
 */
function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i))
  }
}

/**
 * 録音時間をフォーマット
 */
export function formatRecordingTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

/**
 * マイクの権限を確認
 */
export async function checkMicrophonePermission(): Promise<boolean> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
    stream.getTracks().forEach(track => track.stop())
    return true
  } catch (error) {
    console.error('Microphone permission denied:', error)
    return false
  }
}

/**
 * 音声の品質をチェック
 */
export function analyzeAudioQuality(audioBuffer: AudioBuffer): {
  volume: number
  duration: number
  hasAudio: boolean
} {
  const channelData = audioBuffer.getChannelData(0)
  let sum = 0
  let hasSignificantAudio = false
  
  for (let i = 0; i < channelData.length; i++) {
    const sample = Math.abs(channelData[i])
    sum += sample
    
    if (sample > 0.01) { // 無音判定のしきい値
      hasSignificantAudio = true
    }
  }
  
  const averageVolume = sum / channelData.length
  const duration = audioBuffer.duration
  
  return {
    volume: averageVolume,
    duration,
    hasAudio: hasSignificantAudio && duration > 0.5 // 0.5秒以上の音声があるかチェック
  }
} 