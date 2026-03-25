import { useState } from 'react';
import { Database, CheckCircle } from 'lucide-react';

interface ReferenceData {
  ref_condition: string;
  ref_uv_index: number;
  ref_temperature: string;
  ref_humidity: string;
  ref_visibility: string;
  ref_smell: string;
}

interface ReferenceDataInputProps {
  onSubmit: (data: ReferenceData) => void;
}

export function ReferenceDataInput({ onSubmit }: ReferenceDataInputProps) {
  const [formData, setFormData] = useState<ReferenceData>({
    ref_condition: 'Sunny',
    ref_uv_index: 3,
    ref_temperature: '31',
    ref_humidity: '65',
    ref_visibility: '7',
    ref_smell: 'Fresh',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setSubmitted(true);
    // Reset submitted state after 3 seconds
    setTimeout(() => setSubmitted(false), 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'ref_uv_index' ? parseInt(value, 10) : value,
    });
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mt-6">
      <div className="mb-4">
        <p className="text-white/90 text-sm font-medium mb-2">
          For testing purposes, copy the following reference data exactly:
        </p>
        <p className="text-white/70 text-xs">
          (Sunny, Moderate, 31°C, 65%, 7km, Fresh)
        </p>
      </div>

      {submitted && (
        <div className="mb-4 bg-green-500/20 border border-green-500/50 rounded-lg p-3 flex items-center gap-2">
          <CheckCircle size={18} className="text-green-400" />
          <span className="text-green-300 text-sm font-medium">✓ Reference Data Submitted</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="overflow-x-auto">
          <table className="w-full text-white text-sm">
            <thead>
              <tr className="border-b border-white/20">
                <th className="px-4 py-3 text-left font-semibold bg-white/5">Environmental Variable</th>
                <th className="px-4 py-3 text-left font-semibold bg-white/5">Value/Selection</th>
              </tr>
            </thead>
            <tbody>
              {/* Weather Condition */}
              <tr className="border-b border-white/10">
                <td className="px-4 py-3 text-white/80">Weather Condition</td>
                <td className="px-4 py-3">
                  <select
                    name="ref_condition"
                    value={formData.ref_condition}
                    onChange={handleChange}
                    className="w-full bg-white/20 backdrop-blur-sm text-white text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-white/50"
                  >
                    <option value="Sunny" className="bg-blue-600">Sunny</option>
                    <option value="Cloudy" className="bg-blue-600">Cloudy</option>
                    <option value="Rainy" className="bg-blue-600">Rainy</option>
                    <option value="Windy" className="bg-blue-600">Windy</option>
                    <option value="Storm" className="bg-blue-600">Storm</option>
                    <option value="Flooding" className="bg-blue-600">Flooding</option>
                  </select>
                </td>
              </tr>

              {/* UV Intensity */}
              <tr className="border-b border-white/10">
                <td className="px-4 py-3 text-white/80">UV Intensity</td>
                <td className="px-4 py-3">
                  <select
                    name="ref_uv_index"
                    value={formData.ref_uv_index}
                    onChange={handleChange}
                    className="w-full bg-white/20 backdrop-blur-sm text-white text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-white/50"
                  >
                    <option value="1" className="bg-blue-600">1 - Low</option>
                    <option value="2" className="bg-blue-600">2 - Low</option>
                    <option value="3" className="bg-blue-600">3 - Moderate</option>
                    <option value="4" className="bg-blue-600">4 - Moderate</option>
                    <option value="5" className="bg-blue-600">5 - Moderate</option>
                    <option value="6" className="bg-blue-600">6 - High</option>
                    <option value="7" className="bg-blue-600">7 - High</option>
                    <option value="8" className="bg-blue-600">8 - Very High</option>
                    <option value="9" className="bg-blue-600">9 - Very High</option>
                    <option value="10" className="bg-blue-600">10 - Very High</option>
                    <option value="11" className="bg-blue-600">11+ - Extreme</option>
                  </select>
                </td>
              </tr>

              {/* Temperature */}
              <tr className="border-b border-white/10">
                <td className="px-4 py-3 text-white/80">Temperature (°C)</td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    name="ref_temperature"
                    value={formData.ref_temperature}
                    onChange={handleChange}
                    placeholder="e.g., 31°C"
                    className="w-full bg-white/20 backdrop-blur-sm text-white text-sm placeholder-white/50 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-white/50"
                  />
                </td>
              </tr>

              {/* Humidity */}
              <tr className="border-b border-white/10">
                <td className="px-4 py-3 text-white/80">Humidity (%)</td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    name="ref_humidity"
                    value={formData.ref_humidity}
                    onChange={handleChange}
                    placeholder="e.g., 65%"
                    className="w-full bg-white/20 backdrop-blur-sm text-white text-sm placeholder-white/50 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-white/50"
                  />
                </td>
              </tr>

              {/* Visibility */}
              <tr className="border-b border-white/10">
                <td className="px-4 py-3 text-white/80">Visibility (km)</td>
                <td className="px-4 py-3">
                  <input
                    type="text"
                    name="ref_visibility"
                    value={formData.ref_visibility}
                    onChange={handleChange}
                    placeholder="e.g., 7 km"
                    className="w-full bg-white/20 backdrop-blur-sm text-white text-sm placeholder-white/50 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-white/50"
                  />
                </td>
              </tr>

              {/* Smell */}
              <tr>
                <td className="px-4 py-3 text-white/80">Smell</td>
                <td className="px-4 py-3">
                  <select
                    name="ref_smell"
                    value={formData.ref_smell}
                    onChange={handleChange}
                    className="w-full bg-white/20 backdrop-blur-sm text-white text-sm rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-white/50"
                  >
                    <option value="Fresh" className="bg-blue-600">Fresh</option>
                    <option value="Neutral" className="bg-blue-600">Neutral</option>
                    <option value="Dusty" className="bg-blue-600">Dusty</option>
                    <option value="Hot Air" className="bg-blue-600">Hot Air</option>
                    <option value="Damp" className="bg-blue-600">Damp</option>
                    <option value="Earthy" className="bg-blue-600">Earthy</option>
                    <option value="Fresh Rain" className="bg-blue-600">Fresh Rain</option>
                    <option value="Wet Earth" className="bg-blue-600">Wet Earth</option>
                    <option value="Salty Air" className="bg-blue-600">Salty Air</option>
                    <option value="Ozone" className="bg-blue-600">Ozone</option>
                    <option value="Metallic" className="bg-blue-600">Metallic</option>
                    <option value="Muddy" className="bg-blue-600">Muddy</option>
                    <option value="Sewage" className="bg-blue-600">Sewage</option>
                    <option value="Stagnant" className="bg-blue-600">Stagnant</option>
                    <option value="Debris" className="bg-blue-600">Debris</option>
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4">
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm rounded-lg px-4 py-2.5 transition-all duration-200 flex items-center justify-center gap-2"
          >
            <Database size={16} />
            Submit Reference Data
          </button>
        </div>
      </form>
    </div>
  );
}