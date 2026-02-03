import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { MapPin, Navigation } from 'lucide-react';

interface GoogleMapProps {
  apiKey?: string;
  userLat?: number;
  userLng?: number;
  markers?: Array<{ id: number; lat: number; lng: number; location: string; condition: string; note: string | null; created_at: string }>;
  containerRef?: React.RefObject<HTMLDivElement>;
}

export interface GoogleMapRef {
  recenterToUser: () => void;
  centerOnLocation: (lat: number, lng: number) => void;
}

// Davao City coordinates
const DAVAO_CITY_CENTER = {
  lat: 7.070136,
  lng: 125.608519
};

export const GoogleMap = forwardRef<GoogleMapRef, GoogleMapProps>(({ apiKey = 'AIzaSyCCv3fMlFc7PxJXR4Y65zJTsxPbWxnpc8I', userLat, userLng, markers = [], containerRef }, ref) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const userMarkerRef = useRef<google.maps.Marker | null>(null);
  const weatherMarkersRef = useRef<Map<number, google.maps.Marker>>(new Map());
  const scriptLoadedRef = useRef(false);
  const initializationAttemptedRef = useRef(false);
  const [hasUserLocation, setHasUserLocation] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    // Check if script is already in the DOM
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    
    if (existingScript) {
      // Script already exists, wait for it to load
      if (window.google && window.google.maps) {
        setIsLoaded(true);
      } else {
        existingScript.addEventListener('load', () => setIsLoaded(true));
      }
      return;
    }

    // Create and inject the Google Maps script with async loading
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&loading=async&libraries=marker`;
    script.async = true;
    script.defer = true;
    script.onload = () => setIsLoaded(true);
    script.onerror = () => setLoadError('Failed to load Google Maps');
    document.head.appendChild(script);
  }, [apiKey]);

  // Initialize map once script is loaded
  useEffect(() => {
    if (isLoaded && !loadError && !mapInstanceRef.current) {
      // Add a small delay to ensure DOM is ready
      const timer = setTimeout(() => {
        initializeMap();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isLoaded, loadError]);

  // Update user marker when location changes
  useEffect(() => {
    if (mapInstanceRef.current && userLat && userLng) {
      updateUserMarker(userLat, userLng);
      setHasUserLocation(true);
    }
  }, [userLat, userLng]);

  // Update weather markers when reports change
  useEffect(() => {
    if (mapInstanceRef.current && isLoaded) {
      updateWeatherMarkers(markers);
    }
  }, [markers, isLoaded]);

  const initializeMap = () => {
    // Prevent multiple initialization attempts
    if (initializationAttemptedRef.current || mapInstanceRef.current) {
      return;
    }

    if (!mapRef.current) {
      console.warn('Map container not ready');
      return;
    }

    // Verify Google Maps is fully loaded
    if (!window.google || !window.google.maps || !window.google.maps.Map) {
      console.warn('Google Maps API not fully loaded yet');
      return;
    }

    initializationAttemptedRef.current = true;

    try {
      const map = new window.google.maps.Map(mapRef.current, {
        center: DAVAO_CITY_CENTER,
        zoom: 12,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
      });

      mapInstanceRef.current = map;
      setLoadError(null);

      // Initialize weather markers if we have data
      if (markers.length > 0) {
        updateWeatherMarkers(markers);
      }

    } catch (error) {
      console.error('Error initializing map:', error);
      setLoadError('Failed to initialize map. Please refresh the page.');
      initializationAttemptedRef.current = false;
    }
  };

  const updateUserMarker = (lat: number, lng: number) => {
    if (!mapInstanceRef.current || !window.google || !window.google.maps) return;

    const position = { lat, lng };
    
    try {
      // Create or update red pin marker for user location
      if (!userMarkerRef.current) {
        // Create custom red pin icon
        const redPinIcon = {
          path: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
          fillColor: '#EF4444',
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 2,
          scale: 2,
          anchor: new window.google.maps.Point(12, 22),
        };

        userMarkerRef.current = new window.google.maps.Marker({
          position: position,
          map: mapInstanceRef.current,
          title: 'You are here',
          icon: redPinIcon,
          zIndex: 1000,
        });
      } else {
        userMarkerRef.current.setPosition(position);
      }
      
      mapInstanceRef.current.setCenter(position);
      mapInstanceRef.current.setZoom(15);
    } catch (error) {
      console.error('Error updating user marker:', error);
    }
  };

  const recenterToUserLocation = () => {
    if (mapInstanceRef.current && userLat && userLng) {
      try {
        mapInstanceRef.current.setCenter({ lat: userLat, lng: userLng });
        mapInstanceRef.current.setZoom(15);
      } catch (error) {
        console.error('Error recentering map:', error);
      }
    }
  };

  const centerOnLocation = (lat: number, lng: number) => {
    if (mapInstanceRef.current) {
      try {
        mapInstanceRef.current.setCenter({ lat, lng });
        mapInstanceRef.current.setZoom(15);
      } catch (error) {
        console.error('Error centering map:', error);
      }
    }
  };

  const iconFor = (condition: string): string => {
    const iconMap: { [key: string]: string } = {
      'Sunny': '☀️',
      'Cloudy': '☁️',
      'Rainy': '🌧️',
      'Windy': '🌬️',
      'Storm': '⛈️',
      'Flooding': '🌊'
    };
    return iconMap[condition] || '📍';
  };

  const timeAgo = (iso: string): string => {
    const t = new Date(iso).getTime();
    const s = Math.max(0, Math.floor((Date.now() - t) / 1000));
    if (s < 60) return `${s}s ago`;
    const m = Math.floor(s / 60);
    if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24);
    return `${d}d ago`;
  };

  const updateWeatherMarkers = (weatherMarkers: Array<{ id: number; lat: number; lng: number; location: string; condition: string; note: string | null; created_at: string }>) => {
    if (!mapInstanceRef.current || !window.google || !window.google.maps) return;

    const currentMarkers = weatherMarkersRef.current;
    const ids = new Set(weatherMarkers.map(r => r.id));

    // Remove markers that no longer exist
    for (const [id, marker] of currentMarkers.entries()) {
      if (!ids.has(id)) {
        try {
          marker.setMap(null);
          currentMarkers.delete(id);
        } catch (error) {
          console.warn('Error removing marker:', error);
          currentMarkers.delete(id);
        }
      }
    }

    // Add or update markers
    weatherMarkers.forEach((report) => {
      if (!currentMarkers.has(report.id)) {
        try {
          // Create green circle icon for weather reports
          const greenCircleIcon = {
            path: window.google.maps.SymbolPath.CIRCLE,
            fillColor: '#10B981',
            fillOpacity: 0.9,
            strokeColor: '#FFFFFF',
            strokeWeight: 3,
            scale: 12,
          };

          const marker = new window.google.maps.Marker({
            position: { lat: report.lat, lng: report.lng },
            map: mapInstanceRef.current!,
            title: report.condition,
            icon: greenCircleIcon,
            label: {
              text: iconFor(report.condition),
              fontSize: '18px',
              color: '#FFFFFF',
            },
            zIndex: 100,
          });

          const infoWindow = new window.google.maps.InfoWindow({
            content: `
              <div style="font-family:system-ui; font-size:14px; color: #1F2937; min-width: 120px;">
                <div style="font-weight: bold; margin-bottom: 4px;">${iconFor(report.condition)} ${report.condition}</div>
                <div style="opacity: 0.8; font-size: 12px; margin-bottom: 4px;">${timeAgo(report.created_at)}</div>
                ${report.note ? `<div style="margin-top: 4px;">${report.note}</div>` : ''}
              </div>
            `,
          });

          marker.addListener('click', () => {
            infoWindow.open({ anchor: marker, map: mapInstanceRef.current! });
          });

          currentMarkers.set(report.id, marker);
        } catch (error) {
          console.warn('Error creating marker:', error);
        }
      }
    });

    weatherMarkersRef.current = currentMarkers;
  };

  // Expose recenter function to parent
  useImperativeHandle(ref, () => ({
    recenterToUser: () => {
      if (mapInstanceRef.current && hasUserLocation && userLat && userLng) {
        mapInstanceRef.current.setCenter({ lat: userLat, lng: userLng });
        mapInstanceRef.current.setZoom(15);
      }
    },
    centerOnLocation: (lat: number, lng: number) => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.setCenter({ lat, lng });
        mapInstanceRef.current.setZoom(15);
      }
    }
  }));

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 h-full">
      {/* Add global style for InfoWindow close button */}
      <style>{`
        .gm-ui-hover-effect {
          opacity: 1 !important;
          width: 28px !important;
          height: 28px !important;
        }
        .gm-ui-hover-effect > img {
          filter: drop-shadow(0 0 2px rgba(0,0,0,0.8)) brightness(0) invert(1);
        }
        .gm-style-iw-d {
          overflow: hidden !important;
        }
      `}</style>
      
      <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
        <MapPin size={20} />
        Davao City - Weather Map
      </h3>
      <div className="relative">
        <div 
          ref={mapRef} 
          className="w-full h-[500px] md:h-[600px] rounded-lg overflow-hidden bg-gray-200"
        >
          {/* Fallback content while map loads or if error */}
          {!isLoaded && !loadError && (
            <div className="w-full h-full flex items-center justify-center bg-blue-100">
              <div className="text-center text-gray-600">
                <MapPin size={48} className="mx-auto mb-2 opacity-50 animate-pulse" />
                <p>Loading Google Maps...</p>
              </div>
            </div>
          )}
          {loadError && (
            <div className="w-full h-full flex items-center justify-center bg-red-50">
              <div className="text-center text-red-600 px-4">
                <MapPin size={48} className="mx-auto mb-2 opacity-50" />
                <p className="font-semibold mb-2">Map Loading Error</p>
                <p className="text-sm">{loadError}</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* My Location Button - Below the map */}
      {isLoaded && !loadError && (
        <button
          onClick={recenterToUserLocation}
          disabled={!hasUserLocation}
          className={`mt-4 w-full py-3 px-4 rounded-lg shadow-md transition-all hover:shadow-lg flex items-center justify-center gap-2 font-medium ${
            hasUserLocation 
              ? 'bg-white hover:bg-gray-50 text-gray-700 cursor-pointer' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-60'
          }`}
          title={hasUserLocation ? "Go to my location" : "Enable location first"}
        >
          <Navigation size={20} className={hasUserLocation ? "text-blue-500" : "text-gray-400"} />
          <span>{hasUserLocation ? 'Center to My Location' : 'Location Not Available'}</span>
        </button>
      )}
      
      <div className="mt-3 flex items-center gap-4 text-sm text-white/80">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500 border-2 border-white"></div>
          <span>Your Location</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-green-500 border-2 border-white"></div>
          <span>Weather Reports</span>
        </div>
      </div>
    </div>
  );
});

// Extend Window interface for TypeScript
declare global {
  interface Window {
    google: typeof google;
  }
}