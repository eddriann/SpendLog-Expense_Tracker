// The only categories an expense can be saved with. Used by the form (dropdown)
export const CATEGORIES = [
  "Food & Dining",
  "Transportation",
  "Utilities",
  "Entertainment",
  "Shopping",
] as const;

export type Category = (typeof CATEGORIES)[number];

export function isCategory(value: string): value is Category {
  return (CATEGORIES as readonly string[]).includes(value);
}
