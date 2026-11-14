// app/page.tsx
import connectDB from "./lib/db";
import Expense from "./models/Expense";
import ExpenseForm from "./components/ExpenseForm";
import DateFilter from "./components/DateFilter";
import ExpenseTable from "./components/ExpenseTable";
import ReportsSection from "./components/ReportsSection";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ start?: string; end?: string }>;
}) {
  // 1. Await searchParams in Next.js 15+
  const resolvedSearchParams = await searchParams;
  const start = resolvedSearchParams?.start;
  const end = resolvedSearchParams?.end;

  await connectDB();

  // 2. Build query filter for MongoDB
  const query: any = {};
  if (start || end) {
    query.date = {};
    if (start) query.date.$gte = start;
    if (end) query.date.$lte = end;
  }

  const rawExpenses = await Expense.find(query)
    .sort({ date: -1, _id: -1 })
    .lean();

  const expenses = rawExpenses.map((exp: any) => ({
    id: exp._id.toString(),
    date: exp.date,
    description: exp.description,
    category: exp.category,
    amount: exp.amount,
  }));

  // Calculate reports
  const categoryTotals: Record<string, number> = {};
  const dailyTotals: Record<string, number> = {};
  const monthlyTotals: Record<string, number> = {};

  for (const exp of expenses) {
    categoryTotals[exp.category] =
      (categoryTotals[exp.category] || 0) + exp.amount;
    dailyTotals[exp.date] = (dailyTotals[exp.date] || 0) + exp.amount;

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
            Expense Tracker (MongoDB)
          </h1>
          <p className="text-sm text-gray-600">
            Connected live to your MongoDB cloud database cluster.
          </p>
        </div>

        <ExpenseForm />
        <DateFilter />
        <ReportsSection
          categoryReport={categoryReport}
          dailyReport={dailyReport}
          monthlyReport={monthlyReport}
        />
        <ExpenseTable expenses={expenses} />
      </div>
    </main>
  );
}
