import { Trophy, Calendar, MapPin, Users, ExternalLink, DollarSign } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'

interface Tournament {
  id: string
  name: string
  game: string
  gameId: string
  prizePool: string
  startDate: string
  endDate: string
  location: string
  teams: number
  status: string
  url: string
}

interface TournamentsProps {
  tournaments: Tournament[]
}

export function Tournaments({ tournaments }: TournamentsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live':
        return 'bg-red-500/10 text-red-500 border-red-500/20 animate-pulse'
      case 'upcoming':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      case 'completed':
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
      default:
        return 'bg-muted'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="h-5 w-5" />
          Major Tournaments
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {tournaments.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <Trophy className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No tournaments scheduled</p>
          </div>
        ) : (
          tournaments.map((tournament) => (
            <a
              key={tournament.id}
              href={tournament.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <div className="p-4 rounded-lg border bg-card hover:bg-accent transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge
                        variant="outline"
                        className={`text-xs ${getStatusColor(tournament.status)}`}
                      >
                        {tournament.status === 'live' && '🔴 '}
                        {tournament.status.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{tournament.game}</span>
                    </div>
                    <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                      {tournament.name}
                    </h3>
                  </div>
                  <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 ml-2" />
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <DollarSign className="h-4 w-4 text-green-500" />
                    <span className="font-semibold text-foreground">{tournament.prizePool}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{tournament.teams} Teams</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(tournament.startDate)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">{tournament.location}</span>
                  </div>
                </div>
              </div>
            </a>
          ))
        )}
      </CardContent>
    </Card>
  )
}
