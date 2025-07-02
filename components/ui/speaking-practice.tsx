"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { SoundButton } from "@/components/ui/sound-button"
import { Mic, MicOff, Play, Pause, RotateCcw } from "lucide-react"

interface SpeakingPracticeProps {
  text: string
  phonetic: string
  meaning: string
  onComplete: () => void
}

export function SpeakingPractice({ text, phonetic, meaning, onComplete }: SpeakingPracticeProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [hasRecording, setHasRecording] = useState(false)
  const [isPlayingRecording, setIsPlayingRecording] = useState(false)
  const [recordingBlobUrl, setRecordingBlobUrl] = useState<string | null>(null)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [isPermissionGranted, setIsPermissionGranted] = useState<boolean | null>(null)
  
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const chunksRef = useRef<Blob[]>([])

  useEffect(() => {
    // Check for microphone permission
    checkMicrophonePermission()
    
    return () => {
      // Cleanup
      if (recordingBlobUrl) {
        URL.revokeObjectURL(recordingBlobUrl)
      }
    }
  }, [recordingBlobUrl])

  const checkMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      setIsPermissionGranted(true)
      stream.getTracks().forEach(track => track.stop()) // Stop the stream immediately
    } catch (error) {
      console.error("Microphone permission denied:", error)
      setIsPermissionGranted(false)
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        }
      })

      const recorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
      })

      chunksRef.current = []

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: recorder.mimeType })
        const url = URL.createObjectURL(blob)
        setRecordingBlobUrl(url)
        setHasRecording(true)
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop())
      }

      recorder.start()
      setMediaRecorder(recorder)
      setIsRecording(true)
    } catch (error) {
      console.error("Error starting recording:", error)
      setIsPermissionGranted(false)
    }
  }

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop()
      setIsRecording(false)
    }
  }

  const playRecording = () => {
    if (recordingBlobUrl && audioRef.current) {
      audioRef.current.src = recordingBlobUrl
      audioRef.current.play()
      setIsPlayingRecording(true)
    }
  }

  const pauseRecording = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlayingRecording(false)
    }
  }

  const resetRecording = () => {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }
    if (recordingBlobUrl) {
      URL.revokeObjectURL(recordingBlobUrl)
    }
    setRecordingBlobUrl(null)
    setHasRecording(false)
    setIsPlayingRecording(false)
  }

  const handleAudioEnded = () => {
    setIsPlayingRecording(false)
  }

  if (isPermissionGranted === false) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="bg-yellow-50 p-4 rounded-xl mb-4 border border-yellow-200">
            <p className="text-yellow-800 font-medium mb-2">🎤 マイクの許可が必要です</p>
            <p className="text-sm text-yellow-700">
              スピーキング練習にはマイクへのアクセスが必要です。<br/>
              ブラウザの設定でマイクの許可を有効にしてください。
            </p>
          </div>
          <Button
            onClick={checkMicrophonePermission}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            マイクの許可を再確認
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Hidden audio element for playback */}
      <audio 
        ref={audioRef}
        onEnded={handleAudioEnded}
        style={{ display: 'none' }}
      />

      <div className="text-center">
        <p className="text-lg font-medium text-gray-700 mb-4">
          発音記号を参考に、正しく発音してみましょう
        </p>
        
        <div className="bg-blue-50 p-6 rounded-xl mb-6">
          <p className="text-3xl font-bold text-blue-800 mb-2">{text}</p>
          <p className="text-xl text-blue-600 mb-2">/{phonetic}/</p>
          <p className="text-sm text-gray-600">意味: {meaning}</p>
        </div>

        <div className="mb-6">
          <p className="text-sm text-gray-600 mb-2">🔊 まずはお手本を聞いてみましょう</p>
          <SoundButton text={text} className="mx-auto" />
        </div>
      </div>

      {/* Recording Section */}
      <div className="bg-gray-50 p-6 rounded-xl">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
          🎤 あなたの発音を録音してみましょう
        </h3>

        <div className="flex flex-col items-center space-y-4">
          {/* Recording Controls */}
          <div className="flex items-center space-x-4">
            {!isRecording ? (
              <Button
                onClick={startRecording}
                disabled={isPermissionGranted !== true}
                className="bg-red-500 hover:bg-red-600 text-white flex items-center space-x-2 px-6 py-3"
              >
                <Mic className="w-5 h-5" />
                <span>録音開始</span>
              </Button>
            ) : (
              <Button
                onClick={stopRecording}
                className="bg-gray-600 hover:bg-gray-700 text-white flex items-center space-x-2 px-6 py-3 animate-pulse"
              >
                <MicOff className="w-5 h-5" />
                <span>録音停止</span>
              </Button>
            )}

            {hasRecording && (
              <Button
                onClick={resetRecording}
                variant="outline"
                className="flex items-center space-x-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>やり直し</span>
              </Button>
            )}
          </div>

          {/* Recording Status */}
          {isRecording && (
            <div className="flex items-center space-x-2 text-red-600">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">録音中...</span>
            </div>
          )}

          {/* Playback Controls */}
          {hasRecording && (
            <div className="w-full">
              <div className="flex justify-center space-x-4 mb-4">
                {!isPlayingRecording ? (
                  <Button
                    onClick={playRecording}
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <Play className="w-4 h-4" />
                    <span>録音を再生</span>
                  </Button>
                ) : (
                  <Button
                    onClick={pauseRecording}
                    variant="outline"
                    className="flex items-center space-x-2"
                  >
                    <Pause className="w-4 h-4" />
                    <span>一時停止</span>
                  </Button>
                )}
              </div>

              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-sm text-green-700 text-center mb-3">
                  ✅ 録音完了！お手本と聴き比べてみましょう
                </p>
                <div className="flex justify-center space-x-3">
                  <SoundButton text={text} className="flex-shrink-0" />
                  <span className="text-sm text-gray-500 self-center">VS</span>
                  <Button
                    onClick={playRecording}
                    size="icon"
                    variant="outline"
                    className="flex-shrink-0"
                  >
                    <Play className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Complete Button */}
      {hasRecording && (
        <Button
          onClick={onComplete}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4"
        >
          練習完了 ✨
        </Button>
      )}

      {!hasRecording && (
        <div className="text-center text-sm text-gray-500">
          録音してから練習を完了できます
        </div>
      )}
    </div>
  )
} 