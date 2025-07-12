export default function BasicTest() {
  return (
    <div style={{ backgroundColor: 'red', minHeight: '100vh' }}>
      <h1 style={{ color: 'white', padding: '20px' }}>インラインスタイル - これは見えるはず</h1>
      <div className="bg-blue-500 text-white p-4 m-4">
        <h2 className="text-xl font-bold">Tailwind CSS テスト</h2>
        <p className="mt-2">この青いボックスが見えたら、Tailwind CSSが動作しています</p>
      </div>
      <div className="bg-green-500 text-white p-4 m-4 rounded-lg">
        <h2 className="text-xl font-bold">追加テスト</h2>
        <p className="mt-2">この緑のボックスが角丸で見えたら、完全に動作しています</p>
      </div>
    </div>
  )
} 