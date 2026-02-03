import { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation } from 'lucide-react';

interface GoogleMapProps {
  apiKey?: string;
  userLat?: number;
  userLng?: number;
  markers?: Array<{ id: number; lat: number; lng: number; location: string; condition: string; note: string | null; created_at: string }>;
}

// Davao City coordinates
const DAVAO_CITY_CENTER = {
  lat: 7.070200,
  lng: 125.607596
};

export function GoogleMap({ apiKey = 'AIzaSyCCv3fMlFc7PxJXR4Y65zJTsxPbWxnpc8I', userLat, userLng, markers = [] }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const userMarkerRef = useRef<google.maps.Marker | null>(null);
  const weatherMarkersRef = useRef<Map<number, google.maps.Marker>>(new Map());
  const [hasUserLocation, setHasUserLocation] = useState(false);

  useEffect(() => {
    // Check if Google Maps script is already loaded
    if (window.google && window.google.maps) {
      initializeMap();
      return;
    }

    // Load Google Maps script with async/defer and required libraries
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&loading=async&libraries=marker`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      initializeMap();
    };
    script.onerror = () => {
      console.error('Failed to load Google Maps script. Check your API key and restrictions.');
    };
    document.head.appendChild(script);

    return () => {
      // Cleanup if needed
    };
  }, [apiKey]);

  // Update user marker when location changes
  useEffect(() => {
    if (mapInstanceRef.current && userLat && userLng) {
      updateUserMarker(userLat, userLng);
      setHasUserLocation(true);
    }
  }, [userLat, userLng]);

  // Update weather markers when reports change
  useEffect(() => {
    if (mapInstanceRef.current) {
      updateWeatherMarkers(markers);
    }
  }, [markers]);

  const initializeMap = () => {
    if (!mapRef.current) return;

    try {
      const map = new google.maps.Map(mapRef.current, {
        center: DAVAO_CITY_CENTER,
        zoom: 12,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
      });

      mapInstanceRef.current = map;

      // Don't add user marker initially - wait for actual location
      // User marker will be added when location is detected

    } catch (error) {
      console.error('Error initializing map:', error);
    }
  };

  const updateUserMarker = (lat: number, lng: number) => {
    if (!mapInstanceRef.current) return;

    const position = { lat, lng };
    
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
        anchor: new google.maps.Point(12, 22),
      };

      userMarkerRef.current = new google.maps.Marker({
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
  };

  const recenterToUserLocation = () => {
    if (mapInstanceRef.current && userLat && userLng) {
      mapInstanceRef.current.setCenter({ lat: userLat, lng: userLng });
      mapInstanceRef.current.setZoom(15);
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
    if (!mapInstanceRef.current) return;

    const currentMarkers = weatherMarkersRef.current;
    const ids = new Set(weatherMarkers.map(r => r.id));

    // Remove markers that no longer exist
    for (const [id, marker] of currentMarkers.entries()) {
      if (!ids.has(id)) {
        marker.setMap(null);
        currentMarkers.delete(id);
      }
    }

    // Add or update markers
    weatherMarkers.forEach((report) => {
      if (!currentMarkers.has(report.id)) {
        // Create green circle icon for weather reports
        const greenCircleIcon = {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: '#10B981',
          fillOpacity: 0.9,
          strokeColor: '#FFFFFF',
          strokeWeight: 3,
          scale: 12,
        };

        const marker = new google.maps.Marker({
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

        const infoWindow = new google.maps.InfoWindow({
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
      }
    });

    weatherMarkersRef.current = currentMarkers;
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 h-full">
      <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
        <MapPin size={20} />
        Davao City - Weather Map
      </h3>
      <div className="relative">
        <div 
          ref={mapRef} 
          className="w-full h-[500px] md:h-[600px] rounded-lg overflow-hidden bg-gray-200"
        >
          {/* Fallback content while map loads */}
          <div className="w-full h-full flex items-center justify-center bg-blue-100">
            <div className="text-center text-gray-600">
              <MapPin size={48} className="mx-auto mb-2 opacity-50" />
              <p>Loading Google Maps...</p>
            </div>
          </div>
        </div>
        
        {/* My Location Button */}
        {hasUserLocation && (
          <button
            onClick={recenterToUserLocation}
            className="absolute bottom-6 right-6 bg-white hover:bg-gray-50 text-gray-700 p-3 rounded-full shadow-lg transition-all hover:scale-105 active:scale-95 z-10"
            title="Go to my location"
          >
            <Navigation size={20} className="text-blue-500" />
          </button>
        )}
      </div>
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
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    google: typeof google;
  }
}