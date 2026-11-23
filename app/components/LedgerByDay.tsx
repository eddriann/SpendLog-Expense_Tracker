import { dayHeading, money } from "../../lib/format";

type Expense = {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
};

type Props = {
  expenses: Expense[]; // newest first
  filtered: boolean; // a date range is applied
  currentYear: number;
};

type Day = { date: string; total: number; items: Expense[] };

export default function LedgerByDay({
  expenses,
  filtered,
  currentYear,
}: Props) {
  if (expenses.length === 0) {
    return (
      <p className="border-t border-[#1C2A43] py-8 text-[#5E6D84]">
        {filtered
          ? "No expenses in this range. Add one or widen the dates."
          : "No expenses yet. Add your first one on the left."}
      </p>
    );
  }

  // The list is already sorted by date, so equal dates sit next to each other.
  const days: Day[] = [];
  for (const e of expenses) {
    const last = days[days.length - 1];
    if (last && last.date === e.date) {
      last.items.push(e);
      last.total += e.amount;
    } else {
      days.push({ date: e.date, total: e.amount, items: [e] });
    }
  }

  return (
    <div className="space-y-9">
      {days.map((d) => (
        <section key={d.date} aria-labelledby={`day-${d.date}`}>
          <h3
            id={`day-${d.date}`}
            className="flex items-baseline justify-between border-b border-[#1C2A43] pb-2 text-base font-semibold"
          >
            <span>{dayHeading(d.date, currentYear)}</span>
            {d.items.length > 1 && (
              <span className="tabular-nums">{money(d.total)}</span>
            )}
          </h3>
          <ul>
            {d.items.map((e) => (
              <li
                key={e.id}
                className="grid grid-cols-[minmax(0,1fr)_11rem_auto] gap-x-4 border-b border-[#D5DDD7] py-3"
              >
                <span>{e.description}</span>
                <span className="text-[#5E6D84]">{e.category}</span>
                <span className="text-right tabular-nums">
                  {money(e.amount)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
