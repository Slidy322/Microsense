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
  // Reference data for validation
  ref_condition?: string;
  ref_uv_index?: number;
  ref_temperature?: number;
  ref_humidity?: number;
  ref_visibility?: number;
  ref_smell?: string;
  enableValidation?: boolean;
}

interface WeatherSubmissionFormProps {
  onSubmit: (data: WeatherData) => void;
  onLocationChange?: (lat: number, lng: number) => void;
  onRecenterMap?: () => void;
}

// Define what inputs show for each weather condition
const weatherInputConfigs: Record<string, {
  inputs: Array<{
    name: string;
    label: string;
    icon: any;
    unit: string;
    min: number;
    max: number;
    step: number;
    placeholder: string;
  }>;
  smellOptions: string[];
}> = {
  Sunny: {
    inputs: [
      {
        name: 'intensity',
        label: 'UV Index / Sun Intensity',
        icon: Sun,
        unit: '',
        min: 0,
        max: 11,
        step: 1,
        placeholder: 'e.g., 7'
      },
      {
        name: 'temperature',
        label: 'Temperature Feel',
        icon: Thermometer,
        unit: '°C',
        min: 20,
        max: 45,
        step: 0.1,
        placeholder: 'e.g., 31.5'
      },
      {
        name: 'humidity',
        label: 'Humidity',
        icon: Droplets,
        unit: '%',
        min: 0,
        max: 100,
        step: 1,
        placeholder: 'e.g., 65'
      },
      {
        name: 'visibility',
        label: 'Visibility',
        icon: Eye,
        unit: 'km',
        min: 0,
        max: 10,
        step: 0.1,
        placeholder: 'e.g., 7.5'
      }
    ],
    smellOptions: ['Fresh', 'Neutral', 'Dusty', 'Hot Air']
  },
  Cloudy: {
    inputs: [
      {
        name: 'intensity',
        label: 'Cloud Coverage',
        icon: Cloud,
        unit: '%',
        min: 0,
        max: 100,
        step: 1,
        placeholder: 'e.g., 75'
      },
      {
        name: 'humidity',
        label: 'Humidity',
        icon: Droplets,
        unit: '%',
        min: 0,
        max: 100,
        step: 1,
        placeholder: 'e.g., 70'
      },
      {
        name: 'temperature',
        label: 'Temperature Feel',
        icon: Thermometer,
        unit: '°C',
        min: 20,
        max: 40,
        step: 0.1,
        placeholder: 'e.g., 28.5'
      },
      {
        name: 'visibility',
        label: 'Visibility',
        icon: Eye,
        unit: 'km',
        min: 0,
        max: 10,
        step: 0.1,
        placeholder: 'e.g., 5.0'
      }
    ],
    smellOptions: ['Fresh', 'Neutral', 'Damp', 'Earthy']
  },
  Rainy: {
    inputs: [
      {
        name: 'intensity',
        label: 'Rainfall Intensity',
        icon: Droplets,
        unit: 'mm/h',
        min: 0,
        max: 50,
        step: 0.1,
        placeholder: 'e.g., 7.5'
      },
      {
        name: 'visibility',
        label: 'Visibility',
        icon: Eye,
        unit: 'km',
        min: 0,
        max: 5,
        step: 0.1,
        placeholder: 'e.g., 2.5'
      },
      {
        name: 'humidity',
        label: 'Humidity',
        icon: Droplets,
        unit: '%',
        min: 70,
        max: 100,
        step: 1,
        placeholder: 'e.g., 85'
      },
      {
        name: 'windSpeed',
        label: 'Wind with Rain',
        icon: Wind,
        unit: 'km/h',
        min: 0,
        max: 40,
        step: 1,
        placeholder: 'e.g., 15'
      }
    ],
    smellOptions: ['Fresh Rain', 'Wet Earth', 'Neutral', 'Damp']
  },
  Windy: {
    inputs: [
      {
        name: 'windSpeed',
        label: 'Wind Speed',
        icon: Wind,
        unit: 'km/h',
        min: 0,
        max: 60,
        step: 1,
        placeholder: 'e.g., 35'
      },
      {
        name: 'intensity',
        label: 'Gust Intensity',
        icon: Gauge,
        unit: '',
        min: 0,
        max: 100,
        step: 1,
        placeholder: 'e.g., 65'
      },
      {
        name: 'visibility',
        label: 'Visibility (Dust/Debris)',
        icon: Eye,
        unit: 'km',
        min: 0,
        max: 8,
        step: 0.1,
        placeholder: 'e.g., 4.5'
      },
      {
        name: 'temperature',
        label: 'Wind Chill Feel',
        icon: Thermometer,
        unit: '°C',
        min: 20,
        max: 35,
        step: 0.1,
        placeholder: 'e.g., 26.0'
      }
    ],
    smellOptions: ['Fresh', 'Neutral', 'Dusty', 'Salty Air']
  },
  Storm: {
    inputs: [
      {
        name: 'intensity',
        label: 'Storm Intensity',
        icon: Zap,
        unit: '',
        min: 0,
        max: 100,
        step: 1,
        placeholder: 'e.g., 80'
      },
      {
        name: 'windSpeed',
        label: 'Wind Speed',
        icon: Wind,
        unit: 'km/h',
        min: 20,
        max: 100,
        step: 1,
        placeholder: 'e.g., 65'
      },
      {
        name: 'visibility',
        label: 'Visibility',
        icon: Eye,
        unit: 'km',
        min: 0,
        max: 3,
        step: 0.1,
        placeholder: 'e.g., 1.5'
      },
      {
        name: 'humidity',
        label: 'Rainfall Intensity',
        icon: Droplets,
        unit: '',
        min: 0,
        max: 100,
        step: 1,
        placeholder: 'e.g., 85'
      }
    ],
    smellOptions: ['Wet Earth', 'Ozone', 'Fresh Rain', 'Metallic']
  },
  Flooding: {
    inputs: [
      {
        name: 'intensity',
        label: 'Water Level (cm)',
        icon: Waves,
        unit: 'cm',
        min: 0,
        max: 150,
        step: 1,
        placeholder: 'e.g., 40'
      },
      {
        name: 'windSpeed',
        label: 'Water Flow Speed',
        icon: Gauge,
        unit: '',
        min: 0,
        max: 100,
        step: 1,
        placeholder: 'e.g., 50'
      },
      {
        name: 'visibility',
        label: 'Visibility in Area',
        icon: Eye,
        unit: 'km',
        min: 0,
        max: 4,
        step: 0.1,
        placeholder: 'e.g., 2.0'
      },
      {
        name: 'humidity',
        label: 'Area Affected',
        icon: Cloud,
        unit: '',
        min: 0,
        max: 100,
        step: 1,
        placeholder: 'e.g., 70'
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
    intensity: 7,
    visibility: 7.5,
    humidity: 65,
    windSpeed: 15,
    temperature: 31.5,
    smell: 'Fresh',
    enableValidation: false,
  });
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [locationError, setLocationError] = useState('');

  useEffect(() => {
    // Automatically request location permission EVERY TIME component mounts
    requestLocationPermission();
  }, []); // Request location on every mount

  const requestLocationPermission = () => {
    console.log('🔍 requestLocationPermission called');
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
          console.log('📤 Sending location to parent:', latitude, longitude);
          onLocationChange(latitude, longitude);
        } else {
          console.warn('⚠️ onLocationChange callback is not provided!');
        }

        // Stop loading state immediately
        setIsLoadingLocation(false);
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
      const config = weatherInputConfigs[e.target.value as keyof typeof weatherInputConfigs];
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

  const currentConfig = weatherInputConfigs[formData.condition as keyof typeof weatherInputConfigs];

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

        {/* Dynamic Input Fields based on Weather Condition */}
        {currentConfig.inputs.map((input) => {
          const Icon = input.icon;
          return (
            <div key={input.name}>
              <label className="text-white/80 text-xs mb-1.5 block flex items-center gap-1.5">
                <Icon size={14} />
                {input.label}
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={input.min}
                  max={input.max}
                  step={input.step}
                  value={formData[input.name as keyof WeatherData] as number || ''}
                  onChange={(e) => handleSliderChange(input.name, parseFloat(e.target.value) || 0)}
                  placeholder={input.placeholder}
                  className="w-full bg-white/20 backdrop-blur-sm text-white text-sm placeholder-white/50 rounded-lg px-3 py-2 pr-12 outline-none focus:ring-2 focus:ring-white/50"
                />
                {input.unit && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 text-xs">
                    {input.unit}
                  </span>
                )}
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

        {/* Validation Mode Toggle */}
        <div className="border-t border-white/20 pt-3">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.enableValidation || false}
              onChange={(e) => setFormData({ ...formData, enableValidation: e.target.checked })}
              className="w-4 h-4 rounded bg-white/20 border-white/30 text-blue-500 focus:ring-2 focus:ring-white/50"
            />
            <span className="text-white/90 text-sm font-medium">Enable Validation Mode</span>
          </label>
          <p className="text-white/60 text-xs mt-1 ml-6">
            Add reference data to compare accuracy
          </p>
        </div>

        {/* Reference Data Fields (shown when validation mode is enabled) */}
        {formData.enableValidation && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 space-y-3">
            <h4 className="text-yellow-300 text-xs font-semibold uppercase tracking-wide">Reference Data</h4>
            
            {/* Reference Weather Condition */}
            <div>
              <label className="text-white/80 text-xs mb-1 block">Reference Weather</label>
              <select
                value={formData.ref_condition || ''}
                onChange={(e) => setFormData({ ...formData, ref_condition: e.target.value })}
                className="w-full bg-white/20 backdrop-blur-sm text-white text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-yellow-500/50"
                style={{ color: 'white' }}
              >
                <option value="" style={{ color: 'black', backgroundColor: 'white' }}>Select...</option>
                <option value="Sunny" style={{ color: 'black', backgroundColor: 'white' }}>Sunny</option>
                <option value="Cloudy" style={{ color: 'black', backgroundColor: 'white' }}>Cloudy</option>
                <option value="Rainy" style={{ color: 'black', backgroundColor: 'white' }}>Rainy</option>
                <option value="Stormy" style={{ color: 'black', backgroundColor: 'white' }}>Stormy</option>
                <option value="Foggy" style={{ color: 'black', backgroundColor: 'white' }}>Foggy</option>
                <option value="Flood" style={{ color: 'black', backgroundColor: 'white' }}>Flood</option>
              </select>
            </div>

            {/* Reference UV Index */}
            <div>
              <label className="text-white/80 text-xs mb-1 block">Reference UV Index (0-11)</label>
              <input
                type="number"
                min="0"
                max="11"
                value={formData.ref_uv_index || ''}
                onChange={(e) => setFormData({ ...formData, ref_uv_index: parseInt(e.target.value) || undefined })}
                placeholder="e.g., 7"
                className="w-full bg-white/20 backdrop-blur-sm text-white text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-yellow-500/50"
              />
            </div>

            {/* Reference Temperature */}
            <div>
              <label className="text-white/80 text-xs mb-1 block">Reference Temperature (°C)</label>
              <input
                type="number"
                step="0.1"
                value={formData.ref_temperature || ''}
                onChange={(e) => setFormData({ ...formData, ref_temperature: parseFloat(e.target.value) || undefined })}
                placeholder="e.g., 31.5"
                className="w-full bg-white/20 backdrop-blur-sm text-white text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-yellow-500/50"
              />
            </div>

            {/* Reference Humidity */}
            <div>
              <label className="text-white/80 text-xs mb-1 block">Reference Humidity (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.ref_humidity || ''}
                onChange={(e) => setFormData({ ...formData, ref_humidity: parseInt(e.target.value) || undefined })}
                placeholder="e.g., 65"
                className="w-full bg-white/20 backdrop-blur-sm text-white text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-yellow-500/50"
              />
            </div>

            {/* Reference Visibility */}
            <div>
              <label className="text-white/80 text-xs mb-1 block">Reference Visibility (km)</label>
              <input
                type="number"
                step="0.1"
                value={formData.ref_visibility || ''}
                onChange={(e) => setFormData({ ...formData, ref_visibility: parseFloat(e.target.value) || undefined })}
                placeholder="e.g., 7.5"
                className="w-full bg-white/20 backdrop-blur-sm text-white text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-yellow-500/50"
              />
            </div>

            {/* Reference Smell */}
            <div>
              <label className="text-white/80 text-xs mb-1 block">Reference Smell</label>
              <input
                type="text"
                value={formData.ref_smell || ''}
                onChange={(e) => setFormData({ ...formData, ref_smell: e.target.value })}
                placeholder="e.g., Fresh"
                className="w-full bg-white/20 backdrop-blur-sm text-white text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-yellow-500/50"
              />
            </div>
          </div>
        )}

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
              intensity: 7,
              visibility: 7.5,
              humidity: 65,
              windSpeed: 15,
              temperature: 31.5,
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