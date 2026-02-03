# ⚡ Quick Commands Reference

Copy and paste these commands for common tasks.

---

## 🚀 First Time GitHub Upload

```bash
# 1. Initialize Git
git init

# 2. Add all files
git add .

# 3. Create first commit
git commit -m "Initial commit - Davao Weather PWA"

# 4. Create a new repository on GitHub.com, then:
git remote add origin https://github.com/YOUR_USERNAME/weather-map-pwa.git

# 5. Push to GitHub
git branch -M main
git push -u origin main
```

---

## 💻 Development Commands

```bash
# Install dependencies
npm install
# or
pnpm install

# Start development server
npm run dev
# or
pnpm dev

# Build for production
npm run build
# or
pnpm build

# Preview production build
npm run preview
# or
pnpm preview
```

---

## 📝 Making Updates

```bash
# Check what changed
git status

# Add specific files
git add src/app/App.tsx
# or add all changes
git add .

# Commit with message
git commit -m "Add new feature"

# Push to GitHub (triggers auto-deploy if connected)
git push
```

---

## 🔄 Syncing with GitHub

```bash
# Pull latest changes
git pull

# Push your changes
git push

# Create a new branch
git checkout -b feature-name

# Switch back to main
git checkout main

# Merge branch
git merge feature-name
```

---

## 🧹 Cleanup Commands

```bash
# Remove node_modules and reinstall
rm -rf node_modules
npm install

# Clear build folder
rm -rf dist

# Clean rebuild
rm -rf dist node_modules
npm install
npm run build
```

---

## 🐛 Troubleshooting

```bash
# Check Node version (should be 18+)
node --version

# Check npm version
npm --version

# Clear npm cache
npm cache clean --force

# Check what will be committed
git status
git diff

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Discard local changes (CAREFUL!)
git checkout -- .
```

---

## 📦 Package Management

```bash
# Install new package
npm install package-name
# or
pnpm add package-name

# Remove package
npm uninstall package-name
# or
pnpm remove package-name

# Update all packages
npm update
# or
pnpm update

# Check for outdated packages
npm outdated
```

---

## 🌐 Vercel Deployment

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to Vercel
vercel

# Deploy to production
vercel --prod
```

---

## 🎯 Netlify Deployment

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy to Netlify
netlify deploy

# Deploy to production
netlify deploy --prod
```

---

## 📊 GitHub Pages Deployment

```bash
# Install gh-pages
npm install --save-dev gh-pages

# Deploy to GitHub Pages
npm run deploy
```

---

## 🔍 Testing Service Worker Locally

```bash
# Build production version
npm run build

# Preview (service worker only works in production build)
npm run preview

# Open in browser
# http://localhost:4173
```

---

## 📱 Testing PWA on Mobile

### Using ngrok (expose localhost to internet)

```bash
# Install ngrok
npm install -g ngrok

# Start dev server
npm run dev

# In another terminal, expose it
ngrok http 5173

# Use the https URL on your phone
```

---

## 🗃️ Supabase CLI Commands (Optional)

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to project
supabase link --project-ref mylxpghozcxekasbniqm

# Pull database schema
supabase db pull

# Run migrations
supabase db push
```

---

## 🔐 Environment Variables (if using .env)

```bash
# Create .env file
echo "VITE_SUPABASE_URL=your_url" > .env
echo "VITE_SUPABASE_ANON_KEY=your_key" >> .env
echo "VITE_GOOGLE_MAPS_KEY=your_key" >> .env

# .env is in .gitignore, so it won't be committed
```

---

## 📋 Useful Git Commands

```bash
# View commit history
git log --oneline

# View remote URL
git remote -v

# Change remote URL
git remote set-url origin https://github.com/NEW_URL.git

# Create .gitignore
cat > .gitignore << EOF
node_modules/
dist/
.env
.DS_Store
EOF

# View current branch
git branch

# List all branches
git branch -a

# Delete branch
git branch -d branch-name
```

---

## 🏷️ Git Tags (for versions)

```bash
# Create a tag
git tag -a v1.0.0 -m "Version 1.0.0"

# Push tags to GitHub
git push --tags

# List tags
git tag

# Checkout a tag
git checkout v1.0.0
```

---

## 🎨 Customization Quick Edits

### Change App Name
```bash
# Edit these files:
# /index.html - <title>Your New Name</title>
# /public/manifest.webmanifest - "name": "Your New Name"
# /README.md - Update title
```

### Change Theme Color
```bash
# Edit these files:
# /index.html - <meta name="theme-color" content="#YOUR_COLOR" />
# /public/manifest.webmanifest - "theme_color": "#YOUR_COLOR"
```

### Change Default Location
```bash
# Edit /src/app/components/GoogleMap.tsx
# Change DAVAO_CITY_CENTER coordinates
```

---

## 🔧 Common Fixes

### Port Already in Use
```bash
# Kill process on port 5173
# Mac/Linux:
lsof -ti:5173 | xargs kill -9

# Windows:
netstat -ano | findstr :5173
taskkill /PID [PID_NUMBER] /F
```

### Git Push Rejected
```bash
# Pull first, then push
git pull --rebase
git push
```

### Service Worker Not Updating
```bash
# Hard refresh browser
# Chrome: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
# Or clear all cache in DevTools
```

---

## 📚 Documentation Links

- Vite: https://vitejs.dev/guide/
- React: https://react.dev/
- Supabase: https://supabase.com/docs
- Google Maps: https://developers.google.com/maps/documentation
- PWA: https://web.dev/progressive-web-apps/

---

## 💡 Pro Tips

### Quick Local Test
```bash
npm install && npm run dev
```

### Quick Production Build
```bash
npm run build && npm run preview
```

### Quick Deploy (Vercel)
```bash
git add . && git commit -m "Update" && git push
```

### Check Build Size
```bash
npm run build
du -sh dist
```

### Find Large Dependencies
```bash
npm ls --depth=0 --long
```

---

**Bookmark this file for quick reference! 🔖**