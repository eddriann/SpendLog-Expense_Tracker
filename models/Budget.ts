// models/Budget.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IBudget extends Document {
  month: string; // YYYY-MM
  amount: number;
}

const BudgetSchema: Schema = new Schema({
  month: { type: String, required: true, unique: true },
  amount: { type: Number, required: true, min: 0 },
});

export default mongoose.models.Budget ||
  mongoose.model<IBudget>("Budget", BudgetSchema);
