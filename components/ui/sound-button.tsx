"use client"

import { Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSound } from "@/contexts/sound-context"
import { useState, useEffect } from "react"

interface SoundButtonProps {
  audioSrc?: string
  text?: string
  className?: string
  autoPlay?: boolean
  language?: string
  rate?: number
  pitch?: number
}

export function SoundButton({ 
  audioSrc, 
  text, 
  className, 
  autoPlay = false,
  language = "en-US",
  rate = 0.8,
  pitch = 1.0
}: SoundButtonProps) {
  const { playSound, isSoundEnabled } = useSound()
  const [isPlaying, setIsPlaying] = useState(false)
  const [canSpeak, setCanSpeak] = useState(false)

  useEffect(() => {
    // Check if speech synthesis is available
    setCanSpeak('speechSynthesis' in window)
    
    // Wait for voices to be loaded
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices()
      if (voices.length > 0) {
        setCanSpeak(true)
        if (autoPlay && text && isSoundEnabled) {
          setTimeout(() => speakText(), 1000) // Increased delay for better reliability
        }
      }
    }

    if ('speechSynthesis' in window) {
      loadVoices()
      window.speechSynthesis.onvoiceschanged = loadVoices
    }
  }, [autoPlay, text, isSoundEnabled])

  const speakText = () => {
    if (!canSpeak || !text || !isSoundEnabled) return

    // Cancel any ongoing speech
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = language
    utterance.rate = rate
    utterance.pitch = pitch
    utterance.volume = 0.8

    utterance.onstart = () => setIsPlaying(true)
    utterance.onend = () => setIsPlaying(false)
    utterance.onerror = () => setIsPlaying(false)

    // Get available voices
    const voices = window.speechSynthesis.getVoices()
    const voice = voices.find(v => v.lang.startsWith(language)) || voices[0]
    if (voice) {
      utterance.voice = voice
    }

    window.speechSynthesis.speak(utterance)
    playSound("click")
  }



  const handlePlay = () => {
    if (isPlaying) {
      // Stop current playback
      window.speechSynthesis.cancel()
      setIsPlaying(false)
      return
    }

    // Always use Web Speech API for pronunciation practice
    if (text) {
      speakText()
    }
  }

  if (!isSoundEnabled) {
    return (
      <Button variant="outline" size="icon" className={`${className} opacity-50 cursor-not-allowed`} disabled>
        <VolumeX className="w-4 h-4" />
      </Button>
    )
  }

  return (
    <Button 
      variant="outline" 
      size="icon" 
      onClick={handlePlay} 
      className={`${className} audio-button ${isPlaying ? 'playing' : ''} transition-all duration-300`}
      disabled={!canSpeak || !text}
    >
      {isPlaying ? (
        <div className="flex items-center space-x-0.5">
          <div className="audio-wave"></div>
          <div className="audio-wave"></div>
          <div className="audio-wave"></div>
          <div className="audio-wave"></div>
        </div>
      ) : (
        <Volume2 className="w-4 h-4" />
      )}
    </Button>
  )
}
