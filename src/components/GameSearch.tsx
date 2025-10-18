import { useState, useMemo } from 'react'
import { Search, X, Filter, SlidersHorizontal } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Badge } from './ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select'

interface GameSearchProps {
  games: Array<{
    gameId: string
    gameName: string
    currentPlayers: number
    tags?: string[]
    genres?: string[]
    trend?: 'up' | 'down' | 'stable'
  }>
  onGameSelect: (gameId: string) => void
}

export function GameSearch({ games, onGameSelect }: GameSearchProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedGenre, setSelectedGenre] = useState<string>('all')
  const [selectedTrend, setSelectedTrend] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'players' | 'name' | 'trend'>('players')
  const [showFilters, setShowFilters] = useState(false)

  // Get unique genres
  const genres = useMemo(() => {
    const allGenres = new Set<string>()
    games.forEach(game => {
      game.genres?.forEach(genre => allGenres.add(genre))
      game.tags?.forEach(tag => allGenres.add(tag))
    })
    return Array.from(allGenres).sort()
  }, [games])

  // Filter and sort games
  const filteredGames = useMemo(() => {
    let filtered = games.filter(game => {
      // Search filter
      const matchesSearch = game.gameName.toLowerCase().includes(searchQuery.toLowerCase())
      
      // Genre filter
      const matchesGenre = selectedGenre === 'all' || 
        game.genres?.some(g => g.toLowerCase() === selectedGenre.toLowerCase()) ||
        game.tags?.some(t => t.toLowerCase() === selectedGenre.toLowerCase())
      
      // Trend filter
      const matchesTrend = selectedTrend === 'all' || game.trend === selectedTrend
      
      return matchesSearch && matchesGenre && matchesTrend
    })

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'players':
          return b.currentPlayers - a.currentPlayers
        case 'name':
          return a.gameName.localeCompare(b.gameName)
        case 'trend':
          const trendOrder = { up: 3, stable: 2, down: 1 }
          return (trendOrder[b.trend || 'stable'] || 0) - (trendOrder[a.trend || 'stable'] || 0)
        default:
          return 0
      }
    })

    return filtered
  }, [games, searchQuery, selectedGenre, selectedTrend, sortBy])

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedGenre('all')
    setSelectedTrend('all')
    setSortBy('players')
  }

  const activeFiltersCount = [
    searchQuery !== '',
    selectedGenre !== 'all',
    selectedTrend !== 'all',
    sortBy !== 'players'
  ].filter(Boolean).length

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search games..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-10 bg-accent/50"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
            onClick={() => setSearchQuery('')}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Filter Toggle */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="default" className="ml-1 h-5 w-5 p-0 flex items-center justify-center">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>

        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear all
          </Button>
        )}
      </div>

      {/* Filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-3 overflow-hidden"
          >
            {/* Genre Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Filter className="h-4 w-4" />
                Genre/Tags
              </label>
              <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                <SelectTrigger>
                  <SelectValue placeholder="All genres" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All genres</SelectItem>
                  {genres.map(genre => (
                    <SelectItem key={genre} value={genre.toLowerCase()}>
                      {genre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Trend Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Trend</label>
              <Select value={selectedTrend} onValueChange={setSelectedTrend}>
                <SelectTrigger>
                  <SelectValue placeholder="All trends" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All trends</SelectItem>
                  <SelectItem value="up">📈 Rising</SelectItem>
                  <SelectItem value="stable">➖ Stable</SelectItem>
                  <SelectItem value="down">📉 Declining</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort By */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Sort by</label>
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="players">👥 Player Count</SelectItem>
                  <SelectItem value="name">🔤 Name (A-Z)</SelectItem>
                  <SelectItem value="trend">📊 Trend</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results */}
      <div className="space-y-2">
        <div className="text-sm text-muted-foreground">
          Showing {filteredGames.length} of {games.length} games
        </div>

        <div className="max-h-[400px] overflow-y-auto space-y-2 pr-2">
          <AnimatePresence mode="popLayout">
            {filteredGames.map((game, index) => (
              <motion.div
                key={game.gameId}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.02 }}
                onClick={() => onGameSelect(game.gameId)}
                className="flex items-center justify-between p-3 rounded-lg bg-accent/50 hover:bg-accent cursor-pointer transition-all hover:scale-[1.02]"
              >
                <div className="flex-1">
                  <div className="font-medium">{game.gameName}</div>
                  <div className="text-xs text-muted-foreground">
                    {game.currentPlayers.toLocaleString()} players
                  </div>
                </div>
                {game.trend && (
                  <Badge 
                    variant={game.trend === 'up' ? 'default' : 'secondary'}
                    className={`ml-2 ${game.trend === 'down' ? 'bg-red-500 text-white' : ''}`}
                  >
                    {game.trend === 'up' ? '📈' : game.trend === 'down' ? '📉' : '➖'}
                  </Badge>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
