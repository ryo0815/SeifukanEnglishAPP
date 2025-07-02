import { NextRequest, NextResponse } from "next/server"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// GET - ユーザーの青楓館式カリキュラム統計情報を取得
export async function GET(request: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 })
    }

    // ユーザー情報とカリキュラム進捗を取得
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        missions: {
          orderBy: { id: 'desc' }
        },
        speechRecords: {
          orderBy: { recordedAt: 'desc' },
          take: 10 // 最新10件
        }
      }
    })

    if (!user) {
      return NextResponse.json({ error: "ユーザーが見つかりません" }, { status: 404 })
    }

    // 統計データを計算
    const completedMissions = user.missions.filter(m => m.isDone)
    const averagePronunciationScore = user.speechRecords.length > 0
      ? user.speechRecords.reduce((acc, record) => acc + record.overallScore, 0) / user.speechRecords.length
      : 0

    const stats = {
      currentPhase: user.currentPhase,
      speakingCount: user.speakingCount,
      practiceCount: user.practiceCount,
      missionCount: user.missionCount,
      motivationLevel: user.motivationLevel,
      pronunciationScore: user.pronunciationScore || averagePronunciationScore,
      totalXp: user.totalXp,
      completedMissionsCount: completedMissions.length,
      recentSpeechRecords: user.speechRecords.slice(0, 5),
      activeMissions: user.missions.filter(m => !m.isDone).slice(0, 3)
    }

    return NextResponse.json(stats)

  } catch (error) {
    console.error("カリキュラム統計取得エラー:", error)
    return NextResponse.json(
      { error: "統計データの取得に失敗しました" },
      { status: 500 }
    )
  }
}

// POST - ユーザーの青楓館式カリキュラム統計を更新
export async function POST(request: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 })
    }

    const body = await request.json()
    const {
      action,
      value,
      phaseProgress,
      pronunciationScore
    } = body

    let updateData: any = {}

    switch (action) {
      case 'speaking_practice':
        updateData = {
          speakingCount: { increment: 1 },
          practiceCount: { increment: 1 }
        }
        if (pronunciationScore) {
          updateData.pronunciationScore = pronunciationScore
        }
        break

      case 'mission_complete':
        updateData = {
          missionCount: { increment: 1 }
        }
        break

      case 'phase_progress':
        if (phaseProgress && phaseProgress.newPhase) {
          updateData = {
            currentPhase: phaseProgress.newPhase,
            motivationLevel: { increment: 1 }
          }
        }
        break

      case 'update_motivation':
        if (value >= 1 && value <= 5) {
          updateData = {
            motivationLevel: value
          }
        }
        break

      default:
        return NextResponse.json({ error: "無効なアクションです" }, { status: 400 })
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData
    })

    return NextResponse.json({
      message: "統計データを更新しました",
      stats: {
        currentPhase: updatedUser.currentPhase,
        speakingCount: updatedUser.speakingCount,
        practiceCount: updatedUser.practiceCount,
        missionCount: updatedUser.missionCount,
        motivationLevel: updatedUser.motivationLevel,
        pronunciationScore: updatedUser.pronunciationScore
      }
    })

  } catch (error) {
    console.error("カリキュラム統計更新エラー:", error)
    return NextResponse.json(
      { error: "統計データの更新に失敗しました" },
      { status: 500 }
    )
  }
} 