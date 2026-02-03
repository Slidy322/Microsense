# 🌦️ Davao Weather Map

A Progressive Web App (PWA) for crowdsourced weather reporting in Davao City, Philippines. Built with React, Supabase, and Google Maps API.

![PWA Badge](https://img.shields.io/badge/PWA-enabled-blue)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![Vite](https://img.shields.io/badge/Vite-6.3.5-purple)
![Supabase](https://img.shields.io/badge/Supabase-Backend-green)

## ✨ Features

- 🗺️ **Interactive Map** - Google Maps integration centered on Davao City
- 📍 **Auto Location Detection** - Automatically detects user's location using Geolocation API
- 🌤️ **Weather Reporting** - Submit real-time weather conditions with notes
- 📊 **Community Reports** - View weather reports from other users on the map
- 📱 **Progressive Web App** - Install on mobile devices like a native app
- 🔄 **Real-time Updates** - Powered by Supabase for instant data sync
- 📴 **Offline Support** - Service worker caching for offline functionality
- 📜 **History Tab** - View your past weather submissions
- ⚙️ **Settings** - User preferences and logout functionality

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm, pnpm, or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/weather-map-pwa.git
cd weather-map-pwa

# Install dependencies
pnpm install
# or
npm install

# Start development server
pnpm dev
# or
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

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

## 📱 PWA Installation

Once deployed, users can install the app:

**Mobile (Android):**
1. Open the app in Chrome
2. Tap "Add to Home Screen" or "Install"

**Mobile (iOS):**
1. Open the app in Safari
2. Tap Share → "Add to Home Screen"

**Desktop:**
1. Look for install icon in browser address bar
2. Click to install

## 🛠️ Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS v4
- **Backend:** Supabase (PostgreSQL)
- **Maps:** Google Maps JavaScript API
- **PWA:** Service Workers + Web App Manifest
- **Icons:** Lucide React

## 📂 Project Structure

```
davao-weather-map/
├── public/
│   ├── manifest.webmanifest    # PWA manifest
│   ├── sw.js                    # Service worker
│   ├── icon-192.svg             # App icon (small)
│   ├── icon-512.svg             # App icon (large)
│   └── offline.html             # Offline fallback
├── src/
│   ├── app/
│   │   ├── App.tsx              # Main app component
│   │   └── components/          # React components
│   │       ├── GoogleMap.tsx    # Map integration
│   │       ├── WeatherSubmissionForm.tsx
│   │       ├── UserHistory.tsx
│   │       └── Settings.tsx
│   ├── lib/
│   │   └── supabase.ts          # Supabase client
│   ├── styles/
│   │   └── index.css            # Global styles
│   └── main.tsx                 # App entry point
├── index.html                   # HTML entry point
├── vite.config.ts               # Vite configuration
└── package.json
```

## 🔑 Configuration

### Supabase Setup

The app is already configured to connect to Supabase. Make sure your Supabase project has:

**Table: `reports`**
```sql
CREATE TABLE reports (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  condition TEXT NOT NULL,
  note TEXT
);
```

**Row Level Security (RLS) Policies:**
```sql
-- Enable RLS
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Allow anonymous users to insert
CREATE POLICY "Allow anonymous insert" ON reports
  FOR INSERT TO anon
  WITH CHECK (true);

-- Allow anonymous users to select
CREATE POLICY "Allow anonymous select" ON reports
  FOR SELECT TO anon
  USING (true);
```

### Google Maps API

The app uses Google Maps JavaScript API. The API key is configured in `/src/app/components/GoogleMap.tsx`.

**To restrict your API key:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to APIs & Services → Credentials
3. Edit your API key
4. Add HTTP referrers (your deployed domains)
5. Restrict to "Maps JavaScript API" only

## 🌍 Weather Conditions

Users can report the following conditions:
- ☀️ Sunny
- ☁️ Cloudy
- 🌧️ Rainy
- 🌬️ Windy
- ⛈️ Storm
- 🌊 Flooding

## 📱 Browser Support

- ✅ Chrome/Edge (full support)
- ✅ Firefox (full support)
- ✅ Safari/iOS (partial - limited service worker features)
- ✅ Samsung Internet (full support)

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

**Quick Deploy:**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Supabase](https://supabase.com/) - Backend and database
- [Google Maps](https://developers.google.com/maps) - Map integration
- [Lucide](https://lucide.dev/) - Icon library
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Vite](https://vitejs.dev/) - Build tool

## 📞 Support

If you have any questions or run into issues, please open an issue on GitHub.

## 🔐 Security

- Supabase uses Row Level Security (RLS) for data protection
- API keys are public anonymous keys (safe for client-side)
- Google Maps API key should be restricted to your domain
- No sensitive user data is collected

---

**Built with ❤️ for Davao City**