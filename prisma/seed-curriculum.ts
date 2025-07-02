import { PrismaClient, MissionCategory } from '@prisma/client'

const prisma = new PrismaClient()

// 青楓館式カリキュラム - フェーズ・ステージ構成
const curriculumStages = [
  // フェーズ1: 基礎発音 & 自信構築
  {
    phase: 1,
    stage: 1,
    title: "英語の音を知る",
    description: "英語特有の音の基礎を理解し、発音に慣れる",
    goal: "基本的な英語の音素を正確に発音できる",
    phrases: [
      "Hello, how are you?",
      "Nice to meet you",
      "Thank you very much",
      "Excuse me",
      "I'm sorry"
    ]
  },
  {
    phase: 1,
    stage: 2,
    title: "日常挨拶マスター",
    description: "基本的な挨拶表現を自然に発音する",
    goal: "日常的な挨拶を自信を持って言える",
    phrases: [
      "Good morning",
      "Have a nice day",
      "See you later",
      "Take care",
      "How's it going?"
    ]
  },
  
  // フェーズ2: 実用表現 & コミュニケーション基礎
  {
    phase: 2,
    stage: 1,
    title: "お店での注文",
    description: "カフェやレストランでの基本的な注文表現",
    goal: "自信を持って注文ができる",
    phrases: [
      "Can I have a coffee, please?",
      "I'll take this one",
      "How much is it?",
      "Here you are",
      "Keep the change"
    ]
  },
  {
    phase: 2,
    stage: 2,
    title: "道案内・場所",
    description: "道を尋ねる・教える基本表現",
    goal: "道案内の基本的なやり取りができる",
    phrases: [
      "Excuse me, where is the station?",
      "Go straight and turn left",
      "It's about 5 minutes walk",
      "You can't miss it",
      "Thank you for your help"
    ]
  },
  
  // フェーズ3: ビジネス基礎 & 自己表現
  {
    phase: 3,
    stage: 1,
    title: "自己紹介・職業",
    description: "自分について話す基本表現",
    goal: "明確で自然な自己紹介ができる",
    phrases: [
      "Let me introduce myself",
      "I work as a...",
      "I'm interested in...",
      "I enjoy...",
      "Nice talking with you"
    ]
  },
  {
    phase: 3,
    stage: 2,
    title: "電話・メール対応",
    description: "ビジネスシーンでの基本的なコミュニケーション",
    goal: "電話やメールの基本対応ができる",
    phrases: [
      "This is... speaking",
      "Could you hold on a moment?",
      "I'll get back to you",
      "Thank you for calling",
      "Have a great day"
    ]
  },
  
  // フェーズ4: アカデミック英語 & プレゼンテーション
  {
    phase: 4,
    stage: 1,
    title: "意見表明・議論",
    description: "自分の意見を論理的に伝える表現",
    goal: "明確に意見を述べることができる",
    phrases: [
      "In my opinion...",
      "I believe that...",
      "From my perspective...",
      "Let me explain...",
      "What do you think about...?"
    ]
  },
  {
    phase: 4,
    stage: 2,
    title: "プレゼンテーション基礎",
    description: "発表・説明の基本スキル",
    goal: "簡潔で分かりやすい発表ができる",
    phrases: [
      "Today I'd like to talk about...",
      "First, let me explain...",
      "The main point is...",
      "In conclusion...",
      "Thank you for your attention"
    ]
  },
  
  // フェーズ5: 高度なコミュニケーション
  {
    phase: 5,
    stage: 1,
    title: "交渉・説得",
    description: "ビジネスでの交渉スキル",
    goal: "効果的な交渉ができる",
    phrases: [
      "Let's discuss the details",
      "I suggest we...",
      "Would it be possible to...?",
      "We need to find a solution",
      "Let's make a deal"
    ]
  },
  {
    phase: 5,
    stage: 2,
    title: "文化理解・国際感覚",
    description: "文化的背景を理解したコミュニケーション",
    goal: "文化的な違いを理解して対話できる",
    phrases: [
      "In our culture...",
      "I understand your point",
      "That's an interesting perspective",
      "Could you tell me more about...?",
      "I appreciate your understanding"
    ]
  },
  
  // フェーズ6: 実践応用 & 海外進学準備
  {
    phase: 6,
    stage: 1,
    title: "アカデミックライティング",
    description: "論文・レポート作成の基礎",
    goal: "学術的な文章が書ける",
    phrases: [
      "According to the research...",
      "The evidence suggests...",
      "Furthermore...",
      "However...",
      "In summary..."
    ]
  },
  {
    phase: 6,
    stage: 2,
    title: "海外生活準備",
    description: "海外での学習・生活に必要な表現",
    goal: "海外での生活に必要な英語力を身につける",
    phrases: [
      "I'd like to apply for...",
      "Could you help me with...?",
      "I'm having trouble with...",
      "Where can I find...?",
      "I'm looking forward to..."
    ]
  }
]

// ミッションテンプレート
const missionTemplates = [
  // フェーズ1 ミッション
  {
    label: "英語で挨拶してみよう",
    description: "今日一日、出会った人に英語で挨拶をしてみましょう",
    category: MissionCategory.DAILY_LIFE,
    phase: 1,
    difficulty: 1,
    reward: 15
  },
  {
    label: "鏡に向かって自己紹介",
    description: "鏡に向かって英語で自己紹介を3回言ってみましょう",
    category: MissionCategory.DAILY_LIFE,
    phase: 1,
    difficulty: 1,
    reward: 10
  },
  
  // フェーズ2 ミッション
  {
    label: "カフェで英語で注文",
    description: "カフェやコンビニで英語で注文してみましょう",
    category: MissionCategory.DAILY_LIFE,
    phase: 2,
    difficulty: 2,
    reward: 25
  },
  {
    label: "外国人観光客に道案内",
    description: "困っている外国人観光客に英語で道案内をしてみましょう",
    category: MissionCategory.SOCIAL,
    phase: 2,
    difficulty: 3,
    reward: 30
  },
  
  // フェーズ3 ミッション
  {
    label: "英語自己紹介動画作成",
    description: "1分間の英語自己紹介動画を作成してSNSに投稿",
    category: MissionCategory.CREATIVE,
    phase: 3,
    difficulty: 3,
    reward: 35
  },
  {
    label: "英語でメール送信",
    description: "外国の友人や先生に英語でメールを送ってみましょう",
    category: MissionCategory.WORK_STUDY,
    phase: 3,
    difficulty: 2,
    reward: 20
  },
  
  // フェーズ4 ミッション
  {
    label: "英語で3分間スピーチ",
    description: "好きなトピックで3分間の英語スピーチを録画",
    category: MissionCategory.CREATIVE,
    phase: 4,
    difficulty: 4,
    reward: 45
  },
  {
    label: "英語討論に参加",
    description: "オンライン英語討論会や英会話サークルに参加",
    category: MissionCategory.SOCIAL,
    phase: 4,
    difficulty: 4,
    reward: 50
  },
  
  // フェーズ5 ミッション
  {
    label: "ビジネス交渉体験",
    description: "英語でビジネス交渉のロールプレイを実践",
    category: MissionCategory.BUSINESS,
    phase: 5,
    difficulty: 5,
    reward: 60
  },
  {
    label: "国際イベント参加",
    description: "国際交流イベントに参加して積極的に英語で交流",
    category: MissionCategory.SOCIAL,
    phase: 5,
    difficulty: 5,
    reward: 70
  },
  
  // フェーズ6 ミッション
  {
    label: "英語論文執筆",
    description: "興味のあるトピックで英語論文（1000語）を執筆",
    category: MissionCategory.WORK_STUDY,
    phase: 6,
    difficulty: 5,
    reward: 100
  },
  {
    label: "海外大学説明会参加",
    description: "海外大学の説明会に参加して質問を英語でしてみる",
    category: MissionCategory.WORK_STUDY,
    phase: 6,
    difficulty: 4,
    reward: 80
  }
]

export async function seedCurriculum() {
  console.log('🌱 青楓館式カリキュラムデータをシードしています...')
  
  // カリキュラムステージの作成
  for (const stage of curriculumStages) {
    await prisma.curriculumStage.upsert({
      where: { phase_stage: { phase: stage.phase, stage: stage.stage } },
      update: stage,
      create: { ...stage, isUnlocked: stage.phase === 1 } // フェーズ1のみ最初から解放
    })
  }
  
  console.log(`✅ ${curriculumStages.length}個のカリキュラムステージを作成しました`)
  
  return { stages: curriculumStages.length, missions: missionTemplates.length }
}

// ユーザー用ミッション作成関数
export async function createUserMissions(userId: string, userPhase: number = 1) {
  const relevantMissions = missionTemplates.filter(m => m.phase === userPhase)
  
  for (const mission of relevantMissions) {
    await prisma.mission.create({
      data: {
        ...mission,
        userId
      }
    })
  }
  
  return relevantMissions.length
}

export { missionTemplates } 