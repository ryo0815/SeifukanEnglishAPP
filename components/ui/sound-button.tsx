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

    // Check if we have a specific audio file for this text
    const actualAudioSrc = audioSrc || getAudioFileForText(text)
    
    if (actualAudioSrc) {
      playAudioFileFromSrc(actualAudioSrc)
    } else if (text) {
      speakText()
    }
  }

  const getAudioFileForText = (text?: string): string | null => {
    // Return audio file path for specific phrases
    if (text === "Hello, how are you?") {
      return "/audio/hello-how-are-you.mp3"
    }
    return null
  }

  const playAudioFileFromSrc = async (src: string) => {
    try {
      setIsPlaying(true)
      const audio = new Audio(src)
      
      audio.onended = () => setIsPlaying(false)
      audio.onerror = () => {
        setIsPlaying(false)
        // Fallback to text-to-speech if audio file fails
        if (text) {
          speakText()
        }
      }
      
      await audio.play()
      playSound("click")
    } catch (error) {
      setIsPlaying(false)
      console.error("Audio playback failed:", error)
      // Fallback to text-to-speech
      if (text) {
        speakText()
      }
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
      disabled={!canSpeak && !audioSrc}
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
