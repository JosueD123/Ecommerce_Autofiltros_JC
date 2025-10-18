export default function Loading() {
  return (
    <main className="p-6 max-w-5xl mx-auto">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-gray-100 rounded-xl aspect-square" />
        <div className="space-y-3">
          <div className="h-6 w-72 bg-gray-100 rounded" />
          <div className="h-6 w-32 bg-gray-100 rounded" />
          <div className="h-10 w-64 bg-gray-100 rounded" />
          <div className="h-28 bg-gray-100 rounded" />
        </div>
      </div>
    </main>
  )
}
