// app/components/DateFilter.tsx
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

const INPUT =
  "rounded-[4px] border border-[#D5DDD7] bg-white px-3 py-1.5 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1C2A43]";
const LABEL = "mb-1 block text-sm text-[#5E6D84]";

export default function DateFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [start, setStart] = useState(searchParams.get("start") || "");
  const [end, setEnd] = useState(searchParams.get("end") || "");

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (start) params.set("start", start);
    if (end) params.set("end", end);

    const qs = params.toString();
    router.push(qs ? `/?${qs}` : "/");
  };

  const handleReset = () => {
    setStart("");
    setEnd("");
    router.push("/");
  };

  return (
    <form onSubmit={handleFilter} className="flex flex-wrap items-end gap-3">
      <div>
        <label htmlFor="filter-from" className={LABEL}>
          From
        </label>
        <input
          id="filter-from"
          type="date"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          className={INPUT}
        />
      </div>

      <div>
        <label htmlFor="filter-to" className={LABEL}>
          To
        </label>
        <input
          id="filter-to"
          type="date"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          className={INPUT}
        />
      </div>

      <button
        type="submit"
        className="rounded-[4px] bg-[#1C2A43] px-4 py-1.5 text-sm font-semibold text-[#F5F7F3] hover:bg-[#2B3B5C] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1C2A43]"
      >
        Apply
      </button>
      <button
        type="button"
        onClick={handleReset}
        className="px-1 py-1.5 text-sm font-semibold text-[#1C2A43] underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1C2A43]"
      >
        Clear
      </button>
    </form>
  );
}
