import { useState } from 'react'
import { Share2, Twitter, Facebook, Link2, Check } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './ui/button'
import { toast } from 'react-hot-toast'

interface ShareButtonProps {
  title: string
  text: string
  url?: string
  gameData?: {
    name: string
    players: number
    trend?: 'up' | 'down' | 'stable'
  }
}

export function ShareButton({ title, text, url, gameData }: ShareButtonProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [copied, setCopied] = useState(false)

  const shareUrl = url || window.location.href

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      toast.success('Link copied to clipboard!')
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error('Failed to copy link')
    }
  }

  const handleTwitterShare = () => {
    let twitterText = text
    
    if (gameData) {
      const trendEmoji = gameData.trend === 'up' ? '📈' : gameData.trend === 'down' ? '📉' : '➖'
      twitterText = `🎮 ${gameData.name} is ${gameData.trend === 'up' ? 'rising' : gameData.trend === 'down' ? 'declining' : 'stable'}! ${trendEmoji}\n\n👥 ${gameData.players.toLocaleString()} players online now\n\n📊 Live gaming stats on WikiGames`
    }
    
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(twitterText)}&url=${encodeURIComponent(shareUrl)}`
    window.open(twitterUrl, '_blank', 'width=550,height=420')
    setShowMenu(false)
  }

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    window.open(facebookUrl, '_blank', 'width=550,height=420')
    setShowMenu(false)
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text,
          url: shareUrl
        })
        setShowMenu(false)
      } catch (err) {
        // User canceled share
      }
    } else {
      setShowMenu(!showMenu)
    }
  }

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={handleNativeShare}
        className="gap-2"
      >
        <Share2 className="h-4 w-4" />
        Share
      </Button>

      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-48 rounded-lg border bg-card shadow-lg z-50"
          >
            <div className="p-2 space-y-1">
              <button
                onClick={handleTwitterShare}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent transition-colors text-left"
              >
                <Twitter className="h-4 w-4 text-blue-400" />
                <span className="text-sm">Share on Twitter</span>
              </button>

              <button
                onClick={handleFacebookShare}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent transition-colors text-left"
              >
                <Facebook className="h-4 w-4 text-blue-600" />
                <span className="text-sm">Share on Facebook</span>
              </button>

              <button
                onClick={handleCopyLink}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent transition-colors text-left"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Link2 className="h-4 w-4" />
                )}
                <span className="text-sm">{copied ? 'Copied!' : 'Copy link'}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
