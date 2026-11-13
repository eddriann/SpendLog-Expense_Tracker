type ReportsProps = {
  categoryReport: { category: string; total: number }[];
  dailyReport: { date: string; total: number }[];
  monthlyReport: { month: string; total: number }[];
};

export default function ReportsSection({
  categoryReport,
  dailyReport,
  monthlyReport,
}: ReportsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* 1. Category Report */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 font-semibold text-gray-800 text-sm">
          Category Report
        </div>
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-500 uppercase bg-gray-50/50">
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {categoryReport.length === 0 ? (
              <tr>
                <td colSpan={2} className="px-4 py-4 text-center text-gray-400">
                  No data
                </td>
              </tr>
            ) : (
              categoryReport.map((row) => (
                <tr key={row.category}>
                  <td className="px-4 py-2.5 font-medium text-gray-800">
                    {row.category}
                  </td>
                  <td className="px-4 py-2.5 text-right font-semibold">
                    ${row.total.toFixed(2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 2. Daily Report */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 font-semibold text-gray-800 text-sm">
          Daily Report
        </div>
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-500 uppercase bg-gray-50/50">
              <th className="px-4 py-2">Calendar Date</th>
              <th className="px-4 py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {dailyReport.length === 0 ? (
              <tr>
                <td colSpan={2} className="px-4 py-4 text-center text-gray-400">
                  No data
                </td>
              </tr>
            ) : (
              dailyReport.map((row) => (
                <tr key={row.date}>
                  <td className="px-4 py-2.5 font-medium text-gray-800">
                    {row.date}
                  </td>
                  <td className="px-4 py-2.5 text-right font-semibold">
                    ${row.total.toFixed(2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 3. Monthly Report */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 font-semibold text-gray-800 text-sm">
          Monthly Report
        </div>
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead>
            <tr className="text-left text-xs text-gray-500 uppercase bg-gray-50/50">
              <th className="px-4 py-2">Calendar Month</th>
              <th className="px-4 py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {monthlyReport.length === 0 ? (
              <tr>
                <td colSpan={2} className="px-4 py-4 text-center text-gray-400">
                  No data
                </td>
              </tr>
            ) : (
              monthlyReport.map((row) => (
                <tr key={row.month}>
                  <td className="px-4 py-2.5 font-medium text-gray-800">
                    {row.month}
                  </td>
                  <td className="px-4 py-2.5 text-right font-semibold">
                    ${row.total.toFixed(2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
