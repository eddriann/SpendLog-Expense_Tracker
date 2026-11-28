"use client";

import { useEffect, useRef, useState } from "react";
import { addExpense } from "../actions";
import { CATEGORIES } from "../../lib/categories";
import { money, todayInZone } from "../../lib/format";
import {
  MAX_AMOUNT,
  MAX_DESCRIPTION,
  checkDate,
  checkDescription,
  cleanDescription,
  parseAmount,
} from "../../lib/validation";

const INPUT =
  "w-full rounded-[4px] border border-[#D5DDD7] bg-white px-3 py-2 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1C2A43]";
const LABEL = "mb-1 block text-sm text-[#5E6D84]";

export default function ExpenseForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<{
    message: string;
    field?: "category" | "date" | "amount" | "description";
  } | null>(null);

  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 6000);
    return () => clearTimeout(t);
  }, [notice]);

  const [pending, setPending] = useState(false);
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pending) return;
    setPending(true);
    try {
      await handleAction(new FormData(e.currentTarget));
    } finally {
      setPending(false);
    }
  }

  async function handleAction(formData: FormData) {
    setNotice(null);

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

    const descError = checkDescription(
      cleanDescription(String(formData.get("description") ?? "")),
    );
    if (descError) {
      setError({ message: descError, field: "description" });
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
  const descriptionInvalid = error?.field === "description";
  const describedBy = error ? "expense-error expense-error-top" : undefined;
  const today = todayInZone().iso;

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      className="grid grid-cols-2 items-end gap-3 sm:grid-cols-[8rem_1fr_11rem_9.5rem_auto] lg:grid-cols-1"
    >
      {/* From 1024px the error sits above all the fields. Below that it stays under the button. */}
      {error && (
        <p
          id="expense-error-top"
          role="alert"
          className="hidden border-l-2 border-[#B3261E] pl-3 text-sm text-[#B3261E] lg:col-span-1 lg:block"
        >
          {error.message}
        </p>
      )}

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
          aria-describedby={amountInvalid ? describedBy : undefined}
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
        {/* Below 1024px it behaves like the old one-line input; from 1024px it is a roomier box that wraps. */}
        <textarea
          id="expense-description"
          name="description"
          rows={1}
          maxLength={MAX_DESCRIPTION}
          placeholder="Lunch, groceries"
          required
          aria-invalid={descriptionInvalid ? true : undefined}
          aria-describedby={descriptionInvalid ? describedBy : undefined}
          onChange={() => {
            if (descriptionInvalid) setError(null);
          }}
          onKeyDown={(e) => {
            // Below 1024px Enter still submits, as it did with a one-line input.
            if (
              e.key === "Enter" &&
              !e.shiftKey &&
              !window.matchMedia("(min-width: 1024px)").matches
            ) {
              e.preventDefault();
              formRef.current?.requestSubmit();
            }
          }}
          className={`${INPUT} aria-invalid:border-[#B3261E] block resize-none overflow-hidden whitespace-pre lg:h-24 lg:overflow-auto lg:whitespace-pre-wrap`}
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
          aria-describedby={categoryInvalid ? describedBy : undefined}
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
          aria-describedby={dateInvalid ? describedBy : undefined}
          onChange={() => {
            if (dateInvalid) setError(null);
          }}
          className={`${INPUT} aria-invalid:border-[#B3261E]`}
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="disabled:opacity-60 col-span-2 rounded-[4px] bg-[#1C2A43] px-4 py-2 text-sm font-semibold text-[#F5F7F3] hover:bg-[#2B3B5C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1C2A43] sm:col-span-1 lg:col-span-1"
      >
        Add expense
      </button>

      {error && (
        <p
          id="expense-error"
          role="alert"
          className="col-span-2 text-sm text-[#B3261E] sm:col-span-5 lg:hidden"
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
