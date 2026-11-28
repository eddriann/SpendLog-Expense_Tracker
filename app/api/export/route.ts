import connectDB from "../../../lib/db";
import Expense from "../../models/Expense";
import { buildCsv, buildXlsx, parseExportQuery, type ExportRow } from "../../../lib/export";

export const dynamic = "force-dynamic";

function fail(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

export async function GET(req: Request) {
  const parsed = parseExportQuery(new URL(req.url).searchParams);
  if (!parsed.ok) return fail(parsed.error, 400);
  const { from, to, format, filename } = parsed.request;

  let rows: ExportRow[];
  try {
    await connectDB();
    const docs = await Expense.find({ date: { $gte: from, $lte: to } })
      .sort({ date: 1, _id: 1 })
      .lean();
    rows = docs.map((d: any) => ({
      date: String(d.date),
      description: String(d.description),
      category: String(d.category),
      amount: Number(d.amount),
    }));
  } catch (error) {
    console.error("Export failed:", error);
    return fail("Couldn't load the expenses. Try again.", 500);
  }

  if (rows.length === 0) {
    return fail(
      from === to ? "No expenses on that day." : "No expenses in that month.",
      404,
    );
  }

  const body = format === "csv" ? buildCsv(rows) : await buildXlsx(rows);
  const type =
    format === "csv"
      ? "text/csv; charset=utf-8"
      : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

  return new Response(body as BodyInit, {
    headers: {
      "Content-Type": type,
      "Content-Disposition": `attachment; filename="${filename}.${format}"`,
      "Cache-Control": "no-store",
    },
  });
}