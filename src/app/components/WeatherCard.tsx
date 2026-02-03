import { Cloud, Droplets, Wind, Eye, Gauge } from 'lucide-react';

interface WeatherCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

export function WeatherCard({ icon, label, value }: WeatherCardProps) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 flex flex-col items-center justify-center gap-2">
      <div className="text-white/70">{icon}</div>
      <p className="text-white/60 text-sm">{label}</p>
      <p className="text-white text-xl font-semibold">{value}</p>
    </div>
  );
}

export function WeatherDetails() {
  const details = [
    { icon: <Droplets size={24} />, label: 'Humidity', value: '68%' },
    { icon: <Wind size={24} />, label: 'Wind Speed', value: '12 km/h' },
    { icon: <Eye size={24} />, label: 'Visibility', value: '10 km' },
    { icon: <Gauge size={24} />, label: 'Pressure', value: '1013 hPa' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {details.map((detail, index) => (
        <WeatherCard key={index} {...detail} />
      ))}
    </div>
  );
}
