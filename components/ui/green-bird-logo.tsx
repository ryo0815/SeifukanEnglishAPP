import { cn } from "@/lib/utils"

interface GreenBirdLogoProps {
  className?: string
}

export function GreenBirdLogo({ className }: GreenBirdLogoProps) {
  return (
    <svg viewBox="0 0 32 32" className={cn("w-8 h-8", className)} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Bird body */}
      <ellipse cx="16" cy="20" rx="12" ry="8" fill="#58CC02" />

      {/* Bird head */}
      <circle cx="16" cy="12" r="8" fill="#58CC02" />

      {/* Beak */}
      <path d="M8 12 L4 10 L8 14 Z" fill="#FF8C00" />

      {/* Eyes */}
      <circle cx="14" cy="10" r="2" fill="white" />
      <circle cx="18" cy="10" r="2" fill="white" />
      <circle cx="14" cy="10" r="1" fill="black" />
      <circle cx="18" cy="10" r="1" fill="black" />

      {/* Wing */}
      <ellipse cx="20" cy="18" rx="4" ry="6" fill="#89E219" />

      {/* Tail feathers */}
      <ellipse cx="26" cy="22" rx="3" ry="4" fill="#89E219" transform="rotate(30 26 22)" />

      {/* Feet */}
      <ellipse cx="12" cy="28" rx="2" ry="1" fill="#FF8C00" />
      <ellipse cx="20" cy="28" rx="2" ry="1" fill="#FF8C00" />
    </svg>
  )
}
