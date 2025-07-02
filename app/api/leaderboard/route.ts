import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

const prisma = new PrismaClient()

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'xp'
    const limit = parseInt(searchParams.get('limit') || '20')

    let orderBy = {}
    
    switch (type) {
      case 'xp':
        orderBy = { totalXp: 'desc' }
        break
      case 'streak':
        orderBy = { streak: 'desc' }
        break
      case 'lessons':
        orderBy = { completedLessons: { _count: 'desc' } }
        break
      default:
        orderBy = { totalXp: 'desc' }
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        image: true,
        totalXp: true,
        streak: true,
        currentStage: true,
        currentSubStage: true,
        _count: {
          select: {
            completedLessons: true
          }
        }
      },
      orderBy,
      take: limit
    })

    const leaderboard = users.map((user: any, index: number) => ({
      ...user,
      rank: index + 1,
      completedLessons: user._count.completedLessons
    }))

    return NextResponse.json({
      leaderboard,
      currentUser: null, // 認証なしなので現在のユーザーは常にnull
      type
    })

  } catch (error) {
    console.error('Leaderboard error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
