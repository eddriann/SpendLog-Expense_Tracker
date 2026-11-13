"use server";

import { saveExpense } from "./lib/storage";
import { revalidatePath } from "next/cache";

export async function addExpense(formData: FormData) {
  const date = formData.get("date") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const amount = parseFloat(formData.get("amount") as string);

  if (!date || !description || !category || isNaN(amount) || amount <= 0) {
    return;
  }

  // Save directly to local data.json
  saveExpense({
    date,
    description: description.trim(),
    category: category.trim(),
    amount,
  });

  // Refresh the page data instantly
  revalidatePath("/");
}
