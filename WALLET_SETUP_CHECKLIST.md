# 💰 Wallet Setup Checklist - HOÀN THIỆN DONATION SYSTEM

## ✅ Checklist Cần Làm

### **BƯỚC 1: Tạo/Lấy Địa Chỉ Ví Crypto** (15-30 phút)

#### [ ] **1.1 USDT (TRC20)** - RECOMMENDED! ⭐

**Tại sao nên dùng USDT TRC20:**
- ✅ Phí giao dịch cực thấp (~$1)
- ✅ Tốc độ nhanh (vài phút)
- ✅ Stablecoin (giá ổn định = $1)
- ✅ Phổ biến nhất ở Việt Nam

**Cách lấy địa chỉ USDT TRC20:**

**Option A: Binance (Dễ nhất, Recommended!)**
```
1. Đăng ký tài khoản Binance:
   https://www.binance.com/en/register

2. Hoàn thành KYC (xác minh danh tính):
   - Upload CCCD/Passport
   - Chụp ảnh selfie
   - Đợi duyệt (5-30 phút)

3. Lấy địa chỉ ví:
   - Vào Wallet → Fiat and Spot
   - Click "Deposit"
   - Chọn coin: USDT
   - Chọn network: TRC20
   - COPY địa chỉ ví (dạng: TXxxxxxxxxxxxxx)

4. Điền vào đây:
   USDT_TRC20_ADDRESS: _________________________________
```

**Option B: TronLink Wallet (Tự quản lý)**
```
1. Cài đặt TronLink:
   - Chrome: https://www.tronlink.org/
   - Hoặc app mobile từ App Store/Google Play

2. Tạo ví mới:
   - Click "Create Wallet"
   - ĐẶT MẬT KHẨU MẠNH
   - LƯU SEED PHRASE (12 từ) - CỰC KỲ QUAN TRỌNG!
   - Viết ra giấy, cất nơi an toàn
   - KHÔNG BAO GIỜ CHIA SẺ SEED PHRASE!

3. Lấy địa chỉ:
   - Mở TronLink
   - Copy địa chỉ (dạng: TXxxxxxxxxxxxxx)

4. Điền vào đây:
   USDT_TRC20_ADDRESS: _________________________________
```

---

#### [ ] **1.2 Bitcoin (BTC)** - Optional

**Cách lấy địa chỉ BTC:**

**Option A: Binance**
```
1. Wallet → Deposit
2. Chọn coin: BTC
3. Chọn network: Bitcoin (BTC)
4. Copy địa chỉ (dạng: bc1xxx hoặc 1xxx)

Điền vào đây:
BTC_ADDRESS: _________________________________
```

**Option B: Trust Wallet / Exodus**
```
1. Tải Trust Wallet hoặc Exodus
2. Tạo Bitcoin wallet
3. LƯU SEED PHRASE!
4. Copy Bitcoin address

Điền vào đây:
BTC_ADDRESS: _________________________________
```

---

#### [ ] **1.3 Ethereum (ETH)** - Optional

**Cách lấy địa chỉ ETH:**

**Option A: Binance**
```
1. Wallet → Deposit
2. Chọn coin: ETH
3. Chọn network: Ethereum (ERC20)
4. Copy địa chỉ (dạng: 0xxxx)

Điền vào đây:
ETH_ADDRESS: _________________________________
```

**Option B: MetaMask**
```
1. Cài MetaMask: https://metamask.io/
2. Tạo wallet mới
3. LƯU SEED PHRASE!
4. Copy địa chỉ Ethereum

Điền vào đây:
ETH_ADDRESS: _________________________________
```

---

#### [ ] **1.4 BNB (BSC)** - Optional

**Cách lấy địa chỉ BNB:**

**Option A: Binance**
```
1. Wallet → Deposit
2. Chọn coin: BNB
3. Chọn network: BNB Smart Chain (BEP20)
4. Copy địa chỉ (dạng: 0xxxx - giống ETH)

Điền vào đây:
BNB_ADDRESS: _________________________________
```

**Lưu ý:** 
- Địa chỉ ETH và BNB có thể GIỐNG NHAU (cùng 0xxxx)
- Nhưng phải chọn đúng network khi nhận tiền!

---

### **BƯỚC 2: Cập Nhật Code** (5 phút)

#### [ ] **2.1 Mở file DonationPanel.tsx**

```bash
# Vị trí file:
/src/components/DonationPanel.tsx
```

#### [ ] **2.2 Thay thế địa chỉ ví (Line 17-48)**

Tìm đoạn code này và THAY THẾ:

```typescript
const WALLET_ADDRESSES = {
  usdt_trc20: {
    address: 'YOUR_USDT_TRC20_ADDRESS',  // ← THAY ĐỔI Ở ĐÂY!
    network: 'TRC20 (Tron)',
    name: 'USDT (TRC20)',
    icon: '₮',
    color: 'text-green-500',
    recommended: true as const
  },
  btc: {
    address: 'YOUR_BTC_ADDRESS',  // ← THAY ĐỔI Ở ĐÂY!
    network: 'Bitcoin Network',
    name: 'Bitcoin (BTC)',
    icon: '₿',
    color: 'text-orange-500',
    recommended: false as const
  },
  eth: {
    address: 'YOUR_ETH_ADDRESS',  // ← THAY ĐỔI Ở ĐÂY!
    network: 'Ethereum Network',
    name: 'Ethereum (ETH)',
    icon: 'Ξ',
    color: 'text-blue-500',
    recommended: false as const
  },
  bnb: {
    address: 'YOUR_BNB_ADDRESS',  // ← THAY ĐỔI Ở ĐÂY!
    network: 'BNB Smart Chain',
    name: 'BNB (BSC)',
    icon: 'B',
    color: 'text-yellow-500',
    recommended: false as const
  }
}
```

**VÍ DỤ SAU KHI THAY:**

```typescript
const WALLET_ADDRESSES = {
  usdt_trc20: {
    address: 'TYour1Real2USDT3Address4Here5Example6',  // ✅ Real address
    network: 'TRC20 (Tron)',
    name: 'USDT (TRC20)',
    icon: '₮',
    color: 'text-green-500',
    recommended: true as const
  },
  btc: {
    address: 'bc1your_real_bitcoin_address_here',  // ✅ Real address
    network: 'Bitcoin Network',
    name: 'Bitcoin (BTC)',
    icon: '₿',
    color: 'text-orange-500',
    recommended: false as const
  },
  // ... eth, bnb tương tự
}
```

---

### **BƯỚC 3: Test & Verify** (10 phút)

#### [ ] **3.1 Test Local**

```bash
# Chạy development server
npm run dev

# Mở browser: http://localhost:5173
# Click nút "Donate" (góc trên phải)
# Kiểm tra:
```

**Checklist Test:**
- [ ] Panel slide in từ bên phải
- [ ] Hiển thị 4 loại crypto
- [ ] Click vào mỗi crypto → QR code thay đổi
- [ ] QR code hiển thị đúng địa chỉ ví
- [ ] Click "Copy" → Toast notification xuất hiện
- [ ] Paste (Cmd+V) → Địa chỉ ví đúng
- [ ] Test trên mobile (responsive)

#### [ ] **3.2 Verify Địa Chỉ Ví**

**QUAN TRỌNG! Phải kiểm tra kỹ:**

```bash
# Test USDT TRC20:
1. Scan QR code bằng app crypto
2. Hoặc copy address và paste vào ví
3. Kiểm tra trên TronScan:
   https://tronscan.org/#/address/YOUR_ADDRESS

# Test Bitcoin:
1. Check trên blockchain.com:
   https://www.blockchain.com/explorer/addresses/btc/YOUR_ADDRESS

# Test Ethereum:
1. Check trên Etherscan:
   https://etherscan.io/address/YOUR_ADDRESS
```

#### [ ] **3.3 Test Thật (Recommended!)**

```bash
# Gửi test transaction nhỏ:
1. USDT TRC20: Gửi $1 test
2. Đợi vài phút
3. Check trên TronScan xem có nhận được không
4. Nếu OK → Safe to go live!
```

---

### **BƯỚC 4: Deploy to Production** (5 phút)

#### [ ] **4.1 Commit & Push**

```bash
cd /Users/vatallus/wikigamesorg/wikigames-analytics

git add src/components/DonationPanel.tsx
git commit -m "Update real crypto wallet addresses"
git push origin main
```

#### [ ] **4.2 Verify Deployment**

```bash
# Vercel sẽ tự động deploy
# Đợi 2-3 phút
# Kiểm tra tại: https://wikigames.org

# Test trên production:
1. Vào https://wikigames.org
2. Click "Donate"
3. Scan QR code
4. Verify address
```

---

### **BƯỚC 5: Security & Backup** (10 phút)

#### [ ] **5.1 Backup Thông Tin Quan Trọng**

**LƯU VÀO NƠI AN TOÀN (USB, giấy, két sắt):**

```
=================================
CRYPTO WALLET BACKUP
=================================

USDT (TRC20):
Address: ___________________________
Platform: Binance / TronLink
Created: ___________________________

BTC:
Address: ___________________________
Platform: ___________________________
Created: ___________________________

ETH:
Address: ___________________________
Platform: ___________________________
Created: ___________________________

BNB:
Address: ___________________________
Platform: ___________________________
Created: ___________________________

=================================
SEED PHRASES (KHÔNG BAO GIỜ CHIA SẺ!)
=================================

TronLink Seed Phrase (12 words):
1. _______ 2. _______ 3. _______ 4. _______
5. _______ 6. _______ 7. _______ 8. _______
9. _______ 10. ______ 11. ______ 12. ______

MetaMask Seed Phrase (12 words):
1. _______ 2. _______ 3. _______ 4. _______
5. _______ 6. _______ 7. _______ 8. _______
9. _______ 10. ______ 11. ______ 12. ______

=================================
SECURITY NOTES:
=================================
- KHÔNG BAO GIỜ screenshot seed phrase
- KHÔNG BAO GIỜ lưu vào cloud
- KHÔNG BAO GIỜ gửi qua email/chat
- KHÔNG BAO GIỜ share cho ai
- Viết tay ra giấy, cất két sắt
=================================
```

#### [ ] **5.2 Enable 2FA**

```
Nếu dùng Binance:
1. Security → Two-factor Authentication
2. Enable Google Authenticator
3. Backup codes → Lưu an toàn
```

#### [ ] **5.3 Set Up Alerts**

```
Binance Notifications:
1. Settings → Notifications
2. Enable "Deposit" notifications
3. Enable Email + SMS alerts
4. Sẽ nhận thông báo khi có tiền vào
```

---

### **BƯỚC 6: Monitor & Manage** (Ongoing)

#### [ ] **6.1 Check Daily**

```
Mỗi ngày check:
- Binance: Wallet → Transaction History
- TronScan: https://tronscan.org
- Check email notifications
```

#### [ ] **6.2 Withdraw an toàn**

```
Khi muốn rút tiền:
1. KHÔNG BAO GIỜ rút tất cả một lúc
2. Test với số nhỏ trước
3. Double-check địa chỉ đích
4. Chọn đúng network
5. Dùng 2FA khi withdraw
```

---

## 📊 SUMMARY CHECKLIST

```
□ Tạo ví USDT TRC20 (Binance hoặc TronLink)
□ Tạo ví Bitcoin (optional)
□ Tạo ví Ethereum (optional)
□ Tạo ví BNB (optional)
□ Lưu tất cả địa chỉ ví
□ Backup seed phrases an toàn
□ Update code DonationPanel.tsx
□ Test local (npm run dev)
□ Verify QR codes
□ Test với $1 donation
□ Commit & push to GitHub
□ Verify production deployment
□ Enable 2FA on exchange
□ Setup deposit notifications
□ Ready to receive donations! 🎉
```

---

## ⏱️ Timeline Ước Tính

```
Tổng thời gian: 45-60 phút

Bước 1: Tạo ví           → 15-30 phút (lần đầu)
Bước 2: Update code      → 5 phút
Bước 3: Test             → 10 phút
Bước 4: Deploy           → 5 phút
Bước 5: Security backup  → 10 phút
Bước 6: Setup monitoring → 5 phút

TOTAL: 50-65 phút để hoàn thiện 100%!
```

---

## 🚨 LƯU Ý AN TOÀN

### **❌ KHÔNG BAO GIỜ:**
- Share seed phrase (12 từ khôi phục)
- Share private key
- Screenshot seed phrase
- Lưu seed phrase trên cloud/email
- Click vào link lạ
- Gửi tiền test cho người lạ

### **✅ LUÔN LUÔN:**
- Double-check địa chỉ ví
- Chọn đúng network (TRC20, ERC20, etc.)
- Test với số nhỏ trước
- Enable 2FA
- Backup seed phrase ra giấy
- Cất seed phrase ở két sắt

---

## 💡 TIPS

### **Nên dùng crypto nào?**

```
1. USDT (TRC20) ⭐⭐⭐⭐⭐
   - Phí thấp (~$1)
   - Nhanh (vài phút)
   - Giá ổn định ($1)
   - Phổ biến VN
   → RECOMMENDED!

2. Bitcoin ⭐⭐⭐
   - Phí cao ($5-20)
   - Chậm (10-60 phút)
   - Giá dao động
   → OK nhưng không ưu tiên

3. Ethereum ⭐⭐
   - Phí RẤT cao ($10-50)
   - Trung bình (2-5 phút)
   → Không recommend cho số nhỏ

4. BNB ⭐⭐⭐⭐
   - Phí thấp (~$0.5)
   - Nhanh
   → OK, nhưng ít người dùng hơn USDT
```

**KẾT LUẬN:** Chỉ cần USDT TRC20 là đủ! 👍

---

## 📞 HỖ TRỢ

**Nếu gặp vấn đề:**

1. **Binance Support:**
   - Chat support: https://www.binance.com/en/chat
   - Email: support@binance.com

2. **TronLink Support:**
   - Telegram: https://t.me/TronLinkWallet
   - Email: support@tronlink.org

3. **MetaMask Support:**
   - https://metamask.zendesk.com/

---

## ✅ SAU KHI HOÀN THÀNH

**Bạn sẽ có:**
```
✅ Donation system hoàn chỉnh
✅ Crypto wallets hoạt động
✅ QR codes đúng
✅ An toàn & bảo mật
✅ Sẵn sàng nhận donation
✅ Donor leaderboard
✅ Feature request system
```

**Donors có thể:**
```
✅ Donate USDT, BTC, ETH, BNB
✅ Scan QR code
✅ Copy địa chỉ
✅ Lên leaderboard
✅ Request features
✅ Nhận donor badge
```

---

## 🎯 READY TO LAUNCH?

Sau khi hoàn thành tất cả steps trên:

```
✅ Website của bạn sẽ nhận donation crypto
✅ Hoàn toàn tự động
✅ An toàn & chuyên nghiệp
✅ Không cần backend
✅ Miễn phí 100%
```

**Let's do this! 💰🚀**
