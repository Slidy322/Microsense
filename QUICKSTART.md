# Davao Weather Map - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- pnpm, npm, or yarn package manager

### Installation & Running

```bash
# Install dependencies
pnpm install
# or
npm install

# Start development server
pnpm dev
# or
npm run dev
```

The app will be available at: `http://localhost:5173`

### Build for Production

```bash
# Create production build
pnpm build
# or
npm run build

# Preview production build
pnpm preview
# or
npm run preview
```

## 📱 PWA Features

Your app is now a Progressive Web App with:

✅ **Offline Support** - Works without internet connection  
✅ **Install to Home Screen** - Add to mobile home screen like a native app  
✅ **Fast Loading** - Caches files for instant loading  
✅ **Responsive Design** - Works on desktop, tablet, and mobile  

## 🗺️ Google Maps API

The app uses Google Maps API with the key already configured:
- Key is located in `/src/app/components/GoogleMap.tsx`
- If you need to replace it, update the `apiKey` prop

## 💾 Database (Supabase)

The app connects to your Supabase instance:
- URL: `https://mylxpghozcxekasbniqm.supabase.co`
- Credentials are in `/src/lib/supabase.ts`
- Table: `reports` with columns: `id`, `created_at`, `lat`, `lng`, `condition`, `note`

### Supabase Table Setup

Make sure your `reports` table has:
- Row Level Security (RLS) enabled
- Policy allowing `INSERT` for anonymous users
- Policy allowing `SELECT` for anonymous users

## 📂 Project Structure

```
/
├── index.html              # Main HTML entry point
├── src/
│   ├── main.tsx            # React entry point
│   ├── app/
│   │   ├── App.tsx         # Main app component
│   │   └── components/     # React components
│   ├── lib/
│   │   └── supabase.ts     # Supabase API client
│   └── styles/             # CSS files
├── public/
│   ├── manifest.webmanifest  # PWA manifest
│   ├── sw.js                 # Service worker
│   ├── icon-192.svg          # App icon (small)
│   ├── icon-512.svg          # App icon (large)
│   └── offline.html          # Offline fallback page
└── package.json
```

## 🔧 Configuration

### Update App Name & Colors

**Manifest** (`/public/manifest.webmanifest`):
```json
{
  "name": "Your App Name",
  "short_name": "Short Name",
  "theme_color": "#YOUR_COLOR",
  "background_color": "#YOUR_COLOR"
}
```

**HTML** (`/index.html`):
```html
<meta name="theme-color" content="#YOUR_COLOR" />
<title>Your App Name</title>
```

### Update Icons

Replace these files with your own:
- `/public/icon-192.svg` - 192x192 icon
- `/public/icon-512.svg` - 512x512 icon

Or use PNG format and update the manifest accordingly.

## 📱 Testing on Mobile

### Android (Chrome)
1. Open the app on your phone
2. Tap the menu (⋮)
3. Select "Install app" or "Add to Home Screen"

### iOS (Safari)
1. Open the app in Safari
2. Tap the Share button
3. Select "Add to Home Screen"

## 🐛 Troubleshooting

### Location not working
- Ensure HTTPS (or localhost for testing)
- Check browser permissions for location access
- On mobile, enable location services

### Service Worker not registering
- Check browser console for errors
- Service workers require HTTPS (except on localhost)
- Clear cache and reload

### Maps not loading
- Verify Google Maps API key is valid
- Check if API key has proper restrictions
- Ensure Maps JavaScript API is enabled in Google Cloud Console

## 📝 Environment Notes

- Development: Runs on `http://localhost:5173`
- Service Worker works on localhost without HTTPS
- Production deployment requires HTTPS for full PWA features

## 🎯 Next Steps

1. Customize the app icons and colors
2. Set up proper Supabase policies for your use case
3. Consider adding authentication if needed
4. Deploy to a hosting service (Vercel, Netlify, etc.)
5. Test PWA installation on mobile devices

## 📚 Additional Resources

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript)
- [PWA Documentation](https://web.dev/progressive-web-apps/)
