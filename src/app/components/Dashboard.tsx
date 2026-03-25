import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { CheckCircle, AlertCircle, TrendingUp, Activity } from 'lucide-react';

interface WeatherReport {
  id: string;
  condition: string;
  created_at: string;
  visibility?: number;
  note?: string | null;
  uv_index?: number;
  temperature?: number;
  humidity?: number;
  smell?: string;
}

interface DashboardProps {
  reports: WeatherReport[];
}

export function Dashboard({ reports }: DashboardProps) {
  // Get last 7 days of reports
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date.toISOString().split('T')[0];
  });

  // Count reports by condition for last 7 days
  const weatherData = last7Days.map(date => {
    const dayReports = reports.filter(r => r.created_at?.startsWith(date));
    const conditions = {
      Sunny: 0,
      Rainy: 0,
      Cloudy: 0,
      Storm: 0,
      Windy: 0,
      Flooding: 0,
    };

    dayReports.forEach(r => {
      const condition = r.condition;
      if (condition in conditions) {
        conditions[condition as keyof typeof conditions]++;
      }
    });

    const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
    const totalReports = Object.values(conditions).reduce((a, b) => a + b, 0);
    
    return {
      day: dayName,
      date: date,
      total: totalReports,
      ...conditions,
    };
  });

  // Get weather icon for each condition
  const weatherIcons: Record<string, string> = {
    Sunny: '☀️',
    Rainy: '🌧️',
    Cloudy: '☁️',
    Storm: '⛈️',
    Windy: '🌬️',
    Flooding: '🌊',
  };

  // Calculate actual weather distribution from all reports
  const conditionCounts: Record<string, number> = {
    Sunny: 0,
    Cloudy: 0,
    Rainy: 0,
    Windy: 0,
    Storm: 0,
    Flooding: 0,
  };

  reports.forEach(r => {
    if (r.condition in conditionCounts) {
      conditionCounts[r.condition]++;
    }
  });

  const totalReports = Object.values(conditionCounts).reduce((a, b) => a + b, 0);
  
  // Prepare pie chart data for overall distribution
  const distributionData = Object.entries(conditionCounts)
    .filter(([_, count]) => count > 0)
    .map(([condition, count]) => ({
      name: condition,
      value: count,
      percentage: ((count / totalReports) * 100).toFixed(1),
    }));

  const COLORS = {
    Sunny: '#FCD34D',
    Cloudy: '#94A3B8',
    Rainy: '#3B82F6',
    Storm: '#6366F1',
    Windy: '#8B5CF6',
    Flooding: '#06B6D4',
  };

  // Report activity trend (reports per day)
  const activityTrend = last7Days.map((date, i) => {
    const dayReports = reports.filter(r => r.created_at?.startsWith(date));
    return {
      day: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
      reports: dayReports.length,
      // Calculate moving average
      avgReports: i >= 2 ? Math.round(
        weatherData.slice(Math.max(0, i - 2), i + 1).reduce((sum, d) => sum + d.total, 0) / 3
      ) : dayReports.length,
    };
  });

  // Report summary for today
  const today = new Date().toISOString().split('T')[0];
  const todayReports = reports.filter(r => r.created_at?.startsWith(today));
  const reportsToday = todayReports.length;

  // Count conditions today
  const todayConditionCounts: Record<string, number> = {};
  todayReports.forEach(r => {
    todayConditionCounts[r.condition] = (todayConditionCounts[r.condition] || 0) + 1;
  });

  const conditionSummary = Object.entries(todayConditionCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([condition, count]) => `${count} ${condition}`)
    .join(', ') || 'No reports yet';

  // Calculate alert metrics
  const last24Hours = reports.filter(r => {
    const reportTime = new Date(r.created_at).getTime();
    const now = Date.now();
    return (now - reportTime) < 24 * 60 * 60 * 1000;
  });

  const severeWeatherCount = last24Hours.filter(r => 
    r.condition === 'Storm' || r.condition === 'Flooding'
  ).length;

  const lowVisibilityCount = todayReports.filter(r => 
    r.visibility && r.visibility < 30
  ).length;

  // Most active reporting hour
  const hourCounts: Record<number, number> = {};
  reports.forEach(r => {
    const hour = new Date(r.created_at).getHours();
    hourCounts[hour] = (hourCounts[hour] || 0) + 1;
  });
  
  const mostActiveHour = Object.entries(hourCounts)
    .sort((a, b) => b[1] - a[1])[0];
  
  const peakHour = mostActiveHour 
    ? `${mostActiveHour[0].padStart(2, '0')}:00 (${mostActiveHour[1]} reports)`
    : 'N/A';

  // Calculate average weather data across all submissions
  const reportsWithData = reports.filter(r => 
    r.condition || r.uv_index || r.temperature || r.humidity || r.visibility || r.smell
  );

  // Get most common weather condition
  const mostCommonCondition = Object.entries(conditionCounts)
    .sort((a, b) => b[1] - a[1])[0];

  // Calculate UV Intensity distribution (most common)
  const uvCounts: Record<string, number> = {};
  reportsWithData.forEach(r => {
    if (r.uv_index !== undefined) {
      const uvLevel = r.uv_index;
      uvCounts[uvLevel] = (uvCounts[uvLevel] || 0) + 1;
    }
  });
  const mostCommonUV = Object.entries(uvCounts)
    .sort((a, b) => b[1] - a[1])[0];

  // Calculate averages for numeric fields
  const temperatures = reportsWithData.filter(r => r.temperature !== undefined).map(r => r.temperature!);
  const avgTemperature = temperatures.length > 0 
    ? (temperatures.reduce((a, b) => a + b, 0) / temperatures.length).toFixed(1)
    : 'N/A';

  const humidities = reportsWithData.filter(r => r.humidity !== undefined).map(r => r.humidity!);
  const avgHumidity = humidities.length > 0 
    ? (humidities.reduce((a, b) => a + b, 0) / humidities.length).toFixed(1)
    : 'N/A';

  const visibilities = reportsWithData.filter(r => r.visibility !== undefined).map(r => r.visibility!);
  const avgVisibility = visibilities.length > 0 
    ? (visibilities.reduce((a, b) => a + b, 0) / visibilities.length).toFixed(1)
    : 'N/A';

  // Calculate most common smell
  const smellCounts: Record<string, number> = {};
  reportsWithData.forEach(r => {
    if (r.smell) {
      smellCounts[r.smell] = (smellCounts[r.smell] || 0) + 1;
    }
  });
  const mostCommonSmell = Object.entries(smellCounts)
    .sort((a, b) => b[1] - a[1])[0];

  // Prepare data for average weather chart
  const averageWeatherData = [
    {
      variable: 'Weather',
      value: mostCommonCondition ? mostCommonCondition[0] : 'N/A',
      displayValue: mostCommonCondition ? `${mostCommonCondition[0]} (${mostCommonCondition[1]})` : 'N/A',
    },
    {
      variable: 'UV Intensity',
      value: mostCommonUV ? mostCommonUV[0] : 'N/A',
      displayValue: mostCommonUV ? `Level ${mostCommonUV[0]} (${mostCommonUV[1]})` : 'N/A',
    },
    {
      variable: 'Temperature',
      value: avgTemperature,
      displayValue: avgTemperature !== 'N/A' ? `${avgTemperature}°C` : 'N/A',
    },
    {
      variable: 'Humidity',
      value: avgHumidity,
      displayValue: avgHumidity !== 'N/A' ? `${avgHumidity}%` : 'N/A',
    },
    {
      variable: 'Visibility',
      value: avgVisibility,
      displayValue: avgVisibility !== 'N/A' ? `${avgVisibility} km` : 'N/A',
    },
    {
      variable: 'Smell',
      value: mostCommonSmell ? mostCommonSmell[0] : 'N/A',
      displayValue: mostCommonSmell ? `${mostCommonSmell[0]} (${mostCommonSmell[1]})` : 'N/A',
    },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white mb-4">Dashboard Analytics</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Total Reports</p>
              <p className="text-white text-3xl font-bold">{totalReports}</p>
            </div>
            <Activity className="text-blue-400" size={32} />
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Reports Today</p>
              <p className="text-white text-3xl font-bold">{reportsToday}</p>
            </div>
            <TrendingUp className="text-green-400" size={32} />
          </div>
        </div>
        
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/70 text-sm">Severe Weather (24h)</p>
              <p className="text-white text-3xl font-bold">{severeWeatherCount}</p>
            </div>
            {severeWeatherCount > 0 ? (
              <AlertCircle className="text-red-400" size={32} />
            ) : (
              <CheckCircle className="text-green-400" size={32} />
            )}
          </div>
        </div>
      </div>

      {/* Average Weather Data - FIRST CHART */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-4">Average Weather Data Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {averageWeatherData.map((item, index) => (
            <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-white/10">
              <p className="text-white/60 text-xs uppercase tracking-wide mb-2">{item.variable}</p>
              <p className="text-white text-xl font-bold">{item.displayValue}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Weather Reports Last 7 Days */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-4">Weather Reports - Last 7 Days</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={weatherData} margin={{ left: 40, right: 10, top: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="day" 
              stroke="rgba(255,255,255,0.7)"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="rgba(255,255,255,0.7)"
              style={{ fontSize: '12px' }}
              label={{ 
                value: 'Number of Reports', 
                angle: -90, 
                position: 'insideLeft', 
                fill: 'rgba(255,255,255,0.7)',
                style: { textAnchor: 'middle' }
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(30, 41, 59, 0.95)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
              }}
              formatter={(value: any) => [`${value} reports`, '']}
            />
            <Legend 
              wrapperStyle={{ color: 'white', paddingTop: '10px' }}
            />
            <Bar dataKey="Sunny" stackId="a" fill="#FCD34D" name="☀️ Sunny" />
            <Bar dataKey="Cloudy" stackId="a" fill="#94A3B8" name="☁️ Cloudy" />
            <Bar dataKey="Rainy" stackId="a" fill="#3B82F6" name="🌧️ Rainy" />
            <Bar dataKey="Windy" stackId="a" fill="#8B5CF6" name="🌬️ Windy" />
            <Bar dataKey="Storm" stackId="a" fill="#6366F1" name="⛈️ Storm" />
            <Bar dataKey="Flooding" stackId="a" fill="#06B6D4" name="🌊 Flooding" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Activity Trend */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-4">Community Activity Trend</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={activityTrend} margin={{ left: 40, right: 10, top: 10, bottom: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis 
              dataKey="day" 
              stroke="rgba(255,255,255,0.7)"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="rgba(255,255,255,0.7)"
              style={{ fontSize: '12px' }}
              label={{ 
                value: 'Reports Per Day', 
                angle: -90, 
                position: 'insideLeft', 
                fill: 'rgba(255,255,255,0.7)',
                style: { textAnchor: 'middle' }
              }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(30, 41, 59, 0.95)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
              }}
            />
            <Legend 
              wrapperStyle={{ color: 'white' }}
              iconType="line"
            />
            <Line 
              type="monotone" 
              dataKey="reports" 
              stroke="#60A5FA" 
              name="Daily Reports"
              strokeWidth={3}
              dot={{ fill: '#60A5FA', r: 5 }}
            />
            <Line 
              type="monotone" 
              dataKey="avgReports" 
              stroke="#34D399" 
              name="3-Day Average"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={{ fill: '#34D399', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Overall Distribution */}
      {distributionData.length > 0 && (
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
          <h3 className="text-white font-semibold mb-4">Overall Weather Distribution</h3>
          <div className="flex flex-col md:flex-row items-center justify-center gap-8">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} ${percentage}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(30, 41, 59, 0.95)',
                    border: 'none',
                    borderRadius: '8px',
                    color: 'white',
                  }}
                  formatter={(value: any, name: string) => [`${value} reports`, name]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-4">
              {distributionData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div 
                    className="w-4 h-4 rounded" 
                    style={{ backgroundColor: COLORS[item.name as keyof typeof COLORS] }}
                  />
                  <div className="text-white text-sm">
                    <div className="font-semibold">{weatherIcons[item.name]} {item.name}</div>
                    <div className="text-white/70">{item.value} ({item.percentage}%)</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Report Summary */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-4">Today's Summary</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle className="text-green-400 flex-shrink-0" size={24} />
              <div>
                <p className="text-white/70 text-xs">Reports Today</p>
                <p className="text-white font-semibold">{reportsToday}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Activity className="text-blue-400 flex-shrink-0" size={24} />
              <div>
                <p className="text-white/70 text-xs">Top Conditions</p>
                <p className="text-white font-semibold text-sm">{conditionSummary}</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            {severeWeatherCount > 0 ? (
              <div className="flex items-center gap-3">
                <AlertCircle className="text-red-400 flex-shrink-0" size={24} />
                <div>
                  <p className="text-white/70 text-xs">Severe Weather Alerts (24h)</p>
                  <p className="text-white font-semibold">{severeWeatherCount} reports</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-400 flex-shrink-0" size={24} />
                <div>
                  <p className="text-white/70 text-xs">Severe Weather</p>
                  <p className="text-white font-semibold">No alerts</p>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <TrendingUp className="text-purple-400 flex-shrink-0" size={24} />
              <div>
                <p className="text-white/70 text-xs">Peak Activity Hour</p>
                <p className="text-white font-semibold">{peakHour}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Average Weather Data */}
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6">
        <h3 className="text-white font-semibold mb-4">Average Weather Data</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {averageWeatherData.map((item, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-green-400 flex-shrink-0" size={24} />
                <div>
                  <p className="text-white/70 text-xs">{item.variable}</p>
                  <p className="text-white font-semibold">{item.displayValue}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}