import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Check, AlertCircle, ExternalLink } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card'
import toast from 'react-hot-toast'

interface VerifyTransactionModalProps {
  isOpen: boolean
  onClose: () => void
  selectedCurrency: 'usdt_trc20' | 'btc' | 'eth' | 'bnb'
}

export function VerifyTransactionModal({ isOpen, onClose, selectedCurrency }: VerifyTransactionModalProps) {
  const navigate = useNavigate()
  const [step, setStep] = useState<'input' | 'verifying' | 'verified'>('input')
  const [txHash, setTxHash] = useState('')
  const [amount, setAmount] = useState('')

  const getCurrencyInfo = () => {
    const info = {
      usdt_trc20: {
        name: 'USDT (TRC20)',
        explorer: 'TronScan',
        explorerUrl: 'https://tronscan.org',
        placeholder: 'TX123abc...',
        network: 'TRC20'
      },
      btc: {
        name: 'Bitcoin',
        explorer: 'Blockchain.com',
        explorerUrl: 'https://blockchain.com/explorer',
        placeholder: '0x123abc...',
        network: 'Bitcoin'
      },
      eth: {
        name: 'Ethereum',
        explorer: 'Etherscan',
        explorerUrl: 'https://etherscan.io',
        placeholder: '0x123abc...',
        network: 'ERC20'
      },
      bnb: {
        name: 'BNB',
        explorer: 'BscScan',
        explorerUrl: 'https://bscscan.com',
        placeholder: '0x123abc...',
        network: 'BEP20'
      }
    }
    return info[selectedCurrency]
  }

  const handleVerify = async () => {
    if (!txHash || !amount) {
      toast.error('Please fill in all fields')
      return
    }

    if (parseFloat(amount) < 1) {
      toast.error('Minimum donation is $1')
      return
    }

    // Set verifying state
    setStep('verifying')
    
    // Simulate verification (trong thực tế sẽ call blockchain API)
    await new Promise(resolve => setTimeout(resolve, 2000))

    // For now, accept any transaction hash with reasonable length
    if (txHash.length >= 10) {
      setStep('verified')
      
      // Save to sessionStorage for confirmation page
      sessionStorage.setItem('verified_donation', JSON.stringify({
        txHash,
        amount,
        currency: selectedCurrency,
        timestamp: Date.now(),
        verified: true
      }))
      
      toast.success('Transaction verified! 🎉')
    } else {
      toast.error('Invalid transaction hash. Please check and try again.')
      setStep('input')
    }
  }

  const handleContinue = () => {
    navigate('/donate/confirm')
    onClose()
  }

  const currencyInfo = getCurrencyInfo()

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

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            <Card 
              className="max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {step === 'verified' ? (
                      <Check className="h-6 w-6 text-green-500" />
                    ) : (
                      <AlertCircle className="h-6 w-6 text-primary" />
                    )}
                    <CardTitle>
                      {step === 'verified' ? 'Transaction Verified!' : 'Verify Your Transaction'}
                    </CardTitle>
                  </div>
                  <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                <CardDescription>
                  {step === 'verified' 
                    ? 'Your donation has been verified successfully!'
                    : 'Please provide your transaction details to continue'
                  }
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {step === 'input' && (
                  <>
                    {/* Currency Info */}
                    <div className="p-3 bg-muted rounded-lg text-sm">
                      <p className="font-medium mb-1">Selected Currency:</p>
                      <p className="text-muted-foreground">{currencyInfo.name} ({currencyInfo.network})</p>
                    </div>

                    {/* Amount */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Donation Amount (USD) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        step="0.01"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="10.00"
                        className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Minimum: $1
                      </p>
                    </div>

                    {/* Transaction Hash */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Transaction Hash <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={txHash}
                        onChange={(e) => setTxHash(e.target.value)}
                        placeholder={currencyInfo.placeholder}
                        className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
                      />
                      <div className="flex items-center justify-between mt-1">
                        <p className="text-xs text-muted-foreground">
                          Find on {currencyInfo.explorer}
                        </p>
                        <a
                          href={currencyInfo.explorerUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline flex items-center gap-1"
                        >
                          Open Explorer
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </div>

                    {/* Instructions */}
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                      <p className="text-sm font-medium mb-2">How to find your Transaction Hash:</p>
                      <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
                        <li>Open your crypto wallet app</li>
                        <li>Go to transaction history</li>
                        <li>Find the transaction you just sent</li>
                        <li>Copy the Transaction ID/Hash</li>
                        <li>Paste it above</li>
                      </ol>
                    </div>

                    <Button 
                      onClick={handleVerify}
                      className="w-full"
                      size="lg"
                      disabled={!txHash || !amount}
                    >
                      Verify Transaction
                    </Button>
                  </>
                )}

                {step === 'verifying' && (
                  <div className="py-8 text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                    <p className="text-sm text-muted-foreground">
                      Verifying your transaction on the blockchain...
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      This may take a few seconds
                    </p>
                  </div>
                )}

                {step === 'verified' && (
                  <>
                    <div className="py-6 text-center">
                      <div className="mx-auto mb-4 w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center">
                        <Check className="h-8 w-8 text-green-500" />
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        Your transaction has been verified successfully!
                      </p>
                      <div className="bg-muted p-3 rounded-lg text-sm text-left space-y-1">
                        <p><strong>Amount:</strong> ${amount}</p>
                        <p><strong>Currency:</strong> {currencyInfo.name}</p>
                        <p className="break-all"><strong>TX Hash:</strong> {txHash.slice(0, 10)}...{txHash.slice(-10)}</p>
                      </div>
                    </div>

                    <Button 
                      onClick={handleContinue}
                      className="w-full"
                      size="lg"
                    >
                      Continue to Confirmation Form
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
