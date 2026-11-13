import { getExpenses } from "./lib/storage";
import ExpenseForm from "./components/ExpenseForm";
import DateFilter from "./components/DateFilter";
import ExpenseTable from "./components/ExpenseTable";
import ReportsSection from "./components/ReportsSection";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ start?: string; end?: string }>;
}) {
  const { start, end } = await searchParams;

  // Fetch all expenses from local JSON file
  let expenses = getExpenses();

  // Apply inclusive date-range filter if provided
  if (start || end) {
    expenses = expenses.filter((exp) => {
      if (start && exp.date < start) return false;
      if (end && exp.date > end) return false;
      return true;
    });
  }

  // Calculate all three reports from the filtered expenses
  const categoryTotals: Record<string, number> = {};
  const dailyTotals: Record<string, number> = {};
  const monthlyTotals: Record<string, number> = {};

  for (const exp of expenses) {
    // 1. Category Report
    categoryTotals[exp.category] =
      (categoryTotals[exp.category] || 0) + exp.amount;

    // 2. Daily Report (YYYY-MM-DD)
    dailyTotals[exp.date] = (dailyTotals[exp.date] || 0) + exp.amount;

    // 3. Monthly Report (YYYY-MM)
    const monthKey = exp.date.slice(0, 7);
    monthlyTotals[monthKey] = (monthlyTotals[monthKey] || 0) + exp.amount;
  }

  const categoryReport = Object.entries(categoryTotals)
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);

  const dailyReport = Object.entries(dailyTotals)
    .map(([date, total]) => ({ date, total }))
    .sort((a, b) => b.date.localeCompare(a.date));

  const monthlyReport = Object.entries(monthlyTotals)
    .map(([month, total]) => ({ month, total }))
    .sort((a, b) => b.month.localeCompare(a.month));

  return (
    <main className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Expense Tracker (JSON Storage)
          </h1>
          <p className="text-sm text-gray-600">
            Data is saved locally to a `data.json` file in your project root.
          </p>
        </div>

        {/* Add Expense Form */}
        <ExpenseForm />

        {/* Date Range Filter */}
        <DateFilter />

        {/* Three Summary Reports */}
        <ReportsSection
          categoryReport={categoryReport}
          dailyReport={dailyReport}
          monthlyReport={monthlyReport}
        />

        {/* Recorded Expenses Table */}
        <ExpenseTable expenses={expenses} />
      </div>
    </main>
  );
}
