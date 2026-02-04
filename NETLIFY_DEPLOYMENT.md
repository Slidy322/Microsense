# Deploying MICROSENSE to Netlify

This guide covers deploying your MICROSENSE weather app to Netlify - a fast, simple, and free hosting platform perfect for React apps.

## Why Netlify?

- ✅ **Super Fast**: Global CDN with edge locations worldwide
- ✅ **Simple Setup**: Deploy in 3 clicks from GitHub
- ✅ **Free Tier**: Generous free plan (100GB bandwidth/month)
- ✅ **Great for Philippines**: Fast CDN performance in Asia-Pacific
- ✅ **Automatic Deploys**: Push to GitHub = automatic deployment
- ✅ **Easy Environment Variables**: Simple UI for managing secrets
- ✅ **Custom Domains**: Free HTTPS with custom domains

## Performance Comparison

| Platform | Setup Time | Asia-Pacific Speed | Free Tier | Ease of Use |
|----------|-----------|-------------------|-----------|-------------|
| **Netlify** | 5 min | ⚡⚡⚡ Fast | 100GB/mo | ⭐⭐⭐⭐⭐ |
| **Vercel** | 5 min | ⚡⚡ Moderate | 100GB/mo | ⭐⭐⭐⭐⭐ |
| **Google Cloud** | 30 min | ⚡⚡⚡ Fast | Limited | ⭐⭐⭐ |

---

## Method 1: Deploy from GitHub (RECOMMENDED - Easiest)

### Step 1: Push Code to GitHub

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/microsense.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Netlify

1. **Sign up for Netlify**
   - Go to https://app.netlify.com/signup
   - Sign up with GitHub (recommended)

2. **Create New Site**
   - Click "Add new site" → "Import an existing project"
   - Choose "Deploy with GitHub"
   - Authorize Netlify to access your GitHub
   - Select your `microsense` repository

3. **Configure Build Settings**
   
   Netlify should auto-detect these settings (already configured in `netlify.toml`):
   - **Build command**: `pnpm run build`
   - **Publish directory**: `dist`
   - **Node version**: 20
   
   Click "Deploy site"

4. **Set Environment Variables**
   
   Before your site works properly, add your API keys:
   
   - Go to "Site settings" → "Environment variables"
   - Click "Add a variable" and add these:
   
   ```
   VITE_SUPABASE_URL = your_supabase_url
   VITE_SUPABASE_ANON_KEY = your_supabase_anon_key
   VITE_GOOGLE_MAPS_API_KEY = your_google_maps_api_key
   ```
   
   - Click "Save"
   - Go to "Deploys" → "Trigger deploy" → "Deploy site"

5. **Done!** 🎉
   
   Your app will be live at: `https://YOUR_SITE_NAME.netlify.app`

---

## Method 2: Deploy using Netlify CLI

### Step 1: Install Netlify CLI

```bash
npm install -g netlify-cli
```

### Step 2: Login to Netlify

```bash
netlify login
```

This will open your browser to authenticate.

### Step 3: Initialize Netlify in Your Project

```bash
# Run this in your project directory
netlify init
```

Follow the prompts:
- **Create & configure a new site**: Yes
- **Team**: Select your team
- **Site name**: microsense (or your preferred name)
- **Build command**: `pnpm run build`
- **Directory to deploy**: `dist`

### Step 4: Set Environment Variables

```bash
# Set your Supabase URL
netlify env:set VITE_SUPABASE_URL "your_supabase_url"

# Set your Supabase Anon Key
netlify env:set VITE_SUPABASE_ANON_KEY "your_supabase_anon_key"

# Set your Google Maps API Key
netlify env:set VITE_GOOGLE_MAPS_API_KEY "your_google_maps_api_key"
```

### Step 5: Deploy

```bash
# Deploy to production
netlify deploy --prod
```

Your app will be live! 🚀

---

## Method 3: Drag & Drop Deploy (Quick Test)

### Step 1: Build Your App Locally

```bash
# Install dependencies (if not already done)
pnpm install

# Build the app
pnpm run build
```

This creates a `dist` folder with your production build.

### Step 2: Deploy

1. Go to https://app.netlify.com/drop
2. Drag the `dist` folder onto the page
3. Your site will be deployed instantly!

**Note**: This method doesn't support environment variables well. Use Method 1 or 2 for production.

---

## Update Supabase CORS Settings

Add your Netlify URL to Supabase allowed origins:

1. Go to **Supabase Dashboard** → **Settings** → **API**
2. Scroll to **"CORS"** or **"Allowed origins"**
3. Add your Netlify URLs:
   ```
   http://localhost:5173
   https://YOUR_SITE_NAME.netlify.app
   https://YOUR_CUSTOM_DOMAIN.com (if you have one)
   ```
4. Click **Save**

---

## Add Custom Domain (Optional)

### Using Your Own Domain

1. **In Netlify Dashboard**:
   - Go to "Domain settings"
   - Click "Add custom domain"
   - Enter your domain (e.g., `microsense.com`)
   
2. **Update DNS Settings**:
   
   Add these records in your domain registrar (GoDaddy, Namecheap, etc.):
   
   ```
   Type: A
   Name: @
   Value: 75.2.60.5
   
   Type: CNAME
   Name: www
   Value: YOUR_SITE_NAME.netlify.app
   ```
   
3. **Enable HTTPS**:
   - Netlify automatically provides free SSL certificate
   - Wait a few minutes for DNS propagation
   - HTTPS will be enabled automatically!

---

## Automatic Deployments

Once connected to GitHub, Netlify automatically deploys when you push code:

```bash
# Make changes to your code
git add .
git commit -m "Updated feature"
git push

# Netlify automatically builds and deploys! 🎉
```

### Deploy Previews

- Every pull request gets its own preview URL
- Test changes before merging to main
- Perfect for team collaboration

---

## Performance Optimization

### Enable Asset Optimization

In Netlify Dashboard:
1. Go to "Site settings" → "Build & deploy" → "Post processing"
2. Enable:
   - ✅ Bundle CSS
   - ✅ Minify CSS
   - ✅ Minify JS
   - ✅ Compress images

### Enable Edge Functions (Optional)

For even better performance, you can use Netlify Edge Functions to cache API responses.

---

## Monitoring & Analytics

### Built-in Analytics

Netlify provides:
- Bandwidth usage
- Page views
- Top pages
- Unique visitors

Access at: **Site settings** → **Analytics**

### Real-time Logs

View deployment logs:
1. Go to "Deploys"
2. Click on any deployment
3. View build logs in real-time

---

## Troubleshooting

### Build Fails

**Error**: `command not found: pnpm`

**Fix**: Add this to `netlify.toml`:
```toml
[build.environment]
  NPM_FLAGS = "--legacy-peer-deps"
```

Or use npm instead:
```toml
[build]
  command = "npm run build"
```

---

### Blank Page After Deployment

**Cause**: Environment variables not set

**Fix**: 
1. Check Site settings → Environment variables
2. Ensure all VITE_* variables are set
3. Redeploy: Deploys → Trigger deploy → Deploy site

---

### API Calls Fail

**Cause**: CORS issues with Supabase

**Fix**: Add your Netlify URL to Supabase allowed origins (see above)

---

### 404 on Refresh

**Cause**: SPA routing not configured

**Fix**: Already handled in `netlify.toml` redirect rules. If still having issues:
1. Check that `netlify.toml` is in your repository root
2. Redeploy

---

## Environment Variables Best Practices

### For Team Members

Share environment variables securely:

```bash
# Export variables from Netlify
netlify env:list

# Import variables to another site
netlify env:import .env.production
```

### Keep Variables Secure

- ✅ Never commit `.env` files to Git
- ✅ Use Netlify's environment variable UI
- ✅ Use different keys for development/production
- ❌ Don't share keys in Slack/Email

---

## Cost Estimate

### Free Tier Includes:
- 100 GB bandwidth/month
- 300 build minutes/month
- Unlimited sites
- Automatic HTTPS
- Deploy previews

### For MICROSENSE App:
- **Estimated monthly traffic**: ~10-20 GB
- **Build time**: ~2-3 minutes per deploy
- **Cost**: **$0/month** (well within free tier)

### If You Exceed Free Tier:
- Pro plan: $19/month
- Includes: 400 GB bandwidth, 1000 build minutes

---

## Comparing Deployment Options

| Feature | Netlify | Vercel | Google Cloud |
|---------|---------|--------|--------------|
| **Setup Time** | 5 min | 5 min | 30 min |
| **Free Tier** | 100GB | 100GB | Limited |
| **Auto Deploy** | ✅ | ✅ | With setup |
| **Custom Domain** | ✅ Free | ✅ Free | ✅ Paid |
| **Edge Network** | ✅ Global | ✅ Global | ✅ Regional |
| **Build Speed** | Fast | Fast | Very Fast |
| **PH Performance** | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Ease of Use** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |

**Recommendation**: 
- **Netlify**: Best balance of ease and performance
- **Google Cloud**: Best performance but harder setup
- **Vercel**: Similar to Netlify, slightly slower in Asia-Pacific

---

## Advanced: Branch Deploys

Deploy different branches to different URLs:

1. **In Netlify Dashboard**:
   - Site settings → Build & deploy → Continuous deployment
   - Branch deploys → Add branch
   - Enter branch name (e.g., `staging`)

2. **Access**:
   - Main: `https://microsense.netlify.app`
   - Staging: `https://staging--microsense.netlify.app`

---

## Quick Command Reference

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize new site
netlify init

# Deploy to production
netlify deploy --prod

# Deploy preview
netlify deploy

# Open site in browser
netlify open:site

# Open admin dashboard
netlify open:admin

# View environment variables
netlify env:list

# Set environment variable
netlify env:set KEY "value"

# View deploy logs
netlify logs:function

# Link existing site
netlify link
```

---

## Next Steps

1. ✅ Push code to GitHub
2. ✅ Connect to Netlify
3. ✅ Set environment variables
4. ✅ Update Supabase CORS
5. ✅ Test your deployed app
6. ⭐ Add custom domain (optional)
7. ⭐ Enable analytics (optional)

---

## Support Resources

- **Netlify Docs**: https://docs.netlify.com/
- **Community Forum**: https://answers.netlify.com/
- **Status Page**: https://www.netlifystatus.com/
- **Support**: support@netlify.com

---

## Summary

Deploying to Netlify is the **easiest and fastest** option for your MICROSENSE app:

✅ **5-minute setup** vs 30+ minutes on Google Cloud  
✅ **Free forever** for your traffic levels  
✅ **Great performance** in Philippines/Asia-Pacific  
✅ **Automatic deployments** from GitHub  
✅ **Simple environment variables** management  

**Recommended**: Use Method 1 (GitHub deployment) for the best developer experience!
