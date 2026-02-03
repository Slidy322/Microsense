import { Cloud, CloudRain, Sun, CloudDrizzle, CloudSnow } from 'lucide-react';

interface DailyItem {
  day: string;
  icon: React.ReactNode;
  high: number;
  low: number;
}

export function DailyForecast() {
  const dailyData: DailyItem[] = [
    { day: 'Monday', icon: <Sun size={24} />, high: 24, low: 18 },
    { day: 'Tuesday', icon: <Cloud size={24} />, high: 22, low: 16 },
    { day: 'Wednesday', icon: <CloudDrizzle size={24} />, high: 20, low: 15 },
    { day: 'Thursday', icon: <CloudRain size={24} />, high: 19, low: 14 },
    { day: 'Friday', icon: <Cloud size={24} />, high: 21, low: 15 },
    { day: 'Saturday', icon: <Sun size={24} />, high: 23, low: 17 },
    { day: 'Sunday', icon: <CloudSnow size={24} />, high: 18, low: 12 },
  ];

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
      <h3 className="text-white text-lg font-semibold mb-4">7-Day Forecast</h3>
      <div className="flex flex-col gap-3">
        {dailyData.map((day, index) => (
          <div key={index} className="flex items-center justify-between">
            <p className="text-white/90 w-24">{day.day}</p>
            <div className="flex items-center gap-4 flex-1 justify-end">
              <div className="text-white/80">{day.icon}</div>
              <div className="flex gap-3 w-20 justify-end">
                <span className="text-white font-semibold">{day.high}°</span>
                <span className="text-white/50">{day.low}°</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
