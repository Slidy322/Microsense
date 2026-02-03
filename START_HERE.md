# 🚀 START HERE - weather-map-pwa

## Quick Setup for Your GitHub Repository

Your repository name: **weather-map-pwa**

---

## ⚡ Step 1: Push to GitHub (2 minutes)

```bash
# Navigate to your project folder in terminal
cd /path/to/your/project

# Initialize git
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit - Davao Weather PWA"

# Connect to your GitHub repository
git remote add origin https://github.com/YOUR_USERNAME/weather-map-pwa.git

# Push to GitHub
git branch -M main
git push -u origin main
```

✅ **Done!** Your code is now on GitHub.

---

## ⚡ Step 2: Deploy to Vercel (2 minutes)

**Easiest and recommended option:**

1. Go to https://vercel.com
2. Click "Sign up" or "Login" with GitHub
3. Click "New Project"
4. Find and import your `weather-map-pwa` repository
5. Click "Deploy" (don't change any settings)
6. Wait ~1 minute for deployment
7. ✅ **Your app is live!** Copy the URL (e.g., `https://weather-map-pwa.vercel.app`)

---

## ⚡ Step 3: Secure Your Google Maps API (3 minutes)

1. Go to https://console.cloud.google.com/apis/credentials
2. Find your API key: `AIzaSyCCv3fMlFc7PxJXR4Y65zJTsxPbWxnpc8I`
3. Click the pencil icon (Edit)
4. Under "Application restrictions":
   - Select "HTTP referrers (web sites)"
   - Click "ADD AN ITEM"
   - Add these URLs (replace YOUR_URL with your actual Vercel URL):
     ```
     https://YOUR_URL.vercel.app/*
     http://localhost:5173/*
     ```
5. Under "API restrictions":
   - Select "Restrict key"
   - Check only: "Maps JavaScript API"
6. Click "Save"

✅ **Done!** Your API key is now secure.

---

## ⚡ Step 4: Verify Supabase (1 minute)

Your Supabase is already configured! Just verify RLS policies are set:

1. Go to https://supabase.com/dashboard
2. Select your project: `mylxpghozcxekasbniqm`
3. Click "Table Editor" → Select `reports` table
4. Click "RLS" or "Policies" tab
5. Make sure you have policies for:
   - ✅ Allow anonymous INSERT
   - ✅ Allow anonymous SELECT

If missing, run this SQL in the SQL Editor:

```sql
-- Enable RLS
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Allow anonymous insert
CREATE POLICY "Allow anonymous insert" ON reports
  FOR INSERT TO anon
  WITH CHECK (true);

-- Allow anonymous select
CREATE POLICY "Allow anonymous select" ON reports
  FOR SELECT TO anon
  USING (true);
```

---

## 🎉 You're Done!

### Test Your Deployed App:

1. Open your Vercel URL in a browser
2. Check that:
   - ✅ Map loads (centered on Davao City)
   - ✅ Your location is detected (or falls back to Davao)
   - ✅ You can submit a weather report
   - ✅ Reports appear on the map
   - ✅ History tab works
   - ✅ Settings tab works

### Install as PWA:

**On Mobile:**
- Android: Open in Chrome → Menu → "Install app"
- iOS: Open in Safari → Share → "Add to Home Screen"

**On Desktop:**
- Look for install icon in address bar

---

## 📊 Your Configuration Summary

### Repository
- **Name:** weather-map-pwa
- **GitHub:** https://github.com/YOUR_USERNAME/weather-map-pwa

### Deployment
- **Platform:** Vercel (recommended)
- **URL:** https://weather-map-pwa.vercel.app (or your custom URL)
- **Auto-deploy:** ✅ Enabled (pushes to `main` branch auto-deploy)

### Supabase
- **URL:** https://mylxpghozcxekasbniqm.supabase.co
- **Table:** reports
- **Status:** ✅ Already configured in code

### Google Maps
- **API Key:** AIzaSyCCv3fMlFc7PxJXR4Y65zJTsxPbWxnpc8I
- **Status:** ✅ Already configured in code
- **Restrictions:** ⚠️ Add after deployment (see Step 3)

---

## 🔄 Making Updates

After initial setup, to make changes:

```bash
# Make your code changes
# Then:
git add .
git commit -m "Description of changes"
git push
```

Vercel will automatically deploy your changes! 🎉

---

## 📱 Features Checklist

Your app has:
- ✅ Progressive Web App (PWA) - installable
- ✅ Offline support - works without internet
- ✅ Google Maps integration
- ✅ Automatic location detection
- ✅ Real-time Supabase backend
- ✅ Weather condition reporting
- ✅ Community weather map
- ✅ History of submissions
- ✅ Mobile responsive design

---

## 💡 What If Something Goes Wrong?

### Build fails on Vercel:
- Check the build logs in Vercel dashboard
- Make sure all dependencies are in package.json
- Try building locally: `npm run build`

### Map doesn't load:
- Check Google Maps API key restrictions
- Verify Maps JavaScript API is enabled in Google Cloud
- Check browser console for errors

### Can't submit weather reports:
- Verify Supabase RLS policies (see Step 4)
- Check browser console for errors
- Verify internet connection

### Need Help?
- See `/DEPLOYMENT.md` for detailed deployment guide
- See `/API_CREDENTIALS.md` for API configuration help
- See `/QUICKSTART.md` for development guide

---

## 🎯 Next Steps (Optional)

1. **Custom Domain**
   - Buy a domain (e.g., davaaoweather.com)
   - Add to Vercel in Project Settings → Domains
   - Update Google Maps API restrictions with new domain

2. **Add Analytics**
   - Enable Vercel Analytics (free)
   - Or add Google Analytics

3. **Enable Monitoring**
   - Set up Supabase alerts
   - Monitor Google Maps API usage

4. **Share Your App**
   - Share the Vercel URL with users
   - Encourage them to install as PWA
   - Gather feedback for improvements

---

## 📞 Quick Reference

| What | Where |
|------|-------|
| View code | https://github.com/YOUR_USERNAME/weather-map-pwa |
| Live app | Your Vercel URL |
| Deployment dashboard | https://vercel.com/dashboard |
| Database dashboard | https://supabase.com/dashboard |
| Google Cloud Console | https://console.cloud.google.com |

---

**That's it! Your Davao Weather PWA is live! 🌦️**

**Questions?** Check the documentation files in your repository.
