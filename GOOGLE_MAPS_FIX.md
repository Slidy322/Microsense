# How to Fix Google Maps on New Vercel Deployment

## Problem
After changing your Vercel project and repository, Google Maps isn't working because the API key is restricted to the old domain.

## Solution: Update Google Maps API Key Restrictions

### Step 1: Get Your New Vercel Domain
1. Go to your Vercel project dashboard
2. Copy your deployment URL (e.g., `your-project-name.vercel.app`)
3. Also note the preview URLs if you want them to work (e.g., `your-project-name-*.vercel.app`)

### Step 2: Update Google Cloud Console

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Select your project

2. **Navigate to API Credentials**
   - Go to: APIs & Services → Credentials
   - Or direct link: https://console.cloud.google.com/apis/credentials

3. **Find Your API Key**
   - Look for the API key: `AIzaSyCCv3fMlFc7PxJXR4Y65zJTsxPbWxnpc8I`
   - Click on the key name to edit it

4. **Update Application Restrictions**
   - Under "Application restrictions", select **"HTTP referrers (web sites)"**
   - Click "Add an item" and add these referrers:
     ```
     https://your-new-domain.vercel.app/*
     https://*.vercel.app/*
     http://localhost:5173/*
     http://localhost:3000/*
     ```
   - Replace `your-new-domain` with your actual Vercel project name

5. **Verify API Restrictions**
   - Make sure "Maps JavaScript API" is enabled
   - Under "API restrictions", ensure these are enabled:
     - Maps JavaScript API
     - Places API (if using places)
     - Geocoding API (if using geocoding)

6. **Save Changes**
   - Click "Save" at the bottom
   - Wait 1-2 minutes for changes to propagate

### Step 3: Clear Cache and Test

1. **Clear Browser Cache**
   - Press `Ctrl + Shift + R` (Windows/Linux)
   - Press `Cmd + Shift + R` (Mac)

2. **Hard Refresh Vercel**
   - Go to your Vercel deployment
   - Force a hard refresh
   - Check if Google Maps loads

### Step 4: Check Console for Errors

Open browser DevTools (F12) and look for:
- ✅ **Success**: Map loads without errors
- ❌ **Error**: "Google Maps API error: RefererNotAllowedMapError"
  - This means your domain isn't in the allowed list
  - Go back to Step 2 and add your domain
- ❌ **Error**: "Google Maps API error: ApiNotActivatedMapError"
  - Enable Maps JavaScript API in Google Cloud Console

## Alternative: Create a New API Key (Recommended)

If you want a fresh start:

1. Go to Google Cloud Console → APIs & Services → Credentials
2. Click "+ CREATE CREDENTIALS" → API Key
3. Copy the new API key
4. Click "Restrict Key" and follow Step 2 above
5. Update the API key in your code:
   - File: `/src/app/components/GoogleMap.tsx`
   - Line 17: Replace the default API key value

## Quick Check

Test your API key with this URL (replace with your domain):
```
https://maps.googleapis.com/maps/api/js?key=AIzaSyCCv3fMlFc7PxJXR4Y65zJTsxPbWxnpc8I&callback=console.log
```

Open this in your browser from your Vercel domain. If it loads without errors, your API key is configured correctly.

## Common Issues

### Issue: "This page can't load Google Maps correctly"
**Solution**: Your API key is invalid or has billing issues
- Check if billing is enabled in Google Cloud Console
- Verify the API key is correct

### Issue: "RefererNotAllowedMapError"
**Solution**: Your current domain is not authorized
- Add your Vercel domain to the allowed referrers list
- Use wildcard: `https://*.vercel.app/*`

### Issue: Map loads but shows "For development purposes only"
**Solution**: Billing is not enabled
- Go to Google Cloud Console
- Enable billing for the project
- Link a credit card (Google provides $200 free credit monthly)

## Need Help?

If maps still don't work:
1. Check the browser console for specific error messages
2. Verify your Vercel domain is correct
3. Wait 2-3 minutes after updating restrictions
4. Try incognito/private browsing mode
5. Check Google Cloud Console for any billing alerts
