import { Clock, MapPin, FileText, History } from 'lucide-react';

interface WeatherReport {
  id: number;
  location: string;
  condition: string;
  note: string | null;
  created_at: string;
  lat: number;
  lng: number;
}

interface UserHistoryProps {
  userReports: WeatherReport[];
}

export function UserHistory({ userReports }: UserHistoryProps) {
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

  const formatDateTime = (iso: string) => {
    const date = new Date(iso);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
        <h2 className="text-white text-2xl font-bold mb-2 flex items-center gap-3">
          <History size={28} />
          Your Weather Reports
        </h2>
        <p className="text-white/70 mb-6">
          View all your past weather submissions ({userReports.length} total)
        </p>

        <div className="space-y-4">
          {userReports.length === 0 ? (
            <div className="text-center text-white/60 py-12">
              <History size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg">No reports yet</p>
              <p className="text-sm mt-2">Start submitting weather data to build your history!</p>
            </div>
          ) : (
            userReports.map((report) => (
              <div
                key={report.id}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-5 hover:bg-white/15 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin size={18} className="text-white/70" />
                    <span className="text-white font-semibold text-lg">{report.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white/60 text-sm">
                    <Clock size={16} />
                    <span>{formatDateTime(report.created_at)}</span>
                  </div>
                </div>

                <div className="flex items-center gap-4 mb-3">
                  <span className="text-4xl">{getConditionIcon(report.condition)}</span>
                  <div>
                    <p className="text-white text-xl">
                      {report.condition}
                    </p>
                    <p className="text-white/60 text-sm">
                      {report.lat.toFixed(4)}, {report.lng.toFixed(4)}
                    </p>
                  </div>
                </div>

                {report.note && (
                  <div className="bg-white/10 rounded-lg p-3 mt-3">
                    <div className="flex items-start gap-2 text-white/80">
                      <FileText size={16} className="mt-0.5 flex-shrink-0" />
                      <p className="text-sm italic">"{report.note}"</p>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}