export default function SimpleTest() {
  return (
    <div className="bg-red-500 p-8">
      <h1 className="text-white text-4xl font-bold">
        Tailwind CSSテスト
      </h1>
      <div className="mt-4 p-4 bg-blue-500 text-white rounded-lg">
        この背景が青で表示されれば、Tailwind CSSは動作しています
      </div>
      <div className="mt-4 p-4 bg-green-500 text-white rounded-lg">
        緑の背景も表示されるはずです
      </div>
      <button className="mt-4 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600">
        ボタンテスト
      </button>
    </div>
  )
} 