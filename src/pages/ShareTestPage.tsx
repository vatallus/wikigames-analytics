import { ShareableStatsCard } from '@/components/ShareableStatsCard'
import { SEO } from '@/components/SEO'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Sparkles, TrendingUp, Share2, Download, Zap } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function ShareTestPage() {
  const navigate = useNavigate()

  return (
    <>
      <SEO
        title="Share Gaming Stats - Create Viral Social Media Cards | WikiGames"
        description="Create stunning shareable stat cards for CS:GO, Dota 2, and more. Download high-quality images for Twitter, Facebook, Discord. Free viral marketing tool for gamers and streamers."
        keywords="gaming stats cards, shareable gaming stats, esports graphics, gaming social media, viral gaming content, CS:GO stats image, Dota 2 stats card, gaming marketing tools, streamer tools, gaming content creator"
        image="https://wikigames.org/share-preview.png"
        canonical="https://wikigames.org/share-test"
      />
      <div className="min-h-screen bg-gradient-to-b from-violet-500/10 via-background to-background py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Hero Header */}
        <div className="text-center space-y-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Home
          </Button>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium">Viral Marketing Tool</span>
          </div>
          
          <h1 className="text-5xl font-bold bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-500 bg-clip-text text-transparent">
            Shareable Stats Cards
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Create stunning stat cards và share lên social media.
            <br />
            Mỗi share = FREE marketing cho bạn! 🚀
          </p>
        </div>

        {/* Stats Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
            <CardContent className="p-6 text-center">
              <Download className="h-8 w-8 mx-auto mb-3 text-primary" />
              <h3 className="font-semibold mb-2">Download as Image</h3>
              <p className="text-sm text-muted-foreground">High-quality PNG ready to share</p>
            </CardContent>
          </Card>
          
          <Card className="border-primary/20 bg-gradient-to-br from-blue-500/5 to-transparent">
            <CardContent className="p-6 text-center">
              <Share2 className="h-8 w-8 mx-auto mb-3 text-blue-500" />
              <h3 className="font-semibold mb-2">One-Click Share</h3>
              <p className="text-sm text-muted-foreground">Direct to Twitter, Facebook, Discord</p>
            </CardContent>
          </Card>
          
          <Card className="border-primary/20 bg-gradient-to-br from-green-500/5 to-transparent">
            <CardContent className="p-6 text-center">
              <Zap className="h-8 w-8 mx-auto mb-3 text-green-500" />
              <h3 className="font-semibold mb-2">Auto URL</h3>
              <p className="text-sm text-muted-foreground">Your website link included</p>
            </CardContent>
          </Card>
        </div>

        {/* Example 1: CS:GO Stats */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-white font-bold">
              1
            </div>
            <div>
              <h2 className="text-2xl font-bold">Game Player Stats</h2>
              <p className="text-muted-foreground">Showcase massive player counts</p>
            </div>
          </div>
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
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold">
              2
            </div>
            <div>
              <h2 className="text-2xl font-bold">Country Gaming Stats</h2>
              <p className="text-muted-foreground">Highlight regional dominance</p>
            </div>
          </div>
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
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold">
              3
            </div>
            <div>
              <h2 className="text-2xl font-bold">Trending Insights</h2>
              <p className="text-muted-foreground">Catch attention with growth stats</p>
            </div>
          </div>
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

        {/* How It Works */}
        <Card className="border-primary/20 bg-gradient-to-br from-violet-500/5 via-blue-500/5 to-cyan-500/5">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-primary" />
              How to Go Viral
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <span className="h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">1</span>
                  Cách Dùng
                </h4>
                <ol className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">▸</span>
                    <span>Click <strong>"Download Image"</strong> để lưu ảnh PNG</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">▸</span>
                    <span>Click <strong>"Share on Twitter/Facebook"</strong> để post trực tiếp</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">▸</span>
                    <span>Click <strong>"Copy Link"</strong> để share anywhere</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Mỗi ảnh có <strong>wikigames.org URL</strong> = FREE marketing!</span>
                  </li>
                </ol>
              </div>
              
              <div>
                <h4 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <span className="h-6 w-6 rounded-full bg-green-500 text-white flex items-center justify-center text-sm">2</span>
                  Pro Tips
                </h4>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">🔥</span>
                    <span>Post khi games hit milestones ("CS:GO just hit 1M!")</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">🌍</span>
                    <span>Share country stats vào local gaming groups</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-500">📈</span>
                    <span>Trending games với "↑ X% increase" = attention!</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500">#</span>
                    <span>Hashtags: #gaming #esports #gamingstatistics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-500">⏰</span>
                    <span>Best times: 8-10am hoặc 6-8pm</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <Card className="border-2 border-primary bg-gradient-to-r from-primary/10 via-blue-500/10 to-cyan-500/10">
          <CardContent className="p-8 text-center space-y-4">
            <h3 className="text-2xl font-bold">Ready to Get Your First 1000 Visitors?</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Download 1 card ngay bây giờ, post lên Facebook/Twitter của bạn!
              <br />
              Tag 10 friends → They visit → Some share → VIRAL! 🚀
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600">
                <Download className="h-5 w-5 mr-2" />
                Download First Card
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/')}>
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
        {/* Footer Stats */}
        <div className="text-center py-8 text-sm text-muted-foreground">
          <p>💡 <strong>Pro Tip:</strong> Post 1 card/day = 100 shares/month = 5,000 visitors = First $100!</p>
        </div>
      </div>
      </div>
    </>
  )
}
