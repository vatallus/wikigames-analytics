# ⚡ QUICK WALLET SETUP - 3 BƯỚC ĐƠN GIẢN

## 🎯 MỤC TIÊU: Hoàn thiện donation system trong 30 phút!

---

## ✅ BƯỚC 1: LẤY ĐỊA CHỈ VÍ (15 phút)

### **Option A: Dùng Binance (RECOMMENDED - Dễ nhất!)**

```bash
1. Vào https://www.binance.com
2. Đăng ký/Đăng nhập
3. Hoàn thành KYC (nếu chưa có)
4. Vào: Wallet → Fiat and Spot → Deposit
5. Chọn: USDT
6. Network: TRC20
7. COPY địa chỉ (dạng: TXxxxx...)
```

### **Option B: Tự tạo ví TronLink**

```bash
1. Cài TronLink: https://www.tronlink.org/
2. Create New Wallet
3. LƯU 12 từ seed phrase (GHI RA GIẤY!)
4. Đặt mật khẩu
5. Copy địa chỉ ví
```

---

## ✅ BƯỚC 2: CẬP NHẬT CODE (5 phút)

### **Cách 1: Chỉnh sửa trực tiếp (Nhanh nhất!)**

Mở file: `src/components/DonationPanel.tsx`

Tìm dòng 18 và thay:
```typescript
// TRƯỚC:
address: 'YOUR_USDT_TRC20_ADDRESS_HERE',

// SAU:
address: 'TYour1Real2USDT3Address4Here',  // ← Địa chỉ thật của bạn
```

Lặp lại cho BTC (line 26), ETH (line 34), BNB (line 42) nếu có.

**SAVE FILE!** ✅

---

### **Cách 2: Dùng Config File (Chuyên nghiệp hơn)**

```bash
# 1. Copy file mẫu
cp WALLET_ADDRESSES.config.example WALLET_ADDRESSES.config

# 2. Mở file và điền địa chỉ
nano WALLET_ADDRESSES.config
# Hoặc mở bằng VSCode

# 3. Chạy script update
chmod +x scripts/update-wallet-addresses.sh
./scripts/update-wallet-addresses.sh

# 4. Xem thay đổi
git diff src/components/DonationPanel.tsx
```

---

## ✅ BƯỚC 3: TEST & DEPLOY (10 phút)

### **Test Local:**

```bash
# 1. Chạy dev server
npm run dev

# 2. Mở http://localhost:5173
# 3. Click nút "Donate" (góc trên phải)
# 4. Kiểm tra:
```

**Checklist:**
- [ ] QR code hiển thị
- [ ] Copy address hoạt động
- [ ] Toast notification xuất hiện
- [ ] Địa chỉ đúng khi paste

---

### **Deploy to Production:**

```bash
# 1. Commit changes
git add src/components/DonationPanel.tsx
git commit -m "chore: update crypto wallet addresses"

# 2. Push to GitHub
git push origin main

# 3. Vercel auto-deploy (đợi 2-3 phút)

# 4. Kiểm tra live site
# Vào https://wikigames.org
# Click "Donate"
# Verify QR code và address
```

---

## 🧪 TEST VỚI DONATION THẬT (Optional nhưng Recommended!)

```bash
1. Gửi $1 USDT (TRC20) từ ví của bạn
2. Scan QR code hoặc copy address
3. Gửi tiền
4. Đợi 1-3 phút
5. Check TronScan: https://tronscan.org
6. Tìm address của bạn
7. Xem transaction có thành công không

✅ Nếu OK → System hoạt động hoàn hảo!
```

---

## 🔒 SECURITY CHECKLIST

```
✅ Đã lưu seed phrase ra giấy (không screenshot!)
✅ Đã backup wallet passwords
✅ Đã enable 2FA trên Binance
✅ Đã verify địa chỉ ví đúng
✅ Đã test với số tiền nhỏ
✅ KHÔNG share private key/seed phrase cho ai
```

---

## 📊 SAU KHI HOÀN THÀNH

**Bạn có:**
```
✅ Donation button hoạt động
✅ 4 crypto wallets (USDT, BTC, ETH, BNB)
✅ QR codes tự động
✅ Copy address dễ dàng
✅ Professional UI
✅ Sẵn sàng nhận donation!
```

**Donors có thể:**
```
✅ Scan QR code để donate
✅ Copy address để chuyển tiền
✅ Chọn crypto yêu thích
✅ Xem hướng dẫn an toàn
✅ Lên leaderboard sau khi donate
```

---

## 🆘 GẶP VẤN ĐỀ?

### **QR Code không hiển thị?**
```
- Check console (F12) xem có lỗi không
- Verify package installed: npm list qrcode.react
- Try: npm install qrcode.react
```

### **Copy không hoạt động?**
```
- Browser cần HTTPS để copy clipboard
- Test trên production (https://wikigames.org)
- Check permissions
```

### **Địa chỉ ví không đúng?**
```
- Double-check file DonationPanel.tsx
- Xem có lưu file chưa
- Build lại: npm run build
- Clear cache: Cmd+Shift+R
```

---

## 📞 HỖ TRỢ

**Resources:**
- Full Guide: `WALLET_SETUP_CHECKLIST.md`
- Donation System Guide: `DONATION_SYSTEM_GUIDE.md`
- Binance Support: https://www.binance.com/en/chat

---

## 🎉 READY!

**Total Time:** 30 phút
**Difficulty:** ⭐⭐ (Dễ)
**Result:** Professional donation system! 💰

```bash
# Quick commands:
npm run dev          # Test local
npm run build        # Build production
git push origin main # Deploy

# Check live:
https://wikigames.org
```

---

**Chúc mừng! Bạn đã setup xong donation system! 🚀💰**

**Next:** 
- Promote donation system
- Add to social media
- Share with community
- Wait for first donor! 🎊
