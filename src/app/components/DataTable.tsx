import { Table } from 'lucide-react';
import type { WeatherReport } from '../../lib/supabase';

interface DataTableProps {
  reports: WeatherReport[];
}

export function DataTable({ reports }: DataTableProps) {
  // Only show reports with reference data (validation submissions)
  const validationReports = reports.filter(r => 
    r.ref_condition || r.ref_uv_index || r.ref_temperature || 
    r.ref_humidity || r.ref_visibility || r.ref_smell
  );

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mt-6">
      <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
        <Table size={20} />
        Validation Data Table
      </h3>
      
      <div className="overflow-x-auto">
        <table className="w-full text-white text-sm">
          <thead>
            <tr className="border-b border-white/20">
              <th className="px-3 py-3 text-left font-semibold">Entry #</th>
              <th className="px-3 py-3 text-left font-semibold">User Input<br/><span className="text-xs font-normal opacity-70">(Weather, UV, Temp, Humidity, Visibility, Smell)</span></th>
              <th className="px-3 py-3 text-left font-semibold">Reference Data</th>
              <th className="px-3 py-3 text-center font-semibold">Correct<br/>Entries</th>
              <th className="px-3 py-3 text-center font-semibold">Total<br/>Entries</th>
              <th className="px-3 py-3 text-center font-semibold">Accuracy %</th>
            </tr>
          </thead>
          <tbody>
            {validationReports.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-3 py-8 text-center text-white/60">
                  <p>No validation submissions yet.</p>
                  <p className="text-sm mt-2">Submit a report with reference data to see it here.</p>
                </td>
              </tr>
            ) : (
              validationReports.map((report, index) => {
                // Format user input
                const userInput = [
                  report.condition || '-',
                  report.uv_index?.toString() || '-',
                  report.temperature ? `${report.temperature}°C` : '-',
                  report.humidity ? `${report.humidity}%` : '-',
                  report.visibility ? `${report.visibility}km` : '-',
                  report.smell || '-'
                ].join(', ');

                // Format reference data
                const refData = [
                  report.ref_condition || '-',
                  report.ref_uv_index?.toString() || '-',
                  report.ref_temperature ? `${report.ref_temperature}°C` : '-',
                  report.ref_humidity ? `${report.ref_humidity}%` : '-',
                  report.ref_visibility ? `${report.ref_visibility}km` : '-',
                  report.ref_smell || '-'
                ].join(', ');

                const accuracy = report.accuracy_percent || 0;
                const correctCount = report.correct_entries || 0;
                const totalCount = report.total_entries || 6;

                // Color code accuracy
                let accuracyColor = 'text-red-400';
                if (accuracy === 100) accuracyColor = 'text-green-400';
                else if (accuracy >= 80) accuracyColor = 'text-yellow-400';

                return (
                  <tr key={report.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                    <td className="px-3 py-4 font-medium">{index + 1}</td>
                    <td className="px-3 py-4 max-w-md">
                      <div className="text-xs leading-relaxed">{userInput}</div>
                    </td>
                    <td className="px-3 py-4 max-w-md">
                      <div className="text-xs leading-relaxed opacity-80">{refData}</div>
                    </td>
                    <td className="px-3 py-4 text-center font-semibold">{correctCount}</td>
                    <td className="px-3 py-4 text-center font-semibold">{totalCount}</td>
                    <td className={`px-3 py-4 text-center font-bold text-base ${accuracyColor}`}>
                      {accuracy}%
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Summary Stats */}
      <div className="mt-4 pt-4 border-t border-white/20 grid grid-cols-3 gap-4 text-center text-white">
        <div>
          <div className="text-2xl font-bold">{validationReports.length}</div>
          <div className="text-xs opacity-70 mt-1">Total Submissions</div>
        </div>
        <div>
          <div className="text-2xl font-bold">
            {validationReports.length > 0 
              ? Math.round(
                  validationReports.reduce((sum, r) => sum + (r.accuracy_percent || 0), 0) / 
                  validationReports.length
                )
              : 0}%
          </div>
          <div className="text-xs opacity-70 mt-1">Average Accuracy</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-green-400">
            {validationReports.filter(r => (r.accuracy_percent || 0) === 100).length}
          </div>
          <div className="text-xs opacity-70 mt-1">Perfect Scores</div>
        </div>
      </div>
    </div>
  );
}