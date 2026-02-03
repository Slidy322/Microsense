import { Cloud, CloudRain, Sun, CloudDrizzle } from 'lucide-react';

interface HourlyItem {
  time: string;
  temp: number;
  icon: React.ReactNode;
}

export function HourlyForecast() {
  const hourlyData: HourlyItem[] = [
    { time: '12 PM', temp: 22, icon: <Sun size={24} /> },
    { time: '1 PM', temp: 23, icon: <Sun size={24} /> },
    { time: '2 PM', temp: 24, icon: <Cloud size={24} /> },
    { time: '3 PM', temp: 23, icon: <CloudDrizzle size={24} /> },
    { time: '4 PM', temp: 21, icon: <CloudRain size={24} /> },
    { time: '5 PM', temp: 20, icon: <CloudRain size={24} /> },
    { time: '6 PM', temp: 19, icon: <Cloud size={24} /> },
    { time: '7 PM', temp: 18, icon: <Cloud size={24} /> },
  ];

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
      <h3 className="text-white text-lg font-semibold mb-4">Hourly Forecast</h3>
      <div className="flex gap-6 overflow-x-auto pb-2 scrollbar-hide">
        {hourlyData.map((hour, index) => (
          <div key={index} className="flex flex-col items-center gap-2 min-w-[60px]">
            <p className="text-white/70 text-sm">{hour.time}</p>
            <div className="text-white">{hour.icon}</div>
            <p className="text-white font-semibold">{hour.temp}°</p>
          </div>
        ))}
      </div>
    </div>
  );
}
