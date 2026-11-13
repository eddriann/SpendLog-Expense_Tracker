"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function DateFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [startDate, setStartDate] = useState(searchParams.get("start") || "");
  const [endDate, setEndDate] = useState(searchParams.get("end") || "");

  function applyFilter(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (startDate) params.set("start", startDate);
    if (endDate) params.set("end", endDate);
    router.push(`/?${params.toString()}`);
  }

  function clearFilter() {
    setStartDate("");
    setEndDate("");
    router.push("/");
  }

  return (
    <form
      onSubmit={applyFilter}
      className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-wrap items-end gap-4"
    >
      <div>
        <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
          Start Date (Inclusive)
        </label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border border-gray-300 rounded-md p-2 text-sm bg-white"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">
          End Date (Inclusive)
        </label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border border-gray-300 rounded-md p-2 text-sm bg-white"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-medium py-2 px-4 rounded-md"
        >
          Apply Range
        </button>
        {(startDate || endDate) && (
          <button
            type="button"
            onClick={clearFilter}
            className="bg-white hover:bg-gray-100 text-gray-700 border border-gray-300 text-sm font-medium py-2 px-4 rounded-md"
          >
            Reset
          </button>
        )}
      </div>
    </form>
  );
}
