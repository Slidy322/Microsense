import { Settings as SettingsIcon, LogOut, User, Bell, MapPin, Info } from 'lucide-react';

interface SettingsProps {
  user: {
    email?: string;
  } | null;
  onLogout: () => void;
}

export function Settings({ user, onLogout }: SettingsProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
        <h2 className="text-white text-2xl font-bold mb-2 flex items-center gap-3">
          <SettingsIcon size={28} />
          Settings
        </h2>
        <p className="text-white/70 mb-6">
          Manage your account and preferences
        </p>

        {/* Account Section */}
        <div className="space-y-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
            <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
              <User size={20} />
              Account
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/90">Email</p>
                  <p className="text-white/60 text-sm">{user?.email || 'Not connected'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
            <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
              <Bell size={20} />
              Notifications
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white/90">Weather Alerts</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-white/90">Community Reports</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
            <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
              <MapPin size={20} />
              Location Settings
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-white/90">Auto-detect Location</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                </label>
              </div>
              <p className="text-white/60 text-sm">
                Allow the app to automatically detect your location for weather reports
              </p>
            </div>
          </div>

          {/* About */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-5">
            <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
              <Info size={20} />
              About
            </h3>
            <div className="space-y-2 text-white/80 text-sm">
              <p><strong>Version:</strong> 1.0.0</p>
              <p><strong>Location:</strong> Davao City, Philippines</p>
              <p className="text-white/60 mt-3">
                MICROSENSE is a community-powered platform for sharing hyperlocal weather conditions.
              </p>
            </div>
          </div>

          {/* Logout Button */}
          <button
            onClick={onLogout}
            className="w-full bg-red-500/30 hover:bg-red-500/40 backdrop-blur-sm text-white font-semibold rounded-xl px-6 py-4 transition-all duration-200 flex items-center justify-center gap-3"
          >
            <LogOut size={20} />
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}