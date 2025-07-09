"use client"

import { ReactNode } from "react"
import { GameProvider } from "@/contexts/game-context"
import { SoundProvider } from "@/contexts/sound-context"

interface ProvidersProps {
  children: ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <GameProvider>
      <SoundProvider>
        {children}
      </SoundProvider>
    </GameProvider>
  )
}
