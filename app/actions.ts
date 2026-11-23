"use server";

import connectDB from "../lib/db";
import Expense from "./models/Expense";
import Budget from "./models/Budget";
import { isCategory } from "../lib/categories";
import { checkDate, parseAmount } from "../lib/validation";
import { revalidatePath } from "next/cache";

export type ActionResult =
  | { ok: true }
  | { ok: false; error: string; field?: "category" | "date" | "amount" };


function text(formData: FormData, key: string): string {
  const v = formData.get(key);
  return typeof v === "string" ? v.trim() : "";
}

export async function addExpense(formData: FormData): Promise<ActionResult> {
  const date = text(formData, "date");
  const description = text(formData, "description");
  const category = text(formData, "category");

  // Everything is checked here too, so a request that skips the form can't save bad data.
  if (!isCategory(category)) {
    return {
      ok: false,
      error: "Pick a category from the list.",
      field: "category",
    };
  }

  const dateError = checkDate(date);
  if (dateError) {
    return { ok: false, error: dateError, field: "date" };
  }

  const parsed = parseAmount(text(formData, "amount"));
  if (!parsed.ok) {
    return { ok: false, error: parsed.error, field: "amount" };
  }
  const amount = parsed.value;

  if (!description) {
    return { ok: false, error: "Enter a description." };
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
