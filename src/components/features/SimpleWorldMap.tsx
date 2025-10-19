import { formatNumber } from '../../lib/utils'

interface CountryStat {
  country_code: string
  country_name: string
  total_players: number
}

interface SimpleWorldMapProps {
  data: CountryStat[]
}

export default function SimpleWorldMap({ data }: SimpleWorldMapProps) {
  const sortedData = [...data].sort((a, b) => b.total_players - a.total_players)
  const maxPlayers = sortedData[0]?.total_players || 1

  return (
    <div className="w-full bg-gray-800 rounded-lg p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedData.map((country) => {
          const percentage = (country.total_players / maxPlayers) * 100
          
          return (
            <div 
              key={country.country_code} 
              className="relative overflow-hidden rounded-lg bg-gray-900 p-4 hover:bg-gray-850 transition-colors cursor-pointer group"
            >
              {/* Background bar */}
              <div 
                className="absolute inset-0 bg-primary-600/20 transition-all group-hover:bg-primary-600/30"
                style={{ width: `${percentage}%` }}
              />
              
              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-gray-300">
                    {country.country_name}
                  </span>
                  <span className="text-xs text-gray-500 font-mono">
                    {country.country_code}
                  </span>
                </div>
                <div className="text-lg font-bold text-primary-400">
                  {formatNumber(country.total_players)}
                  <span className="text-xs text-gray-500 ml-1">players</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      
      <div className="mt-4 text-center text-xs text-gray-500">
        Interactive world map visualization • Sorted by player count
      </div>
    </div>
  )
}
