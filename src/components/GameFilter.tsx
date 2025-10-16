import { useState } from 'react'
import { Search, Filter, X } from 'lucide-react'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Game, GAMES, GAME_TYPES } from '@/data/mockData'
import { cn } from '@/lib/utils'
import { GameIcon } from './GameIcon'

interface GameFilterProps {
  onGameSelect: (game: Game | null) => void
  selectedGame: Game | null
}

export function GameFilter({ onGameSelect, selectedGame }: GameFilterProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string>('All Types')
  const [isExpanded, setIsExpanded] = useState(true)

  const filteredGames = GAMES.filter(game => {
    const matchesSearch = game.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === 'All Types' || game.type === selectedType
    return matchesSearch && matchesType
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
                <button
                  key={game.id}
                  onClick={() => onGameSelect(game)}
                  className={cn(
                    'flex items-center gap-3 p-3 rounded-lg border transition-all hover:border-primary hover:bg-accent',
                    selectedGame?.id === game.id && 'border-primary bg-primary/10'
                  )}
                >
                  <GameIcon gameId={game.id} size={40} />
                  <div className="text-left flex-1">
                    <div className="font-medium">{game.name}</div>
                    <div className="text-xs text-muted-foreground">{game.type}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {filteredGames.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No games found matching your criteria
            </div>
          )}
        </CardContent>
      )}
    </Card>
  )
}
