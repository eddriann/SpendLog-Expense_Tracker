"use client";

import { useEffect, useRef, useState } from "react";
import { addExpense } from "../actions";
import { CATEGORIES } from "../../lib/categories";
import { money, todayInZone } from "../../lib/format";
import { MAX_AMOUNT, checkDate, parseAmount } from "../../lib/validation";

const INPUT =
  "w-full rounded-[4px] border border-[#D5DDD7] bg-white px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1C2A43]";
const LABEL = "mb-1 block text-sm text-[#5E6D84]";

export default function ExpenseForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<{
    message: string;
    field?: "category" | "date" | "amount";
  } | null>(null);
  // "Added ₱120.00 to Food & Dining." Shown from 1024px up only, and cleared after a few seconds.
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 6000);
    return () => clearTimeout(t);
  }, [notice]);

  async function handleAction(formData: FormData) {
    setNotice(null);
    // Same rules as the server, run first. Some phone browsers ignore `max` on date and
    // number inputs, so the browser alone can't be trusted to stop a bad value.
    const amountCheck = parseAmount(String(formData.get("amount") ?? ""));
    if (!amountCheck.ok) {
      setError({ message: amountCheck.error, field: "amount" });
      return;
    }
    const dateError = checkDate(String(formData.get("date") ?? "").trim());
    if (dateError) {
      setError({ message: dateError, field: "date" });
      return;
    }

    const result = await addExpense(formData);
    if (result.ok) {
      setError(null);
      setNotice(
        `Added ${money(amountCheck.value)} to ${String(formData.get("category") ?? "")}.`,
      );
      formRef.current?.reset();
    } else {
      // Keep what the person typed so they only fix the one field.
      setError({ message: result.error, field: result.field });
    }
  }

  const categoryInvalid = error?.field === "category";
  const dateInvalid = error?.field === "date";
  const amountInvalid = error?.field === "amount";
  const today = todayInZone().iso;

  return (
    <form
      ref={formRef}
      action={handleAction}
      className="grid grid-cols-2 items-end gap-3 sm:grid-cols-[8rem_1fr_11rem_9.5rem_auto] lg:grid-cols-1"
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
          max={MAX_AMOUNT}
          inputMode="decimal"
          placeholder="0.00"
          required
          aria-invalid={amountInvalid ? true : undefined}
          aria-describedby={amountInvalid ? "expense-error" : undefined}
          onChange={() => {
            if (amountInvalid) setError(null);
          }}
          className={`${INPUT} aria-invalid:border-[#B3261E] text-lg font-semibold tabular-nums`}
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
          max={today}
          defaultValue={today}
          aria-invalid={dateInvalid ? true : undefined}
          aria-describedby={dateInvalid ? "expense-error" : undefined}
          onChange={() => {
            if (dateInvalid) setError(null);
          }}
          className={`${INPUT} aria-invalid:border-[#B3261E]`}
        />
      </div>

      <button
        type="submit"
        className="col-span-2 rounded-[4px] bg-[#1C2A43] px-4 py-2 text-sm font-semibold text-[#F5F7F3] hover:bg-[#2B3B5C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1C2A43] sm:col-span-1 lg:col-span-1"
      >
        Add expense
      </button>

      {error && (
        <p
          id="expense-error"
          role="alert"
          className="col-span-2 text-sm text-[#B3261E] sm:col-span-5 lg:col-span-1"
        >
          {error.message}
        </p>
      )}

      {notice && (
        <p
          role="status"
          className="hidden text-sm text-[#1C2A43] lg:col-span-1 lg:block"
        >
          {notice}
        </p>
      )}
    </form>
  );
}
