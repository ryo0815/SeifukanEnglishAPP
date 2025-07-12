# Vercel環境変数設定ガイド

## 必要な環境変数

Vercelダッシュボードで以下の環境変数を設定してください：

### 🎯 必須環境変数

#### Azure Speech Service
```
AZURE_SPEECH_KEY=6efG0moi4cGbr9kRJ6RUGUB5EVfxAjwl1lUxHXaT2xpke7AETDAEJQQJ99BGACxCCsyXJ3w3AAAYACOGFUjj
AZURE_SPEECH_REGION=japanwest
AZURE_SPEECH_ENDPOINT=https://japanwest.api.cognitive.microsoft.com/
```

#### Google Cloud API（音声認識用）
```
GOOGLE_CLOUD_API_KEY=your_google_cloud_api_key_here
```

#### OpenAI API（AI評価用）
```
OPENAI_API_KEY=your_openai_api_key_here
```

### 📊 オプション環境変数

#### データベース（認証機能使用時）
```
DATABASE_URL=your_database_url_here
```

#### NextAuth.js（認証機能使用時）
```
NEXTAUTH_URL=https://your-app-domain.vercel.app
NEXTAUTH_SECRET=your_nextauth_secret_here
```

#### Google OAuth（ソーシャルログイン使用時）
```
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

## 🛠️ Vercel設定手順

### 1. プロジェクトのインポート
1. [Vercel Dashboard](https://vercel.com/dashboard)にアクセス
2. 「New Project」をクリック
3. `SeifukanEnglishAPP`リポジトリを選択
4. 「Import」をクリック

### 2. 環境変数の設定
1. 「Environment Variables」セクションに移動
2. 上記の環境変数を一つずつ追加
3. 各環境変数で以下を設定：
   - **Name**: 変数名
   - **Value**: 実際の値
   - **Environment**: Production, Preview, Development（すべて選択推奨）

### 3. デプロイ
1. すべての環境変数を設定後、「Deploy」をクリック
2. ビルドプロセスが開始されます
3. 完了後、デプロイURLが表示されます

## 🔧 環境変数の優先順位

1. **必須（アプリが動作するために必要）**：
   - `AZURE_SPEECH_KEY`
   - `AZURE_SPEECH_REGION`
   - `AZURE_SPEECH_ENDPOINT`

2. **推奨（フル機能のために必要）**：
   - `GOOGLE_CLOUD_API_KEY`
   - `OPENAI_API_KEY`

3. **オプション（追加機能のために必要）**：
   - `DATABASE_URL`
   - `NEXTAUTH_URL`
   - `NEXTAUTH_SECRET`
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`

## 📝 注意事項

- 環境変数が設定されていない場合、該当する機能は動作しません
- Azure Speech Serviceのキーは現在ハードコードされた値をフォールバックとして使用
- Google Cloud APIとOpenAI APIが設定されていない場合、AI評価機能は制限されます
- 認証機能を使用しない場合、データベースとNextAuth関連の環境変数は不要

## 🚀 最小構成でのデプロイ

最小構成でデプロイする場合、以下の環境変数のみで動作します：

```
AZURE_SPEECH_KEY=（現在のハードコード値）
AZURE_SPEECH_REGION=japanwest
AZURE_SPEECH_ENDPOINT=https://japanwest.api.cognitive.microsoft.com/
```

これらの環境変数を設定後、Vercelで正常にデプロイできます。 