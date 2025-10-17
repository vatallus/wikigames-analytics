import { useRef } from 'react'
import { Share2, Download, Twitter, Facebook } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import html2canvas from 'html2canvas'
import toast from 'react-hot-toast'

interface ShareableStatsCardProps {
  title: string
  mainStat: string
  mainStatLabel: string
  secondaryStat?: string
  secondaryStatLabel?: string
  change?: string
  country?: string
  countryFlag?: string
  game?: string
}

export function ShareableStatsCard({
  title,
  mainStat,
  mainStatLabel,
  secondaryStat,
  secondaryStatLabel,
  change,
  country,
  countryFlag,
  game
}: ShareableStatsCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  const generateImage = async () => {
    if (!cardRef.current) return null

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#0a0a0a',
        scale: 2,
        logging: false
      })
      return canvas.toDataURL('image/png')
    } catch (error) {
      console.error('Error generating image:', error)
      toast.error('Failed to generate image')
      return null
    }
  }

  const handleDownload = async () => {
    const dataUrl = await generateImage()
    if (!dataUrl) return

    const link = document.createElement('a')
    link.download = `wikigames-stats-${Date.now()}.png`
    link.href = dataUrl
    link.click()

    toast.success('Image downloaded! 📸')
  }

  const handleShare = async (platform: 'twitter' | 'facebook') => {
    const text = `${title}\n${mainStat} ${mainStatLabel}\n\nCheck out more gaming stats at wikigames.org 🎮`
    
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=https://wikigames.org`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=https://wikigames.org&quote=${encodeURIComponent(text)}`
    }

    window.open(urls[platform], '_blank', 'width=600,height=400')
    toast.success(`Opening ${platform}...`)
  }

  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://wikigames.org')
    toast.success('Link copied! Share it anywhere! 🔗')
  }

  return (
    <div className="space-y-4">
      {/* Shareable Card */}
      <div
        ref={cardRef}
        className="bg-gradient-to-br from-violet-600 via-blue-600 to-cyan-600 p-8 rounded-xl shadow-2xl"
        style={{ width: '600px', height: '400px' }}
      >
        <div className="h-full flex flex-col justify-between text-white">
          {/* Header */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              {countryFlag && <span className="text-5xl">{countryFlag}</span>}
              <div>
                <h2 className="text-3xl font-bold">{title}</h2>
                {country && <p className="text-xl opacity-90">{country}</p>}
              </div>
            </div>
          </div>

          {/* Main Stats */}
          <div className="space-y-6">
            <div>
              <div className="text-6xl font-bold mb-2">{mainStat}</div>
              <div className="text-2xl opacity-90">{mainStatLabel}</div>
              {change && (
                <div className="text-xl mt-2 inline-block bg-white/20 px-4 py-2 rounded-full">
                  {change}
                </div>
              )}
            </div>

            {secondaryStat && (
              <div>
                <div className="text-3xl font-semibold">{secondaryStat}</div>
                <div className="text-lg opacity-80">{secondaryStatLabel}</div>
              </div>
            )}

            {game && (
              <div className="text-xl bg-white/20 inline-block px-4 py-2 rounded-full">
                🎮 {game}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-6 border-t border-white/20">
            <div className="text-2xl font-bold">wikigames.org</div>
            <div className="text-sm opacity-80">Live Analytics</div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2 flex-wrap">
            <Button onClick={handleDownload} variant="default" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Download Image
            </Button>

            <Button onClick={() => handleShare('twitter')} variant="outline" size="sm">
              <Twitter className="h-4 w-4 mr-2" />
              Share on Twitter
            </Button>

            <Button onClick={() => handleShare('facebook')} variant="outline" size="sm">
              <Facebook className="h-4 w-4 mr-2" />
              Share on Facebook
            </Button>

            <Button onClick={handleCopyLink} variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Copy Link
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mt-3">
            💡 Share this card to spread the word about WikiGames! Every share helps us grow. 🚀
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
