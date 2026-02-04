import { useState, useEffect } from 'react';
import { Cloud, MapPin, Loader2, FileText, Wind, Eye, Droplets, Volume2, Sun, Thermometer, Gauge, Zap, Waves } from 'lucide-react';

interface WeatherData {
  condition: string;
  notes: string;
  location: string;
  lat: number;
  lng: number;
  // Dynamic sensory fields
  intensity: number;
  visibility: number;
  humidity: number;
  windSpeed: number;
  temperature: number;
  smell: string;
}

interface WeatherSubmissionFormProps {
  onSubmit: (data: WeatherData) => void;
  onLocationChange?: (lat: number, lng: number) => void;
  onRecenterMap?: () => void;
}

// Define what sliders show for each weather condition
const weatherSliderConfigs: Record<string, {
  sliders: Array<{
    name: string;
    label: string;
    icon: any;
    unit: string;
    getLabel: (value: number) => string;
  }>;
  smellOptions: string[];
}> = {
  Sunny: {
    sliders: [
      {
        name: 'intensity',
        label: 'UV Index / Sun Intensity',
        icon: Sun,
        unit: '',
        getLabel: (value: number) => {
          if (value < 30) return 'Low (1-3)';
          if (value < 60) return 'Moderate (4-6)';
          if (value < 80) return 'High (7-9)';
          return 'Extreme (10+)';
        }
      },
      {
        name: 'temperature',
        label: 'Temperature Feel',
        icon: Thermometer,
        unit: '°C',
        getLabel: (value: number) => {
          const temp = 25 + (value / 100) * 12; // 25°C to 37°C
          return `${temp.toFixed(1)}°C`;
        }
      },
      {
        name: 'humidity',
        label: 'Humidity',
        icon: Droplets,
        unit: '%',
        getLabel: (value: number) => `${value}%`
      },
      {
        name: 'visibility',
        label: 'Visibility',
        icon: Eye,
        unit: 'km',
        getLabel: (value: number) => {
          const km = (value / 100) * 10; // 0-10km
          return `${km.toFixed(1)} km`;
        }
      }
    ],
    smellOptions: ['Fresh', 'Neutral', 'Dusty', 'Hot Air']
  },
  Cloudy: {
    sliders: [
      {
        name: 'intensity',
        label: 'Cloud Coverage',
        icon: Cloud,
        unit: '%',
        getLabel: (value: number) => {
          if (value < 25) return 'Partly Cloudy (25%)';
          if (value < 50) return 'Mostly Cloudy (50%)';
          if (value < 75) return 'Overcast (75%)';
          return 'Complete Cover (100%)';
        }
      },
      {
        name: 'humidity',
        label: 'Humidity',
        icon: Droplets,
        unit: '%',
        getLabel: (value: number) => `${value}%`
      },
      {
        name: 'temperature',
        label: 'Temperature Feel',
        icon: Thermometer,
        unit: '°C',
        getLabel: (value: number) => {
          const temp = 24 + (value / 100) * 10; // 24°C to 34°C
          return `${temp.toFixed(1)}°C`;
        }
      },
      {
        name: 'visibility',
        label: 'Visibility',
        icon: Eye,
        unit: 'km',
        getLabel: (value: number) => {
          const km = (value / 100) * 10;
          return `${km.toFixed(1)} km`;
        }
      }
    ],
    smellOptions: ['Fresh', 'Neutral', 'Damp', 'Earthy']
  },
  Rainy: {
    sliders: [
      {
        name: 'intensity',
        label: 'Rainfall Intensity',
        icon: Droplets,
        unit: 'mm/h',
        getLabel: (value: number) => {
          if (value < 25) return 'Light (2 mm/h)';
          if (value < 50) return 'Moderate (7 mm/h)';
          if (value < 75) return 'Heavy (15 mm/h)';
          return 'Extreme (50+ mm/h)';
        }
      },
      {
        name: 'visibility',
        label: 'Visibility',
        icon: Eye,
        unit: 'km',
        getLabel: (value: number) => {
          const km = (value / 100) * 5; // Reduced max for rain
          return `${km.toFixed(1)} km`;
        }
      },
      {
        name: 'humidity',
        label: 'Humidity',
        icon: Droplets,
        unit: '%',
        getLabel: (value: number) => `${Math.max(70, value)}%` // Rain = high humidity
      },
      {
        name: 'windSpeed',
        label: 'Wind with Rain',
        icon: Wind,
        unit: 'km/h',
        getLabel: (value: number) => {
          const speed = (value / 100) * 40;
          return `${speed.toFixed(0)} km/h`;
        }
      }
    ],
    smellOptions: ['Fresh Rain', 'Wet Earth', 'Neutral', 'Damp']
  },
  Windy: {
    sliders: [
      {
        name: 'windSpeed',
        label: 'Wind Speed',
        icon: Wind,
        unit: 'km/h',
        getLabel: (value: number) => {
          const speed = (value / 100) * 60; // 0-60 km/h
          if (value < 25) return `Light (${speed.toFixed(0)} km/h)`;
          if (value < 50) return `Moderate (${speed.toFixed(0)} km/h)`;
          if (value < 75) return `Strong (${speed.toFixed(0)} km/h)`;
          return `Gale Force (${speed.toFixed(0)} km/h)`;
        }
      },
      {
        name: 'intensity',
        label: 'Gust Intensity',
        icon: Gauge,
        unit: '',
        getLabel: (value: number) => {
          if (value < 33) return 'Steady';
          if (value < 66) return 'Gusty';
          return 'Very Gusty';
        }
      },
      {
        name: 'visibility',
        label: 'Visibility (Dust/Debris)',
        icon: Eye,
        unit: 'km',
        getLabel: (value: number) => {
          const km = (value / 100) * 8;
          return `${km.toFixed(1)} km`;
        }
      },
      {
        name: 'temperature',
        label: 'Wind Chill Feel',
        icon: Thermometer,
        unit: '°C',
        getLabel: (value: number) => {
          const temp = 22 + (value / 100) * 10;
          return `${temp.toFixed(1)}°C`;
        }
      }
    ],
    smellOptions: ['Fresh', 'Neutral', 'Dusty', 'Salty Air']
  },
  Storm: {
    sliders: [
      {
        name: 'intensity',
        label: 'Storm Intensity',
        icon: Zap,
        unit: '',
        getLabel: (value: number) => {
          if (value < 25) return 'Mild Thunderstorm';
          if (value < 50) return 'Moderate Storm';
          if (value < 75) return 'Severe Storm';
          return 'Dangerous Storm';
        }
      },
      {
        name: 'windSpeed',
        label: 'Wind Speed',
        icon: Wind,
        unit: 'km/h',
        getLabel: (value: number) => {
          const speed = 20 + (value / 100) * 80; // 20-100 km/h
          return `${speed.toFixed(0)} km/h`;
        }
      },
      {
        name: 'visibility',
        label: 'Visibility',
        icon: Eye,
        unit: 'km',
        getLabel: (value: number) => {
          const km = (value / 100) * 3; // Very reduced
          return `${km.toFixed(1)} km`;
        }
      },
      {
        name: 'humidity',
        label: 'Rainfall Intensity',
        icon: Droplets,
        unit: '',
        getLabel: (value: number) => {
          if (value < 33) return 'Heavy Rain';
          if (value < 66) return 'Torrential Rain';
          return 'Extreme Downpour';
        }
      }
    ],
    smellOptions: ['Wet Earth', 'Ozone', 'Fresh Rain', 'Metallic']
  },
  Flooding: {
    sliders: [
      {
        name: 'intensity',
        label: 'Water Level',
        icon: Waves,
        unit: '',
        getLabel: (value: number) => {
          if (value < 25) return 'Ankle Deep (10 cm)';
          if (value < 50) return 'Knee Deep (40 cm)';
          if (value < 75) return 'Waist Deep (80 cm)';
          return 'Chest+ Deep (120+ cm)';
        }
      },
      {
        name: 'windSpeed',
        label: 'Water Flow Speed',
        icon: Gauge,
        unit: '',
        getLabel: (value: number) => {
          if (value < 33) return 'Slow/Standing';
          if (value < 66) return 'Moderate Flow';
          return 'Fast/Dangerous';
        }
      },
      {
        name: 'visibility',
        label: 'Visibility in Area',
        icon: Eye,
        unit: 'km',
        getLabel: (value: number) => {
          const km = (value / 100) * 4;
          return `${km.toFixed(1)} km`;
        }
      },
      {
        name: 'humidity',
        label: 'Area Affected',
        icon: Cloud,
        unit: '',
        getLabel: (value: number) => {
          if (value < 33) return 'Localized';
          if (value < 66) return 'Widespread';
          return 'Major Area';
        }
      }
    ],
    smellOptions: ['Muddy', 'Sewage', 'Stagnant', 'Debris']
  }
};

export function WeatherSubmissionForm({ onSubmit, onLocationChange, onRecenterMap }: WeatherSubmissionFormProps) {
  const [formData, setFormData] = useState<WeatherData>({
    condition: 'Sunny',
    notes: '',
    location: '',
    lat: 0,
    lng: 0,
    intensity: 50,
    visibility: 70,
    humidity: 65,
    windSpeed: 10,
    temperature: 50,
    smell: 'Fresh',
  });
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState('');

  useEffect(() => {
    // Automatically request location permission EVERY TIME component mounts
    requestLocationPermission();
  }, []); // Request location on every mount

  const requestLocationPermission = () => {
    setIsLoadingLocation(true);
    setLocationError('');

    if (!navigator.geolocation) {
      // No geolocation support - default to Davao City
      const davaoCityCenter = { lat: 7.070136, lng: 125.608519 };
      setFormData(prev => ({
        ...prev,
        lat: davaoCityCenter.lat,
        lng: davaoCityCenter.lng,
        location: 'Davao City',
      }));
      
      if (onLocationChange) {
        onLocationChange(davaoCityCenter.lat, davaoCityCenter.lng);
      }
      
      setIsLoadingLocation(false);
      return;
    }

    // Request permission via geolocation API
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        // INSTANT: Update form data with actual user coordinates immediately
        setFormData(prev => ({
          ...prev,
          lat: latitude,
          lng: longitude,
          location: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`, // Show coordinates immediately
        }));

        // INSTANT: Notify parent component about location change (shows red pin immediately)
        if (onLocationChange) {
          onLocationChange(latitude, longitude);
        }

        // Stop loading state immediately
        setIsLoadingLocation(false);

        // BACKGROUND: Get address from coordinates using reverse geocoding (doesn't block UI)
        try {
          const address = await reverseGeocode(latitude, longitude);
          setFormData(prev => ({
            ...prev,
            location: address, // Update with human-readable address when ready
          }));
        } catch (error) {
          console.error('Error getting address:', error);
          // Keep showing coordinates if geocoding fails
        }
      },
      (error) => {
        // Handle geolocation errors - all errors default to Davao City
        console.warn('Geolocation error:', error.code, error.message);
        
        // Default to Davao City for all errors
        const davaoCityCenter = { lat: 7.070136, lng: 125.608519 };
        setFormData(prev => ({
          ...prev,
          lat: davaoCityCenter.lat,
          lng: davaoCityCenter.lng,
          location: 'Davao City',
        }));
        
        if (onLocationChange) {
          onLocationChange(davaoCityCenter.lat, davaoCityCenter.lng);
        }

        // Set appropriate error message based on error code
        // Error codes: 1 = PERMISSION_DENIED, 2 = POSITION_UNAVAILABLE, 3 = TIMEOUT
        const errorMessages: { [key: number]: string } = {
          1: 'Location access denied. Using Davao City as default.',
          2: 'Location unavailable. Using Davao City as default.',
          3: 'Location request timed out. Using Davao City as default.',
        };
        
        setLocationError(errorMessages[error.code] || 'Location error. Using Davao City as default.');
        setIsLoadingLocation(false);
      },
      {
        enableHighAccuracy: false, // Use WiFi/cellular for faster location (1-3 seconds vs 10-30 seconds with GPS)
        timeout: 5000, // Reduced timeout to 5 seconds
        maximumAge: 0 // ALWAYS get fresh location, never use cached position
      }
    );
  };

  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    // Using a public reverse geocoding API
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16`
      );
      const data = await response.json();
      
      // Extract relevant address components
      const address = data.address;
      const parts = [];
      
      if (address.suburb || address.neighbourhood) {
        parts.push(address.suburb || address.neighbourhood);
      }
      if (address.city || address.town || address.municipality) {
        parts.push(address.city || address.town || address.municipality);
      }
      
      return parts.join(', ') || data.display_name.split(',').slice(0, 2).join(',');
    } catch (error) {
      throw error;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.lat || !formData.lng) {
      setLocationError('Enable location first so we can place your weather pin.');
      return;
    }
    
    onSubmit(formData);
    // Reset form except location
    setFormData(prev => ({
      ...prev,
      notes: '',
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>) => {
    const newData = {
      ...formData,
      [e.target.name]: e.target.value,
    };
    
    // Reset smell to first option when condition changes
    if (e.target.name === 'condition') {
      const config = weatherSliderConfigs[e.target.value as keyof typeof weatherSliderConfigs];
      newData.smell = config.smellOptions[0];
    }
    
    setFormData(newData);
  };

  const handleSliderChange = (name: string, value: number) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const currentConfig = weatherSliderConfigs[formData.condition as keyof typeof weatherSliderConfigs];

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5">
      <h3 className="text-white text-base font-semibold mb-4 flex items-center gap-2">
        <Cloud size={18} />
        Submit Weather
      </h3>
      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Location Display */}
        <div>
          <label className="text-white/80 text-xs mb-1.5 block flex items-center gap-1.5">
            <MapPin size={14} />
            Location
          </label>
          <div className="flex flex-col gap-2">
            <input
              type="text"
              name="location"
              value={formData.location}
              readOnly
              placeholder="Detecting..."
              className="flex-1 bg-white/20 backdrop-blur-sm text-white text-sm placeholder-white/50 rounded-lg px-3 py-2 outline-none"
            />
            <button
              type="button"
              onClick={requestLocationPermission}
              disabled={isLoadingLocation}
              className="bg-white/30 hover:bg-white/40 backdrop-blur-sm text-white text-sm rounded-lg px-3 py-2 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoadingLocation ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <MapPin size={14} />
              )}
              {isLoadingLocation ? 'Detecting...' : 'Use my location'}
            </button>
          </div>
          {locationError && (
            <p className="text-red-300 text-xs mt-1">{locationError}</p>
          )}
          {formData.lat !== 0 && formData.lng !== 0 && (
            <p className="text-white/60 text-xs mt-1">
              {formData.lat.toFixed(5)}, {formData.lng.toFixed(5)}
            </p>
          )}
        </div>

        {/* Weather Condition */}
        <div>
          <label className="text-white/80 text-xs mb-1.5 block flex items-center gap-1.5">
            <Cloud size={14} />
            Weather
          </label>
          <select
            name="condition"
            value={formData.condition}
            onChange={handleChange}
            required
            className="w-full bg-white/20 backdrop-blur-sm text-white text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-white/50"
          >
            <option value="Sunny" className="bg-blue-600">☀️ Sunny</option>
            <option value="Cloudy" className="bg-blue-600">☁️ Cloudy</option>
            <option value="Rainy" className="bg-blue-600">🌧️ Rainy</option>
            <option value="Windy" className="bg-blue-600">🌬️ Windy</option>
            <option value="Storm" className="bg-blue-600">⛈️ Storm</option>
            <option value="Flooding" className="bg-blue-600">🌊 Flooding</option>
          </select>
        </div>

        {/* Dynamic Sliders based on Weather Condition */}
        {currentConfig.sliders.map((slider) => {
          const Icon = slider.icon;
          return (
            <div key={slider.name}>
              <label className="text-white/80 text-xs mb-1.5 block flex items-center gap-1.5">
                <Icon size={14} />
                {slider.label}
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={formData[slider.name as keyof WeatherData] as number}
                onChange={(e) => handleSliderChange(slider.name, parseInt(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="text-white/60 text-xs text-right mt-1">
                {slider.getLabel(formData[slider.name as keyof WeatherData] as number)}
              </div>
            </div>
          );
        })}

        {/* Smell Buttons - Dynamic based on condition */}
        <div>
          <label className="text-white/80 text-xs mb-1.5 block flex items-center gap-1.5">
            <Droplets size={14} />
            Smell
          </label>
          <div className="grid grid-cols-2 gap-2">
            {currentConfig.smellOptions.map((smell) => (
              <button
                key={smell}
                type="button"
                onClick={() => setFormData({ ...formData, smell })}
                className={`py-2 px-3 text-xs rounded-lg transition-all duration-200 ${
                  formData.smell === smell
                    ? 'bg-blue-500 text-white font-semibold'
                    : 'bg-white/20 text-white/70 hover:bg-white/30'
                }`}
              >
                {smell}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="text-white/80 text-xs mb-1.5 block flex items-center gap-1.5">
            <FileText size={14} />
            Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Add a note..."
            maxLength={120}
            rows={2}
            className="w-full bg-white/20 backdrop-blur-sm text-white text-sm placeholder-white/50 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-white/50 resize-none"
          />
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold text-sm rounded-lg px-4 py-2.5 transition-all duration-200"
          >
            Submit
          </button>
          <button
            type="button"
            onClick={() => setFormData({
              ...formData,
              condition: 'Sunny',
              notes: '',
              intensity: 50,
              visibility: 70,
              humidity: 65,
              windSpeed: 10,
              temperature: 50,
              smell: 'Fresh',
            })}
            className="flex-1 bg-white/20 hover:bg-white/30 text-white font-semibold text-sm rounded-lg px-4 py-2.5 transition-all duration-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}