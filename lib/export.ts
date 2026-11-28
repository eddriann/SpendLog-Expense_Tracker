
import ExcelJS from "exceljs";
import { isRealDate } from "./validation";

export type ExportRow = {
  date: string;
  description: string;
  category: string;
  amount: number;
};

export type ExportRequest = {
  from: string; // YYYY-MM-DD, inclusive
  to: string; // YYYY-MM-DD, inclusive
  format: "csv" | "xlsx";
  filename: string; // without extension
};

const HEADERS = ["Date", "Description", "Category", "Amount"];


export function parseExportQuery(
  params: URLSearchParams,
): { ok: true; request: ExportRequest } | { ok: false; error: string } {
  const format = params.get("format");
  if (format !== "csv" && format !== "xlsx") {
    return { ok: false, error: "Choose CSV or Excel." };
  }

  const period = params.get("period");
  if (period === "day") {
    const date = params.get("date") ?? "";
    if (!isRealDate(date)) return { ok: false, error: "Pick a valid day." };
    return {
      ok: true,
      request: { from: date, to: date, format, filename: `expenses-${date}` },
    };
  }

  if (period === "month") {
    const month = params.get("month") ?? "";
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
      return { ok: false, error: "Pick a valid month." };
    }
    return {
      ok: true,
      request: {
        from: `${month}-01`,
        to: `${month}-31`,
        format,
        filename: `expenses-${month}`,
      },
    };
  }

  return { ok: false, error: "Choose a day or a month." };
}


function csvCell(value: string): string {
  const safe = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return `"${safe.replace(/"/g, '""')}"`;
}

/** UTF-8 CSV with a byte-order mark, so Excel reads the ₱ sign and accents correctly. */
export function buildCsv(rows: ExportRow[]): string {
  const lines = [HEADERS.join(",")];
  for (const r of rows) {
    lines.push(
      [
        csvCell(r.date),
        csvCell(r.description),
        csvCell(r.category),
        r.amount.toFixed(2),
      ].join(","),
    );
  }
  return "﻿" + lines.join("\r\n") + "\r\n";
}

/** Excel file with real numbers in the Amount column and a total row at the bottom. */
export async function buildXlsx(rows: ExportRow[]): Promise<Uint8Array> {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Expenses");
  ws.columns = [
    { header: HEADERS[0], key: "date", width: 14 },
    { header: HEADERS[1], key: "description", width: 44 },
    { header: HEADERS[2], key: "category", width: 20 },
    { header: HEADERS[3], key: "amount", width: 16, style: { numFmt: '"₱"#,##0.00' } },
  ];
  ws.getRow(1).font = { bold: true };
  ws.views = [{ state: "frozen", ySplit: 1 }];

  for (const r of rows) ws.addRow(r);

  const total = rows.reduce((sum, r) => sum + r.amount, 0);
  const last = rows.length + 1;
  const totalRow = ws.addRow({ date: "Total" });
  totalRow.getCell("amount").value = {
    formula: `SUM(D2:D${last})`,
    result: Math.round(total * 100) / 100,
  };
  totalRow.font = { bold: true };

  return new Uint8Array(await wb.xlsx.writeBuffer());
}
