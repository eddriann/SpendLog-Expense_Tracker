import { setBudget } from "../actions";
import { monthLabel } from "../../lib/format";
import { summarizePace } from "../../lib/pace";
import { C } from "../../lib/theme";
import BudgetEditor from "./BudgetEditor";
import PaceChart from "./PaceChart";

type Props = {
  month: string; // YYYY-MM
  day: number;
  daysInMonth: number;
  daily: number[];
  budget: number | null;
  carriedFrom: string | null;
};

const MARKER = { ok: C.ink, warn: C.amber, over: C.crimson } as const;

export default function BudgetHero({
  month,
  day,
  daysInMonth,
  daily,
  budget,
  carriedFrom,
}: Props) {
  const spent = daily.slice(0, day).reduce((a, b) => a + b, 0);
  const pace = summarizePace({ month, day, daysInMonth, spent, budget });

  return (
    <section aria-labelledby="month-heading">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
        <h1 id="month-heading" className="text-xl font-semibold text-[#5E6D84]">
          {monthLabel(month)}
        </h1>

        {/* Below 1024px: the budget form, always visible. */}
        <form action={setBudget} className="flex items-end gap-2 lg:hidden">
          <input type="hidden" name="month" value={month} />
          <div>
            <label
              htmlFor="budget-amount"
              className="mb-1 block text-sm text-[#5E6D84]"
            >
              Monthly budget (₱)
            </label>
            <input
              id="budget-amount"
              type="number"
              name="amount"
              step="0.01"
              min="0.01"
              inputMode="decimal"
              required
              defaultValue={budget ?? ""}
              placeholder="0.00"
              className="w-36 rounded-[4px] border border-[#D5DDD7] bg-white px-3 py-2 text-sm tabular-nums focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1C2A43]"
            />
          </div>
          <button
            type="submit"
            className="rounded-[4px] bg-[#1C2A43] px-4 py-2 text-sm font-semibold text-[#F5F7F3] hover:bg-[#2B3B5C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1C2A43]"
          >
            Save budget
          </button>
        </form>

        {/* From 1024px: a quiet "Edit budget" link once a budget exists. */}
        {budget != null && (
          <div className="hidden lg:block">
            <BudgetEditor month={month} budget={budget} mode="link" />
          </div>
        )}
      </div>

      {carriedFrom && (
        <p className="mt-2 text-right text-sm text-[#5E6D84]">
          Carried over from {monthLabel(carriedFrom)}. Saving sets a budget for{" "}
          {monthLabel(month)}.
        </p>
      )}

      <div className="lg:mt-10 lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-14">
        <div>
          <h2
            className="mt-10 max-w-[24ch] text-[clamp(2rem,5.5vw,3rem)] font-bold leading-[1.08] tracking-[-0.01em] text-[#1C2A43] lg:mt-0"
            style={{
              fontVariationSettings: '"wdth" 72',
              textWrap: "balance",
            }}
          >
            {pace.headline}
          </h2>

          <p className="mt-4 flex max-w-[62ch] items-start gap-3 text-base leading-relaxed text-[#1C2A43]">
            <span
              aria-hidden="true"
              className="mt-[0.5em] inline-block h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ backgroundColor: MARKER[pace.tone] }}
            />
            <span>{pace.detail}</span>
          </p>

          {/* From 1024px, with no budget yet: a large first-run question. */}
          {budget == null && (
            <div className="hidden lg:block">
              <BudgetEditor month={month} budget={null} mode="prompt" />
            </div>
          )}
        </div>

        <div className="mt-8 lg:mt-0">
          <PaceChart
            daily={daily}
            day={day}
            daysInMonth={daysInMonth}
            budget={budget}
            tone={pace.tone}
            label={`${pace.headline} Chart of cumulative spending against the monthly budget.`}
          />
        </div>
      </div>
    </section>
  );
}
