import mongoose, { Schema, Document } from "mongoose";

export interface IExpense extends Document {
  date: string; // YYYY-MM-DD
  description: string;
  category: string;
  amount: number;
  createdAt: Date;
}

const ExpenseSchema: Schema = new Schema({
  date: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Expense ||
  mongoose.model<IExpense>("Expense", ExpenseSchema);
