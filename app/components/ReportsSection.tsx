import BarChart from "./BarChart";

type Props = {
  categoryReport: { category: string; total: number }[];
  dailyReport: { date: string; total: number }[];
  monthlyReport: { month: string; total: number }[];
};

export default function ReportsSection({
  categoryReport,
  dailyReport,
  monthlyReport,
}: Props) {
  // Reports are sorted newest-first; charts read better oldest -> newest
  const daily = dailyReport
    .slice(0, 14)
    .reverse()
    .map((d) => ({ label: d.date.slice(5), value: d.total }));

  const monthly = monthlyReport
    .slice(0, 12)
    .reverse()
    .map((m) => ({ label: m.month, value: m.total }));

  const categories = categoryReport.map((c) => ({
    label: c.category,
    value: c.total,
  }));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <BarChart
        title="By Category"
        data={categories}
        colorClass="bg-blue-600"
      />
      <BarChart
        title="Daily (last 14 days)"
        data={daily}
        colorClass="bg-green-600"
      />
      <BarChart title="Monthly" data={monthly} colorClass="bg-purple-600" />
    </div>
  );
}
