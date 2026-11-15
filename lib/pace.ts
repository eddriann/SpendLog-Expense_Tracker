// lib/pace.ts
// Turns "spent so far + budget + day of month" into the sentence the page leads with.
import { moneyWhole, monthShort } from "./format";

export type Tone = "ok" | "warn" | "over";
export type PaceState =
  | "no-budget"
  | "early"
  | "on-pace"
  | "projected-over"
  | "over";

export type PaceSummary = {
  state: PaceState;
  tone: Tone;
  headline: string;
  detail: string;
  spent: number;
  projected: number;
  daysLeft: number;
};

/** Projections are too noisy in the first few days of a month. */
export const EARLY_DAYS = 3;

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

export function summarizePace(input: {
  month: string; // YYYY-MM
  day: number; // 1-based day of month
  daysInMonth: number;
  spent: number;
  budget: number | null;
}): PaceSummary {
  const { month, day, daysInMonth, spent, budget } = input;
  const daysLeft = Math.max(daysInMonth - day, 0);
  const projected = day > 0 ? (spent / day) * daysInMonth : 0;
  const base = { spent, projected, daysLeft };

  if (!budget || budget <= 0) {
    return {
      ...base,
      state: "no-budget",
      tone: "ok",
      headline: "Set a monthly budget to see if you're on pace.",
      detail: `${moneyWhole(spent)} spent so far this month.`,
    };
  }

  if (spent > budget) {
    return {
      ...base,
      state: "over",
      tone: "over",
      headline:
        daysLeft > 0
          ? `You're ${moneyWhole(spent - budget)} over budget with ${plural(daysLeft, "day")} left.`
          : `You're ${moneyWhole(spent - budget)} over budget this month.`,
      detail: `${moneyWhole(spent)} spent of ${moneyWhole(budget)}.`,
    };
  }

  if (day <= EARLY_DAYS) {
    return {
      ...base,
      state: "early",
      tone: "ok",
      headline: `Too early to project. ${moneyWhole(spent)} spent so far.`,
      detail: `${moneyWhole(budget - spent)} left of ${moneyWhole(budget)}.`,
    };
  }

  const perDay = daysLeft > 0 ? (budget - spent) / daysLeft : 0;

  if (projected > budget) {
    return {
      ...base,
      state: "projected-over",
      tone: "warn",
      headline: `At this pace you'll go ${moneyWhole(projected - budget)} over budget by ${monthShort(month)} ${daysInMonth}.`,
      detail:
        daysLeft > 0
          ? `${moneyWhole(spent)} spent of ${moneyWhole(budget)}. To stay under, keep it to about ${moneyWhole(perDay)} a day for the remaining ${plural(daysLeft, "day")}.`
          : `${moneyWhole(spent)} spent of ${moneyWhole(budget)}.`,
    };
  }

  const under = budget - projected;
  return {
    ...base,
    state: "on-pace",
    tone: "ok",
    headline:
      Math.round(under) === 0
        ? "You're on pace to land right on budget."
        : `You're on pace to finish ${moneyWhole(under)} under budget.`,
    detail:
      daysLeft > 0
        ? `${moneyWhole(spent)} spent of ${moneyWhole(budget)}. You can spend about ${moneyWhole(perDay)} a day for the remaining ${plural(daysLeft, "day")}.`
        : `${moneyWhole(spent)} spent of ${moneyWhole(budget)}.`,
  };
}
