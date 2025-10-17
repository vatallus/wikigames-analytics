# 🎯 Hướng Dẫn Setup Wallet Bitunix - NHANH CHÓNG!

## ✅ Bạn Đã Có Tài Khoản Bitunix - Tuyệt Vời!

Chỉ cần **3 BƯỚC** để hoàn thiện donation system:

---

## 📍 BƯỚC 1: Lấy Địa Chỉ Ví Từ Bitunix (5 phút)

### **1.1 Đăng nhập Bitunix**
```
https://www.bitunix.com
```

### **1.2 Lấy Địa Chỉ USDT (TRC20)** ⭐ QUAN TRỌNG!

```
1. Vào: Assets → Deposit (hoặc Nạp tiền)

2. Chọn coin: USDT

3. Chọn network: TRC20
   ⚠️ QUAN TRỌNG: Phải chọn TRC20, KHÔNG phải ERC20!

4. Sẽ hiện ra địa chỉ ví deposit
   Dạng: TXxxxxxxxxxxxxxxxxxxxxxxxxxxxx

5. Click COPY hoặc ghi lại địa chỉ này

📋 Địa chỉ USDT TRC20 của bạn:
_______________________________________________
```

### **1.3 Lấy Các Địa Chỉ Khác (Optional)**

**Bitcoin:**
```
Assets → Deposit → BTC → Bitcoin Network → Copy address

📋 Địa chỉ BTC:
_______________________________________________
```

**Ethereum:**
```
Assets → Deposit → ETH → ERC20 → Copy address

📋 Địa chỉ ETH:
_______________________________________________
```

**BNB:**
```
Assets → Deposit → BNB → BEP20 (BSC) → Copy address

📋 Địa chỉ BNB:
_______________________________________________
```

---

## 📝 BƯỚC 2: Cập Nhật Vào Code (3 phút)

### **Cách 1: Chỉnh Sửa Trực Tiếp (Nhanh nhất!)**

**Mở file:**
```
src/components/DonationPanel.tsx
```

**Tìm và thay địa chỉ (Line 18-47):**

```typescript
const WALLET_ADDRESSES = {
  usdt_trc20: {
    address: 'YOUR_USDT_TRC20_ADDRESS',  // ← Paste địa chỉ USDT TRC20 ở đây
    network: 'TRC20 (Tron)',
    name: 'USDT (TRC20)',
    icon: '₮',
    color: 'text-green-500',
    recommended: true as const
  },
  btc: {
    address: 'YOUR_BTC_ADDRESS',  // ← Paste địa chỉ BTC (nếu có)
    network: 'Bitcoin Network',
    name: 'Bitcoin (BTC)',
    icon: '₿',
    color: 'text-orange-500',
    recommended: false as const
  },
  eth: {
    address: 'YOUR_ETH_ADDRESS',  // ← Paste địa chỉ ETH (nếu có)
    network: 'Ethereum Network',
    name: 'Ethereum (ETH)',
    icon: 'Ξ',
    color: 'text-blue-500',
    recommended: false as const
  },
  bnb: {
    address: 'YOUR_BNB_ADDRESS',  // ← Paste địa chỉ BNB (nếu có)
    network: 'BNB Smart Chain',
    name: 'BNB (BSC)',
    icon: 'B',
    color: 'text-yellow-500',
    recommended: false as const
  }
}
```

**Ví dụ sau khi cập nhật:**
```typescript
const WALLET_ADDRESSES = {
  usdt_trc20: {
    address: 'TX7n2Ej7p6ACTUAL_BITUNIX_ADDRESS_HERE',  // ✅ Địa chỉ thật
    // ... rest stays the same
  },
  // ... các ví khác
}
```

**Lưu file (Cmd+S)** ✅

---

### **Cách 2: Dùng Config File (An Toàn Hơn)**

```bash
# 1. Copy file mẫu
cp WALLET_ADDRESSES.config.example WALLET_ADDRESSES.config

# 2. Mở file và điền địa chỉ
code WALLET_ADDRESSES.config
# Hoặc: nano WALLET_ADDRESSES.config

# 3. Thay YOUR_USDT_TRC20_ADDRESS_HERE bằng địa chỉ thật

# 4. Lưu file

# 5. Chạy script update
./scripts/update-wallet-addresses.sh
```

---

## 🧪 BƯỚC 3: Test & Deploy (5 phút)

### **3.1 Test Local**

```bash
# Chạy development server
npm run dev

# Mở browser
http://localhost:5173
```

**Kiểm tra:**
```
1. ✅ Click nút "Donate" (góc trên phải)
2. ✅ Panel slide in từ bên phải
3. ✅ Click "USDT (TRC20)"
4. ✅ QR code hiển thị
5. ✅ Click nút "Copy"
6. ✅ Toast notification xuất hiện
7. ✅ Paste (Cmd+V) → Kiểm tra địa chỉ đúng
```

### **3.2 Verify Địa chỉ Trên Blockchain**

**Check USDT TRC20:**
```
1. Vào: https://tronscan.org
2. Search địa chỉ của bạn
3. Xem có hiển thị đúng không
4. Nếu mới tạo có thể chưa có transaction (OK)
```

### **3.3 Test Donation Thật ($1 Test)**

```
💡 HIGHLY RECOMMENDED: Test với $1 trước!

1. Mở app crypto wallet của bạn
2. Gửi $1 USDT (TRC20) đến địa chỉ này
3. Đợi 1-3 phút
4. Check Bitunix: Assets → Transaction History
5. Check TronScan để xem transaction

✅ Nếu nhận được → Perfect! System hoạt động!
❌ Nếu không nhận → Kiểm tra lại:
   - Đúng network (TRC20)?
   - Đúng địa chỉ?
   - Transaction đã confirmed?
```

---

### **3.4 Deploy to Production**

```bash
# Build để check lỗi
npm run build

# Nếu build OK → Commit
git add src/components/DonationPanel.tsx
git commit -m "feat: update Bitunix wallet addresses"
git push origin main

# Vercel sẽ auto-deploy trong 2-3 phút

# Check live site
https://wikigames.org
```

---

## 🔐 SECURITY - QUAN TRỌNG!

### **✅ AN TOÀN:**
```
✅ Chỉ dùng địa chỉ DEPOSIT từ Bitunix
✅ KHÔNG BAO GIỜ share password Bitunix
✅ KHÔNG BAO GIỜ share 2FA codes
✅ Enable 2FA trên Bitunix
✅ Sử dụng email riêng cho Bitunix
✅ Set up withdrawal whitelist (nếu có)
```

### **❌ NGUY HIỂM - TRÁNH:**
```
❌ KHÔNG screenshot hoặc share private key
❌ KHÔNG click vào link lạ
❌ KHÔNG share seed phrase (nếu dùng ví riêng)
❌ KHÔNG dùng wifi công cộng để login
❌ KHÔNG share API keys
```

### **🔒 Bảo Mật Bitunix:**

```
1. Enable Google Authenticator 2FA:
   Settings → Security → 2FA

2. Enable Withdrawal Whitelist:
   Settings → Security → Withdrawal Address Management
   → Chỉ cho phép rút về các địa chỉ đã whitelist

3. Enable Email Notifications:
   Settings → Notifications
   → Bật thông báo cho Deposit/Withdrawal

4. Set Strong Password:
   - Ít nhất 12 ký tự
   - Chữ hoa, chữ thường, số, ký tự đặc biệt
   - Không dùng lại password khác
```

---

## 📊 Monitoring Donations

### **Check Deposits trên Bitunix:**

```
1. Vào: Assets → Transaction History
2. Filter: Deposit
3. Coin: USDT (hoặc BTC, ETH, BNB)
4. Xem transactions gần đây
```

### **Check On-Chain:**

```
USDT TRC20: https://tronscan.org/address/YOUR_ADDRESS
BTC:        https://blockchain.com/btc/address/YOUR_ADDRESS
ETH:        https://etherscan.io/address/YOUR_ADDRESS
BNB:        https://bscscan.com/address/YOUR_ADDRESS
```

### **Setup Alerts:**

```
Bitunix App → Settings → Notifications:
✅ Deposit Received
✅ Withdrawal Completed
✅ Login from New Device
✅ API Key Used
```

---

## 💡 TIPS for Bitunix Users

### **Phí Giao Dịch:**
```
USDT TRC20: ~$1      ✅ RECOMMENDED!
Bitcoin:    $5-20    💰 Cao
Ethereum:   $10-50   💰 Rất cao
BNB (BSC):  ~$0.5    ✅ Tốt
```

### **Tốc Độ:**
```
USDT TRC20: 1-3 phút     ⚡ Nhanh
Bitcoin:    10-60 phút   🐌 Chậm
Ethereum:   2-5 phút     ⏱️  Trung bình
BNB:        1-3 phút     ⚡ Nhanh
```

### **Nên Dùng Gì?**
```
🥇 USDT (TRC20):  Tốt nhất - Nhanh, rẻ, stable
🥈 BNB (BSC):     OK - Nhanh, rẻ
🥉 Bitcoin:       Chấp nhận được - Chậm, đắt
❌ Ethereum:      Không khuyến khích - Rất đắt phí
```

---

## 🎯 CHECKLIST Hoàn Thiện

```
□ Đã lấy địa chỉ USDT TRC20 từ Bitunix
□ Đã lấy địa chỉ BTC (optional)
□ Đã lấy địa chỉ ETH (optional)
□ Đã lấy địa chỉ BNB (optional)
□ Đã update vào DonationPanel.tsx
□ Đã test local (npm run dev)
□ QR code hiển thị đúng
□ Copy address hoạt động
□ Đã test với $1 donation
□ Transaction thành công
□ Đã enable 2FA trên Bitunix
□ Đã setup email notifications
□ Đã commit code
□ Đã push to GitHub
□ Đã verify trên production
□ System hoàn toàn sẵn sàng! ✅
```

---

## 🚀 READY TO LAUNCH!

**Sau khi hoàn thành:**
```
✅ Donation system hoạt động 100%
✅ Nhận donation qua Bitunix
✅ QR codes tự động
✅ An toàn & bảo mật
✅ Professional UI/UX
✅ Donor leaderboard
✅ Ready for production!
```

**Your donors can now:**
```
✅ Donate crypto dễ dàng
✅ Scan QR code
✅ Copy address
✅ Lên leaderboard
✅ Request features
```

---

## 📞 Support

**Bitunix:**
- Website: https://www.bitunix.com
- Support: Check app/website for contact

**Blockchain Explorers:**
- TronScan: https://tronscan.org
- Blockchain.com: https://blockchain.com/explorer
- Etherscan: https://etherscan.io
- BscScan: https://bscscan.com

**Documentation:**
- Full Guide: WALLET_SETUP_CHECKLIST.md
- Donation System: DONATION_SYSTEM_GUIDE.md

---

## ⏱️ Timeline

```
Bước 1: Lấy địa chỉ từ Bitunix    → 5 phút
Bước 2: Update code                → 3 phút
Bước 3: Test & Deploy              → 5 phút
-------------------------------------------------
TOTAL: 13 phút để hoàn thiện! ⚡

Optional:
- Test $1 donation                 → +5 phút
- Setup security                   → +5 phút
-------------------------------------------------
FULL SETUP: ~25 phút
```

---

**🎉 Chúc mừng! Bạn sắp hoàn thiện donation system với Bitunix! 💰**

**Let's do this! 🚀**
