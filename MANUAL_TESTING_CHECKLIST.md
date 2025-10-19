# 🧪 Manual Testing Checklist - WikiGames Analytics

## ✅ Pre-Test Setup

### 1. Clear Cache (Quan trọng!)

**Chrome/Edge:**
```
1. Press Cmd + Shift + Delete (Mac) or Ctrl + Shift + Delete (Windows)
2. Select "All time"
3. Check: "Cached images and files"
4. Click "Clear data"
```

**Firefox:**
```
1. Press Cmd + Shift + Delete (Mac) or Ctrl + Shift + Delete (Windows)
2. Select "Everything"
3. Check: "Cache"
4. Click "Clear Now"
```

**Safari:**
```
1. Develop → Empty Caches
2. Or: Safari → Preferences → Privacy → Manage Website Data → Remove All
```

**Hard Refresh:**
- Mac: `Cmd + Shift + R`
- Windows/Linux: `Ctrl + Shift + R`

### 2. Open DevTools Console

Press `F12` or:
- Mac: `Cmd + Option + I`
- Windows/Linux: `Ctrl + Shift + I`

**Watch for errors in Console tab!**

---

## 📋 Test Account

**Email:** `hacuong.1751992@gmail.com`  
**Password:** [Your password]

---

## 🎯 Test Cases

### **Test 1: Initial Page Load (Not Logged In)**

#### **Steps:**
1. Navigate to: https://www.wikigames.org/
2. Wait for page to fully load

#### **Expected Results:**
- [ ] Logo "WikiGames" hiển thị
- [ ] Connection status hiển thị ("Real-time Data" + "Connected")
- [ ] Navigation menu có: Home, Analytics, Leaderboards, Discover, Blog, Profile
- [ ] Header có: Donate button (màu hồng), Notification bell, **Sign In**, **Sign Up**, Refresh, Settings
- [ ] **Sign In** và **Sign Up** buttons phải hiển thị rõ ràng
- [ ] No console errors
- [ ] Backend connection working (không có "Server Offline" message)

#### **Screenshot/Debug:**
```javascript
// Run in console to check:
console.log('Auth buttons:', document.querySelectorAll('button').length);
console.log('Sign In:', document.body.innerText.includes('Sign In'));
console.log('Sign Up:', document.body.innerText.includes('Sign Up'));
```

---

### **Test 2: Sign In Flow**

#### **Steps:**
1. Click **"Sign In"** button
2. Enter email: `hacuong.1751992@gmail.com`
3. Enter password
4. Click "Sign In" trong modal
5. Wait for authentication

#### **Expected Results:**
- [ ] Modal mở ra với form đăng nhập
- [ ] Email input có validation (phải là email hợp lệ)
- [ ] Password input type="password" (ẩn text)
- [ ] "Sign In" button trong modal clickable
- [ ] Sau khi submit: Modal đóng lại
- [ ] **Sign In/Sign Up buttons biến mất**
- [ ] **Profile menu xuất hiện** (thay thế Sign In/Sign Up)
- [ ] Welcome message hoặc notification
- [ ] No errors in console

#### **Error Cases to Test:**
- [ ] Wrong password → Error: "Invalid login credentials"
- [ ] Invalid email format → Error: "Email address is invalid"
- [ ] Empty fields → Error: "Email and password required"

#### **Console Debug:**
```javascript
// Check auth state:
console.log('Logged in:', localStorage.getItem('supabase.auth.token'));
```

---

### **Test 3: Profile Menu (After Login)**

#### **Steps:**
1. Ensure logged in
2. Look for Profile button/menu in header

#### **Expected Results:**
- [ ] Profile icon/button hiển thị (thay thế Sign In/Sign Up)
- [ ] Click vào Profile → Dropdown menu mở ra
- [ ] Menu có options:
  - [ ] View Profile
  - [ ] Settings
  - [ ] **Logout**
- [ ] Avatar hiển thị đúng (nếu có)
- [ ] Username hiển thị đúng

---

### **Test 4: Home Page (Logged In)**

#### **Steps:**
1. Navigate to Home (`/` or click "Home" in nav)

#### **Expected Results:**
- [ ] Hero section hiển thị
- [ ] Global stats cards hiển thị (Total Players, Active Games, etc.)
- [ ] Real-time data updates
- [ ] Charts/graphs render properly
- [ ] No "Server Offline" message
- [ ] Smooth animations

---

### **Test 5: Analytics Page**

#### **Steps:**
1. Click "Analytics" in navigation menu
2. Wait for page load

#### **Expected Results:**
- [ ] Analytics dashboard loads
- [ ] Charts display data:
  - [ ] Player count chart
  - [ ] Game distribution pie chart
  - [ ] Trend lines
- [ ] Filters working (if any)
- [ ] Data refreshes on Refresh button click
- [ ] Real-time updates via WebSocket
- [ ] No loading errors

#### **Debug:**
```javascript
// Check WebSocket connection:
console.log('WebSocket:', window.location.href);
// Look for WebSocket connection in Network tab (WS filter)
```

---

### **Test 6: Leaderboards Page**

#### **Steps:**
1. Click "Leaderboards" in navigation menu
2. Wait for page load

#### **Expected Results:**
- [ ] Leaderboard table displays
- [ ] Games list shows correctly
- [ ] Player rankings visible
- [ ] Sort/filter functions work
- [ ] Pagination works (if applicable)
- [ ] User stats update correctly
- [ ] No loading spinners stuck

---

### **Test 7: Discover Page**

#### **Steps:**
1. Click "Discover" in navigation menu
2. Wait for page load

#### **Expected Results:**
- [ ] Game cards display in grid
- [ ] Each card shows:
  - [ ] Game image
  - [ ] Game name
  - [ ] Current players
  - [ ] Genre tags
- [ ] Search/filter works
- [ ] Click on game card → Shows details
- [ ] Hover effects work smoothly

---

### **Test 8: Blog Page**

#### **Steps:**
1. Click "Blog" in navigation menu
2. Wait for page load

#### **Expected Results:**
- [ ] Blog posts list displays
- [ ] Each post has:
  - [ ] Title
  - [ ] Date
  - [ ] Author
  - [ ] Excerpt
  - [ ] Featured image
- [ ] Click on post → Opens full post
- [ ] Markdown rendering works
- [ ] Code syntax highlighting (if blog has code)

---

### **Test 9: Profile Page (My Profile)**

#### **Steps:**
1. Click "Profile" in navigation menu
2. Or click Profile dropdown → "View Profile"

#### **Expected Results:**
- [ ] Profile page loads with user info:
  - [ ] Username: `hacuong.1751992@gmail.com`
  - [ ] Email displayed
  - [ ] Avatar (if uploaded)
  - [ ] Join date
  - [ ] User stats
- [ ] Edit profile button (if applicable)
- [ ] Settings accessible
- [ ] Activity history shows
- [ ] No permission errors

---

### **Test 10: Donation Flow**

#### **Steps:**
1. Click pink **"Donate"** button in header
2. Modal/panel should open

#### **Expected Results:**
- [ ] Donation panel opens
- [ ] Currency selection works:
  - [ ] USDT (TRC20)
  - [ ] Bitcoin (BTC)
  - [ ] Ethereum (ETH)
  - [ ] BNB
- [ ] QR code displays for selected currency
- [ ] Wallet address shown and copyable
- [ ] "Verify Transaction" button visible

#### **Test Transaction Verification:**
1. Click "Verify Transaction"
2. Enter **VALID** transaction hash:
   - USDT: `a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2` (64 chars hex)
   - BTC: `1a2b3c4d5e6f1a2b3c4d5e6f1a2b3c4d5e6f1a2b3c4d5e6f1a2b3c4d5e6f1a2b` (64 chars hex)
   - ETH: `0x1a2b3c4d5e6f1a2b3c4d5e6f1a2b3c4d5e6f1a2b3c4d5e6f1a2b3c4d5e6f1a2b` (0x + 64 chars)
   - BNB: `0x1a2b3c4d5e6f1a2b3c4d5e6f1a2b3c4d5e6f1a2b3c4d5e6f1a2b3c4d5e6f1a2b` (0x + 64 chars)
3. Enter amount (e.g., `50`)
4. Submit

#### **Expected Results:**
- [ ] Valid hash → Success message: "Transaction information received! We will verify it within 24 hours. 🎉"
- [ ] Invalid hash → Error: "Invalid transaction hash. Please check and try again."
- [ ] Confirmation screen shows:
  - [ ] Amount donated
  - [ ] Currency type
  - [ ] Transaction hash (shortened)
  - [ ] "Verification will be completed within 24 hours"

#### **Invalid Hash Tests:**
- [ ] `abc123` → Should reject (too short)
- [ ] `not-a-hash-at-all` → Should reject
- [ ] Empty field → Should reject

---

### **Test 11: Notifications**

#### **Steps:**
1. Click notification bell icon in header
2. Panel should open

#### **Expected Results:**
- [ ] Notification panel opens
- [ ] Unread count badge shows (if any unread)
- [ ] List of notifications displays
- [ ] Each notification has:
  - [ ] Icon
  - [ ] Title
  - [ ] Message
  - [ ] Timestamp
- [ ] Click on notification → Marks as read
- [ ] "Mark all as read" works
- [ ] "Clear all" works

---

### **Test 12: Real-time Updates**

#### **Steps:**
1. Stay on Analytics or Home page
2. Keep page open for 30-60 seconds
3. Watch for updates

#### **Expected Results:**
- [ ] Data auto-refreshes every 30 seconds
- [ ] WebSocket connection indicator shows "Connected"
- [ ] Player counts update without page reload
- [ ] No flickering or UI jumps
- [ ] Smooth transitions

#### **Check WebSocket:**
```javascript
// In DevTools Console:
// Check for WebSocket messages in Network tab (WS filter)
// Should see periodic updates
```

---

### **Test 13: Logout Flow**

#### **Steps:**
1. Click Profile menu
2. Click "Logout"

#### **Expected Results:**
- [ ] Confirmation prompt (optional)
- [ ] User logged out successfully
- [ ] Redirected to home or login page
- [ ] Profile menu disappears
- [ ] **Sign In / Sign Up buttons reappear**
- [ ] Session cleared
- [ ] No access to protected pages

#### **Console Debug:**
```javascript
// After logout:
console.log('Token cleared:', !localStorage.getItem('supabase.auth.token'));
```

---

### **Test 14: Settings/Dark Mode**

#### **Steps:**
1. Click settings icon (⚙️) in header
2. Or access via Profile → Settings

#### **Expected Results:**
- [ ] Settings panel/page opens
- [ ] Dark mode toggle works
- [ ] Theme switches smoothly
- [ ] Preference saved (persists on reload)
- [ ] All UI elements adapt to theme

---

### **Test 15: Mobile Responsiveness**

#### **Steps:**
1. Open DevTools → Device Toolbar (Cmd+Shift+M or Ctrl+Shift+M)
2. Test different device sizes:
   - iPhone SE (375px)
   - iPhone 12 Pro (390px)
   - iPad (768px)
   - Desktop (1920px)

#### **Expected Results:**
- [ ] Layout adapts to screen size
- [ ] Navigation collapses to hamburger menu on mobile
- [ ] Auth buttons visible on all screen sizes
- [ ] Cards stack properly on mobile
- [ ] No horizontal scroll
- [ ] Touch targets ≥ 44px
- [ ] Text readable without zoom

---

## 🐛 Common Issues & Solutions

### **Issue 1: Auth Buttons Not Showing**

**Symptoms:**
- Blank space in header where Sign In/Sign Up should be
- Skeleton loader stuck

**Solutions:**
1. Check console for Supabase errors
2. Verify env vars:
   ```javascript
   console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);
   console.log('Supabase Key:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Set' : 'Missing');
   ```
3. Hard refresh (Cmd+Shift+R)
4. Clear localStorage:
   ```javascript
   localStorage.clear();
   sessionStorage.clear();
   location.reload();
   ```

---

### **Issue 2: "Server Offline" Message**

**Symptoms:**
- Yellow warning box with "Server Offline"
- Mock data being used

**Solutions:**
1. Check backend status: https://postgres-production-959d.up.railway.app/health
2. Verify env vars:
   ```javascript
   console.log('API URL:', import.meta.env.VITE_API_URL);
   console.log('WS URL:', import.meta.env.VITE_WS_URL);
   ```
3. Check Railway dashboard for backend errors

---

### **Issue 3: Login Errors**

**Error: "Invalid login credentials"**
- Password incorrect
- Account doesn't exist
- Try "Forgot Password" flow

**Error: "Email address is invalid"**
- Check email format
- Should be: `user@example.com`

**Error: "Network error"**
- Check internet connection
- Check if Supabase service is down
- Clear cache and retry

---

### **Issue 4: Transaction Validation Fails**

**Error: "Invalid transaction hash"**
- Check hash format:
  - USDT/BTC: 64 hex characters
  - ETH/BNB: 0x + 64 hex characters
- Example valid hashes in Test 10

---

### **Issue 5: WebSocket Disconnected**

**Symptoms:**
- "Connecting..." or "Offline" in connection status
- Data not updating

**Solutions:**
1. Check Network tab (WS filter) for WebSocket errors
2. Verify backend is running
3. Click Refresh button
4. Reload page

---

## 📊 Test Results Template

### **Test Session:** [Date/Time]
### **Tester:** hacuong.1751992@gmail.com
### **Browser:** [Chrome/Firefox/Safari] [Version]
### **Device:** [Mac/Windows/Mobile]

| Test # | Feature | Status | Notes |
|--------|---------|--------|-------|
| 1 | Initial Load | ✅ / ❌ | |
| 2 | Sign In | ✅ / ❌ | |
| 3 | Profile Menu | ✅ / ❌ | |
| 4 | Home Page | ✅ / ❌ | |
| 5 | Analytics | ✅ / ❌ | |
| 6 | Leaderboards | ✅ / ❌ | |
| 7 | Discover | ✅ / ❌ | |
| 8 | Blog | ✅ / ❌ | |
| 9 | Profile Page | ✅ / ❌ | |
| 10 | Donation | ✅ / ❌ | |
| 11 | Notifications | ✅ / ❌ | |
| 12 | Real-time | ✅ / ❌ | |
| 13 | Logout | ✅ / ❌ | |
| 14 | Settings | ✅ / ❌ | |
| 15 | Mobile | ✅ / ❌ | |

### **Critical Bugs Found:**
1. [Description]
2. [Description]

### **Minor Issues:**
1. [Description]
2. [Description]

### **Suggestions:**
1. [Improvement]
2. [Improvement]

---

## 🚀 Quick Debug Commands

Open Console (F12) and run:

```javascript
// Check auth status
console.log('Logged in:', !!localStorage.getItem('supabase.auth.token'));

// Check env vars
console.log('API URL:', import.meta.env.VITE_API_URL);
console.log('WS URL:', import.meta.env.VITE_WS_URL);
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL);

// Check WebSocket
console.log('WS State:', window.WebSocket ? 'Available' : 'Not Available');

// Force clear cache
localStorage.clear();
sessionStorage.clear();
console.log('Cache cleared!');

// Reload
location.reload();
```

---

## ✅ Success Criteria

**All features considered working when:**

✅ No console errors  
✅ All test cases pass  
✅ Auth flow works smoothly  
✅ Real-time data updates  
✅ Mobile responsive  
✅ No visual glitches  
✅ Fast load times (< 3s)  
✅ Smooth animations  
✅ Proper error messages  
✅ Data persists across reloads  

---

**Happy Testing! 🎉**

If you find bugs, please document:
1. What you did (steps to reproduce)
2. What you expected
3. What actually happened
4. Browser/device info
5. Console errors (screenshot)
6. Network errors (DevTools → Network tab)
