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
      
      // Try to get a good location name from the results
      const firstResult = result.results[0];
      
      // Look for neighborhood, locality, or sublocality
      const addressComponents = firstResult.address_components;
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
        const component = addressComponents?.find(c => 
          c.types.includes(priority)
        );
        if (component) {
          locationName = component.long_name;
          console.log(`✨ Found location name from ${priority}:`, locationName);
          break;
        }
      }
      
      // Fallback to formatted address if no specific component found
      if (!locationName && firstResult.formatted_address) {
        // Get first part of formatted address (usually the most specific location)
        const parts = firstResult.formatted_address.split(',');
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
    
    console.error('❌ No geocoding results found');
    return '';
  } catch (error) {
    console.error('❌ Reverse geocoding error:', error);
    return '';
  }
}