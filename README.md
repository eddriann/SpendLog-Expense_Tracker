# Expense Tracker

A personal expense tracker that answers one question first: **am I on pace to stay within this month's budget?**

You log expenses, set a monthly budget, and the home page tells you in plain language whether you're on track, projected to go over, or already over. A chart of cumulative spending against your budget shows how the month is going.

## Features

- **Budget status at a glance.** A sentence at the top of the page summarizes the month, for example "You're on pace to finish ₱160 under budget." or "At this pace you'll go ₱360 over budget by Nov 30."
- **Pace chart.** Cumulative spending, a dotted budget line, and a dashed projection to the end of the month.
- **Monthly budget.** One budget per month. If you haven't set one for the current month, the most recent earlier budget carries over until you save a new one.
- **Add expenses.** Amount, description, category and date. Categories are limited to a fixed list and validated in the browser and on the server.
- **Date filter.** Filter the ledger and category breakdown by a date range. The budget section always shows the current month.
- **Category breakdown.** Spending per category for the selected range, ranked from highest to lowest.
- **Ledger.** A table of recorded expenses, newest first.
- **Philippine peso (₱)** throughout, with dates and "this month" calculated in the Asia/Manila time zone.

## How the pace projection works

- Projected month-end spending = spent so far ÷ days elapsed × days in the month.
- In the first 3 days of a month the app doesn't project, because a single purchase would skew it.
- If spending already exceeds the budget, it reports how far over you are and how many days remain.
- Expenses dated after today don't count toward "spent so far."

## Tech stack

| Area | Technology |
| --- | --- |
| Framework | [Next.js](https://nextjs.org/) 15+ (App Router, Server Components, Server Actions) |
| Language | TypeScript |
| UI | React, [Tailwind CSS](https://tailwindcss.com/) |
| Database | [MongoDB](https://www.mongodb.com/) (cloud cluster) |
| ODM | [Mongoose](https://mongoosejs.com/) |
| Font | [Archivo](https://fonts.google.com/specimen/Archivo) via `next/font/google` |
| Charts | Hand-built server-rendered SVG (no chart library) |

Data is read directly in Server Components and written through Server Actions, so the app has no separate API routes.

## Project structure

```
app/
  page.tsx                  Home page: loads data, composes the sections
  actions.ts                Server actions: addExpense, setBudget
  components/
    BudgetHero.tsx          Month heading, budget form, status sentence, chart
    PaceChart.tsx           SVG chart: spent, budget and projected lines
    ExpenseForm.tsx         Add-expense form with validation errors
    DateFilter.tsx          Date range filter (client component)
    CategoryBars.tsx        Spending per category
    ExpenseTable.tsx        Ledger table
lib/
  db.ts                     Cached MongoDB connection
  pace.ts                   Budget status logic and sentences
  format.ts                 Currency, dates, time zone helpers
  categories.ts             Allowed expense categories
  theme.ts                  Color palette used by the chart
  fonts.ts                  Font setup
models/
  Expense.ts                Expense schema
  Budget.ts                 Budget schema
```

## Data model

**Expense**

| Field | Type | Notes |
| --- | --- | --- |
| `date` | string | `YYYY-MM-DD` |
| `description` | string | |
| `category` | string | One of the categories in `lib/categories.ts` |
| `amount` | number | Greater than 0 |
| `createdAt` | Date | Set automatically |

**Budget**

| Field | Type | Notes |
| --- | --- | --- |
| `month` | string | `YYYY-MM`, unique |
| `amount` | number | Monthly budget |

## Getting started

### Prerequisites

- Node.js 18.18 or newer
- A MongoDB database, such as a free MongoDB Atlas cluster

### Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env.local` file in the project root with your connection string:

   ```
   MONGODB_URI=your-mongodb-connection-string
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000).

Never commit `.env.local`. It is listed in `.gitignore`.

## Configuration

- **Currency symbol:** `CURRENCY` in `lib/format.ts`
- **Time zone:** `APP_TIME_ZONE` in `lib/format.ts`
- **Expense categories:** `lib/categories.ts` (the dropdown and the server validation both read this list)
