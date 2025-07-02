# OwlLearn - AI英語学習アプリ

Google Cloud Speech-to-Text APIとOpenAI APIを使用したAIスピーキング評価機能を搭載した英語学習アプリです。

## 🚀 新機能: AIスピーキング評価

ユーザーの英語発音と文法をAIが評価し、ネイティブレベルまで引き上げるための詳細なフィードバックを提供します。

### 機能概要
- 🎤 **音声認識**: Google Cloud Speech-to-Text APIによる高精度な音声認識
- 🤖 **AI評価**: OpenAI GPT-4を使用した発音・文法の詳細評価
- 📊 **詳細スコア**: 発音、明瞭度、流暢さ、文法、語順の個別評価
- 💬 **建設的フィードバック**: 改善点と良い点の具体的なアドバイス
- 🏆 **ネイティブレベル判定**: 1-10段階でのレベル評価

## ⚙️ セットアップ

### 1. 環境変数の設定

プロジェクトルートに `.env.local` ファイルを作成し、以下の内容を追加してください：

```env
# Google Cloud Speech-to-Text API
GOOGLE_CLOUD_API_KEY=your_google_cloud_api_key_here

# OpenAI API
OPENAI_API_KEY=your_openai_api_key_here
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

## 🎯 使用方法

1. **学習ページ**にアクセス
2. 任意のレッスンを選択
3. **発音練習**または**文章読み上げ**問題でAI評価を体験
4. マイクボタンをクリックして録音開始
5. 英語を発話後、録音停止
6. AIによる詳細な評価結果を確認

## 📝 評価項目

### 発音練習
- **発音の正確性** (0-100点)
- **単語の明瞭度** (0-100点)
- **流暢さ** (0-100点)
- **総合評価** (0-100点)
- **ネイティブレベル** (1-10段階)

### 文法練習
- **文法の正確性** (0-100点)
- **語順の正確性** (0-100点)
- **語彙の適切性** (0-100点)
- **総合評価** (0-100点)
- **ネイティブレベル** (1-10段階)

## 🛠️ 技術スタック

- **フロントエンド**: Next.js 14, React, TypeScript, Tailwind CSS
- **音声認識**: Google Cloud Speech-to-Text API
- **AI評価**: OpenAI GPT-4o-mini
- **UI コンポーネント**: Radix UI
- **データベース**: Prisma
- **アイコン**: Lucide React

## 🔧 APIエンドポイント

### `/api/speech/transcribe`
Google Cloud Speech-to-Text APIを使用した音声認識

### `/api/speech/evaluate`
OpenAI APIを使用したスピーキング評価

## 📱 ブラウザ対応

- Chrome (推奨)
- Firefox
- Safari
- Edge

**注意**: マイク機能を使用するため、HTTPS環境での実行を推奨します。

## 🔒 プライバシー

音声データは評価のためにのみ使用され、サーバーに保存されることはありません。録音データは評価完了後に自動的に削除されます。
