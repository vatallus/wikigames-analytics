import { Star } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from './ui/button'
import { useFavorites } from '@/hooks/useFavorites'
import { cn } from '@/lib/utils'

interface FavoriteButtonProps {
  gameId: string
  gameName?: string
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

export function FavoriteButton({ 
  gameId, 
  gameName,
  size = 'md', 
  showLabel = false,
  className 
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const favorite = isFavorite(gameId)

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleFavorite(gameId)
  }

  const sizeClasses = {
    sm: 'h-7 w-7',
    md: 'h-9 w-9',
    lg: 'h-11 w-11'
  }

  const iconSizes = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-5 w-5'
  }

  return (
    <Button
      variant={favorite ? 'default' : 'outline'}
      size={showLabel ? 'default' : 'icon'}
      className={cn(
        showLabel ? '' : sizeClasses[size],
        'transition-all',
        favorite && 'bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500',
        className
      )}
      onClick={handleClick}
      title={favorite ? `Remove ${gameName || 'game'} from favorites` : `Add ${gameName || 'game'} to favorites`}
    >
      <motion.div
        animate={{
          scale: favorite ? [1, 1.3, 1] : 1,
        }}
        transition={{ duration: 0.3 }}
      >
        <Star 
          className={cn(
            iconSizes[size],
            favorite && 'fill-current'
          )}
        />
      </motion.div>
      {showLabel && (
        <span className="ml-2">
          {favorite ? 'Favorited' : 'Add to Favorites'}
        </span>
      )}
    </Button>
  )
}
