// app/actions.ts
"use server";

import connectDB from "./lib/db";
import Expense from "./models/Expense";
import { revalidatePath } from "next/cache";

export async function addExpense(formData: FormData) {
  const date = formData.get("date") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const amount = parseFloat(formData.get("amount") as string);

  if (!date || !description || !category || isNaN(amount) || amount <= 0) {
    return;
  }

  try {
    await connectDB();

    await Expense.create({
      date,
      description: description.trim(),
      category: category.trim(),
      amount,
    });

    revalidatePath("/");
  } catch (error) {
    console.error("Failed to save expense to MongoDB:", error);
  }
}
