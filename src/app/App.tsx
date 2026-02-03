import { useState, useEffect, useRef } from 'react';
import { Cloud, Info, Home, History, Settings as SettingsIcon, BarChart3 } from 'lucide-react';
import { WeatherSubmissionForm } from '@/app/components/WeatherSubmissionForm';
import { GoogleMap, GoogleMapRef } from '@/app/components/GoogleMap';
import { UserWeatherReports } from '@/app/components/UserWeatherReports';
import { UserHistory } from '@/app/components/UserHistory';
import { Settings } from '@/app/components/Settings';
import { Dashboard } from '@/app/components/Dashboard';
import { LoginForm } from '@/app/components/LoginForm';
import { ImageWithFallback } from '@/app/components/figma/ImageWithFallback';
import { loadReports, loadUserReports, postReport, WeatherReport as SupabaseWeatherReport } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

interface WeatherReport extends SupabaseWeatherReport {
  location: string;
}

type TabType = 'home' | 'dashboard' | 'history' | 'settings';

export default function App() {
  const { user, loading, signIn, signUp, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [weatherReports, setWeatherReports] = useState<WeatherReport[]>([]);
  const [userReports, setUserReports] = useState<WeatherReport[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [statusMessage, setStatusMessage] = useState('Loading reports...');

  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16`
      );
      const data = await response.json();
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

  const fetchReports = async () => {
    try {
      const reports = await loadReports();
      
      // Add location info to each report using reverse geocoding
      const reportsWithLocation = await Promise.all(
        reports.map(async (report) => {
          try {
            const location = await reverseGeocode(report.lat, report.lng);
            return { ...report, location };
          } catch {
            return { 
              ...report, 
              location: `${report.lat.toFixed(4)}, ${report.lng.toFixed(4)}` 
            };
          }
        })
      );

      setWeatherReports(reportsWithLocation);
      setStatusMessage(`${reportsWithLocation.length} reports loaded`);
    } catch (error) {
      console.error('Failed to load reports:', error);
      setStatusMessage('Failed to load reports');
    }
  };

  const fetchUserReports = async () => {
    if (!user?.id) return;
    
    try {
      const reports = await loadUserReports(user.id);
      
      // Add location info to each report using reverse geocoding
      const reportsWithLocation = await Promise.all(
        reports.map(async (report) => {
          try {
            const location = await reverseGeocode(report.lat, report.lng);
            return { ...report, location };
          } catch {
            return { 
              ...report, 
              location: `${report.lat.toFixed(4)}, ${report.lng.toFixed(4)}` 
            };
          }
        })
      );

      setUserReports(reportsWithLocation);
    } catch (error) {
      console.error('Failed to load user reports:', error);
    }
  };

  // Load reports on mount and every 30 seconds
  useEffect(() => {
    if (user) {
      fetchReports();
      const interval = setInterval(fetchReports, 30000);
      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Load user reports on mount
  useEffect(() => {
    if (user) {
      fetchUserReports();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
        <div className="text-center text-white">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!user) {
    return <LoginForm onLogin={signIn} onSignup={signUp} />;
  }

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Failed to logout:', error);
      alert('Failed to logout');
    }
  };

  const handleWeatherSubmit = async (data: any) => {
    try {
      setStatusMessage('Posting update...');
      
      await postReport({
        lat: data.lat,
        lng: data.lng,
        condition: data.condition,
        note: data.notes.trim() || null,
      });

      setStatusMessage('Posted! Loading updates…');
      
      // Reload reports
      await fetchReports();
      await fetchUserReports();
    } catch (error) {
      console.error('Failed to post report:', error);
      setStatusMessage('Failed to post. Check console.');
      alert('Failed to post. Check console + Supabase policies.');
    }
  };

  const handleLocationChange = (lat: number, lng: number) => {
    setUserLocation({ lat, lng });
  };

  // Prepare markers for map
  const mapMarkers = weatherReports.map(report => ({
    id: report.id,
    lat: report.lat,
    lng: report.lng,
    location: report.location,
    condition: report.condition,
    note: report.note,
    created_at: report.created_at,
  }));

  const tabs = [
    { id: 'home' as TabType, label: 'Home', icon: Home },
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: BarChart3 },
    { id: 'history' as TabType, label: 'History', icon: History },
    { id: 'settings' as TabType, label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1767692965437-cbc92297bb88?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxibHVlJTIwc2t5JTIwY2xvdWRzJTIwd2VhdGhlcnxlbnwxfHx8fDE3NzAwOTIxOTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Weather background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/40 via-blue-600/50 to-purple-600/60"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mb-6">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2 flex items-center gap-3">
                  <Cloud size={36} />
                  MICROSENSE
                </h1>
                <p className="text-white/80">
                  Community-powered local weather monitoring
                </p>
              </div>
              <div className="text-white/80 text-sm">
                {statusMessage}
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2 mb-6">
            <div className="flex gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                      activeTab === tab.id
                        ? 'bg-white/30 text-white'
                        : 'text-white/70 hover:bg-white/10'
                    }`}
                  >
                    <Icon size={20} />
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'home' && (
            <>
              {/* Info Banner */}
              <div className="bg-blue-500/20 backdrop-blur-md rounded-xl p-4 mb-6 flex items-start gap-3">
                <Info size={20} className="text-white/90 flex-shrink-0 mt-0.5" />
                <p className="text-white/90 text-sm">
                  Your location is automatically detected! Select weather condition and add notes to help your community.
                </p>
              </div>

              {/* Main Grid Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Right Column - Google Maps (First on mobile, right on desktop) */}
                <div className="lg:col-span-3 order-1 lg:order-2">
                  <GoogleMap 
                    apiKey="AIzaSyCCv3fMlFc7PxJXR4Y65zJTsxPbWxnpc8I"
                    userLat={userLocation?.lat}
                    userLng={userLocation?.lng}
                    markers={mapMarkers}
                  />
                </div>

                {/* Left Column - Weather Submission Form (Second on mobile, left on desktop) */}
                <div className="lg:col-span-1 order-2 lg:order-1">
                  <WeatherSubmissionForm 
                    onSubmit={handleWeatherSubmit} 
                    onLocationChange={handleLocationChange}
                  />
                </div>
              </div>

              {/* Bottom Section - Community Reports */}
              <div className="mt-6">
                <UserWeatherReports reports={weatherReports} />
              </div>
            </>
          )}

          {activeTab === 'dashboard' && (
            <Dashboard reports={weatherReports} />
          )}

          {activeTab === 'history' && (
            <UserHistory userReports={userReports} />
          )}

          {activeTab === 'settings' && (
            <Settings user={user} onLogout={handleLogout} />
          )}
        </div>
      </div>
    </div>
  );
}