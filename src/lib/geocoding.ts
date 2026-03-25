// Geocoding utilities for getting location names from coordinates

// Get API key from environment variable or use the documented key as fallback
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY || 'AIzaSyCCv3fMlFc7PxJXR4Y65zJTsxPbWxnpc8I';

// Cache to avoid repeated API calls for the same coordinates
const geocodeCache = new Map<string, string>();

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
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`;
    console.log('🌍 Geocoding request:', url);
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error('❌ Geocoding HTTP error:', response.status, response.statusText);
      throw new Error('Geocoding request failed');
    }

    const data = await response.json();
    console.log('📍 Geocoding response:', data);
    
    if (data.status === 'REQUEST_DENIED') {
      console.error('🚫 Geocoding API access denied. Check if Geocoding API is enabled:', data.error_message);
      return '';
    }
    
    if (data.status === 'ZERO_RESULTS') {
      console.warn('⚠️ No results found for coordinates:', lat, lng);
      return '';
    }
    
    if (data.status === 'OK' && data.results && data.results.length > 0) {
      console.log('✅ Geocoding successful, processing results...');
      
      // Log all results for debugging
      data.results.forEach((result: any, index: number) => {
        console.log(`Result ${index}:`, result.formatted_address);
        console.log(`  Types:`, result.types);
      });
      
      // Try to get a good location name from the results
      const result = data.results[0];
      
      // Look for neighborhood, locality, or sublocality
      const addressComponents = result.address_components;
      let locationName = '';
      
      console.log('📋 Address components:', addressComponents);
      
      // Priority order: neighborhood, sublocality, locality, administrative_area_level_3
      const priorities = [
        'neighborhood',
        'sublocality',
        'sublocality_level_1',
        'locality',
        'administrative_area_level_3',
        'administrative_area_level_2'
      ];
      
      for (const priority of priorities) {
        const component = addressComponents.find((c: any) => 
          c.types.includes(priority)
        );
        if (component) {
          locationName = component.long_name;
          console.log(`✨ Found location name from ${priority}:`, locationName);
          break;
        }
      }
      
      // Fallback to formatted address if no specific component found
      if (!locationName && result.formatted_address) {
        // Get first part of formatted address (usually the most specific location)
        const parts = result.formatted_address.split(',');
        locationName = parts[0].trim();
        
        console.log('📝 Using formatted address parts:', parts);
        
        // If it's just a street address with number, try to get a better name
        if (/^\d+/.test(locationName) && parts.length > 1) {
          locationName = parts[1].trim();
        }
        
        console.log('🏷️ Final location name from formatted address:', locationName);
      }
      
      if (!locationName) {
        console.warn('⚠️ Could not extract location name, using empty string');
      }
      
      // Cache the result
      geocodeCache.set(cacheKey, locationName);
      return locationName;
    }
    
    console.error('❌ Unexpected geocoding status:', data.status);
    return '';
  } catch (error) {
    console.error('❌ Reverse geocoding error:', error);
    return '';
  }
}

/**
 * Batch reverse geocode multiple locations
 */
export async function batchReverseGeocode(
  locations: Array<{ lat: number; lng: number }>
): Promise<string[]> {
  // Use Promise.all to fetch all locations in parallel, but with a small delay to avoid rate limiting
  const results: string[] = [];
  
  for (let i = 0; i < locations.length; i++) {
    const location = locations[i];
    const name = await reverseGeocode(location.lat, location.lng);
    results.push(name);
    
    // Small delay to avoid hitting rate limits (only if not from cache)
    if (i < locations.length - 1 && !geocodeCache.has(`${location.lat.toFixed(4)},${location.lng.toFixed(4)}`)) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  return results;
}