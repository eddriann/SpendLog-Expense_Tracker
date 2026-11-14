// app/components/BarChart.tsx
"use client";

type BarChartProps = {
  title: string;
  data: { label: string; value: number }[];
  colorClass?: string;
};

export default function BarChart({
  title,
  data,
  colorClass = "bg-blue-600",
}: BarChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
        <p className="text-sm text-gray-500 py-8 text-center">
          No data available for this view.
        </p>
      </div>
    );
  }

  // Find the highest value to calculate relative bar heights as percentages
  const maxVal = Math.max(...data.map((item) => item.value), 1);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col justify-between">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 mb-6">{title}</h3>

        {/* Chart Container */}
        <div className="h-48 flex items-end gap-2 sm:gap-4 pt-6 pb-2 border-b border-gray-100 overflow-x-auto">
          {data.map((item, index) => {
            const heightPercentage = Math.round((item.value / maxVal) * 100);

            return (
              <div
                key={index}
                className="flex-1 flex flex-col items-center h-full justify-end group relative min-w-[36px]"
              >
                {/* Tooltip on hover */}
                <div className="absolute -top-10 bg-gray-900 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none shadow-md">
                  {item.label}: ${item.value.toFixed(2)}
                </div>

                {/* Value label on top of bar */}
                <span className="text-[10px] text-gray-500 mb-1 font-medium truncate max-w-full">
                  $
                  {item.value >= 1000
                    ? `${(item.value / 1000).toFixed(1)}k`
                    : item.value.toFixed(0)}
                </span>

                {/* Animated vertical bar */}
                <div
                  style={{ height: `${Math.max(heightPercentage, 4)}%` }}
                  className={`w-full rounded-t transition-all duration-300 ${colorClass} group-hover:opacity-80`}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* X-Axis Labels */}
      <div className="flex gap-2 sm:gap-4 mt-3 overflow-x-auto">
        {data.map((item, index) => (
          <div key={index} className="flex-1 text-center min-w-[36px]">
            <span
              className="text-xs text-gray-600 font-medium block truncate"
              title={item.label}
            >
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
