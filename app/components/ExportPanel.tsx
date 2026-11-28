"use client";

import { useState } from "react";
import { todayInZone } from "../../lib/format";
import { isRealDate } from "../../lib/validation";

const FIELD =
  "rounded-[4px] border border-[#D5DDD7] bg-white px-3 py-1.5 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1C2A43]";
const LABEL = "mb-1 block text-sm text-[#5E6D84]";

type Period = "day" | "month";
type Format = "csv" | "xlsx";

export default function ExportPanel() {
  const today = todayInZone();
  const [period, setPeriod] = useState<Period>("day");
  const [day, setDay] = useState(today.iso);
  const [month, setMonth] = useState(today.month);
  const [format, setFormat] = useState<Format>("csv");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ text: string; bad: boolean } | null>(
    null,
  );

  async function download(e: React.FormEvent) {
    e.preventDefault();
    setMessage(null);

    if (period === "day" && !isRealDate(day)) {
      setMessage({ text: "Pick a valid day.", bad: true });
      return;
    }
    if (period === "month" && !/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
      setMessage({ text: "Pick a valid month.", bad: true });
      return;
    }

    const params = new URLSearchParams({ period, format });
    if (period === "day") params.set("date", day);
    else params.set("month", month);

    setBusy(true);
    try {
      const res = await fetch(`/api/export?${params.toString()}`);
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        setMessage({
          text: body?.error ?? "Couldn't export. Try again.",
          bad: true,
        });
        return;
      }
      const name = `expenses-${period === "day" ? day : month}.${format}`;
      const url = URL.createObjectURL(await res.blob());
      const a = document.createElement("a");
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setMessage({ text: `Downloaded ${name}.`, bad: false });
    } catch {
      setMessage({
        text: "Couldn't export. Check your connection and try again.",
        bad: true,
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <section
      aria-labelledby="export-heading"
      className="mt-14 border-t border-[#D5DDD7] pt-6"
    >
      <h2 id="export-heading" className="text-xl font-semibold">
        Export
      </h2>

      <form
        onSubmit={download}
        className="mt-4 flex flex-wrap items-end gap-x-4 gap-y-3"
      >
        <div>
          <label htmlFor="export-period" className={LABEL}>
            Period
          </label>
          <select
            id="export-period"
            value={period}
            onChange={(e) => {
              setPeriod(e.target.value as Period);
              setMessage(null);
            }}
            className={FIELD}
          >
            <option value="day">One day</option>
            <option value="month">One month</option>
          </select>
        </div>

        <div>
          <label htmlFor="export-when" className={LABEL}>
            {period === "day" ? "Day" : "Month"}
          </label>
          {period === "day" ? (
            <input
              id="export-when"
              type="date"
              value={day}
              max={today.iso}
              required
              onChange={(e) => {
                setDay(e.target.value);
                setMessage(null);
              }}
              className={FIELD}
            />
          ) : (
            <input
              id="export-when"
              type="month"
              value={month}
              max={today.month}
              required
              onChange={(e) => {
                setMonth(e.target.value);
                setMessage(null);
              }}
              className={FIELD}
            />
          )}
        </div>

        <div>
          <label htmlFor="export-format" className={LABEL}>
            File type
          </label>
          <select
            id="export-format"
            value={format}
            onChange={(e) => setFormat(e.target.value as Format)}
            className={FIELD}
          >
            <option value="csv">CSV (.csv)</option>
            <option value="xlsx">Excel (.xlsx)</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={busy}
          className="rounded-[4px] bg-[#1C2A43] px-4 py-1.5 text-sm font-semibold text-[#F5F7F3] hover:bg-[#2B3B5C] disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1C2A43]"
        >
          {busy ? "Preparing…" : "Download"}
        </button>
      </form>

      {message && (
        <p
          role={message.bad ? "alert" : "status"}
          className={`mt-3 text-sm ${message.bad ? "text-[#B3261E]" : "text-[#1C2A43]"}`}
        >
          {message.text}
        </p>
      )}
    </section>
  );
}
