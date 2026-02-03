import { Clock, MapPin, Cloud } from 'lucide-react';

interface WeatherReport {
  id: number;
  location: string;
  condition: string;
  note: string | null;
  created_at: string;
}

interface UserWeatherReportsProps {
  reports: WeatherReport[];
}

export function UserWeatherReports({ reports }: UserWeatherReportsProps) {
  const getConditionIcon = (condition: string) => {
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

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
      <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
        <Cloud size={20} />
        Recent Community Reports ({reports.length})
      </h3>
      <div className="space-y-3 max-h-[500px] overflow-y-auto">
        {reports.length === 0 ? (
          <div className="text-center text-white/60 py-8">
            <p>No weather reports yet.</p>
            <p className="text-sm mt-2">Be the first to submit local weather data!</p>
          </div>
        ) : (
          reports.map((report) => (
            <div
              key={report.id}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/15 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-white/70" />
                  <span className="text-white font-semibold">{report.location}</span>
                </div>
                <div className="flex items-center gap-2 text-white/60 text-sm">
                  <Clock size={14} />
                  <span>{timeAgo(report.created_at)}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{getConditionIcon(report.condition)}</span>
                <span className="text-white text-lg">
                  {report.condition}
                </span>
              </div>

              {report.note && (
                <p className="text-white/70 text-sm mt-2 italic">
                  "{report.note}"
                </p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}