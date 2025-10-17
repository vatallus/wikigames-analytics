# 📸 HƯỚNG DẪN THÊM ẢNH VÀO BLOG POSTS

## 🎯 CÓ 2 LOẠI ẢNH:

### 1. **Thumbnail (Ảnh đại diện)**
- Hiển thị ở đầu bài viết
- Kích thước khuyến nghị: 1200x630px
- Format: JPG, PNG, WebP

### 2. **Ảnh trong nội dung**
- Ảnh minh họa trong markdown
- Có thể nhiều ảnh
- Format: JPG, PNG, WebP, GIF

---

## 📁 CẤU TRÚC THƯ MỤC:

```
public/
└── blog/
    ├── images/                    ← Folder chứa ảnh
    │   ├── valorant-vs-csgo.jpg  ← Thumbnail
    │   ├── csgo-stats.jpg
    │   ├── dota2-stats.jpg
    │   ├── csgo-screenshot1.png  ← Ảnh trong bài
    │   └── dota2-chart.png
    │
    ├── valorant-vs-csgo-comparison.md
    ├── csgo-player-count-guide.md
    └── dota2-statistics-complete-guide.md
```

---

## 🖼️ CÁCH 1: THÊM THUMBNAIL

### **Bước 1: Chuẩn bị ảnh**
```
1. Tạo/tải ảnh (1200x630px recommended)
2. Đặt tên file: dota2-stats.jpg
3. Copy vào: /public/blog/images/
```

### **Bước 2: Cập nhật metadata**
**File:** `src/pages/BlogPostPage.tsx`

```typescript
'dota2-statistics-complete-guide': {
  title: 'Dota 2 Statistics 2025...',
  description: '...',
  readTime: '7 min',
  category: 'Statistics',
  keywords: ['Dota 2', 'Analytics'],
  published: 'October 17, 2025',
  thumbnail: '/blog/images/dota2-stats.jpg',  // ← THÊM DÒNG NÀY
  author: 'WikiGames Team'
}
```

### **Kết quả:**
✅ Ảnh hiển thị ngay dưới title
✅ Tự động ẩn nếu ảnh lỗi
✅ Responsive design

---

## 📝 CÁCH 2: THÊM ẢNH TRONG NỘI DUNG MARKDOWN

### **Syntax Markdown:**

```markdown
# Dota 2 Statistics 2025

Đây là intro...

## Player Statistics

![Dota 2 Player Chart](/blog/images/dota2-chart.png)

Như bạn thấy trong biểu đồ trên...

### Regional Breakdown

![Regional Stats](/blog/images/dota2-regions.png)
*Figure 1: Dota 2 players by region*

## Conclusion
...
```

### **Options:**

#### **Ảnh đơn giản:**
```markdown
![Alt text](/blog/images/image.jpg)
```

#### **Ảnh với caption:**
```markdown
![Chart Title](/blog/images/chart.png)
*Caption text here*
```

#### **Ảnh với link:**
```markdown
[![Click me](/blog/images/image.jpg)](https://wikigames.org)
```

#### **Nhiều ảnh cạnh nhau (HTML trong markdown):**
```markdown
<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
  <img src="/blog/images/img1.jpg" alt="Image 1" />
  <img src="/blog/images/img2.jpg" alt="Image 2" />
</div>
```

---

## 🎨 VÍ DỤ HOÀN CHỈNH:

### **File:** `dota2-statistics-complete-guide.md`

```markdown
# Dota 2 Statistics 2025: Complete Player Count & Analytics Guide

**Published:** October 17, 2025 | **Reading Time:** 7 minutes

## Dota 2 Player Statistics Overview

Dota 2 remains one of the most popular MOBAs in 2025 with a massive global player base.

![Dota 2 Banner](/blog/images/dota2-banner.jpg)

## Current Dota 2 Stats (October 2025)

- **Peak Concurrent Players:** 850,000+
- **Average Daily:** 650,000 players
- **Monthly Active:** 12 million+
- **Prize Pool 2025:** $40 million (The International)

### Player Count Trend

![Player Count Chart](/blog/images/dota2-player-trend.png)
*Figure 1: Dota 2 player count over the last 12 months*

## Dota 2 by Region

**Top Regions:**
1. Southeast Asia - 300K players
2. Europe - 250K players  
3. China - 200K players

![Regional Distribution](/blog/images/dota2-regions.png)

## Best Time to Play Dota 2

**Peak Hours:**
- Asia: 6-11 PM GMT+8
- Europe: 7-11 PM CET

![Peak Hours Heatmap](/blog/images/dota2-heatmap.jpg)

## Track Dota 2 Real-time

Use WikiGames for free real-time Dota 2 statistics.

**Track now:** https://wikigames.org
```

---

## 📦 KÍCH THƯỚC ẢNH KHUYẾN NGHỊ:

### **Thumbnails:**
```
Kích thước: 1200x630px (Facebook/Twitter optimal)
File size: < 200KB
Format: JPG (nén 80%)
```

### **Ảnh trong bài:**
```
Width: 800-1200px
Height: Auto
File size: < 300KB mỗi ảnh
Format: JPG hoặc WebP
```

### **Screenshots:**
```
Original resolution OK
Format: PNG (cho text rõ)
Nén: TinyPNG.com
```

---

## 🛠️ TOOLS ĐỂ TẠO ẢNH:

### **Free Design Tools:**
```
1. Canva (canva.com) - Tạo thumbnail
2. Figma (figma.com) - Design graphics
3. Photopea (photopea.com) - Free Photoshop
4. Remove.bg - Xóa background
```

### **Free Stock Photos:**
```
1. Unsplash.com - High quality free
2. Pexels.com - Free stock photos
3. Pixabay.com - Free images
```

### **Optimize Images:**
```
1. TinyPNG.com - Nén PNG/JPG
2. Squoosh.app - Convert to WebP
3. ImageOptim.com (Mac)
```

---

## 🚀 WORKFLOW THÊM ẢNH:

### **Cho bài mới:**

```bash
# 1. Chuẩn bị ảnh
- Tạo thumbnail: 1200x630px
- Tạo ảnh minh họa (nếu cần)
- Optimize tất cả ảnh

# 2. Upload ảnh
- Copy vào: /public/blog/images/
- Đặt tên rõ ràng: dota2-stats.jpg

# 3. Update BlogPostPage.tsx
- Thêm thumbnail path vào metadata

# 4. Update .md file
- Thêm ![alt](/blog/images/image.jpg) vào nội dung

# 5. Test
npm run dev
# Vào: http://localhost:5173/blog/dota2-statistics-complete-guide

# 6. Commit
git add public/blog/images/
git add src/pages/BlogPostPage.tsx
git add public/blog/dota2-statistics-complete-guide.md
git commit -m "feat: Add images to Dota 2 blog post"
git push
```

---

## 📸 MẪU THUMBNAIL NHANH:

### **Dùng Canva:**

```
1. Vào canva.com/create/facebook-post (1200x630)
2. Choose template hoặc blank
3. Add elements:
   - Background: Gradient (violet → blue)
   - Title: "Dota 2 Statistics 2025"
   - Subtitle: "Complete Analytics Guide"
   - Logo: WikiGames.org
   - Icon: Game icon hoặc chart
4. Download: JPG (Quality: 80)
5. Save as: dota2-stats.jpg
```

### **Template Ideas:**
```
Style 1: Gradient Background
- Violet to Blue gradient
- White bold title
- Minimal design
- WikiGames logo corner

Style 2: Game Screenshot
- Blur background
- Overlay dark gradient
- White text on top
- Stats numbers prominent

Style 3: Charts/Data
- Chart/graph background
- Data visualization
- Professional look
- Color: Blue/Purple theme
```

---

## ✅ CHECKLIST:

**Trước khi publish:**
```
□ Thumbnail có? (recommended 1200x630px)
□ Ảnh đã optimize? (< 200KB)
□ Alt text rõ ràng?
□ Ảnh hiển thị OK trên mobile?
□ Link ảnh đúng path?
□ Test trên localhost?
□ Commit ảnh vào git?
```

---

## 🎯 QUICK START:

### **Thêm thumbnail cho Dota 2 post:**

```bash
# 1. Tạo/download ảnh
# Save as: dota2-stats.jpg

# 2. Copy vào project
cp ~/Downloads/dota2-stats.jpg public/blog/images/

# 3. Metadata đã có sẵn rồi! (Check BlogPostPage.tsx)

# 4. Test
npm run dev
# http://localhost:5173/blog/dota2-statistics-complete-guide

# 5. Commit
git add public/blog/images/dota2-stats.jpg
git commit -m "feat: Add Dota 2 thumbnail"
git push
```

---

## 💡 TIPS:

```
✅ Dùng WebP format (nhẹ hơn 30%)
✅ Lazy load images (React tự động)
✅ Descriptive alt text (SEO!)
✅ Consistent aspect ratio
✅ Brand colors (violet/blue/cyan)
✅ Add watermark "wikigames.org"
```

---

## 🔥 EXAMPLE THUMBNAILS TO CREATE:

```
1. valorant-vs-csgo.jpg
   → Split screen: Valorant | CS:GO
   
2. csgo-stats.jpg
   → CS:GO logo + player count graph
   
3. dota2-stats.jpg
   → Dota 2 hero + statistics chart
   
4. steam-stats.jpg
   → Steam logo + trending graph
   
5. esports-trends.jpg
   → Trophy + upward arrow + 2025
   
6. free-tools.jpg
   → Tool icons + "FREE" badge
   
7. gaming-dashboard.jpg
   → Dashboard mockup screenshot
   
8. gaming-trends.jpg
   → Futuristic gaming theme
   
9. viral-content.jpg
   → Social media icons + rocket
   
10. analytics-tools.jpg
    → Analytics charts + tools
```

---

**🎨 READY TO ADD IMAGES!**

**Folder:** `/public/blog/images/`
**Just add images & update metadata!** 🚀
