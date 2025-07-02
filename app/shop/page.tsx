"use client"

import { useState } from "react"
import { TopBar } from "@/components/layout/top-bar"
import { BottomNav } from "@/components/layout/bottom-nav"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useGame } from "@/contexts/game-context"
import { useToast } from "@/hooks/use-toast"
import { Heart, Zap, Shield, Clock, Gem } from "lucide-react"

const shopItems = [
  {
    id: "refill-hearts",
    name: "Refill Hearts",
    description: "Get 5 full hearts instantly",
    price: 350,
    icon: Heart,
    color: "text-red-500",
    bgColor: "bg-red-50",
  },
  {
    id: "double-xp",
    name: "Double XP",
    description: "2x XP for the next 30 minutes",
    price: 200,
    icon: Zap,
    color: "text-yellow-500",
    bgColor: "bg-yellow-50",
  },
  {
    id: "mistake-protection",
    name: "Mistake Protection",
    description: "Don't lose hearts for 1 hour",
    price: 400,
    icon: Shield,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  {
    id: "time-freeze",
    name: "Time Freeze",
    description: "Freeze your streak for 24 hours",
    price: 100,
    icon: Clock,
    color: "text-purple-500",
    bgColor: "bg-purple-50",
  },
]

export default function ShopPage() {
  const { state, dispatch } = useGame()
  const { toast } = useToast()
  const [purchasing, setPurchasing] = useState<string | null>(null)

  const handlePurchase = async (item: (typeof shopItems)[0]) => {
    if (state.gems < item.price) {
      toast({
        title: "Not enough gems!",
        description: `You need ${item.price - state.gems} more gems to buy this item.`,
        variant: "destructive",
      })
      return
    }

    setPurchasing(item.id)

    // Simulate purchase delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    dispatch({ type: "SPEND_GEMS", amount: item.price })

    switch (item.id) {
      case "refill-hearts":
        dispatch({ type: "REFILL_HEARTS" })
        break
      case "double-xp":
        // In a real app, you'd set a temporary boost flag
        toast({
          title: "Double XP activated!",
          description: "You'll earn 2x XP for the next 30 minutes.",
        })
        break
      case "mistake-protection":
        toast({
          title: "Mistake protection activated!",
          description: "You won't lose hearts for the next hour.",
        })
        break
      case "time-freeze":
        toast({
          title: "Streak freeze activated!",
          description: "Your streak is protected for 24 hours.",
        })
        break
    }

    toast({
      title: "Purchase successful!",
      description: `You bought ${item.name}.`,
    })

    setPurchasing(null)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />

      <div className="p-4 pb-20">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Shop</h1>
          <p className="text-gray-600">Use gems to boost your learning</p>
        </div>

        {/* Gem balance */}
        <Card className="p-6 mb-6 bg-gradient-to-r from-blue-400 to-purple-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold">Your Gems</h2>
              <p className="text-blue-100">Earn more by completing lessons!</p>
            </div>
            <div className="flex items-center space-x-2">
              <Gem className="w-8 h-8 text-blue-200" />
              <span className="text-3xl font-bold">{state.gems}</span>
            </div>
          </div>
        </Card>

        {/* Shop items */}
        <div className="space-y-4">
          {shopItems.map((item) => {
            const Icon = item.icon
            const canAfford = state.gems >= item.price
            const isPurchasing = purchasing === item.id

            return (
              <Card key={item.id} className="p-6">
                <div className="flex items-center space-x-4">
                  <div className={`w-12 h-12 rounded-xl ${item.bgColor} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${item.color}`} />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800">{item.name}</h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center space-x-1">
                        <Gem className="w-4 h-4 text-blue-500" />
                        <span className="font-bold text-blue-600">{item.price}</span>
                      </div>

                      <Button
                        onClick={() => handlePurchase(item)}
                        disabled={!canAfford || isPurchasing}
                        className={`${
                          canAfford ? "bg-green-500 hover:bg-green-600" : "bg-gray-300 text-gray-500 cursor-not-allowed"
                        }`}
                      >
                        {isPurchasing ? "Buying..." : "Buy"}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>

        {/* Earn more gems section */}
        <Card className="p-6 mt-8 bg-gradient-to-r from-green-400 to-green-600 text-white">
          <h3 className="text-lg font-bold mb-2">Need more gems?</h3>
          <p className="text-green-100 mb-4">Complete lessons and maintain your streak to earn gems!</p>
          <ul className="space-y-2 text-sm">
            <li>• Complete a lesson: +5 gems</li>
            <li>• Perfect lesson score: +3 bonus gems</li>
            <li>• 7-day streak: +25 gems</li>
            <li>• Daily login: +2 gems</li>
          </ul>
        </Card>
      </div>

      <BottomNav />
    </div>
  )
}
