export const CURRENCY = "₱";
export const APP_TIME_ZONE = "Asia/Manila";

const wholeFmt = new Intl.NumberFormat("en-PH", { maximumFractionDigits: 0 });
const centsFmt = new Intl.NumberFormat("en-PH", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** ₱1,234.50 */
export function money(n: number): string {
  return `${CURRENCY}${centsFmt.format(n)}`;
}

/** ₱1,235 (rounded, for sentences) */
export function moneyWhole(n: number): string {
  const v = Math.round(n);
  return `${CURRENCY}${wholeFmt.format(v === 0 ? 0 : v)}`;
}

/** ₱1.2k (for chart axes) */
export function moneyCompact(n: number): string {
  if (n >= 1000) {
    const k = n / 1000;
    return `${CURRENCY}${Number.isInteger(k) ? k : k.toFixed(1)}k`;
  }
  return `${CURRENCY}${Math.round(n)}`;
}

/** "2026-11" -> "November 2026" */
export function monthLabel(ym: string): string {
  const [y, m] = ym.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

/** "2026-11" -> "Nov" */
export function monthShort(ym: string): string {
  const [y, m] = ym.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString("en-US", {
    month: "short",
    timeZone: "UTC",
  });
}

/** "2026-11-15" -> "Nov 15" (adds the year when it isn't the current year) */
export function shortDate(iso: string, currentYear: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const opts: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  };
  if (y !== currentYear) opts.year = "numeric";
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", opts);
}

/** "2026-11-23" -> "Mon, Nov 23" (adds the year when it isn't the current year) */
export function dayHeading(iso: string, currentYear: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const opts: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  };
  if (y !== currentYear) opts.year = "numeric";
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", opts);
}

/** Today's date parts in APP_TIME_ZONE, so "this month" doesn't flip at the wrong hour. */
export function todayInZone(now: Date = new Date()) {
  const iso = now.toLocaleDateString("en-CA", { timeZone: APP_TIME_ZONE }); // YYYY-MM-DD
  const [year, month, day] = iso.split("-").map(Number);
  return {
    iso,
    month: iso.slice(0, 7), // YYYY-MM
    year,
    day,
    daysInMonth: new Date(Date.UTC(year, month, 0)).getUTCDate(),
  };
}
