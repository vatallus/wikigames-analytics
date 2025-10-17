# ⚡ CẬP NHẬT ĐỊA CHỈ VÍ BITUNIX - HƯỚNG DẪN NHANH

## 🚨 BẠN CẦN LÀM NGAY: Update địa chỉ ví thật!

Hiện tại website đang hiển thị địa chỉ placeholder. Để hiển thị địa chỉ ví Bitunix thật của bạn:

---

## 📍 BƯỚC 1: Lấy Địa Chỉ Từ Bitunix (2 phút)

1. **Đăng nhập Bitunix:** https://www.bitunix.com

2. **Vào:** `Assets` → `Deposit`

3. **Chọn coin:** `USDT`

4. **Chọn network:** `TRC20` ⚠️ (quan trọng!)

5. **Copy địa chỉ** (dạng: TXxxxxx...)

---

## 📝 BƯỚC 2: Cập Nhật Vào Code (1 phút)

### **Mở file:**
```
src/components/DonationPanel.tsx
```

### **Tìm dòng 18:**
```typescript
address: 'YOUR_USDT_TRC20_ADDRESS_HERE',
```

### **Thay bằng địa chỉ thật từ Bitunix:**
```typescript
address: 'TX7n2Ej...PASTE_BITUNIX_ADDRESS_HERE...xyz',
```

### **Lưu file:** `Cmd + S`

---

## 🧪 BƯỚC 3: Test (1 phút)

```bash
npm run dev
```

1. Click nút "Donate" (góc trên phải)
2. Xem QR code → Phải hiển thị địa chỉ THẬT của bạn
3. Click "Copy" → Paste → Kiểm tra địa chỉ đúng

---

## 🚀 BƯỚC 4: Deploy (2 phút)

```bash
git add src/components/DonationPanel.tsx
git commit -m "chore: update Bitunix wallet addresses"
git push origin main
```

Xong! Vercel sẽ auto-deploy trong 2-3 phút.

---

## ✅ SAU KHI CẬP NHẬT

### **Donors giờ có thể:**

1. **Scan QR code** hoặc **Copy địa chỉ**
2. **Gửi donation** qua Bitunix hoặc wallet khác
3. **Click "Confirm Your Donation"** trong donation panel
4. **Điền form xác nhận:**
   - Tên (sẽ hiện trên leaderboard)
   - Số tiền
   - Transaction hash (optional)
   - Message (optional)
   - Feature request (optional)

5. **Submit** → Đợi verify → Lên leaderboard! 🎉

---

## 🎯 FLOW HOÀN CHỈNH

```
User clicks "Donate" button
    ↓
Panel slides in với QR code
    ↓
User scan QR / copy địa chỉ VÍ THẬT từ Bitunix
    ↓
User gửi tiền qua ví crypto
    ↓
User clicks "Confirm Your Donation"
    ↓
User điền form với:
  - Tên
  - Số tiền
  - Transaction hash
  - Message
  - Feature request
    ↓
Submit form → Lưu vào localStorage
    ↓
Bạn verify transaction trên Bitunix
    ↓
Add user vào Donor Leaderboard
    ↓
User nhận donor badge! 🏆
```

---

## 📊 ĐÃ IMPLEMENT

✅ **Donation Panel** - QR code + copy address
✅ **Confirmation Form** - Route `/donate/confirm`
✅ **Form validation** - Tên, số tiền required
✅ **localStorage storage** - Lưu pending donations
✅ **Success screen** - Hiển thị sau submit
✅ **Navigation** - Link từ panel → form
✅ **Responsive** - Mobile friendly

---

## 🔜 BƯỚC TIẾP THEO (Optional)

### **Kết nối Supabase để auto-verify:**

1. Tạo bảng `donations` trong Supabase (đã có SQL trong DONATION_SYSTEM_GUIDE.md)

2. Update `DonateConfirmPage.tsx` để lưu vào Supabase:

```typescript
const { data, error } = await supabase
  .from('donations')
  .insert([formData])
```

3. Tạo dashboard admin để approve donations

4. Auto-update leaderboard sau khi approve

---

## 🔐 LƯU Ý BẢO MẬT

✅ File `WALLET_ADDRESSES.config` đã được gitignore (an toàn)
✅ Chỉ commit file DonationPanel.tsx (có địa chỉ public deposit)
✅ Địa chỉ deposit là PUBLIC và AN TOÀN
✅ Không bao giờ commit private key/seed phrase

---

## 📞 CẦN GIÚP?

**Nếu gặp vấn đề:**

1. Địa chỉ không hiển thị? 
   → Check file đã lưu chưa (Cmd+S)
   
2. QR code không đổi?
   → Clear cache browser (Cmd+Shift+R)
   
3. Copy không hoạt động?
   → Cần HTTPS (test trên production)

---

## ⏱️ Timeline

```
□ Lấy địa chỉ Bitunix           → 2 phút
□ Update DonationPanel.tsx      → 1 phút  
□ Test local                    → 1 phút
□ Commit & Push                 → 1 phút
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOTAL: 5 phút để GO LIVE! ⚡
```

---

**🎯 HÃY CẬP NHẬT NGAY ĐỂ NHẬN DONATION! 💰**
