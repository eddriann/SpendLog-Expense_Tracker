// app/page.tsx
import { Suspense } from "react";
import connectDB from "./lib/db";
import Expense from "./models/Expense";
import Budget from "../models/Budget";
import { archivo } from "../lib/fonts";
import { todayInZone } from "../lib/format";
import BudgetHero from "./components/BudgetHero";
import ExpenseForm from "./components/ExpenseForm";
import DateFilter from "./components/DateFilter";
import CategoryBars from "./components/CategoryBars";
import ExpenseTable from "./components/ExpenseTable";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ start?: string; end?: string }>;
}) {
  // Await searchParams in Next.js 15+
  const resolvedSearchParams = await searchParams;
  const start = resolvedSearchParams?.start;
  const end = resolvedSearchParams?.end;

  await connectDB();

  // --- Budget hero: always the current month, independent of the date filter ---
  const today = todayInZone();

  const dailyAgg: { _id: string; total: number }[] = await Expense.aggregate([
    {
      $match: {
        date: { $gte: `${today.month}-01`, $lte: `${today.month}-31` },
      },
    },
    { $group: { _id: "$date", total: { $sum: "$amount" } } },
  ]);

  const daily: number[] = Array.from({ length: today.daysInMonth }, () => 0);
  for (const row of dailyAgg) {
    const d = Number(row._id.slice(8, 10));
    if (d >= 1 && d <= today.daysInMonth) daily[d - 1] += row.total;
  }

  let budgetDoc = (await Budget.findOne({
    month: today.month,
  }).lean()) as { month: string; amount: number } | null;
  let carriedFrom: string | null = null;
  if (!budgetDoc) {
    const prev = (await Budget.findOne({ month: { $lt: today.month } })
      .sort({ month: -1 })
      .lean()) as { month: string; amount: number } | null;
    if (prev) {
      budgetDoc = prev;
      carriedFrom = prev.month;
    }
  }

  // --- Ledger: follows the date filter ---
  const query: Record<string, any> = {};
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
    date: exp.date as string,
    description: exp.description as string,
    category: exp.category as string,
    amount: exp.amount as number,
  }));

  const categoryTotals: Record<string, number> = {};
  for (const exp of expenses) {
    categoryTotals[exp.category] =
      (categoryTotals[exp.category] || 0) + exp.amount;
  }
  const categoryReport = Object.entries(categoryTotals)
    .map(([category, total]) => ({ category, total }))
    .sort((a, b) => b.total - a.total);

  return (
    <main
      className={`${archivo.className} min-h-screen bg-[#F5F7F3] px-4 py-10 text-[#1C2A43] sm:px-6`}
    >
      <div className="mx-auto max-w-[860px]">
        <BudgetHero
          month={today.month}
          day={today.day}
          daysInMonth={today.daysInMonth}
          daily={daily}
          budget={budgetDoc ? budgetDoc.amount : null}
          carriedFrom={carriedFrom}
        />

        <section
          aria-labelledby="add-heading"
          className="mt-12 border-t border-[#D5DDD7] pt-6"
        >
          <h2 id="add-heading" className="mb-4 text-xl font-semibold">
            Add expense
          </h2>
          <ExpenseForm />
        </section>

        <section
          aria-labelledby="ledger-heading"
          className="mt-12 border-t border-[#D5DDD7] pt-6"
        >
          <div className="flex flex-wrap items-end justify-between gap-4">
            <h2 id="ledger-heading" className="text-xl font-semibold">
              Expenses
              <span className="ml-3 text-base font-normal text-[#5E6D84]">
                {expenses.length}{" "}
                {expenses.length === 1 ? "expense" : "expenses"}
              </span>
            </h2>
            <Suspense fallback={null}>
              <DateFilter />
            </Suspense>
          </div>

          <div className="mt-8">
            <CategoryBars rows={categoryReport} />
          </div>

          <div className="mt-10">
            <ExpenseTable
              expenses={expenses}
              filtered={Boolean(start || end)}
              currentYear={today.year}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
