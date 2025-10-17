# 🌐 Custom Domain Setup Guide - wikigames.org

## ✅ URLs Updated to Official Domain

All meta tags, sitemaps, and configurations have been updated to use:
```
https://wikigames.org
```

---

## 🚀 Setting Up Custom Domain on Vercel

### **Step 1: Add Domain in Vercel Dashboard**

1. **Go to Vercel Dashboard:**
   ```
   https://vercel.com/vatallus-projects/wikigames-analytics/settings/domains
   ```

2. **Click "Add Domain"**

3. **Enter your domain:**
   ```
   wikigames.org
   ```

4. **Click "Add"**

---

### **Step 2: Configure DNS Records**

Vercel will show you the DNS records to add. You need to configure:

#### **For Root Domain (wikigames.org):**

**Option A - Using A Record (Recommended):**
```
Type: A
Name: @
Value: 76.76.21.21
TTL: Auto or 3600
```

**Option B - Using CNAME (If A record not supported):**
```
Type: CNAME
Name: @
Value: cname.vercel-dns.com
TTL: Auto or 3600
```

#### **For www Subdomain (optional):**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
TTL: Auto or 3600
```

---

### **Step 3: Add Records in Your DNS Provider**

#### **If using Namecheap:**
1. Go to: https://ap.www.namecheap.com/domains/domaincontrolpanel/wikigames.org/advancedns
2. Click "Add New Record"
3. Add the A or CNAME record from above
4. Save changes

#### **If using GoDaddy:**
1. Go to your domain settings
2. Click "DNS" → "Manage DNS"
3. Add the records from above
4. Save

#### **If using Cloudflare:**
1. Go to DNS settings
2. Add A or CNAME record
3. Make sure proxy is OFF (gray cloud) initially
4. Save

---

### **Step 4: Verify Domain**

1. **Wait for DNS Propagation** (5-30 minutes)
   - Check status: https://dnschecker.org/#A/wikigames.org

2. **Vercel will automatically verify** once DNS propagates

3. **SSL Certificate** will be automatically generated (takes 2-5 minutes)

---

### **Step 5: Set as Production Domain**

1. In Vercel dashboard, find your domain
2. Click "..." → "Set as Production Domain"
3. This makes wikigames.org the primary URL

---

## 📊 Current URLs Configuration

### **Meta Tags (Already Updated):**
```html
<!-- Open Graph -->
<meta property="og:url" content="https://wikigames.org/" />

<!-- Twitter -->
<meta property="twitter:url" content="https://wikigames.org/" />

<!-- Canonical -->
<link rel="canonical" href="https://wikigames.org/" />

<!-- Structured Data -->
"url": "https://wikigames.org"
```

### **Sitemap (Already Updated):**
```xml
<loc>https://wikigames.org/</loc>
<loc>https://wikigames.org/analytics</loc>
<loc>https://wikigames.org/leaderboards</loc>
<loc>https://wikigames.org/discover</loc>
<loc>https://wikigames.org/profile</loc>
```

### **Robots.txt (Already Updated):**
```txt
Sitemap: https://wikigames.org/sitemap.xml
```

---

## ✅ Verification Checklist

After domain is configured:

- [ ] Visit https://wikigames.org (should load your site)
- [ ] Check SSL certificate (should show green lock 🔒)
- [ ] Test www redirect: https://www.wikigames.org
- [ ] Verify canonical tags point to wikigames.org
- [ ] Test Open Graph: https://www.opengraph.xyz/
- [ ] Submit sitemap to Google: https://search.google.com/search-console

---

## 🔄 Redirects Configuration

Vercel automatically handles:
- ✅ **www → non-www:** Redirects www.wikigames.org → wikigames.org
- ✅ **HTTP → HTTPS:** Forces SSL
- ✅ **Vercel subdomain → Custom:** Redirects *.vercel.app → wikigames.org

No additional configuration needed!

---

## 📈 After Domain is Live

### **1. Update Google Search Console:**
```
1. Go to https://search.google.com/search-console
2. Click "Add Property"
3. Add: https://wikigames.org
4. Verify ownership (use DNS TXT record)
5. Submit sitemap: https://wikigames.org/sitemap.xml
```

### **2. Update Analytics:**
```
- Vercel Analytics: Auto-updates
- Google Analytics: Update property URL
```

### **3. Test Social Sharing:**
```
Facebook: https://developers.facebook.com/tools/debug/
Twitter: https://cards-dev.twitter.com/validator
LinkedIn: https://www.linkedin.com/post-inspector/
```

### **4. Monitor:**
```
- DNS propagation: https://dnschecker.org
- SSL status: https://www.ssllabs.com/ssltest/
- Performance: https://pagespeed.web.dev/
```

---

## 🚨 Troubleshooting

### **Domain not loading:**
- Check DNS records are correct
- Wait 24-48 hours for full propagation
- Clear browser cache (Cmd+Shift+R)

### **SSL certificate error:**
- Wait 5-10 minutes after domain verification
- Vercel auto-generates SSL (Let's Encrypt)
- Check Vercel dashboard for status

### **www not redirecting:**
- Make sure www CNAME is added
- Vercel handles redirect automatically
- May take a few hours to activate

### **Old Vercel URL still showing:**
- Clear cache
- Update canonical tags (already done ✅)
- Submit new sitemap to Google

---

## 📝 DNS Records Reference

**Required for wikigames.org:**

| Type | Name | Value | Priority |
|------|------|-------|----------|
| A | @ | 76.76.21.21 | - |
| CNAME | www | cname.vercel-dns.com | - |

**Optional:**

| Type | Name | Value | Purpose |
|------|------|-------|---------|
| TXT | @ | v=spf1 include:_spf.vercel.com ~all | Email SPF |
| TXT | _vercel | [verification-code] | Ownership verification |

---

## 🎯 Expected Timeline

```
0-5 min:   DNS records added
5-30 min:  DNS propagation starts
30-60 min: Domain verified on Vercel
60-120 min: SSL certificate generated
2-24 hrs:  Full global DNS propagation
24-48 hrs: All caches updated
```

---

## ✅ Current Status

```
✅ All URLs updated to wikigames.org
✅ Meta tags configured
✅ Sitemap updated
✅ Robots.txt updated
✅ Structured data updated
✅ Code committed to git
⏳ Pending: DNS configuration
⏳ Pending: Domain verification on Vercel
```

---

## 🔗 Quick Links

**Vercel Dashboard:**
```
https://vercel.com/vatallus-projects/wikigames-analytics/settings/domains
```

**DNS Checker:**
```
https://dnschecker.org/#A/wikigames.org
```

**SSL Test:**
```
https://www.ssllabs.com/ssltest/analyze.html?d=wikigames.org
```

**Search Console:**
```
https://search.google.com/search-console
```

---

## 📞 Support

**Vercel Documentation:**
- Custom Domains: https://vercel.com/docs/concepts/projects/custom-domains
- DNS Configuration: https://vercel.com/docs/concepts/projects/custom-domains#dns-configuration

**Common DNS Providers:**
- Namecheap: https://www.namecheap.com/support/knowledgebase/article.aspx/9645/2208/how-do-i-link-my-domain-to-vercel/
- GoDaddy: https://www.godaddy.com/help/add-an-a-record-19238
- Cloudflare: https://developers.cloudflare.com/dns/manage-dns-records/how-to/create-dns-records/

---

## 🎉 Next Steps

1. **Configure DNS** at your domain registrar
2. **Wait for propagation** (check dnschecker.org)
3. **Verify in Vercel** dashboard
4. **Test the domain** (https://wikigames.org)
5. **Submit to Search Console**
6. **Monitor analytics**

**Your domain is ready to go live! 🚀**
