# PWA Setup for Davao Weather Map

## Files Created

### 1. `/index.html`
- Main HTML entry point
- Includes PWA manifest and meta tags
- Apple and Windows mobile web app configurations

### 2. `/src/main.tsx`
- React application entry point
- Registers the service worker
- Mounts the React app to the DOM

### 3. `/public/manifest.webmanifest`
- PWA manifest file with app metadata
- Defines app name, icons, colors, and display mode
- Enables "Add to Home Screen" functionality

### 4. `/public/sw.js`
- Service worker for offline functionality
- Implements caching strategies:
  - **Precache**: Essential files cached on install
  - **Network First**: API requests (Supabase, Google Maps)
  - **Cache First**: App shell and static assets
  - **Runtime Cache**: Dynamic content caching

### 5. Icons
- `/public/icon-192.svg` - 192x192 app icon
- `/public/icon-512.svg` - 512x512 app icon
- SVG format for scalability and small file size

### 6. `/public/offline.html`
- Fallback page when user is completely offline
- Friendly offline message with retry button

## How It Works

1. **Installation**: When users visit the app, the service worker installs and caches essential files
2. **Offline Support**: Cached files are served when offline, API requests fail gracefully
3. **Add to Home Screen**: Users can install the app on mobile devices
4. **Updates**: Service worker automatically updates when new version is deployed

## Testing PWA Functionality

### In Development
1. Run `npm run dev` or `pnpm dev`
2. Open Chrome DevTools > Application tab
3. Check:
   - **Manifest**: Verify manifest loads correctly
   - **Service Workers**: Ensure SW is registered
   - **Cache Storage**: Check cached files

### Testing Offline Mode
1. Open Chrome DevTools > Network tab
2. Select "Offline" from throttling dropdown
3. Reload the page - should still work with cached content

### Testing "Add to Home Screen"
1. On mobile device, open the app in browser
2. Look for "Add to Home Screen" prompt
3. Or use browser menu > "Install App" or "Add to Home Screen"

## Deployment Notes

- Ensure all files in `/public` folder are served at root level
- Service worker must be served from same origin
- HTTPS required for service workers (except localhost)
- Update `CACHE_NAME` in `sw.js` when deploying new versions

## Browser Support

- Chrome/Edge: Full support
- Safari/iOS: Partial support (no service worker background sync)
- Firefox: Full support
- Samsung Internet: Full support

## Customization

### Updating Icons
Replace `/public/icon-192.svg` and `/public/icon-512.svg` with your custom icons.
Or create PNG versions:
- 192x192px for mobile
- 512x512px for splash screens

### Updating Theme Color
Change `theme_color` in:
- `/public/manifest.webmanifest`
- `/index.html` meta tag

### Cache Strategy
Modify caching logic in `/public/sw.js` based on your needs.
