// lib/categories.ts
// The only categories an expense can be saved with. Used by the form (dropdown)
// and by the server action (validation), so the two can't drift apart.
// This lives outside actions.ts because "use server" files can only export async functions.
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
