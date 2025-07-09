"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react'

export default function AzureTestPage() {
  const [testResult, setTestResult] = useState<any>(null)
  const [testing, setTesting] = useState(false)
  const [pronunciationTestResult, setPronunciationTestResult] = useState<any>(null)

  const testConnection = async () => {
    setTesting(true)
    setTestResult(null)
    
    try {
      const response = await fetch('/api/azure-speech/test', {
        method: 'GET'
      })
      
      const result = await response.json()
      setTestResult(result)
    } catch (error) {
      setTestResult({
        status: 'error',
        message: 'Network error',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setTesting(false)
    }
  }

  const testPronunciationAssessment = async () => {
    setTesting(true)
    setPronunciationTestResult(null)
    
    try {
      const response = await fetch('/api/azure-speech/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      })
      
      const result = await response.json()
      setPronunciationTestResult(result)
    } catch (error) {
      setPronunciationTestResult({
        status: 'error',
        message: 'Network error',
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    } finally {
      setTesting(false)
    }
  }

  const audioBufferToWav = (buffer: AudioBuffer): Blob => {
    const numChannels = 1
    const sampleRate = 16000
    const format = 1
    const bitDepth = 16
    
    const bytesPerSample = bitDepth / 8
    const blockAlign = numChannels * bytesPerSample
    const data = buffer.getChannelData(0)
    
    const arrayBuffer = new ArrayBuffer(44 + data.length * bytesPerSample)
    const view = new DataView(arrayBuffer)
    
    // WAV header
    const writeString = (offset: number, string: string) => {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i))
      }
    }
    
    writeString(0, 'RIFF')
    view.setUint32(4, 36 + data.length * bytesPerSample, true)
    writeString(8, 'WAVE')
    writeString(12, 'fmt ')
    view.setUint32(16, 16, true)
    view.setUint16(20, format, true)
    view.setUint16(22, numChannels, true)
    view.setUint32(24, sampleRate, true)
    view.setUint32(28, sampleRate * blockAlign, true)
    view.setUint16(32, blockAlign, true)
    view.setUint16(34, bitDepth, true)
    writeString(36, 'data')
    view.setUint32(40, data.length * bytesPerSample, true)
    
    // Convert audio data
    let offset = 44
    for (let i = 0; i < data.length; i++) {
      const sample = Math.max(-1, Math.min(1, data[i]))
      view.setInt16(offset, sample < 0 ? sample * 0x8000 : sample * 0x7FFF, true)
      offset += 2
    }
    
    return new Blob([arrayBuffer], { type: 'audio/wav' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Azure Speech Service デバッグテスト
        </h1>
        <p className="text-gray-600 mb-8">
          Azure Speech Serviceの接続状況を確認します
        </p>

        {/* Current Configuration */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">現在の設定</h2>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">リージョン:</span> japanwest
            </div>
            <div>
              <span className="font-medium">エンドポイント:</span> https://japanwest.api.cognitive.microsoft.com/
            </div>
            <div>
              <span className="font-medium">STTエンドポイント:</span> https://japanwest.stt.speech.microsoft.com/
            </div>
            <div>
              <span className="font-medium">キー:</span> 6efG0moi...（一部省略）
            </div>
          </div>
        </Card>

        {/* Connection Test */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">接続テスト</h2>
          <p className="text-gray-600 mb-4">
            Azure Speech Serviceのトークン取得をテストします
          </p>
          
          <Button 
            onClick={testConnection}
            disabled={testing}
            className="mb-4"
          >
            {testing ? 'テスト中...' : '接続テスト実行'}
          </Button>

          {testResult && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                {testResult.status === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <Badge 
                  variant={testResult.status === 'success' ? 'success' : 'destructive'}
                >
                  {testResult.status}
                </Badge>
              </div>
              
              <div className="bg-gray-100 p-3 rounded text-sm">
                <div className="font-medium mb-2">結果:</div>
                <pre className="whitespace-pre-wrap">
                  {JSON.stringify(testResult, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </Card>

        {/* Pronunciation Assessment Test */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">発音評価テスト</h2>
          <p className="text-gray-600 mb-4">
            発音評価API（"Hello"のテスト音声）をテストします
          </p>
          
          <Button 
            onClick={testPronunciationAssessment}
            disabled={testing}
            className="mb-4"
          >
            {testing ? 'テスト中...' : '発音評価テスト実行'}
          </Button>

          {pronunciationTestResult && (
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                {pronunciationTestResult.status === 'success' ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <Badge 
                  variant={pronunciationTestResult.status === 'success' ? 'success' : 'destructive'}
                >
                  {pronunciationTestResult.status}
                </Badge>
              </div>
              
              <div className="bg-gray-100 p-3 rounded text-sm">
                <div className="font-medium mb-2">結果:</div>
                <pre className="whitespace-pre-wrap">
                  {JSON.stringify(pronunciationTestResult, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </Card>

        {/* Status Summary */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            <AlertCircle className="w-5 h-5 inline mr-2 text-blue-600" />
            接続状況
          </h2>
          
          <div className="space-y-4 text-sm">
            <div className="bg-green-50 p-3 rounded border border-green-200">
              <div className="font-bold text-green-800 mb-1">✅ 設定更新:</div>
              <div className="text-green-700">
                正しいエンドポイント（https://japanwest.api.cognitive.microsoft.com/）とリージョン（japanwest）を使用するように更新しました。
              </div>
            </div>
            
            <div className="bg-blue-50 p-3 rounded border border-blue-200">
              <div className="font-bold text-blue-800 mb-1">🔧 テスト手順:</div>
              <ol className="list-decimal list-inside space-y-1 text-blue-700">
                <li>「接続テスト実行」でAzure Speech Serviceへの接続を確認</li>
                <li>「発音評価テスト実行」で発音評価APIの動作を確認</li>
                <li>両方のテストが成功すれば、500エラーが解決されます</li>
              </ol>
            </div>
            
            <div className="bg-yellow-50 p-3 rounded border border-yellow-200">
              <div className="font-bold text-yellow-800 mb-1">⚠️ 解決した問題:</div>
              <div className="text-yellow-700 text-xs">
                エンドポイントをjapaneastからjapanwestに修正しました。これで500エラーが解決されるはずです。
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
} 