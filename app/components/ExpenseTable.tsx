type Expense = {
  id: number;
  date: string;
  description: string;
  category: string;
  amount: number;
};

export default function ExpenseTable({ expenses }: { expenses: Expense[] }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800">
          Recorded Expenses
        </h2>
        <span className="text-sm text-gray-500">{expenses.length} entries</span>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase">
                Date
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase">
                Description
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-500 uppercase">
                Category
              </th>
              <th className="px-6 py-3 text-right font-medium text-gray-500 uppercase">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {expenses.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                  No expenses found in this date range.
                </td>
              </tr>
            ) : (
              expenses.map((expense) => (
                <tr key={expense.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 whitespace-nowrap text-gray-700">
                    {expense.date}
                  </td>
                  <td className="px-6 py-3 text-gray-900 font-medium">
                    {expense.description}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap">
                    <span className="bg-blue-50 text-blue-700 px-2.5 py-0.5 rounded-full text-xs font-medium">
                      {expense.category}
                    </span>
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-right font-semibold text-gray-900">
                    ${expense.amount.toFixed(2)}
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
