# MICROSENSE - Project Technology Stack

## Project Overview
**MICROSENSE** is a crowdsourced weather monitoring Progressive Web App (PWA) for Davao City that allows community members to submit real-time weather observations with enhanced sensory data.

---

## 🎯 Core Technologies

### Frontend Framework
- **React** v18.3.1 - JavaScript library for building user interfaces
- **TypeScript** - Type-safe JavaScript for better code quality
- **Vite** v6.3.5 - Next-generation frontend build tool (faster than Webpack)

### Styling & UI
- **Tailwind CSS** v4.1.12 - Utility-first CSS framework
- **Radix UI** - Unstyled, accessible UI component primitives
  - Accordion, Dialog, Dropdown, Tabs, Slider, and 20+ other components
- **Lucide React** v0.487.0 - Beautiful & consistent icon library
- **Motion (Framer Motion)** v12.23.24 - Animation library
- **class-variance-authority** - For component variants
- **tailwind-merge** - Merge Tailwind classes without conflicts

### UI Component Libraries
- **Material-UI (MUI)** v7.3.5 - React component library
  - @mui/material
  - @mui/icons-material
  - @emotion/react (peer dependency)
  - @emotion/styled (peer dependency)

---

## 🗄️ Backend & Database

### Backend as a Service (BaaS)
- **Supabase** v2.93.3
  - PostgreSQL Database (real-time)
  - Authentication (Email/Password)
  - Row Level Security (RLS)
  - Real-time subscriptions
  - RESTful API

### Database Schema
- **reports** table - Stores weather submissions
  - User location (lat/lng)
  - Weather conditions
  - Enhanced sensory data (intensity, visibility, humidity, wind speed, temperature, smell)
  - Timestamps
  - User associations

---

## 🌍 Third-Party APIs & Services

### Maps & Location
- **Google Maps JavaScript API**
  - Interactive map display
  - Custom markers for user location and weather reports
  - InfoWindows for report details
  - Geolocation API integration
- **OpenStreetMap Nominatim API**
  - Reverse geocoding (coordinates to addresses)
  - Free, no API key required

### Image Service
- **Unsplash API** - Stock photos for UI backgrounds

---

## 📊 Data Visualization

### Charts & Graphs
- **Recharts** v2.15.2 - React charting library
  - Bar charts (7-day weather distribution)
  - Line charts (activity trends)
  - Pie charts (overall weather distribution)
  - Responsive charts with tooltips

---

## 🚀 Hosting & Deployment

### Hosting Platform
- **Vercel** - Cloud platform for static sites and serverless functions
  - Automatic deployments from Git
  - Preview deployments for PRs
  - Edge network for global CDN
  - Zero-config setup
  - Custom domains support
  - Environment variables management

### Database Hosting
- **Supabase Cloud** - Hosted PostgreSQL with global CDN

---

## 📱 Progressive Web App (PWA)

### PWA Features
- **Service Worker** (`/public/sw.js`)
  - Offline functionality
  - Cache-first strategy
  - Background sync
- **Web App Manifest** (`/public/manifest.webmanifest`)
  - Installable on mobile/desktop
  - Custom app icons
  - Splash screens
- **Responsive Design**
  - Mobile-first approach
  - Tablet and desktop support

---

## 🛠️ Additional Libraries

### Form Management
- **React Hook Form** v7.55.0 - Performant form validation

### UI Components
- **Sonner** v2.0.3 - Toast notifications
- **Vaul** v1.1.2 - Drawer component
- **cmdk** v1.1.1 - Command menu component
- **React Day Picker** v8.10.1 - Date picker
- **date-fns** v3.6.0 - Date utility library

### Interaction Libraries
- **React DnD** v16.0.1 - Drag and drop functionality
- **React Slick** v0.31.0 - Carousel component
- **React Responsive Masonry** v2.7.1 - Masonry grid layouts
- **Popper.js** v2.11.8 - Tooltip & popover positioning

### Utility Libraries
- **clsx** v2.1.1 - Conditional className utility
- **next-themes** v0.4.6 - Theme management

---

## 🔧 Development Tools

### Build Tools
- **Vite** v6.3.5 - Build tool and dev server
- **@vitejs/plugin-react** v4.7.0 - React plugin for Vite
- **@tailwindcss/vite** v4.1.12 - Tailwind CSS integration

### Package Manager
- **pnpm** - Fast, disk space efficient package manager

---

## 🗂️ Project Structure

```
microsense/
├── public/              # Static assets
│   ├── icon-192.svg    # PWA icons
│   ├── icon-512.svg
│   ├── manifest.webmanifest
│   ├── offline.html    # Offline fallback page
│   └── sw.js           # Service worker
├── src/
│   ├── app/
│   │   ├── components/ # React components
│   │   │   ├── Dashboard.tsx
│   │   │   ├── GoogleMap.tsx
│   │   │   ├── WeatherSubmissionForm.tsx
│   │   │   ├── UserHistory.tsx
│   │   │   ├── Settings.tsx
│   │   │   └── ui/     # Reusable UI components
│   │   └── App.tsx     # Main app component
│   ├── hooks/
│   │   └── useAuth.ts  # Authentication hook
│   ├── lib/
│   │   └── supabase.ts # Supabase client
│   ├── styles/
│   │   ├── index.css
│   │   ├── tailwind.css
│   │   ├── theme.css
│   │   └── fonts.css
│   └── main.tsx        # App entry point
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## 🔐 Authentication & Security

- **Supabase Auth** - Email/password authentication
- **Row Level Security (RLS)** - Database-level security policies
- **Environment Variables** - API keys stored securely in Vercel
- **HTTPS** - All connections encrypted via Vercel

---

## 🌐 API Keys & Credentials

### Required API Keys
1. **Google Maps JavaScript API**
   - Used for: Interactive maps, markers, geocoding
   - Restrictions: HTTP referrers (domain whitelist)

2. **Supabase API Keys**
   - Public Anon Key (client-side)
   - Service Role Key (server-side, if needed)

3. **Unsplash API** (Optional)
   - Used for: Background images

---

## 📊 Features

### Core Functionality
- ✅ Real-time weather report submission
- ✅ Interactive Google Maps with markers
- ✅ Automatic geolocation detection
- ✅ Enhanced sensory data collection (contextual to weather type)
- ✅ User authentication (Supabase Auth)
- ✅ Analytics dashboard with charts
- ✅ User history and past reports
- ✅ PWA (installable, works offline)

### Weather Conditions Supported
- ☀️ Sunny (UV index, temperature, humidity, visibility)
- ☁️ Cloudy (cloud coverage, humidity, temperature, visibility)
- 🌧️ Rainy (rainfall intensity, visibility, humidity, wind)
- 🌬️ Windy (wind speed, gust intensity, visibility, wind chill)
- ⛈️ Storm (storm intensity, wind speed, visibility, rainfall)
- 🌊 Flooding (water level, flow speed, visibility, affected area)

### Analytics Features
- 7-day weather report trends
- Community activity trends
- Weather distribution (pie chart)
- Real-time statistics
- Severe weather alerts

---

## 🎨 Design System

- **Color Scheme**: Blue gradient with glass morphism effects
- **Typography**: System fonts for optimal performance
- **Icons**: Lucide React + weather emoji icons
- **Animations**: Subtle transitions and hover effects
- **Accessibility**: ARIA labels, keyboard navigation, semantic HTML

---

## 📈 Performance Optimizations

- **Code Splitting** - Dynamic imports for better loading
- **Lazy Loading** - Components loaded on demand
- **Image Optimization** - Unsplash CDN
- **CDN Delivery** - Vercel Edge Network
- **Caching** - Service worker cache strategies
- **Tree Shaking** - Vite removes unused code

---

## 🔄 Real-time Features

- **Live Updates** - Reports refresh every 30 seconds
- **Real-time Map** - New reports appear instantly
- **Live Dashboard** - Statistics update automatically

---

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## 🌍 Deployment Information

### Production URL
- Hosted on Vercel
- Custom domain support available

### Environment Variables (Vercel)
```
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Build Command
```bash
npm run build
# or
pnpm build
```

### Dev Command
```bash
npm run dev
# or
pnpm dev
```

---

## 📝 License

This project is proprietary software developed for weather monitoring in Davao City.

---

## 📞 Summary for Client

**Frontend:** React + TypeScript + Tailwind CSS  
**Backend:** Supabase (PostgreSQL + Authentication)  
**Hosting:** Vercel (Cloud Platform)  
**Maps:** Google Maps JavaScript API  
**Charts:** Recharts  
**Type:** Progressive Web App (PWA)  
**Package Manager:** pnpm  
**Build Tool:** Vite  

All services are cloud-based, serverless, and automatically scale based on usage. No physical servers to maintain.
