import { useState } from 'react'
import { Search, Filter, X, Star } from 'lucide-react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Game, GAMES, GAME_TYPES } from '@/data/mockData'
import { cn } from '@/lib/utils'
import { GameIcon } from './GameIcon'
import { FavoriteButton } from './FavoriteButton'
import { useFavorites } from '@/hooks/useFavorites'

interface GameFilterProps {
  onGameSelect: (game: Game | null) => void
  selectedGame: Game | null
  compact?: boolean
}

export function GameFilter({ onGameSelect, selectedGame, compact: _compact = false }: GameFilterProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string>('All Types')
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)
  const [isExpanded, setIsExpanded] = useState(true)
  const { favorites, count: favoritesCount } = useFavorites()

  const filteredGames = GAMES.filter(game => {
    const matchesSearch = game.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === 'All Types' || game.type === selectedType
    const matchesFavorites = !showFavoritesOnly || favorites.includes(game.id)
    return matchesSearch && matchesType && matchesFavorites
  }).sort((a, b) => {
    // Sort favorites to top
    const aIsFav = favorites.includes(a.id)
    const bIsFav = favorites.includes(b.id)
    if (aIsFav && !bIsFav) return -1
    if (!aIsFav && bIsFav) return 1
    return 0
  })

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-xl font-bold flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Game Filters
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </Button>
      </CardHeader>
      
      {isExpanded && (
        <CardContent className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search games..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Favorites Filter */}
          {favoritesCount > 0 && (
            <div className="flex items-center gap-2 p-3 rounded-lg border border-yellow-500/20 bg-yellow-500/5">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="text-sm flex-1">
                {favoritesCount} Favorite{favoritesCount !== 1 ? 's' : ''}
              </span>
              <Button
                variant={showFavoritesOnly ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className={showFavoritesOnly ? 'bg-yellow-500 hover:bg-yellow-600' : ''}
              >
                {showFavoritesOnly ? 'Show All' : 'Favorites Only'}
              </Button>
            </div>
          )}

          {/* Game Type Filter */}
          <div>
            <label className="text-sm font-medium mb-2 block">Game Type</label>
            <div className="flex flex-wrap gap-2">
              {GAME_TYPES.map(type => (
                <Badge
                  key={type}
                  variant={selectedType === type ? 'default' : 'outline'}
                  className="cursor-pointer hover:bg-primary/80 transition-colors"
                  onClick={() => setSelectedType(type)}
                >
                  {type}
                </Badge>
              ))}
            </div>
          </div>

          {/* Selected Game */}
          {selectedGame && (
            <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border border-primary/20">
              <div className="flex items-center gap-2">
                <GameIcon gameId={selectedGame.id} size={40} />
                <div>
                  <div className="font-semibold">{selectedGame.name}</div>
                  <div className="text-xs text-muted-foreground">{selectedGame.type}</div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onGameSelect(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          {/* Game List */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Select Game ({filteredGames.length} games)
            </label>
            <div className="grid grid-cols-1 gap-2 max-h-[400px] overflow-y-auto">
              {filteredGames.map(game => (
                <div
                  key={game.id}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-lg border transition-all hover:border-primary hover:bg-accent cursor-pointer',
                    selectedGame?.id === game.id && 'border-primary bg-primary/10',
                    favorites.includes(game.id) && 'border-yellow-500/30 bg-yellow-500/5'
                  )}
                  onClick={() => onGameSelect(game)}
                >
                  <GameIcon gameId={game.id} size={40} />
                  <div className="text-left flex-1">
                    <div className="font-medium flex items-center gap-2">
                      {game.name}
                      {favorites.includes(game.id) && (
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">{game.type}</div>
                  </div>
                  <FavoriteButton gameId={game.id} gameName={game.name} size="sm" />
                </div>
              ))}
            </div>
          </div>

          {filteredGames.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              {showFavoritesOnly && favoritesCount === 0 ? (
                <div>
                  <Star className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
                  <p className="font-medium mb-1">No favorites yet</p>
                  <p className="text-sm">Click the star icon to add games to your favorites</p>
                </div>
              ) : (
                'No games found matching your criteria'
              )}
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}
