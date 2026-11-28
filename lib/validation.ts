import { moneyWhole, todayInZone } from "./format";

// Max amount that can be inserted
export const MAX_AMOUNT = 1_000_000_000;


export function isRealDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(`${value}T00:00:00Z`);
  return !isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

// Validate if the date is in the future
export function checkDate(value: string): string | null {
  if (!isRealDate(value)) return "Enter a valid date.";
  // ISO dates compare correctly as strings. "Today" is in the app's time zone.
  if (value > todayInZone().iso) {
    return "The date can't be in the future. Pick today or an earlier date.";
  }
  return null;
}

export type AmountResult =
  | { ok: true; value: number }
  | { ok: false; error: string };


export function parseAmount(raw: string): AmountResult {
  const s = raw.trim();

  if (!/^(\d+(\.\d{1,2})?|\.\d{1,2})$/.test(s)) {
    return {
      ok: false,
      error: "Enter an amount greater than 0, with up to 2 decimal places.",
    };
  }

  const value = Number(s);

  if (value <= 0) {
    return { ok: false, error: "The amount must be greater than 0." };
  }
  if (value > MAX_AMOUNT) {
    return {
      ok: false,
      error: `The amount can't be more than ${moneyWhole(MAX_AMOUNT)}.`,
    };
  }

  return { ok: true, value };
}
