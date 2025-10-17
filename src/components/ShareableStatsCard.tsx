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
        className="relative bg-gradient-to-br from-violet-600 via-blue-600 to-cyan-600 p-10 rounded-2xl shadow-2xl overflow-hidden"
        style={{ width: '600px', height: '400px' }}
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl transform -translate-x-32 translate-y-32"></div>
        </div>
        
        <div className="relative h-full flex flex-col justify-between text-white">
          {/* Header */}
          <div>
            <div className="flex items-center gap-4 mb-2">
              {countryFlag && <span className="text-6xl filter drop-shadow-lg">{countryFlag}</span>}
              <div className="flex-1">
                <h2 className="text-4xl font-extrabold tracking-tight leading-tight" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
                  {title}
                </h2>
                {country && (
                  <p className="text-xl opacity-90 font-medium mt-1">{country}</p>
                )}
              </div>
            </div>
          </div>

          {/* Main Stats */}
          <div className="space-y-5">
            <div>
              <div className="text-7xl font-black mb-3 tracking-tight" style={{ textShadow: '0 4px 20px rgba(0,0,0,0.3)', lineHeight: '1' }}>
                {mainStat}
              </div>
              <div className="text-2xl font-semibold opacity-95 tracking-wide">{mainStatLabel}</div>
              {change && (
                <div className="text-lg mt-3 inline-flex items-center gap-2 bg-white/25 backdrop-blur-sm px-5 py-2.5 rounded-full font-semibold" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                  {change}
                </div>
              )}
            </div>

            {secondaryStat && (
              <div className="pt-2">
                <div className="text-4xl font-bold mb-1.5" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.2)' }}>
                  {secondaryStat}
                </div>
                <div className="text-xl opacity-90 font-medium">{secondaryStatLabel}</div>
              </div>
            )}

            {game && (
              <div className="inline-flex items-center gap-2 text-lg bg-white/25 backdrop-blur-sm px-5 py-2.5 rounded-full font-semibold" style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.15)' }}>
                🎮 {game}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-6 border-t border-white/30">
            <div className="text-3xl font-black tracking-tight" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>
              wikigames.org
            </div>
            <div className="text-base opacity-90 font-semibold px-3 py-1 bg-white/20 rounded-full">
              Live Analytics
            </div>
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
            💡 Share this to social media and help gamers discover real-time analytics!
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
