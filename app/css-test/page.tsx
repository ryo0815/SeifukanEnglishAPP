export default function CSSTest() {
  return (
    <div className="min-h-screen bg-red-500 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-blue-600 mb-4">CSS Test Page</h1>
        <p className="text-lg text-gray-700 mb-4">If you can see this styled, Tailwind CSS is working!</p>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-red-200 p-4 rounded">Red</div>
          <div className="bg-green-200 p-4 rounded">Green</div>
          <div className="bg-blue-200 p-4 rounded">Blue</div>
        </div>
        <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300">
          Gradient Button
        </button>
      </div>
    </div>
  )
} 