import { PrismaClient } from "@prisma/client"
import { writeFileSync } from "fs"

const prisma = new PrismaClient()

/* ====== 1. 語彙リスト ====== */
const vocab4 = [
  { en: "school", ja: "学校" },
  { en: "student", ja: "生徒" },
  { en: "teacher", ja: "先生" },
  { en: "family", ja: "家族" },
  { en: "friend", ja: "友達" },
  { en: "book", ja: "本" },
  { en: "pen", ja: "ペン" },
  { en: "pencil", ja: "えんぴつ" },
  { en: "desk", ja: "机" },
  { en: "chair", ja: "椅子" },
  { en: "library", ja: "図書館" },
  { en: "homework", ja: "宿題" },
  { en: "apple", ja: "りんご" },
  { en: "orange", ja: "オレンジ" },
  { en: "banana", ja: "バナナ" },
  { en: "fruit", ja: "果物" },
  { en: "bread", ja: "パン" },
  { en: "milk", ja: "牛乳" },
  { en: "water", ja: "水" },
  { en: "juice", ja: "ジュース" },
  { en: "coffee", ja: "コーヒー" },
  { en: "tea", ja: "お茶" },
  { en: "breakfast", ja: "朝食" },
  { en: "lunch", ja: "昼食" },
  { en: "dinner", ja: "夕食" },
  { en: "food", ja: "食べ物" },
  { en: "car", ja: "車" },
  { en: "bus", ja: "バス" },
  { en: "train", ja: "電車" },
  { en: "station", ja: "駅" },
  { en: "movie", ja: "映画" },
  { en: "music", ja: "音楽" },
  { en: "game", ja: "ゲーム" },
  { en: "play", ja: "遊ぶ" },
  { en: "run", ja: "走る" },
  { en: "walk", ja: "歩く" },
  { en: "swim", ja: "泳ぐ" },
  { en: "sleep", ja: "眠る" },
  { en: "sit", ja: "座る" },
  { en: "stand", ja: "立つ" },
  { en: "read", ja: "読む" },
  { en: "write", ja: "書く" },
  { en: "listen", ja: "聞く" },
  { en: "watch", ja: "見る" },
  { en: "see", ja: "見える" },
  { en: "hear", ja: "聞こえる" },
  { en: "talk", ja: "話す" },
  { en: "love", ja: "愛する" },
  { en: "like", ja: "好き" },
  { en: "hate", ja: "嫌い" },
  { en: "good", ja: "良い" },
  { en: "bad", ja: "悪い" },
  { en: "big", ja: "大きい" },
  { en: "small", ja: "小さい" },
  { en: "hot", ja: "暑い" },
  { en: "cold", ja: "寒い" },
  { en: "summer", ja: "夏" },
  { en: "winter", ja: "冬" },
  { en: "rain", ja: "雨" },
  { en: "snow", ja: "雪" },
  { en: "sun", ja: "太陽" },
  { en: "today", ja: "今日" },
  { en: "tomorrow", ja: "明日" },
  { en: "yesterday", ja: "昨日" },
]

const vocab3 = [
  { en: "language", ja: "言語" },
  { en: "culture", ja: "文化" },
  { en: "travel", ja: "旅行する" },
  { en: "vacation", ja: "休暇" },
  { en: "passport", ja: "パスポート" },
  { en: "airport", ja: "空港" },
  { en: "ticket", ja: "切符" },
  { en: "hotel", ja: "ホテル" },
  { en: "restaurant", ja: "レストラン" },
  { en: "menu", ja: "メニュー" },
  { en: "exercise", ja: "運動する" },
  { en: "sport", ja: "スポーツ" },
  { en: "hospital", ja: "病院" },
  { en: "medicine", ja: "薬" },
  { en: "health", ja: "健康" },
  { en: "doctor", ja: "医者" },
  { en: "practice", ja: "練習する" },
  { en: "study", ja: "勉強する" },
  { en: "learn", ja: "学ぶ" },
  { en: "teach", ja: "教える" },
  { en: "difficult", ja: "難しい" },
  { en: "easy", ja: "簡単な" },
  { en: "important", ja: "重要な" },
  { en: "decide", ja: "決める" },
  { en: "choose", ja: "選ぶ" },
  { en: "because", ja: "なぜなら" },
  { en: "though", ja: "〜だけれども" },
  { en: "while", ja: "〜の間に" },
  { en: "usually", ja: "普段は" },
  { en: "often", ja: "しばしば" },
  { en: "sometimes", ja: "時々" },
  { en: "always", ja: "いつも" },
  { en: "never", ja: "決して〜ない" },
  { en: "maybe", ja: "たぶん" },
  { en: "probably", ja: "おそらく" },
  { en: "question", ja: "質問" },
  { en: "answer", ja: "答え" },
  { en: "sentence", ja: "文" },
  { en: "explain", ja: "説明する" },
  { en: "describe", ja: "描写する" },
  { en: "compare", ja: "比較する" },
  { en: "difference", ja: "違い" },
  { en: "example", ja: "例" },
  { en: "favorite", ja: "お気に入りの" },
  { en: "together", ja: "一緒に" },
  { en: "alone", ja: "一人で" },
  { en: "better", ja: "より良い" },
  { en: "worse", ja: "より悪い" },
  { en: "enough", ja: "十分な" },
  { en: "enjoy", ja: "楽しむ" },
]

const vocab2 = [
  { en: "environment", ja: "環境" },
  { en: "responsibility", ja: "責任" },
  { en: "maintain", ja: "維持する" },
  { en: "improvement", ja: "改善" },
  { en: "advantage", ja: "利点" },
  { en: "disadvantage", ja: "欠点" },
  { en: "nutrition", ja: "栄養" },
  { en: "technology", ja: "技術" },
  { en: "communication", ja: "コミュニケーション" },
  { en: "influence", ja: "影響" },
  { en: "community", ja: "コミュニティ" },
  { en: "society", ja: "社会" },
  { en: "education", ja: "教育" },
  { en: "research", ja: "研究" },
  { en: "challenge", ja: "挑戦" },
  { en: "solution", ja: "解決策" },
  { en: "opportunity", ja: "機会" },
  { en: "development", ja: "発展" },
  { en: "economy", ja: "経済" },
  { en: "population", ja: "人口" },
  { en: "global", ja: "世界的な" },
  { en: "sustainability", ja: "持続可能性" },
  { en: "innovation", ja: "革新" },
  { en: "performance", ja: "性能" },
  { en: "efficient", ja: "効率的な" },
  { en: "analysis", ja: "分析" },
  { en: "significant", ja: "重要な" },
  { en: "achieve", ja: "達成する" },
  { en: "culture", ja: "文化" },
  { en: "history", ja: "歴史" },
  { en: "government", ja: "政府" },
  { en: "nation", ja: "国家" },
  { en: "democracy", ja: "民主主義" },
  { en: "election", ja: "選挙" },
  { en: "policy", ja: "政策" },
  { en: "require", ja: "要求する" },
  { en: "examine", ja: "調べる" },
  { en: "decide", ja: "決定する" },
  { en: "accept", ja: "受け入れる" },
  { en: "avoid", ja: "避ける" },
  { en: "manage", ja: "管理する" },
  { en: "support", ja: "支援する" },
  { en: "compare", ja: "比較する" },
  { en: "describe", ja: "描写する" },
  { en: "discuss", ja: "議論する" },
  { en: "explain", ja: "説明する" },
  { en: "express", ja: "表現する" },
  { en: "encourage", ja: "励ます" },
  { en: "provide", ja: "提供する" },
  { en: "represent", ja: "代表する" },
]

/* ====== 2. レッスン生成関数 ====== */
function chunk<T>(arr: T[], size: number) {
  const res: T[][] = []
  for (let i = 0; i < arr.length; i += size) res.push(arr.slice(i, i + size))
  return res
}

function mkMeaningMC(word: any) {
  const distractors = [...vocab4, ...vocab3, ...vocab2]
    .filter((w) => w.en !== word.en)
    .sort(() => 0.5 - Math.random())
    .slice(0, 3)
    .map((w) => w.ja)
  const options = [...distractors, word.ja].sort(() => 0.5 - Math.random())
  return {
    questionType: "MEANING_MC" as const,
    json: { prompt: word.en, options, answer: word.ja },
  }
}

function mkWordOrder(sentence: string) {
  const words = sentence.split(" ")
  const shuffled = [...words].sort(() => 0.5 - Math.random())
  return {
    questionType: "WORD_ORDER" as const,
    json: { prompt: "並べ替えて正しい英文に:", words: shuffled, answer: sentence },
  }
}

async function main() {
  await prisma.$transaction(async (tx) => {
    await tx.question.deleteMany()
    await tx.lesson.deleteMany()

    const stages = [
      ...chunk(vocab4, 10), // 4級 → 4×10=40 words => stages 1-4
      ...chunk(vocab3, 15), // 3級 → 8×15=120 words => stages 5-12
      ...chunk(vocab2, 15), // 2級 → 8×15=120 words => stages 13-20
    ]

    for (let stageIdx = 0; stageIdx < 20; stageIdx++) {
      const words = stages[stageIdx]
      const subChunks = chunk(words, 2) // 5 subStages × 2 words = 10 words per stage
      for (let sub = 0; sub < 5; sub++) {
        const lesson = await tx.lesson.create({
          data: { stage: stageIdx + 1, subStage: sub + 1, title: `Stage ${stageIdx + 1}-${sub + 1}` },
        })
        const wordA = subChunks[sub][0]
        const wordB = subChunks[sub][1]

        const q1 = mkMeaningMC(wordA)
        const q2 = mkMeaningMC(wordB)
        const q3 = mkWordOrder(`I like ${wordA.en}.`)
        const q4 = {
          questionType: "TYPE_HEAR" as const,
          json: { audio: `/audio/${wordB.en}.mp3`, answer: wordB.en },
        }
        const q5 = {
          questionType: "LISTENING_MC" as const,
          json: {
            audio: `/audio/${wordA.en}.mp3`,
            options: [wordA.ja, wordB.ja, "車", "パン"].sort(() => 0.5 - Math.random()),
            answer: wordA.ja,
          },
        }
        const q6 = {
          questionType: "PIC_MATCH" as const,
          json: { image: `/img/${wordB.en}.jpg`, options: [wordB.ja, wordA.ja], answer: wordB.ja },
        }

        await tx.question.createMany({ data: [q1, q2, q3, q4, q5, q6].map((q) => ({ ...q, lessonId: lesson.id })) })
      }
    }
  })

  console.log("Seed finished ✅")
}

/* ====== 3. 音声リスト書き出し (TTS 用) ====== */
const wordsForTTS = [...vocab4, ...vocab3, ...vocab2].map((w) => w.en)
writeFileSync("scripts/words.txt", wordsForTTS.join("\n"))

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
