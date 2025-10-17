import { ShareableStatsCard } from '@/components/ShareableStatsCard'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function ShareTestPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          <h1 className="text-3xl font-bold mb-2">Test Shareable Stats Cards</h1>
          <p className="text-muted-foreground">
            Create beautiful stat cards to share on social media 🚀
          </p>
        </div>

        {/* Example 1: CS:GO Stats */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Example 1: Game Stats</h2>
          <ShareableStatsCard
            title="🔥 CS:GO ON FIRE"
            mainStat="1.2M"
            mainStatLabel="Players Online Right Now"
            secondaryStat="1.5M"
            secondaryStatLabel="Peak Today"
            change="↑ 15% vs Last Week"
            game="Counter-Strike: Global Offensive"
          />
        </div>

        {/* Example 2: Country Stats */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Example 2: Country Stats</h2>
          <ShareableStatsCard
            title="VIETNAM GAMING"
            mainStat="2.5M"
            mainStatLabel="Active Gamers"
            secondaryStat="Dota 2"
            secondaryStatLabel="Most Popular Game"
            change="↑ 22% This Month"
            country="Vietnam"
            countryFlag="🇻🇳"
          />
        </div>

        {/* Example 3: Trending Game */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Example 3: Trending Stats</h2>
          <ShareableStatsCard
            title="TRENDING NOW"
            mainStat="850K"
            mainStatLabel="Dota 2 Players"
            secondaryStat="🌍 Global"
            secondaryStatLabel="Across 150+ Countries"
            change="↑ 28% vs Yesterday"
            game="Dota 2"
          />
        </div>

        {/* Instructions */}
        <div className="bg-muted p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">How to Use:</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm">
            <li>Click "Download Image" to save the stat card</li>
            <li>Click "Share on Twitter" or "Share on Facebook" to post directly</li>
            <li>Click "Copy Link" to share the website URL</li>
            <li>The image includes wikigames.org URL for free marketing!</li>
            <li>Create your own cards with real data from the homepage</li>
          </ol>
        </div>

        {/* Tips */}
        <div className="bg-primary/5 border border-primary/20 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">💡 Marketing Tips:</h3>
          <ul className="space-y-2 text-sm">
            <li>✅ Post when games hit milestones (e.g., "CS:GO just hit 1M players!")</li>
            <li>✅ Share country-specific stats on local gaming groups</li>
            <li>✅ Post trending games with "↑ X% increase" to catch attention</li>
            <li>✅ Use hashtags: #gaming #esports #gamingstatistics #pcgaming</li>
            <li>✅ Post best times: 8-10am or 6-8pm for max engagement</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
