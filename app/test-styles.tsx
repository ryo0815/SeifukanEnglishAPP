"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function TestStyles() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          スタイルテスト
        </h1>
        
        <Card className="p-8 shadow-xl">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            基本要素のテスト
          </h2>
          
          <div className="space-y-4">
            <div className="flex gap-4">
              <Button>デフォルト</Button>
              <Button variant="secondary">セカンダリ</Button>
              <Button variant="outline">アウトライン</Button>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-blue-800">
                これは基本的なスタイルテストです。
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="w-12 h-12 bg-green-500 rounded-full mb-2"></div>
                <p className="text-green-800">グリーン</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="w-12 h-12 bg-purple-500 rounded-full mb-2"></div>
                <p className="text-purple-800">パープル</p>
              </div>
            </div>
          </div>
        </Card>
        
        <div className="text-center">
          <p className="text-gray-600">
            このページでスタイルが正しく表示されれば、CSS設定は正常です。
          </p>
        </div>
      </div>
    </div>
  )
} 