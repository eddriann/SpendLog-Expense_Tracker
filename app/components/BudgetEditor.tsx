"use client";

import { useState } from "react";
import { setBudget } from "../actions";

const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1C2A43]";

type Props = {
  month: string; // YYYY-MM
  budget: number | null;
  mode: "link" | "prompt";
};

export default function BudgetEditor({ month, budget, mode }: Props) {
  const [open, setOpen] = useState(false);

  async function save(formData: FormData) {
    await setBudget(formData);
    setOpen(false);
  }

  if (mode === "prompt") {
    return (
      <form action={save} className="mt-8 max-w-sm">
        <input type="hidden" name="month" value={month} />
        <label
          htmlFor="budget-prompt-amount"
          className="block text-base font-semibold"
        >
          How much do you want to spend this month?
        </label>
        <div className="mt-3 flex items-stretch gap-2">
          <input
            id="budget-prompt-amount"
            type="number"
            name="amount"
            step="0.01"
            min="0.01"
            inputMode="decimal"
            required
            placeholder="₱0.00"
            className={`w-full rounded-[4px] border border-[#D5DDD7] bg-white px-3 py-2 text-2xl font-semibold tabular-nums ${FOCUS}`}
          />
          <button
            type="submit"
            className={`shrink-0 rounded-[4px] bg-[#1C2A43] px-4 text-sm font-semibold text-[#F5F7F3] hover:bg-[#2B3B5C] ${FOCUS}`}
          >
            Save budget
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="flex flex-col items-end">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="budget-edit-form"
        onClick={() => setOpen((o) => !o)}
        className={`text-sm font-semibold text-[#1C2A43] underline underline-offset-4 ${FOCUS}`}
      >
        {open ? "Close" : "Edit budget"}
      </button>

      {open && (
        <form
          id="budget-edit-form"
          action={save}
          className="mt-3 flex items-end gap-2"
        >
          <input type="hidden" name="month" value={month} />
          <div>
            <label
              htmlFor="budget-edit-amount"
              className="mb-1 block text-sm text-[#5E6D84]"
            >
              Monthly budget (₱)
            </label>
            <input
              id="budget-edit-amount"
              type="number"
              name="amount"
              step="0.01"
              min="0.01"
              inputMode="decimal"
              required
              autoFocus
              defaultValue={budget ?? ""}
              placeholder="0.00"
              className={`w-36 rounded-[4px] border border-[#D5DDD7] bg-white px-3 py-2 text-sm tabular-nums ${FOCUS}`}
            />
          </div>
          <button
            type="submit"
            className={`rounded-[4px] bg-[#1C2A43] px-4 py-2 text-sm font-semibold text-[#F5F7F3] hover:bg-[#2B3B5C] ${FOCUS}`}
          >
            Save budget
          </button>
        </form>
      )}
    </div>
  );
}
