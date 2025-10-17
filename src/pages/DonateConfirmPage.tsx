import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Send, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import toast from 'react-hot-toast'

export function DonateConfirmPage() {
  const navigate = useNavigate()
  const [submitted, setSubmitted] = useState(false)
  const [verified, setVerified] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    amount: '',
    currency: 'USDT',
    transactionHash: '',
    message: '',
    featureRequest: ''
  })

  // Check if user has verified transaction
  useEffect(() => {
    const verifiedDonation = sessionStorage.getItem('verified_donation')
    
    if (verifiedDonation) {
      try {
        const data = JSON.parse(verifiedDonation)
        
        // Check if verification is recent (within 30 minutes)
        const isRecent = Date.now() - data.timestamp < 30 * 60 * 1000
        
        if (data.verified && isRecent) {
          setVerified(true)
          // Pre-fill form data
          setFormData(prev => ({
            ...prev,
            amount: data.amount,
            currency: data.currency.toUpperCase().replace('_', ' '),
            transactionHash: data.txHash
          }))
        } else {
          // Verification expired
          sessionStorage.removeItem('verified_donation')
          setVerified(false)
        }
      } catch (e) {
        console.error('Error parsing verified donation:', e)
        setVerified(false)
      }
    } else {
      setVerified(false)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Simulate submission (replace with actual Supabase later)
    console.log('Donation submitted:', formData)
    
    // Show success
    setSubmitted(true)
    toast.success('Thank you for your donation! 🎉', {
      duration: 5000,
      icon: '💰'
    })

    // Save to localStorage temporarily (until Supabase is connected)
    const donations = JSON.parse(localStorage.getItem('pending_donations') || '[]')
    donations.push({
      ...formData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      status: 'pending'
    })
    localStorage.setItem('pending_donations', JSON.stringify(donations))
    
    // Clear verification data after successful submission
    sessionStorage.removeItem('verified_donation')
  }

  // Show error if not verified
  if (!verified) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-lg w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto" />
            </div>
            <CardTitle className="text-2xl">Transaction Not Verified</CardTitle>
            <CardDescription>
              You need to verify your transaction first
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 space-y-2 text-sm">
              <p className="font-medium">⚠️ Access Denied</p>
              <p className="text-muted-foreground">
                This page is only accessible after you've verified your donation transaction.
              </p>
            </div>

            <div className="space-y-2 text-sm text-muted-foreground">
              <p><strong>To access this page:</strong></p>
              <ol className="list-decimal list-inside space-y-1 ml-4">
                <li>Make sure you've sent your donation</li>
                <li>Click "Donate" button on the website</li>
                <li>Click "I've Sent the Donation"</li>
                <li>Enter your transaction hash</li>
                <li>After verification, you'll be redirected here</li>
              </ol>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={() => navigate('/')}
                className="flex-1"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Go Home
              </Button>
              <Button 
                onClick={() => {
                  navigate('/')
                  // Trigger donate panel open (you'll need to implement this)
                  setTimeout(() => {
                    toast('Click the "Donate" button to start!', {
                      icon: '💰',
                      duration: 3000
                    })
                  }, 500)
                }}
                variant="outline"
                className="flex-1"
              >
                Start Donation
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-lg w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
            </div>
            <CardTitle className="text-2xl">Thank You! 🎉</CardTitle>
            <CardDescription>
              Your donation information has been received!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg space-y-2 text-sm">
              <p>✅ <strong>Name:</strong> {formData.name}</p>
              <p>✅ <strong>Amount:</strong> ${formData.amount} {formData.currency}</p>
              {formData.transactionHash && (
                <p className="break-all">
                  ✅ <strong>TX Hash:</strong> {formData.transactionHash}
                </p>
              )}
            </div>

            <div className="space-y-2 text-sm text-muted-foreground">
              <p>📧 <strong>Next Steps:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>We'll verify your transaction (usually within 24 hours)</li>
                <li>You'll be added to the Donor Leaderboard</li>
                <li>You'll receive your donor badge and benefits</li>
                {formData.featureRequest && (
                  <li>We'll review your feature request</li>
                )}
              </ul>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={() => navigate('/')}
                className="flex-1"
              >
                Back to Home
              </Button>
              <Button 
                onClick={() => {
                  setSubmitted(false)
                  setFormData({
                    name: '',
                    email: '',
                    amount: '',
                    currency: 'USDT',
                    transactionHash: '',
                    message: '',
                    featureRequest: ''
                  })
                }}
                variant="outline"
                className="flex-1"
              >
                Submit Another
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold mb-2">Confirm Your Donation</h1>
          <p className="text-muted-foreground">
            Please fill out this form after you've sent your donation
          </p>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle>Donation Information</CardTitle>
            <CardDescription>
              Help us track your donation and add you to the leaderboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe or Anonymous"
                  className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  This name will appear on the Donor Leaderboard
                </p>
              </div>

              {/* Email (Optional) */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Email (Optional)
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your@email.com"
                  className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  We'll contact you for updates (optional)
                </p>
              </div>

              {/* Amount */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Amount (USD) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="10.00"
                  className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Currency */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Currency <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="USDT">USDT (TRC20)</option>
                  <option value="BTC">Bitcoin (BTC)</option>
                  <option value="ETH">Ethereum (ETH)</option>
                  <option value="BNB">BNB (BSC)</option>
                </select>
              </div>

              {/* Transaction Hash */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Transaction Hash (Optional)
                </label>
                <input
                  type="text"
                  value={formData.transactionHash}
                  onChange={(e) => setFormData({ ...formData, transactionHash: e.target.value })}
                  placeholder="0x... or TX..."
                  className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Helps us verify your donation faster
                </p>
              </div>

              {/* Message */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Message (Optional)
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Leave a message that will appear on the leaderboard..."
                  rows={3}
                  className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Max 200 characters
                </p>
              </div>

              {/* Feature Request */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Feature Request (Optional)
                </label>
                <textarea
                  value={formData.featureRequest}
                  onChange={(e) => setFormData({ ...formData, featureRequest: e.target.value })}
                  placeholder="Suggest a new feature you'd like to see..."
                  rows={4}
                  className="w-full px-4 py-2 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  As a donor, you can request features! We'll review and consider all requests.
                </p>
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full" size="lg">
                <Send className="h-4 w-4 mr-2" />
                Submit Donation Info
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Info Cards */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-sm">Verification Time</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Usually within 24 hours. We'll check the blockchain and add you to the leaderboard!
              </p>
            </CardContent>
          </Card>

          <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
              <CardTitle className="text-sm">Donor Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>✅ Name on leaderboard</li>
                <li>✅ Donor badge</li>
                <li>✅ Feature requests</li>
                <li>✅ Early access</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
