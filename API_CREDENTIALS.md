# API Credentials & Configuration

## 🔑 Current API Keys (Already Configured)

### Supabase Configuration

**Location:** `/src/lib/supabase.ts`

```
Supabase URL: https://mylxpghozcxekasbniqm.supabase.co
Supabase Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15bHhwZ2hvemN4ZWthc2JuaXFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk3MDAyNzksImV4cCI6MjA4NTI3NjI3OX0.-cdzpuUZ9z5KrTgCvy2v9aja9a9QaQ0BHKTfWAx5SJs
```

**Database Table:** `reports`

**Table Schema:**
```sql
id: BIGSERIAL PRIMARY KEY
created_at: TIMESTAMPTZ DEFAULT NOW()
lat: DOUBLE PRECISION NOT NULL
lng: DOUBLE PRECISION NOT NULL
condition: TEXT NOT NULL
note: TEXT
```

### Google Maps Configuration

**Location:** `/src/app/components/GoogleMap.tsx`

```
API Key: AIzaSyCCv3fMlFc7PxJXR4Y65zJTsxPbWxnpc8I
```

**Required Google Cloud APIs:**
- Maps JavaScript API

---

## 🔒 Security Notes

### Supabase Anon Key
✅ **Safe to commit to public repos**
- This is an anonymous/public key meant for client-side use
- Actual security is enforced through Row Level Security (RLS) policies in Supabase
- RLS policies control what operations anonymous users can perform

**Required RLS Policies:**
```sql
-- Allow anonymous users to insert weather reports
CREATE POLICY "Allow anonymous insert" ON reports
  FOR INSERT TO anon
  WITH CHECK (true);

-- Allow anonymous users to read weather reports
CREATE POLICY "Allow anonymous select" ON reports
  FOR SELECT TO anon
  USING (true);
```

### Google Maps API Key
⚠️ **Should be restricted**
- Currently configured for development
- **Before production deployment**, restrict the key in Google Cloud Console

**How to Restrict:**
1. Go to: https://console.cloud.google.com/apis/credentials
2. Find your API key
3. Click "Edit API Key"
4. Under "Application restrictions":
   - Select "HTTP referrers (web sites)"
   - Add your production domains:
     ```
     https://your-domain.com/*
     https://your-domain.vercel.app/*
     https://your-domain.netlify.app/*
     http://localhost:5173/*  (for development)
     ```
5. Under "API restrictions":
   - Select "Restrict key"
   - Check only: "Maps JavaScript API"
6. Save changes

---

## 🔄 Updating Credentials

### To Change Supabase Credentials:

Edit `/src/lib/supabase.ts`:
```typescript
const SUPABASE_URL = "YOUR_NEW_SUPABASE_URL";
const SUPABASE_ANON_KEY = "YOUR_NEW_ANON_KEY";
```

### To Change Google Maps API Key:

Edit `/src/app/components/GoogleMap.tsx`:
```typescript
export function GoogleMap({ 
  apiKey = 'YOUR_NEW_GOOGLE_MAPS_KEY',
  // ... rest of props
})
```

---

## 📊 Usage Limits & Quotas

### Supabase Free Tier
- 500 MB database space
- 1 GB file storage
- 50,000 monthly active users
- 2 GB bandwidth per month

**Upgrade if you exceed limits:** https://supabase.com/pricing

### Google Maps Free Tier
- $200 monthly credit (covers ~28,000 map loads)
- After credit: $7 per 1,000 map loads

**Monitor usage:** https://console.cloud.google.com/apis/dashboard

---

## 🧪 Testing Credentials

### Test Supabase Connection:
```bash
curl -H "apikey: YOUR_ANON_KEY" \
     -H "Authorization: Bearer YOUR_ANON_KEY" \
     "https://YOUR_PROJECT.supabase.co/rest/v1/reports?select=*&limit=1"
```

Expected response: JSON array with reports (or empty array)

### Test Google Maps API:
Open in browser:
```
https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY
```

Expected: JavaScript file loads without errors

---

## 🚨 What to Do If Keys Are Compromised

### Supabase Anon Key Compromised:
1. Go to Supabase Dashboard → Settings → API
2. The anon key cannot be rotated (it's meant to be public)
3. Rely on RLS policies for security
4. If needed, create a new Supabase project

### Google Maps API Key Compromised:
1. Go to Google Cloud Console → Credentials
2. Delete the compromised key
3. Create a new API key
4. Update the key in your code
5. Add proper restrictions immediately

---

## 📝 Environment Variables (Alternative Approach)

If you prefer using environment variables instead of hardcoded keys:

### 1. Create `.env` file (not committed to git):
```bash
VITE_SUPABASE_URL=https://mylxpghozcxekasbniqm.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_GOOGLE_MAPS_KEY=your_google_maps_key_here
```

### 2. Update code to use env variables:

**`/src/lib/supabase.ts`:**
```typescript
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
```

**`/src/app/components/GoogleMap.tsx`:**
```typescript
export function GoogleMap({ 
  apiKey = import.meta.env.VITE_GOOGLE_MAPS_KEY,
  // ... rest
})
```

### 3. Add to deployment platform:
- **Vercel:** Project Settings → Environment Variables
- **Netlify:** Site Settings → Environment Variables
- **Render:** Environment → Environment Variables

**Note:** For public anon keys, hardcoding is actually fine and simpler. Environment variables are more useful for secret keys.

---

## ✅ Credentials Checklist

- [x] Supabase URL configured
- [x] Supabase anon key configured
- [x] Google Maps API key configured
- [ ] Google Maps API key restricted (do before production)
- [ ] Supabase RLS policies enabled
- [ ] Usage monitoring set up
- [ ] Billing alerts configured (optional)

---

## 📞 Getting Help

- **Supabase Support:** https://supabase.com/docs
- **Google Maps Support:** https://developers.google.com/maps/support
- **Report Issues:** Open an issue on GitHub
