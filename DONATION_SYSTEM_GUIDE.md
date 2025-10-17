# 💰 Donation System - Complete Guide

## 🎉 Tính Năng Đã Implement

### ✅ **Donation Panel** (Panel Donate)
- 4 loại cryptocurrency: USDT (TRC20), BTC, ETH, BNB
- QR Code tự động generate
- Copy địa chỉ ví dễ dàng
- Hướng dẫn an toàn chi tiết
- UI/UX đẹp với gradient

### ✅ **Donor Leaderboard** (Bảng Xếp Hạng)
- Top 3 podium với animation
- 4 donor tiers: Gold, Silver, Bronze, Supporter
- Hiển thị tên + số tiền + lời nhắn
- Badge và icons đẹp
- Tổng số tiền và số donors

### ✅ **Donor Benefits** (Quyền Lợi)
- Tên trên leaderboard
- Request features mới
- Early access
- Special donor badge

---

## 🖼️ Screenshots (Preview)

### **Donation Panel:**
```
┌──────────────────────────────────────┐
│  💖 Support WikiGames                │
│                                      │
│  🎁 Donor Benefits:                  │
│    ✅ Your name on leaderboard       │
│    ✅ Request new features           │
│    ✅ Early access                   │
│    ✅ Special badge                  │
│                                      │
│  Select Cryptocurrency:              │
│  [ USDT (TRC20) ⭐ ] [ Bitcoin ]     │
│  [ Ethereum     ] [ BNB      ]       │
│                                      │
│  📱 QR Code                          │
│  ┌─────────────┐                    │
│  │ [QR CODE]   │                    │
│  │             │                    │
│  └─────────────┘                    │
│                                      │
│  Address: YOUR_ADDRESS_HERE          │
│  [Copy 📋]                           │
│                                      │
│  ⚠️ Safety Instructions:             │
│    - Double check address            │
│    - Select correct network          │
│    - Test with small amount first    │
│                                      │
└──────────────────────────────────────┘
```

### **Donor Leaderboard:**
```
┌──────────────────────────────────────┐
│  🏆 Donor Leaderboard                │
│  5 generous supporters • $925 raised │
│                                      │
│     👑 2nd      👑 1st      👑 3rd  │
│  CryptoGamer  Whale🐋   ProPlayer   │
│    $250         $500       $100     │
│                                      │
│  #1  💰 Anonymous Whale  🟡 $500    │
│  #2  💰 CryptoGamer      🥈 $250    │
│  #3  💰 ProPlayer123     🥉 $100    │
│  #4  💰 GameFan          💗 $50     │
│  #5  💰 Player456        💗 $25     │
│                                      │
│  Donor Tiers:                        │
│  👑 Gold: $250+    🥈 Silver: $100+  │
│  ⭐ Bronze: $50+   💗 Supporter: Any │
└──────────────────────────────────────┘
```

---

## 🔧 Setup Instructions

### **Step 1: Update Wallet Addresses**

Edit `/src/components/DonationPanel.tsx`:

```typescript
const WALLET_ADDRESSES = {
  usdt_trc20: {
    address: 'YOUR_REAL_USDT_TRC20_ADDRESS',  // ← Change this!
    network: 'TRC20 (Tron)',
    name: 'USDT (TRC20)',
    icon: '₮',
    color: 'text-green-500',
    recommended: true as const
  },
  btc: {
    address: 'YOUR_REAL_BTC_ADDRESS',  // ← Change this!
    network: 'Bitcoin Network',
    name: 'Bitcoin (BTC)',
    icon: '₿',
    color: 'text-orange-500',
    recommended: false as const
  },
  eth: {
    address: 'YOUR_REAL_ETH_ADDRESS',  // ← Change this!
    network: 'Ethereum Network',
    name: 'Ethereum (ETH)',
    icon: 'Ξ',
    color: 'text-blue-500',
    recommended: false as const
  },
  bnb: {
    address: 'YOUR_REAL_BNB_ADDRESS',  // ← Change this!
    network: 'BNB Smart Chain',
    name: 'BNB (BSC)',
    icon: 'B',
    color: 'text-yellow-500',
    recommended: false as const
  }
}
```

### **Step 2: Get Your Crypto Wallets**

#### **Option 1: Binance** (Recommended for beginners)
```
1. Create account: https://binance.com
2. Complete KYC verification
3. Go to Wallet → Deposit
4. Select USDT
5. Select TRC20 network
6. Copy deposit address
```

#### **Option 2: TronLink** (For USDT TRC20)
```
1. Install TronLink: https://www.tronlink.org/
2. Create wallet
3. Save seed phrase (IMPORTANT!)
4. Copy wallet address
```

#### **Option 3: MetaMask** (For ETH, BNB, BSC)
```
1. Install MetaMask: https://metamask.io/
2. Create wallet
3. Save seed phrase (IMPORTANT!)
4. Copy wallet address for:
   - Ethereum (ETH)
   - BNB Smart Chain (BNB)
```

#### **Option 4: Bitcoin Wallet**
```
1. Use Trust Wallet or Exodus
2. Create Bitcoin wallet
3. Copy Bitcoin address
```

### **Step 3: Test Your Setup**

```bash
npm run dev
```

1. Click "Donate" button (top right, pink/purple gradient)
2. Panel should slide in from right
3. Select different cryptocurrencies
4. QR code should display
5. Copy address button should work
6. Toast notification should appear

---

## 💾 Database Setup (Supabase)

### **Create Tables:**

Run in Supabase SQL Editor:

```sql
-- Donations table
CREATE TABLE donations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donor_name TEXT NOT NULL,
  donor_email TEXT,
  amount DECIMAL(10, 2) NOT NULL,
  currency TEXT NOT NULL,
  wallet_address TEXT,
  transaction_hash TEXT,
  message TEXT,
  tier TEXT DEFAULT 'supporter',
  feature_request TEXT,
  status TEXT DEFAULT 'pending', -- pending, confirmed, completed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  confirmed_at TIMESTAMP WITH TIME ZONE
);

-- Add indexes
CREATE INDEX idx_donations_tier ON donations(tier);
CREATE INDEX idx_donations_status ON donations(status);
CREATE INDEX idx_donations_created_at ON donations(created_at DESC);

-- Feature requests from donors
CREATE TABLE feature_requests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  donation_id UUID REFERENCES donations(id),
  donor_name TEXT NOT NULL,
  feature_title TEXT NOT NULL,
  feature_description TEXT NOT NULL,
  votes INTEGER DEFAULT 1,
  status TEXT DEFAULT 'pending', -- pending, approved, in_progress, completed
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_requests ENABLE ROW LEVEL SECURITY;

-- Public can read donations (for leaderboard)
CREATE POLICY "Public read donations" ON donations
  FOR SELECT USING (status = 'confirmed');

-- Public can read feature requests
CREATE POLICY "Public read feature requests" ON feature_requests
  FOR SELECT USING (true);
```

### **Create Submission Form API:**

Create `/src/pages/DonateConfirm.tsx`:

```typescript
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import toast from 'react-hot-toast'

export function DonateConfirmPage() {
  const [formData, setFormData] = useState({
    donor_name: '',
    donor_email: '',
    amount: '',
    currency: 'USDT',
    transaction_hash: '',
    message: '',
    feature_request: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const { data, error } = await supabase
        .from('donations')
        .insert([{
          ...formData,
          amount: parseFloat(formData.amount),
          tier: getTier(parseFloat(formData.amount))
        }])
      
      if (error) throw error
      
      toast.success('Thank you for your donation! 🎉')
      // Reset form or redirect
    } catch (error) {
      toast.error('Error submitting donation')
      console.error(error)
    }
  }

  const getTier = (amount: number) => {
    if (amount >= 250) return 'gold'
    if (amount >= 100) return 'silver'
    if (amount >= 50) return 'bronze'
    return 'supporter'
  }

  return (
    <Card className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Confirm Your Donation</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Your Name"
          value={formData.donor_name}
          onChange={(e) => setFormData({...formData, donor_name: e.target.value})}
          required
          className="w-full px-4 py-2 rounded-lg border"
        />
        <input
          type="email"
          placeholder="Email (optional)"
          value={formData.donor_email}
          onChange={(e) => setFormData({...formData, donor_email: e.target.value})}
          className="w-full px-4 py-2 rounded-lg border"
        />
        <input
          type="number"
          placeholder="Amount (USD)"
          value={formData.amount}
          onChange={(e) => setFormData({...formData, amount: e.target.value})}
          required
          className="w-full px-4 py-2 rounded-lg border"
        />
        <input
          type="text"
          placeholder="Transaction Hash (optional)"
          value={formData.transaction_hash}
          onChange={(e) => setFormData({...formData, transaction_hash: e.target.value})}
          className="w-full px-4 py-2 rounded-lg border"
        />
        <textarea
          placeholder="Message (will be shown on leaderboard)"
          value={formData.message}
          onChange={(e) => setFormData({...formData, message: e.target.value})}
          className="w-full px-4 py-2 rounded-lg border h-24"
        />
        <textarea
          placeholder="Feature Request (optional)"
          value={formData.feature_request}
          onChange={(e) => setFormData({...formData, feature_request: e.target.value})}
          className="w-full px-4 py-2 rounded-lg border h-32"
        />
        <Button type="submit" className="w-full">
          Submit Donation Info
        </Button>
      </form>
    </Card>
  )
}
```

---

## 🔄 Fetch Real Donors

Update `/src/components/DonorLeaderboard.tsx`:

```typescript
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export function DonorLeaderboard({ limit = 10 }) {
  const [donors, setDonors] = useState<Donor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDonors()
  }, [])

  const fetchDonors = async () => {
    try {
      const { data, error } = await supabase
        .from('donations')
        .select('*')
        .eq('status', 'confirmed')
        .order('amount', { ascending: false })
        .limit(limit)
      
      if (error) throw error
      setDonors(data || [])
    } catch (error) {
      console.error('Error fetching donors:', error)
    } finally {
      setLoading(false)
    }
  }

  // ... rest of component
}
```

---

## 🔐 Security Best Practices

### **1. Never Expose Private Keys**
```
❌ NEVER put private keys in code
❌ NEVER commit seed phrases to git
✅ Only use PUBLIC wallet addresses
✅ Store private keys offline (hardware wallet)
```

### **2. Verify Transactions Manually**
```
✅ Check Tron/Ethereum explorer
✅ Confirm transaction hash
✅ Match amounts with donors
✅ Update database manually if needed
```

### **3. Test Small Amount First**
```
Before publishing:
1. Send $1 test transaction
2. Verify it arrives correctly
3. Check network (TRC20 vs ERC20)
4. Confirm wallet address
```

---

## 💡 Features to Add (Future)

### **1. Auto-Verify Transactions**

Use blockchain APIs:

```typescript
// Check USDT TRC20 transaction
async function verifyTronTransaction(txHash: string) {
  const response = await fetch(
    `https://api.trongrid.io/v1/transactions/${txHash}`
  )
  const data = await response.json()
  
  // Verify amount, address, etc.
  return {
    verified: true,
    amount: data.amount,
    sender: data.from
  }
}
```

### **2. Notification on New Donation**

```typescript
// Discord webhook
async function notifyNewDonation(donor: Donor) {
  await fetch(DISCORD_WEBHOOK_URL, {
    method: 'POST',
    body: JSON.stringify({
      content: `🎉 New donation from ${donor.name}: $${donor.amount}!`
    })
  })
}
```

### **3. Real-time Leaderboard Updates**

```typescript
// Supabase realtime
supabase
  .channel('donations')
  .on('INSERT', payload => {
    // Update leaderboard live
    setDonors(prev => [payload.new, ...prev])
  })
  .subscribe()
```

---

## 📊 Analytics

### **Track Donation Metrics:**

```typescript
// Add to Vercel Analytics
import { track } from '@vercel/analytics'

track('Donation Panel Opened')
track('Wallet Selected', { wallet: 'USDT' })
track('Address Copied', { currency: 'BTC' })
```

---

## 🎨 Customization

### **Change Colors:**

```typescript
// DonationPanel.tsx
// Line 119: Donation button gradient
className="bg-gradient-to-r from-pink-500 to-purple-500"

// Change to:
className="bg-gradient-to-r from-blue-500 to-cyan-500"
```

### **Add More Cryptocurrencies:**

```typescript
const WALLET_ADDRESSES = {
  ...existing wallets,
  
  usdc: {
    address: 'YOUR_USDC_ADDRESS',
    network: 'Ethereum',
    name: 'USDC',
    icon: '$',
    color: 'text-blue-600',
    recommended: false as const
  },
  
  doge: {
    address: 'YOUR_DOGE_ADDRESS',
    network: 'Dogecoin',
    name: 'Dogecoin',
    icon: 'Ð',
    color: 'text-yellow-600',
    recommended: false as const
  }
}
```

---

## ✅ Testing Checklist

Before going live:

- [ ] Replace all placeholder wallet addresses
- [ ] Test each cryptocurrency address
- [ ] Send test transaction (small amount)
- [ ] Verify QR codes work
- [ ] Test copy to clipboard
- [ ] Check mobile responsive
- [ ] Test toast notifications
- [ ] Verify safety warnings display
- [ ] Test form submission (if added)
- [ ] Check Supabase connection

---

## 🚀 Deployment

### **Update Environment Variables:**

Add to Vercel:
```bash
# Not needed for client-side wallets
# Wallets are hardcoded in component
```

### **Deploy:**

```bash
git add .
git commit -m "feat: Add donation system"
git push origin main
```

Vercel auto-deploys!

---

## 📞 Support

**Crypto wallet resources:**
- Binance: https://binance.com
- TronLink: https://www.tronlink.org/
- MetaMask: https://metamask.io/
- Trust Wallet: https://trustwallet.com/

**Blockchain explorers:**
- Tron (TRC20): https://tronscan.org/
- Ethereum: https://etherscan.io/
- Bitcoin: https://blockchain.com/explorer
- BNB: https://bscscan.com/

---

## 🎉 Summary

**What You Have:**
```
✅ Beautiful donation panel
✅ 4 cryptocurrency options
✅ QR code generation
✅ Copy address functionality
✅ Safety instructions
✅ Donor leaderboard
✅ Tier system (Gold/Silver/Bronze)
✅ Toast notifications
✅ Mobile responsive
✅ Ready for production
```

**Next Steps:**
```
1. Update wallet addresses ← IMPORTANT!
2. Test with small donations
3. Add to Supabase (optional)
4. Create confirmation form
5. Auto-verify transactions
6. Go live!
```

---

**💰 Your donation system is ready! Update the wallet addresses and start accepting donations! 🚀**
