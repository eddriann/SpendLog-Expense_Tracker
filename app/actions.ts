"use server";

import connectDB from "./lib/db";
import Expense from "./models/Expense";
import Budget from "../models/Budget";
import { isCategory } from "../lib/categories";
import { revalidatePath } from "next/cache";

export type ActionResult =
  { ok: true } | { ok: false; error: string; field?: "category" };

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

  if (!date || !description || isNaN(amount) || amount <= 0) {
    return {
      ok: false,
      error: "Enter a date, a description and an amount greater than 0.",
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
