import { useState, useMemo } from 'react'
import { ComposableMap, Geographies, Geography, ZoomableGroup } from 'react-simple-maps'
import { Button } from './ui/button'
import { ZoomIn, ZoomOut } from 'lucide-react'
import { Game, CountryData, getCountryData } from '@/data/mockData'
import { formatNumber } from '@/lib/utils'

const geoUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'

interface WorldMapProps {
  selectedGame: Game | null
  countryData: CountryData[]
  onCountryClick: (countryCode: string) => void
}

export function WorldMap({ selectedGame, countryData, onCountryClick }: WorldMapProps) {
  const [zoom, setZoom] = useState(1)
  const [center, setCenter] = useState<[number, number]>([0, 20])

  const handleZoomIn = () => {
    if (zoom < 4) setZoom(zoom * 1.5)
  }

  const handleZoomOut = () => {
    if (zoom > 1) setZoom(zoom / 1.5)
  }

  // Calculate color intensity based on player count
  const getCountryColor = (geo: any) => {
    const countryName = geo.properties.name
    
    // Map country names to our data
    const countryMapping: { [key: string]: string } = {
      'United States of America': 'USA',
      'China': 'CHN',
      'South Korea': 'KOR',
      'Japan': 'JPN',
      'Germany': 'DEU',
      'United Kingdom': 'GBR',
      'Brazil': 'BRA',
      'Russia': 'RUS',
      'France': 'FRA',
      'Canada': 'CAN',
      'Australia': 'AUS',
      'Mexico': 'MEX',
      'Sweden': 'SWE',
      'Poland': 'POL',
      'Turkey': 'TUR',
    }

    const countryCode = countryMapping[countryName]
    if (!countryCode) return '#1e293b' // slate-800 for countries without data

    const country = getCountryData(countryCode)
    if (!country) return '#1e293b'

    if (selectedGame) {
      const gameData = country.games[selectedGame.id]
      if (!gameData) return '#1e293b'

      const playRate = gameData.playRate
      // Color scale from dark to bright based on play rate
      if (playRate >= 30) return '#dc2626' // red-600
      if (playRate >= 20) return '#ea580c' // orange-600
      if (playRate >= 15) return '#f59e0b' // amber-500
      if (playRate >= 10) return '#facc15' // yellow-400
      if (playRate >= 5) return '#84cc16' // lime-500
      return '#22c55e' // green-500
    } else {
      // Show total players when no game is selected
      const totalPlayers = country.totalPlayers
      if (totalPlayers >= 20000000) return '#dc2626'
      if (totalPlayers >= 10000000) return '#ea580c'
      if (totalPlayers >= 5000000) return '#f59e0b'
      if (totalPlayers >= 2000000) return '#facc15'
      return '#84cc16'
    }
  }

  const getCountryTooltip = (geo: any) => {
    const countryName = geo.properties.name
    const countryMapping: { [key: string]: string } = {
      'United States of America': 'USA',
      'China': 'CHN',
      'South Korea': 'KOR',
      'Japan': 'JPN',
      'Germany': 'DEU',
      'United Kingdom': 'GBR',
      'Brazil': 'BRA',
      'Russia': 'RUS',
      'France': 'FRA',
      'Canada': 'CAN',
      'Australia': 'AUS',
      'Mexico': 'MEX',
      'Sweden': 'SWE',
      'Poland': 'POL',
      'Turkey': 'TUR',
    }

    const countryCode = countryMapping[countryName]
    if (!countryCode) return ''

    const country = getCountryData(countryCode)
    if (!country) return ''

    if (selectedGame) {
      const gameData = country.games[selectedGame.id]
      if (!gameData) return `${country.country}: No data`
      return `${country.country}\n${selectedGame.name}: ${formatNumber(gameData.playerCount)} players (${gameData.playRate}%)`
    }
    return `${country.country}\nTotal Players: ${formatNumber(country.totalPlayers)}`
  }

  return (
    <div className="relative w-full h-full bg-background rounded-lg border overflow-hidden">
      {/* Zoom Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <Button
          size="icon"
          variant="outline"
          onClick={handleZoomIn}
          className="bg-background/95 backdrop-blur"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="outline"
          onClick={handleZoomOut}
          className="bg-background/95 backdrop-blur"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 z-10 bg-background/95 backdrop-blur border rounded-lg p-3">
        <div className="text-xs font-semibold mb-2">
          {selectedGame ? `${selectedGame.name} Play Rate` : 'Total Players'}
        </div>
        <div className="flex flex-col gap-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#dc2626' }}></div>
            <span>Very High</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#f59e0b' }}></div>
            <span>High</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded" style={{ backgroundColor: '#84cc16' }}></div>
            <span>Medium</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-slate-800"></div>
            <span>Low/No Data</span>
          </div>
        </div>
      </div>

      {/* Map */}
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 147,
        }}
        className="w-full h-full"
      >
        <ZoomableGroup
          zoom={zoom}
          center={center}
          onMoveEnd={({ coordinates, zoom }) => {
            setCenter(coordinates)
            setZoom(zoom)
          }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  fill={getCountryColor(geo)}
                  stroke="#0f172a"
                  strokeWidth={0.5}
                  style={{
                    default: { outline: 'none' },
                    hover: { 
                      outline: 'none',
                      fill: '#3b82f6',
                      cursor: 'pointer',
                    },
                    pressed: { outline: 'none' },
                  }}
                  onClick={() => {
                    const countryName = geo.properties.name
                    const countryMapping: { [key: string]: string } = {
                      'United States of America': 'USA',
                      'China': 'CHN',
                      'South Korea': 'KOR',
                      'Japan': 'JPN',
                      'Germany': 'DEU',
                      'United Kingdom': 'GBR',
                      'Brazil': 'BRA',
                      'Russia': 'RUS',
                      'France': 'FRA',
                      'Canada': 'CAN',
                      'Australia': 'AUS',
                      'Mexico': 'MEX',
                      'Sweden': 'SWE',
                      'Poland': 'POL',
                      'Turkey': 'TUR',
                    }
                    const countryCode = countryMapping[countryName]
                    if (countryCode) {
                      onCountryClick(countryCode)
                    }
                  }}
                >
                  <title>{getCountryTooltip(geo)}</title>
                </Geography>
              ))
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
    </div>
  )
}
