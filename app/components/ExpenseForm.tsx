"use client";

import { useRef, useState } from "react";
import { addExpense } from "../actions";
import { CATEGORIES } from "../../lib/categories";
import { todayInZone } from "../../lib/format";

const INPUT =
  "w-full rounded-[4px] border border-[#D5DDD7] bg-white px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1C2A43]";
const LABEL = "mb-1 block text-sm text-[#5E6D84]";

export default function ExpenseForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<{
    message: string;
    field?: "category";
  } | null>(null);

  async function handleAction(formData: FormData) {
    const result = await addExpense(formData);
    if (result.ok) {
      setError(null);
      formRef.current?.reset();
    } else {
      // Keep what the person typed so they only fix the one field.
      setError({ message: result.error, field: result.field });
    }
  }

  const categoryInvalid = error?.field === "category";

  return (
    <form
      ref={formRef}
      action={handleAction}
      className="grid grid-cols-2 items-end gap-3 sm:grid-cols-[8rem_1fr_11rem_9.5rem_auto]"
    >
      <div>
        <label htmlFor="expense-amount" className={LABEL}>
          Amount (₱)
        </label>
        <input
          id="expense-amount"
          type="number"
          name="amount"
          step="0.01"
          min="0.01"
          inputMode="decimal"
          placeholder="0.00"
          required
          className={`${INPUT} text-lg font-semibold tabular-nums`}
        />
      </div>

      <div>
        <label htmlFor="expense-description" className={LABEL}>
          What for
        </label>
        <input
          id="expense-description"
          type="text"
          name="description"
          placeholder="Lunch, groceries"
          required
          className={INPUT}
        />
      </div>

      <div>
        <label htmlFor="expense-category" className={LABEL}>
          Category
        </label>
        <select
          id="expense-category"
          name="category"
          required
          defaultValue=""
          aria-invalid={categoryInvalid ? true : undefined}
          aria-describedby={categoryInvalid ? "expense-error" : undefined}
          onChange={() => {
            if (categoryInvalid) setError(null);
          }}
          className={`${INPUT} aria-invalid:border-[#B3261E]`}
        >
          <option value="" disabled>
            Choose one
          </option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="expense-date" className={LABEL}>
          Date
        </label>
        <input
          id="expense-date"
          type="date"
          name="date"
          required
          defaultValue={todayInZone().iso}
          className={INPUT}
        />
      </div>

      <button
        type="submit"
        className="col-span-2 rounded-[4px] bg-[#1C2A43] px-4 py-2 text-sm font-semibold text-[#F5F7F3] hover:bg-[#2B3B5C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1C2A43] sm:col-span-1"
      >
        Add expense
      </button>

      {error && (
        <p
          id="expense-error"
          role="alert"
          className="col-span-2 text-sm text-[#B3261E] sm:col-span-5"
        >
          {error.message}
        </p>
      )}
    </form>
  );
}
