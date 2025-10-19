export default function AnalyticsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Analytics</h1>
      <p className="text-gray-400 text-lg">
        Game analytics and trends
      </p>
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-8 bg-gray-900 rounded-lg border border-gray-800">
          <h2 className="text-xl font-semibold mb-2">Top Games</h2>
          <p className="text-gray-400">Leaderboard coming soon</p>
        </div>
        <div className="p-8 bg-gray-900 rounded-lg border border-gray-800">
          <h2 className="text-xl font-semibold mb-2">Player Trends</h2>
          <p className="text-gray-400">Charts coming soon</p>
        </div>
      </div>
    </div>
  )
}
