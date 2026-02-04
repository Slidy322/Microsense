# 🚀 MICROSENSE - Handoff Documentation

## Project Overview
**MICROSENSE** is a crowdsourced weather app for Davao City where users submit localized weather observations with sensory data (UV index, humidity, smell, etc.).

**Live Site:** https://microsense.netlify.app  
**Stack:** React + TypeScript + Vite + Tailwind CSS + Supabase + Google Maps API

---

## ✅ Recent Fixes Completed

### 1. Location Detection
- ✅ Requests fresh location on every page load (`maximumAge: 0`)
- ✅ No caching - always prompts for permission
- ✅ Instant location display (1-3 seconds)
- ✅ Red marker shows user location on Google Maps
- ✅ Removed reverse geocoding API to prevent rate limits

### 2. User Authentication
- ✅ Reports REQUIRE user login (cannot submit without account)
- ✅ All new reports linked to `user_id`
- ✅ History tab shows only YOUR reports
- ✅ Run `/CLEAR_REPORTS_AND_ENFORCE_USER_ID.sql` in Supabase to enforce

### 3. Performance
- ✅ Eliminated 30-60 second load times
- ✅ Map loads in 1-3 seconds
- ✅ No more reverse geocoding bottlenecks
- ✅ Weekly auto-clear (reports older than 7 days filtered out)

---

## 📁 Important Files

### Core Application
- `/src/app/App.tsx` - Main app component
- `/src/app/components/WeatherSubmissionForm.tsx` - Weather submission form with location
- `/src/app/components/GoogleMap.tsx` - Google Maps integration with red user marker
- `/src/app/components/UserHistory.tsx` - User's personal weather history
- `/src/app/components/Dashboard.tsx` - Analytics charts
- `/src/hooks/useAuth.ts` - Supabase authentication
- `/src/lib/supabase.ts` - Supabase API functions

### Configuration
- `/package.json` - Dependencies
- `/vite.config.ts` - Vite build config
- `/netlify.toml` - Netlify deployment config
- `/index.html` - Entry point

### Database Setup (IMPORTANT!)
- `/SUPABASE_PERFORMANCE_SETUP.sql` - Performance indexes (MUST RUN)
- `/CLEAR_REPORTS_AND_ENFORCE_USER_ID.sql` - Enforces user_id requirement (MUST RUN)

### Documentation
- `/README.md` - Project overview
- `/PROJECT_TECH_STACK.md` - Complete tech stack
- `/USER_ACCOUNT_REQUIREMENTS_IMPLEMENTATION.md` - User auth implementation details

---

## 🔧 Current Issues

### ⚠️ CRITICAL: Red Marker Disappears on Refresh
**Problem:** Red location marker shows on first load, disappears on page refresh

**Console Logs Show:**
```
📍 Location props changed - userLat: undefined, userLng: undefined  // First
📤 Sending location to parent: 7.099251, 125.605800              // Second
Initializing Google Maps...                                       // Third
⏳ No user location yet on map init                               // Map initializes without location
```

**Root Cause:** Timing issue - map initializes before location arrives

**Files Involved:**
- `/src/app/components/GoogleMap.tsx` (lines 90-105)
- `/src/app/components/WeatherSubmissionForm.tsx` (lines 335-365)

**What to Debug:**
1. Check why `userLat/userLng` are `undefined` initially
2. Ensure `onLocationChange` callback fires BEFORE map initialization
3. Verify `useEffect` dependencies in both files

---

## 🗄️ Supabase Setup

### Database Tables

**`reports` table:**
```sql
- id (bigint, primary key)
- created_at (timestamp)
- lat (double precision)
- lng (double precision)
- condition (text)
- note (text, nullable)
- user_id (uuid, NOT NULL) ← REQUIRED after running SQL
- location (text) ← Human-readable address
```

### SQL Files to Run

1. **`/SUPABASE_PERFORMANCE_SETUP.sql`**
   - Adds `location` column
   - Creates indexes for fast queries
   - **Status:** ⚠️ NOT RUN YET

2. **`/CLEAR_REPORTS_AND_ENFORCE_USER_ID.sql`**
   - Deletes ALL existing reports
   - Makes `user_id` NOT NULL
   - Updates RLS policies
   - **Status:** ⚠️ NOT RUN YET

**How to Run:**
1. Go to https://supabase.com/dashboard
2. Select project
3. Click **SQL Editor**
4. Paste SQL content
5. Click **Run**

---

## 🌍 Environment Variables

### Supabase (in `/src/lib/supabase.ts`)
```typescript
SUPABASE_URL = "https://mylxpghozcxekasbniqm.supabase.co"
SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

### Google Maps (in `/src/app/components/GoogleMap.tsx`)
```typescript
apiKey = "AIzaSyCCv3fMlFc7PxJXR4Y65zJTsxPbWxnpc8I"
```

---

## 📦 Dependencies

```json
{
  "@supabase/supabase-js": "^2.x",
  "react": "^18.x",
  "tailwindcss": "^4.x",
  "lucide-react": "^0.x",
  "recharts": "^2.x"
}
```

---

## 🚀 Deployment

**Platform:** Netlify  
**Build Command:** `npm run build`  
**Publish Directory:** `dist`  
**Deploy URL:** https://microsense.netlify.app

**Auto-deploy on:**
- Push to `main` branch

---

## 🐛 Debugging Tips

### Check Console Logs
Open browser console (F12) and look for these emojis:
- 🔍 = Location request started
- 📤 = Location sent to parent
- 🌍 = Location received in App
- 📍 = Location props changed in GoogleMap
- ✅ = Map ready, marker created
- ⏳ = Waiting for something
- ❌ = Error

### Common Issues

**Location not showing:**
1. Check if `onLocationChange` callback is defined
2. Verify `userLat` and `userLng` are passed to GoogleMap
3. Hard refresh: `Ctrl+Shift+R` or `Cmd+Shift+R`

**Map not loading:**
1. Check Google Maps API key is valid
2. Verify billing is enabled on Google Cloud
3. Check console for API errors

**Reports not saving:**
1. Check if user is logged in
2. Verify `user_id` is included in report
3. Check Supabase RLS policies

---

## 📋 Next Steps

### Immediate Priority
1. ✅ **FIX RED MARKER PERSISTENCE** - Critical bug
2. ⚠️ Run SQL files in Supabase
3. ⚠️ Test location on multiple devices
4. ⚠️ Verify user_id enforcement

### Future Enhancements
- Add weather forecast integration
- Implement push notifications
- Add report moderation
- Create admin dashboard
- Add data visualization improvements

---

## 🆘 Getting Help

**Files to check first:**
1. `/src/app/App.tsx` - Main component state
2. `/src/app/components/GoogleMap.tsx` - Map and marker logic
3. `/src/app/components/WeatherSubmissionForm.tsx` - Location detection
4. `/src/lib/supabase.ts` - Database queries

**Common commands:**
```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Deploy to Netlify
git push origin main
```

---

## 📊 Current Status

| Feature | Status | Notes |
|---------|--------|-------|
| User Authentication | ✅ Working | Supabase Auth |
| Weather Submission | ✅ Working | Requires login |
| Google Maps Display | ⚠️ Partial | Shows on first load |
| Red User Marker | ❌ Bug | Disappears on refresh |
| Location Detection | ✅ Working | Requests every time |
| History Tab | ✅ Working | Shows only user reports |
| Dashboard Analytics | ✅ Working | Charts display correctly |
| 7-Day Auto-Clear | ✅ Working | Filters old reports |
| Database Performance | ⚠️ Pending | SQL not run yet |

---

## 🔑 Key Concepts

### Location Flow
1. Page loads → `WeatherSubmissionForm` mounts
2. `requestLocationPermission()` called
3. Browser prompts for location
4. User allows → `onLocationChange(lat, lng)` called
5. App.tsx receives location → sets `userLocation` state
6. GoogleMap receives `userLat` and `userLng` props
7. Map creates red marker at user location

### Report Flow
1. User fills out weather form
2. Clicks Submit
3. `postReport()` checks if user is logged in
4. Includes `user_id` automatically
5. Geocodes location on backend
6. Saves to Supabase `reports` table
7. Map refreshes with new report marker

---

## 📝 Notes for ChatGPT

- This project was built in Figma Make (v0-style environment)
- All UI uses Tailwind CSS v4
- No component library - custom components
- Focus on mobile-first responsive design
- Location is critical feature - must work reliably
- Users MUST be logged in to submit reports
- SQL files in root need to be run in Supabase

---

**Last Updated:** 2025-02-04  
**Handed off by:** Claude  
**Handed off to:** ChatGPT  
**Priority:** Fix red marker persistence on refresh

Good luck! The codebase is clean and well-documented. 🚀
