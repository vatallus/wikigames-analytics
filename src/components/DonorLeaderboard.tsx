import { Trophy, Heart, Crown, Medal, Star } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card'
import { Badge } from './ui/badge'

export interface Donor {
  id: string
  name: string
  amount: number
  currency: string
  message?: string
  date: string
  tier: 'gold' | 'silver' | 'bronze' | 'supporter'
  avatar?: string
}

// Mock donors - Replace with real data from Supabase
const MOCK_DONORS: Donor[] = [
  {
    id: '1',
    name: 'Anonymous Whale 🐋',
    amount: 500,
    currency: 'USDT',
    message: 'Love this project! Keep it up! 🚀',
    date: '2025-10-15',
    tier: 'gold'
  },
  {
    id: '2',
    name: 'CryptoGamer',
    amount: 250,
    currency: 'BTC',
    message: 'Amazing analytics platform!',
    date: '2025-10-14',
    tier: 'silver'
  },
  {
    id: '3',
    name: 'ProPlayer123',
    amount: 100,
    currency: 'ETH',
    message: 'Thanks for the awesome features!',
    date: '2025-10-13',
    tier: 'bronze'
  },
  {
    id: '4',
    name: 'GameFan',
    amount: 50,
    currency: 'USDT',
    date: '2025-10-12',
    tier: 'supporter'
  },
  {
    id: '5',
    name: 'Player456',
    amount: 25,
    currency: 'BNB',
    date: '2025-10-11',
    tier: 'supporter'
  }
]

const getTierInfo = (tier: Donor['tier']) => {
  switch (tier) {
    case 'gold':
      return {
        icon: <Crown className="h-5 w-5 text-yellow-500" />,
        color: 'text-yellow-500',
        bgColor: 'bg-yellow-500/10',
        borderColor: 'border-yellow-500/30',
        label: 'Gold Donor',
        min: '$250+'
      }
    case 'silver':
      return {
        icon: <Medal className="h-5 w-5 text-gray-400" />,
        color: 'text-gray-400',
        bgColor: 'bg-gray-400/10',
        borderColor: 'border-gray-400/30',
        label: 'Silver Donor',
        min: '$100+'
      }
    case 'bronze':
      return {
        icon: <Star className="h-5 w-5 text-orange-600" />,
        color: 'text-orange-600',
        bgColor: 'bg-orange-600/10',
        borderColor: 'border-orange-600/30',
        label: 'Bronze Donor',
        min: '$50+'
      }
    default:
      return {
        icon: <Heart className="h-5 w-5 text-pink-500" />,
        color: 'text-pink-500',
        bgColor: 'bg-pink-500/10',
        borderColor: 'border-pink-500/30',
        label: 'Supporter',
        min: 'Any amount'
      }
  }
}

interface DonorLeaderboardProps {
  limit?: number
}

export function DonorLeaderboard({ limit = 10 }: DonorLeaderboardProps) {
  const donors = MOCK_DONORS.slice(0, limit)
  const totalDonations = MOCK_DONORS.reduce((sum, d) => sum + d.amount, 0)
  const totalDonors = MOCK_DONORS.length

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle>Donor Leaderboard</CardTitle>
              <CardDescription>
                {totalDonors} generous supporters • ${totalDonations} raised
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Top 3 Podium */}
        {donors.length >= 3 && (
          <div className="grid grid-cols-3 gap-4 mb-6">
            {/* 2nd Place */}
            <div className="flex flex-col items-center pt-8">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 flex items-center justify-center text-white text-xl font-bold">
                  {donors[1].name[0]}
                </div>
                <Badge className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-gray-400 text-white">
                  2nd
                </Badge>
              </div>
              <p className="text-sm font-medium mt-3 text-center">{donors[1].name}</p>
              <p className="text-xs text-muted-foreground">${donors[1].amount}</p>
            </div>

            {/* 1st Place */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <Crown className="h-8 w-8 text-yellow-500 absolute -top-6 left-1/2 transform -translate-x-1/2 animate-bounce" />
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                  {donors[0].name[0]}
                </div>
                <Badge className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-yellow-500 text-white">
                  1st
                </Badge>
              </div>
              <p className="text-sm font-medium mt-3 text-center">{donors[0].name}</p>
              <p className="text-xs text-muted-foreground font-semibold">${donors[0].amount}</p>
            </div>

            {/* 3rd Place */}
            <div className="flex flex-col items-center pt-12">
              <div className="relative">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-lg font-bold">
                  {donors[2].name[0]}
                </div>
                <Badge className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-orange-600 text-white">
                  3rd
                </Badge>
              </div>
              <p className="text-sm font-medium mt-3 text-center">{donors[2].name}</p>
              <p className="text-xs text-muted-foreground">${donors[2].amount}</p>
            </div>
          </div>
        )}

        {/* Full List */}
        <div className="space-y-2">
          {donors.map((donor, index) => {
            const tierInfo = getTierInfo(donor.tier)
            
            return (
              <div
                key={donor.id}
                className={`
                  p-4 rounded-lg border-2 transition-all
                  ${tierInfo.borderColor} ${tierInfo.bgColor}
                  hover:scale-[1.02]
                `}
              >
                <div className="flex items-center gap-3">
                  {/* Rank */}
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-background text-sm font-bold">
                    #{index + 1}
                  </div>

                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center text-white font-semibold`}>
                    {donor.name[0]}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium truncate">{donor.name}</p>
                      {tierInfo.icon}
                    </div>
                    {donor.message && (
                      <p className="text-xs text-muted-foreground italic truncate">
                        "{donor.message}"
                      </p>
                    )}
                  </div>

                  {/* Amount */}
                  <div className="text-right">
                    <p className={`font-bold ${tierInfo.color}`}>
                      ${donor.amount}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {donor.currency}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Tier Legend */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <p className="text-sm font-medium mb-3">Donor Tiers</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <Crown className="h-4 w-4 text-yellow-500" />
              <span>Gold: $250+</span>
            </div>
            <div className="flex items-center gap-2">
              <Medal className="h-4 w-4 text-gray-400" />
              <span>Silver: $100+</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-orange-600" />
              <span>Bronze: $50+</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-pink-500" />
              <span>Supporter: Any</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
