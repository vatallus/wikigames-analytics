#!/bin/bash

# ============================================
# Update Wallet Addresses Script
# ============================================
# Tự động update wallet addresses từ config file
# vào DonationPanel.tsx
# ============================================

echo "🔧 Updating Wallet Addresses..."
echo ""

# Check if config file exists
if [ ! -f "WALLET_ADDRESSES.config" ]; then
    echo "❌ Error: WALLET_ADDRESSES.config not found!"
    echo ""
    echo "Please:"
    echo "1. Copy WALLET_ADDRESSES.config.example to WALLET_ADDRESSES.config"
    echo "2. Fill in your real wallet addresses"
    echo "3. Run this script again"
    echo ""
    exit 1
fi

# Load config
source WALLET_ADDRESSES.config

# Validate addresses
if [ "$USDT_TRC20_ADDRESS" == "YOUR_USDT_TRC20_ADDRESS_HERE" ]; then
    echo "⚠️  Warning: USDT address still using placeholder!"
fi

if [ "$BTC_ADDRESS" == "YOUR_BTC_ADDRESS_HERE" ]; then
    echo "⚠️  Warning: BTC address still using placeholder!"
fi

if [ "$ETH_ADDRESS" == "YOUR_ETH_ADDRESS_HERE" ]; then
    echo "⚠️  Warning: ETH address still using placeholder!"
fi

if [ "$BNB_ADDRESS" == "YOUR_BNB_ADDRESS_HERE" ]; then
    echo "⚠️  Warning: BNB address still using placeholder!"
fi

echo ""
echo "📝 Addresses to update:"
echo "  USDT (TRC20): ${USDT_TRC20_ADDRESS:0:10}...${USDT_TRC20_ADDRESS: -10}"
echo "  Bitcoin:      ${BTC_ADDRESS:0:10}...${BTC_ADDRESS: -10}"
echo "  Ethereum:     ${ETH_ADDRESS:0:10}...${ETH_ADDRESS: -10}"
echo "  BNB:          ${BNB_ADDRESS:0:10}...${BNB_ADDRESS: -10}"
echo ""

# Ask for confirmation
read -p "Continue? (y/n) " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Cancelled"
    exit 1
fi

# Update DonationPanel.tsx
FILE="src/components/DonationPanel.tsx"

if [ ! -f "$FILE" ]; then
    echo "❌ Error: $FILE not found!"
    exit 1
fi

# Create backup
cp "$FILE" "$FILE.backup"
echo "✅ Created backup: $FILE.backup"

# Update addresses using sed
sed -i.tmp "s|address: 'YOUR_USDT_TRC20_ADDRESS_HERE'|address: '$USDT_TRC20_ADDRESS'|g" "$FILE"
sed -i.tmp "s|address: 'YOUR_BTC_ADDRESS_HERE'|address: '$BTC_ADDRESS'|g" "$FILE"
sed -i.tmp "s|address: 'YOUR_ETH_ADDRESS_HERE'|address: '$ETH_ADDRESS'|g" "$FILE"
sed -i.tmp "s|address: 'YOUR_BNB_ADDRESS_HERE'|address: '$BNB_ADDRESS'|g" "$FILE"

# Clean up temp files
rm -f "$FILE.tmp"

echo "✅ Updated wallet addresses in $FILE"
echo ""
echo "🎯 Next steps:"
echo "1. Review changes: git diff $FILE"
echo "2. Test locally: npm run dev"
echo "3. Commit: git add $FILE && git commit -m 'Update wallet addresses'"
echo "4. Deploy: git push origin main"
echo ""
echo "✨ Done!"
