import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Heart, Copy, Check, Gift, Shield, QrCode } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card'
import { Badge } from './ui/badge'
import { VerifyTransactionModal } from './VerifyTransactionModal'
import toast from 'react-hot-toast'

interface DonationPanelProps {
  isOpen: boolean
  onClose: () => void
}

// Crypto wallet addresses - UPDATE THESE WITH YOUR REAL WALLETS!
const WALLET_ADDRESSES = {
  usdt_trc20: {
    address: 'TRTy1Y71L9KfsVScgYnnkbw9f3Vd3DgiJx',
    network: 'TRC20 (Tron)',
    name: 'USDT (TRC20)',
    icon: '₮',
    color: 'text-green-500',
    recommended: true as const
  },
  btc: {
    address: '359LKA6LNK8WHAzgAHteXMadH2vkoFXkxM',
    network: 'Bitcoin Network',
    name: 'Bitcoin (BTC)',
    icon: '₿',
    color: 'text-orange-500',
    recommended: false as const
  },
  eth: {
    address: '0x234eae962c79b2207338fac019e980959561a63f',
    network: 'Ethereum Network',
    name: 'Ethereum (ETH)',
    icon: 'Ξ',
    color: 'text-blue-500',
    recommended: false as const
  },
  bnb: {
    address: '0x883dfff63fed12918f9dfced682d191ebac489cc',
    network: 'BNB Smart Chain',
    name: 'BNB (BSC)',
    icon: 'B',
    color: 'text-yellow-500',
    recommended: false as const
  }
}

export function DonationPanel({ isOpen, onClose }: DonationPanelProps) {
  const [selectedWallet, setSelectedWallet] = useState<keyof typeof WALLET_ADDRESSES>('usdt_trc20')
  const [copiedAddress, setCopiedAddress] = useState(false)
  const [verifyModalOpen, setVerifyModalOpen] = useState(false)

  const copyAddress = (address: string) => {
    navigator.clipboard.writeText(address)
    setCopiedAddress(true)
    toast.success('Address copied to clipboard!', {
      icon: '📋',
      duration: 2000
    })
    setTimeout(() => setCopiedAddress(false), 2000)
  }

  const wallet = WALLET_ADDRESSES[selectedWallet]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[500px] bg-card border-l shadow-2xl z-50 flex flex-col overflow-y-auto"
          >
            {/* Header */}
            <div className="sticky top-0 bg-card border-b p-6 z-10">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-pink-500 to-purple-500">
                    <Heart className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Support WikiGames</h2>
                    <p className="text-sm text-muted-foreground">Help us grow! 💚</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-6 space-y-6">
              {/* Benefits */}
              <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Gift className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">Donor Benefits</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Your name on Donor Leaderboard</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Request new features</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Early access to new features</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-green-500" />
                    <span>Special donor badge</span>
                  </div>
                </CardContent>
              </Card>

              {/* Wallet Selection */}
              <div>
                <label className="text-sm font-medium mb-3 block">Select Cryptocurrency</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(WALLET_ADDRESSES).map(([key, wallet]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedWallet(key as keyof typeof WALLET_ADDRESSES)}
                      className={`
                        p-3 rounded-lg border-2 transition-all text-left
                        ${selectedWallet === key 
                          ? 'border-primary bg-primary/10' 
                          : 'border-border hover:border-primary/50 hover:bg-accent'
                        }
                      `}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className={`text-2xl ${wallet.color}`}>{wallet.icon}</span>
                        {wallet.recommended && (
                          <Badge variant="secondary" className="text-xs">Recommended</Badge>
                        )}
                      </div>
                      <div className="text-sm font-medium">{wallet.name}</div>
                      <div className="text-xs text-muted-foreground">{wallet.network}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* QR Code */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <QrCode className="h-5 w-5" />
                    <CardTitle className="text-base">Scan QR Code</CardTitle>
                  </div>
                  <CardDescription>
                    Scan with your crypto wallet app
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  <div className="p-4 bg-white rounded-lg">
                    <QRCodeSVG 
                      value={wallet.address}
                      size={200}
                      level="H"
                      includeMargin
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Wallet Address */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Or Copy Address</CardTitle>
                  <CardDescription>
                    {wallet.name} • {wallet.network}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={wallet.address}
                      readOnly
                      className="flex-1 px-3 py-2 bg-muted rounded-lg text-sm font-mono select-all"
                      onClick={(e) => e.currentTarget.select()}
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => copyAddress(wallet.address)}
                    >
                      {copiedAddress ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Safety Instructions */}
              <Card className="border-yellow-500/20 bg-yellow-500/5">
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-yellow-500" />
                    <CardTitle className="text-base">Safety Instructions</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <span className="text-yellow-500">⚠️</span>
                    <p>Always double-check the address before sending</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-yellow-500">⚠️</span>
                    <p>Make sure you select the correct network ({wallet.network})</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-yellow-500">⚠️</span>
                    <p>Start with a small test transaction first</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-500">✅</span>
                    <p>No minimum amount required</p>
                  </div>
                </CardContent>
              </Card>

              {/* After Donation */}
              <Card className="border-primary/20 bg-primary/5">
                <CardHeader>
                  <CardTitle className="text-base">After Donation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <p>After sending your donation:</p>
                  <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                    <li>Your transaction will be confirmed on the blockchain</li>
                    <li>Fill out the form below to be added to leaderboard</li>
                    <li>Submit your feature request (optional)</li>
                    <li>Receive donor badge and benefits!</li>
                  </ol>
                  <Button 
                    className="w-full mt-4"
                    onClick={() => setVerifyModalOpen(true)}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    I've Sent the Donation
                  </Button>
                </CardContent>
              </Card>

              {/* Thank You */}
              <div className="text-center py-6 space-y-2">
                <Heart className="h-12 w-12 mx-auto text-pink-500" />
                <h3 className="text-lg font-semibold">Thank You!</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  Your support helps us keep WikiGames free and continuously improve the platform for all gamers! 🎮
                </p>
              </div>
            </div>
          </motion.div>

          {/* Verify Transaction Modal */}
          <VerifyTransactionModal
            isOpen={verifyModalOpen}
            onClose={() => setVerifyModalOpen(false)}
            selectedCurrency={selectedWallet}
          />
        </>
      )}
    </AnimatePresence>
  )
}
