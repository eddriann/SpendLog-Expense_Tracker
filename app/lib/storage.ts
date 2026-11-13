import fs from "fs";
import path from "path";

export type Expense = {
  id: number;
  date: string; // YYYY-MM-DD
  description: string;
  category: string;
  amount: number;
};

const filePath = path.join(process.cwd(), "data.json");

// Read all expenses from data.json
export function getExpenses(): Expense[] {
  try {
    if (!fs.existsSync(filePath)) {
      return [];
    }
    const fileData = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(fileData);
  } catch (error) {
    console.error("Error reading data.json:", error);
    return [];
  }
}

// Save a new expense to data.json
export function saveExpense(newExpense: Omit<Expense, "id">) {
  const expenses = getExpenses();

  // Generate a unique ID based on timestamp
  const expenseWithId: Expense = {
    id: Date.now(),
    ...newExpense,
  };

  expenses.unshift(expenseWithId); // Add to the beginning of the list
  fs.writeFileSync(filePath, JSON.stringify(expenses, null, 2));
}
