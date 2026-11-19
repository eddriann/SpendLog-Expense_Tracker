// app/actions.ts
"use server";

import connectDB from "../lib/db";
import Expense from "./models/Expense";
import Budget from "./models/Budget";
import { isCategory } from "../lib/categories";
import { todayInZone } from "../lib/format";
import { revalidatePath } from "next/cache";

export type ActionResult =
  { ok: true } | { ok: false; error: string; field?: "category" | "date" };

// True for a real calendar date written as YYYY-MM-DD (rejects 2026-02-31, "abc", etc.).
function isRealDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const d = new Date(`${value}T00:00:00Z`);
  return !isNaN(d.getTime()) && d.toISOString().slice(0, 10) === value;
}

export async function addExpense(formData: FormData): Promise<ActionResult> {
  const date = ((formData.get("date") as string | null) ?? "").trim();
  const description = (
    (formData.get("description") as string | null) ?? ""
  ).trim();
  const category = ((formData.get("category") as string | null) ?? "").trim();
  const amount = parseFloat(formData.get("amount") as string);

  // Checked on the server too, so a hand-edited request can't save any other category.
  if (!isCategory(category)) {
    return {
      ok: false,
      error: "Pick a category from the list.",
      field: "category",
    };
  }

  if (!isRealDate(date)) {
    return { ok: false, error: "Enter a valid date.", field: "date" };
  }

  // Only expenses that have already happened. ISO dates compare correctly as strings.
  if (date > todayInZone().iso) {
    return {
      ok: false,
      error: "The date can't be in the future. Pick today or an earlier date.",
      field: "date",
    };
  }

  if (!description || isNaN(amount) || amount <= 0) {
    return {
      ok: false,
      error: "Enter a description and an amount greater than 0.",
    };
  }

  try {
    await connectDB();

    await Expense.create({ date, description, category, amount });

    revalidatePath("/");
    return { ok: true };
  } catch (error) {
    console.error("Failed to save expense to MongoDB:", error);
    return { ok: false, error: "Couldn't save the expense. Try again." };
  }
}

export async function setBudget(formData: FormData) {
  const month = formData.get("month") as string;
  const amount = parseFloat(formData.get("amount") as string);

  if (!/^\d{4}-\d{2}$/.test(month) || isNaN(amount) || amount <= 0) {
    return;
  }

  try {
    await connectDB();
    await Budget.findOneAndUpdate({ month }, { amount }, { upsert: true });
    revalidatePath("/");
  } catch (error) {
    console.error("Failed to save budget:", error);
  }
}
