# Deployment Guide - Davao Weather Map

## 📦 GitHub Repository Setup

### 1. Initialize Git Repository

```bash
git init
git add .
git commit -m "Initial commit - Davao Weather PWA"
```

### 2. Create GitHub Repository

1. Go to [GitHub.com](https://github.com/new)
2. Create a new repository (e.g., `davao-weather-map`)
3. Don't initialize with README (you already have files)

### 3. Push to GitHub

```bash
git remote add origin https://github.com/YOUR_USERNAME/weather-map-pwa.git
git branch -M main
git push -u origin main
```

---

## 🚀 Deployment Options

### Option 1: Vercel (Recommended - Easiest)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

**Steps:**
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Import your `weather-map-pwa` repository
5. Configure:
   - **Framework Preset:** Vite
   - **Build Command:** `pnpm build` or `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `pnpm install` or `npm install`
6. Click "Deploy"

**Result:** Your app will be live at `https://your-project.vercel.app`

**Benefits:**
- ✅ Automatic HTTPS
- ✅ Automatic deployments on git push
- ✅ Free tier available
- ✅ Fast global CDN
- ✅ PWA fully supported

---

### Option 2: Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

**Steps:**
1. Go to [netlify.com](https://netlify.com)
2. Sign in with GitHub
3. Click "New site from Git"
4. Choose your GitHub repository
5. Configure:
   - **Build command:** `npm run build` or `pnpm build`
   - **Publish directory:** `dist`
6. Click "Deploy site"

**Add netlify.toml** (optional but recommended):

```toml
[build]
  command = "pnpm build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

### Option 3: GitHub Pages

**Steps:**

1. **Install gh-pages package:**
```bash
npm install --save-dev gh-pages
```

2. **Update package.json:**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "deploy": "gh-pages -d dist"
  },
  "homepage": "https://YOUR_USERNAME.github.io/weather-map-pwa"
}
```

3. **Update vite.config.ts:**
```typescript
import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/weather-map-pwa/', // Add your repo name
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
```

4. **Deploy:**
```bash
npm run build
npm run deploy
```

5. **Enable GitHub Pages:**
   - Go to repository Settings → Pages
   - Source: Deploy from branch
   - Branch: `gh-pages` → `/ (root)`
   - Save

**Result:** App live at `https://YOUR_USERNAME.github.io/weather-map-pwa`

---

### Option 4: Render

**Steps:**
1. Go to [render.com](https://render.com)
2. Sign in with GitHub
3. Click "New +" → "Static Site"
4. Connect your repository
5. Configure:
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`
6. Click "Create Static Site"

---

### Option 5: Cloudflare Pages

**Steps:**
1. Go to [pages.cloudflare.com](https://pages.cloudflare.com)
2. Sign in and click "Create a project"
3. Connect GitHub and select your repository
4. Configure:
   - **Framework preset:** Vite
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
5. Click "Save and Deploy"

---

## 🔑 API Keys & Security

### Current Setup (Already Configured)

Your app uses **public/anonymous keys** which are safe to commit:

✅ **Supabase Anon Key** - Safe for public repos  
✅ **Google Maps API Key** - Has restrictions set  

### Important Notes:

1. **Supabase Anon Key:**
   - This key is meant to be public
   - Security is handled by Row Level Security (RLS) in Supabase
   - Make sure RLS policies are properly configured

2. **Google Maps API Key:**
   - Should have domain restrictions in Google Cloud Console
   - Restrict to your deployed domain(s)
   - Enable only required APIs (Maps JavaScript API)

### Securing Google Maps API Key:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to APIs & Services → Credentials
3. Find your API key
4. Click "Edit"
5. Under "Application restrictions":
   - Choose "HTTP referrers"
   - Add your domains:
     ```
     https://your-domain.vercel.app/*
     https://your-domain.netlify.app/*
     http://localhost:5173/*
     ```
6. Under "API restrictions":
   - Select "Restrict key"
   - Enable only: "Maps JavaScript API"
7. Save

---

## 🧪 Testing Your Deployment

### 1. Check PWA Installation
- Open deployed URL in Chrome
- Look for install icon in address bar
- Try "Add to Home Screen" on mobile

### 2. Test Offline Mode
- Open Chrome DevTools → Network tab
- Select "Offline"
- Refresh page → Should still work

### 3. Test Service Worker
- DevTools → Application tab
- Check "Service Workers" section
- Should show registered and activated

### 4. Test Functionality
- ✅ Location detection works
- ✅ Map loads correctly
- ✅ Can submit weather reports
- ✅ Reports appear on map
- ✅ History tab shows submissions
- ✅ Responsive on mobile

---

## 🔄 Continuous Deployment

Once set up with Vercel, Netlify, or Cloudflare Pages:

1. Make changes locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update feature"
   git push
   ```
3. Deployment happens automatically!

---

## 📱 PWA Installation

After deployment, users can:

**On Mobile:**
- Android Chrome: "Add to Home Screen"
- iOS Safari: Share → "Add to Home Screen"

**On Desktop:**
- Chrome: Install icon in address bar
- Edge: Install button in address bar

---

## 🐛 Troubleshooting Deployment

### Build Fails
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

### Service Worker Not Working
- Ensure HTTPS is enabled (required for SW)
- Check service worker file is in build output
- Clear browser cache

### Maps Not Loading
- Check API key restrictions
- Verify Maps JavaScript API is enabled
- Check browser console for errors

### Supabase Connection Issues
- Verify RLS policies allow anonymous access
- Check table exists with correct schema
- Verify anon key is correct

---

## 📊 Monitoring

### Vercel Analytics (Free)
Enable in Vercel dashboard for:
- Page views
- User analytics
- Performance metrics

### Supabase Dashboard
Monitor:
- Database queries
- Storage usage
- API requests

### Google Maps Usage
Check in Google Cloud Console:
- API requests per day
- Usage costs
- Error rates

---

## 🎯 Post-Deployment Checklist

- [ ] App is live and accessible
- [ ] HTTPS is working
- [ ] PWA can be installed
- [ ] Service worker is active
- [ ] Map loads correctly
- [ ] Location detection works
- [ ] Weather submissions save to database
- [ ] Reports appear on map
- [ ] Mobile responsive
- [ ] Tested on different browsers
- [ ] Google Maps API key restricted
- [ ] Supabase RLS policies configured

---

## 💡 Next Steps

1. **Custom Domain** (Optional)
   - Purchase domain from domain registrar
   - Add to your hosting platform
   - Update Google Maps API restrictions

2. **Analytics** (Optional)
   - Add Google Analytics
   - Or use hosting platform analytics

3. **Monitoring** (Optional)
   - Set up Sentry for error tracking
   - Configure uptime monitoring

4. **Enhancements**
   - Add user authentication
   - Create admin dashboard
   - Add push notifications
   - Implement weather analytics

---

## 📞 Support Resources

- **Vite:** https://vitejs.dev/
- **Vercel:** https://vercel.com/docs
- **Netlify:** https://docs.netlify.com/
- **Supabase:** https://supabase.com/docs
- **Google Maps:** https://developers.google.com/maps