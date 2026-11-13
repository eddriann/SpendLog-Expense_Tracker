"use client";

import { useRef } from "react";
import { addExpense } from "../actions";

export default function ExpenseForm() {
  const formRef = useRef<HTMLFormElement>(null);

  async function handleAction(formData: FormData) {
    await addExpense(formData);
    formRef.current?.reset();
  }

  return (
    <form
      ref={formRef}
      action={handleAction}
      className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 grid grid-cols-1 md:grid-cols-5 gap-4 items-end"
    >
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Date
        </label>
        <input
          type="date"
          name="date"
          required
          defaultValue={new Date().toISOString().split("T")[0]}
          className="w-full border border-gray-300 rounded-md p-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <input
          type="text"
          name="description"
          placeholder="e.g., Lunch, Groceries"
          required
          className="w-full border border-gray-300 rounded-md p-2 text-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <input
          type="text"
          name="category"
          list="category-suggestions"
          placeholder="e.g., Food, Transport"
          required
          className="w-full border border-gray-300 rounded-md p-2 text-sm"
        />
        <datalist id="category-suggestions">
          <option value="Food & Dining" />
          <option value="Transportation" />
          <option value="Utilities" />
          <option value="Entertainment" />
          <option value="Shopping" />
        </datalist>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Amount ($)
        </label>
        <input
          type="number"
          name="amount"
          step="0.01"
          min="0.01"
          placeholder="0.00"
          required
          className="w-full border border-gray-300 rounded-md p-2 text-sm"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md text-sm transition"
      >
        + Add Expense
      </button>
    </form>
  );
}
