import { Table } from 'lucide-react';
import type { WeatherReport } from '../../lib/supabase';

interface DataTableProps {
  reports: WeatherReport[];
}

export function DataTable({ reports }: DataTableProps) {
  // Filter for only validation reports (those with reference data)
  const validationReports = reports.filter(r => 
    r.ref_condition || r.ref_uv_index || r.ref_temperature || 
    r.ref_humidity || r.ref_visibility || r.ref_smell
  );

  // Group validation reports by user email
  const userGroups = validationReports.reduce((acc, report) => {
    const userEmail = report.user_email || 'Anonymous';
    if (!acc[userEmail]) {
      acc[userEmail] = [];
    }
    acc[userEmail].push(report);
    return acc;
  }, {} as Record<string, WeatherReport[]>);

  // Calculate accuracy for each user
  const userStats = Object.entries(userGroups).map(([email, userReports]) => {
    const totalEntries = userReports.length * 6; // 6 fields per submission
    const correctEntries = userReports.reduce((sum, report) => {
      return sum + (report.correct_entries || 0);
    }, 0);
    const accuracy = totalEntries > 0 ? ((correctEntries / totalEntries) * 100).toFixed(2) : '0.00';
    
    return {
      email,
      correctEntries,
      totalEntries,
      accuracy: parseFloat(accuracy),
    };
  });

  // Calculate overall accuracy
  const totalCorrect = userStats.reduce((sum, user) => sum + user.correctEntries, 0);
  const totalEntries = userStats.reduce((sum, user) => sum + user.totalEntries, 0);
  const meanAccuracy = totalEntries > 0 ? ((totalCorrect / totalEntries) * 100).toFixed(2) : '0.00';

  if (userStats.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mt-6">
        <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
          <Table size={20} />
          Validation Results
        </h3>
        <div className="text-center text-white/60 py-8">
          <p>No validation data available yet.</p>
          <p className="text-sm mt-2">Submit reports with reference data to see accuracy results.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 mt-6">
      <h3 className="text-white text-lg font-semibold mb-4 flex items-center gap-2">
        <Table size={20} />
        Validation Results
      </h3>
      
      <div className="overflow-x-auto">
        <table className="w-full text-white text-sm">
          <thead>
            <tr className="border-b border-white/20">
              <th className="px-4 py-3 text-left font-semibold bg-white/5">User</th>
              <th className="px-4 py-3 text-center font-semibold bg-white/5">Correct Entries</th>
              <th className="px-4 py-3 text-center font-semibold bg-white/5">Total Entries</th>
              <th className="px-4 py-3 text-center font-semibold bg-white/5">Accuracy</th>
            </tr>
          </thead>
          <tbody>
            {userStats.map((user, index) => {
              // Color code accuracy
              let accuracyColor = 'text-red-400';
              if (user.accuracy === 100) accuracyColor = 'text-green-400';
              else if (user.accuracy >= 80) accuracyColor = 'text-yellow-400';

              return (
                <tr key={user.email} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                  <td className="px-4 py-3">User {index + 1}</td>
                  <td className="px-4 py-3 text-center font-semibold">{user.correctEntries}</td>
                  <td className="px-4 py-3 text-center font-semibold">{user.totalEntries}</td>
                  <td className={`px-4 py-3 text-center font-bold ${accuracyColor}`}>
                    {user.accuracy.toFixed(2)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="mt-6 space-y-3">
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
          <p className="text-white/90 text-sm">
            Accuracy: <span className="font-semibold">{totalCorrect} out of {totalEntries} correct</span>
          </p>
        </div>
        
        <div className="text-center">
          <p className="text-white/70 text-lg mb-1">Mean Accuracy:</p>
          <p className="text-green-400 text-3xl font-bold">{meanAccuracy}%</p>
        </div>
      </div>
    </div>
  );
}