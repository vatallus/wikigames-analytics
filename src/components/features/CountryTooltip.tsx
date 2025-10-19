import { formatNumber } from '../../lib/utils'

interface CountryTooltipProps {
  countryName: string
  playerCount: number
  position: { x: number; y: number }
}

export default function CountryTooltip({ countryName, playerCount, position }: CountryTooltipProps) {
  return (
    <div
      className="fixed z-50 pointer-events-none"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -120%)'
      }}
    >
      <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-xl px-3 py-2">
        <div className="text-sm font-semibold text-white">{countryName}</div>
        <div className="text-xs text-primary-400">{formatNumber(playerCount)} players</div>
      </div>
      <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 mx-auto" />
    </div>
  )
}
