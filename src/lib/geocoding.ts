// Geocoding utilities for getting location names from coordinates

// Cache to avoid repeated API calls for the same coordinates
const geocodeCache = new Map<string, string>();

// Geocoder instance (will be initialized when needed)
let geocoder: google.maps.Geocoder | null = null;

/**
 * Initialize the geocoder (requires Google Maps API to be loaded)
 */
function initGeocoder() {
  if (!geocoder && typeof google !== 'undefined' && google.maps) {
    geocoder = new google.maps.Geocoder();
  }
  return geocoder;
}

/**
 * Get a location name from lat/lng coordinates using Google Maps Geocoding API
 */
export async function reverseGeocode(lat: number, lng: number): Promise<string> {
  const cacheKey = `${lat.toFixed(4)},${lng.toFixed(4)}`;
  
  // Check cache first
  if (geocodeCache.has(cacheKey)) {
    return geocodeCache.get(cacheKey)!;
  }

  try {
    // Initialize geocoder if needed
    const geo = initGeocoder();
    if (!geo) {
      console.error('❌ Google Maps Geocoder not available');
      return '';
    }

    console.log('🌍 Geocoding coordinates:', lat, lng);
    
    // Use the Google Maps JavaScript API Geocoder (works with referer-restricted keys)
    const result = await geo.geocode({
      location: { lat, lng }
    });

    console.log('📍 Geocoding response:', result);
    
    if (result.results && result.results.length > 0) {
      console.log('✅ Geocoding successful, processing results...');
      
      // Log all results for debugging
      result.results.forEach((res, index) => {
        console.log(`Result ${index}:`, res.formatted_address);
        console.log(`  Types:`, res.types);
      });
      
      // Get the most detailed result (usually the first one with route/street_address type)
      let bestResult = result.results[0];
      
      // Try to find a result that includes a route (street name) for more detail
      const routeResult = result.results.find(r => 
        r.types.includes('route') || 
        r.types.includes('street_address') ||
        r.types.includes('premise')
      );
      
      if (routeResult) {
        bestResult = routeResult;
        console.log('📍 Using result with street address:', bestResult.formatted_address);
      } else {
        console.log('📍 Using first result:', bestResult.formatted_address);
      }
      
      // Parse the formatted address and take the relevant parts
      // Example: "J. Palma Gil St, Poblacion District, Davao City, 8000 Davao del Sur, Philippines"
      // We want: "J. Palma Gil St, Poblacion District, Davao City, Davao del Sur"
      
      const parts = bestResult.formatted_address.split(',').map(p => p.trim());
      console.log('📝 Address parts:', parts);
      
      // Filter out: postal codes, Plus Codes, "Philippines", and empty parts
      const filteredParts = parts.filter(part => {
        // Skip Plus Codes (format like "66HQ+XWX", "3J95+WFQ", or longer codes)
        // Plus Codes are alphanumeric with a "+" in the middle
        if (/^[A-Z0-9]{2,8}\+[A-Z0-9]{2,3}$/i.test(part)) {
          console.log('🚫 Skipping Plus Code:', part);
          return false;
        }
        
        // Skip postal codes (4 digits, or patterns like "8000 Davao del Sur")
        if (/^\d{4}$/.test(part)) return false;
        
        // Skip parts that start with postal code
        if (/^\d{4}\s/.test(part)) {
          // But extract the location name after the postal code
          const match = part.match(/^\d{4}\s+(.+)$/);
          if (match) {
            // We'll handle this separately
            return false;
          }
        }
        
        // Skip "Philippines"
        if (part === 'Philippines') return false;
        
        return true;
      });
      
      // Handle parts with postal codes embedded (e.g., "8000 Davao del Sur")
      parts.forEach(part => {
        const match = part.match(/^\d{4}\s+(.+)$/);
        if (match) {
          filteredParts.push(match[1]);
        }
      });
      
      // Remove duplicates while preserving order
      const uniqueParts = Array.from(new Set(filteredParts));
      
      // Take first 4 parts maximum (Street, Barangay/District, City, Province)
      const locationName = uniqueParts.slice(0, 4).join(', ');
      
      console.log('🎯 Final location name:', locationName);
      
      // Cache the result
      geocodeCache.set(cacheKey, locationName);
      return locationName;
    }
    
    console.error('❌ No geocoding results found');
    return '';
  } catch (error) {
    console.error('❌ Reverse geocoding error:', error);
    return '';
  }
}