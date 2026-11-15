import { money, shortDate } from "../../lib/format";

type Expense = {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
};

type Props = {
  expenses: Expense[];
  filtered: boolean; // a date range is applied
  currentYear: number;
};

export default function ExpenseTable({
  expenses,
  filtered,
  currentYear,
}: Props) {
  return (
    <table className="w-full text-left">
      <caption className="sr-only">Recorded expenses</caption>
      <thead>
        <tr className="border-b border-[#1C2A43] text-sm text-[#5E6D84]">
          <th scope="col" className="w-24 py-2 pr-4 font-medium">
            Date
          </th>
          <th scope="col" className="py-2 pr-4 font-medium">
            Description
          </th>
          <th
            scope="col"
            className="hidden py-2 pr-4 font-medium sm:table-cell"
          >
            Category
          </th>
          <th scope="col" className="py-2 text-right font-medium">
            Amount
          </th>
        </tr>
      </thead>
      <tbody>
        {expenses.length === 0 ? (
          <tr>
            <td colSpan={4} className="py-10 text-[#5E6D84]">
              {filtered
                ? "No expenses in this range. Add one above or widen the dates."
                : "No expenses yet. Add your first one above."}
            </td>
          </tr>
        ) : (
          expenses.map((e) => (
            <tr key={e.id} className="border-b border-[#D5DDD7] align-top">
              <td className="whitespace-nowrap py-3 pr-4 tabular-nums text-[#5E6D84]">
                {shortDate(e.date, currentYear)}
              </td>
              <td className="py-3 pr-4">
                {e.description}
                <span className="mt-0.5 block text-sm text-[#5E6D84] sm:hidden">
                  {e.category}
                </span>
              </td>
              <td className="hidden py-3 pr-4 text-[#5E6D84] sm:table-cell">
                {e.category}
              </td>
              <td className="whitespace-nowrap py-3 text-right font-semibold tabular-nums">
                {money(e.amount)}
              </td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
}
