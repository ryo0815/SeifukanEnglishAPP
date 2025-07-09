import { Loading } from "@/components/ui/loading"

export default function LessonCompleteLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Loading 
        message="結果を計算中" 
        variant="default"
        size="lg"
      />
    </div>
  )
}
