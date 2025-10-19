import { ComposableMap, Geographies, Geography } from 'react-simple-maps'
import { scaleLinear } from 'd3-scale'

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"

interface CountryStat {
  country_code: string
  country_name: string
  total_players: number
}

interface WorldMapProps {
  data: CountryStat[]
  onCountryClick?: (countryCode: string) => void
}

export default function WorldMap({ data, onCountryClick }: WorldMapProps) {
  // Create a map for quick lookup
  const dataMap = new Map(data.map(d => [d.country_code, d.total_players]))
  
  // Find min and max for color scale
  const playerCounts = data.map(d => d.total_players)
  const minPlayers = Math.min(...playerCounts)
  const maxPlayers = Math.max(...playerCounts)
  
  // Color scale from dark to bright blue
  const colorScale = scaleLinear<string>()
    .domain([0, minPlayers, maxPlayers])
    .range(['#1f2937', '#3b82f6', '#60a5fa'])

  return (
    <div className="w-full h-full min-h-[400px] bg-gray-800 rounded-lg overflow-hidden">
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 147,
          center: [0, 20]
        }}
        style={{
          width: '100%',
          height: '100%'
        }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const countryCode = geo.id
              const playerCount = dataMap.get(countryCode) || 0
              const fillColor = playerCount > 0 
                ? colorScale(playerCount)
                : '#374151'
              
              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={fillColor}
                  stroke="#1f2937"
                  strokeWidth={0.5}
                  style={{
                    default: {
                      fill: fillColor,
                      outline: 'none',
                    },
                    hover: {
                      fill: playerCount > 0 ? '#93c5fd' : '#4b5563',
                      outline: 'none',
                      cursor: playerCount > 0 ? 'pointer' : 'default',
                    },
                    pressed: {
                      fill: '#3b82f6',
                      outline: 'none',
                    },
                  }}
                  onClick={() => {
                    if (playerCount > 0 && onCountryClick) {
                      onCountryClick(countryCode)
                    }
                  }}
                />
              )
            })
          }
        </Geographies>
      </ComposableMap>
    </div>
  )
}
