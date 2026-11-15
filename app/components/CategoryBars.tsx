import { money } from "../../lib/format";

type Row = { category: string; total: number };

export default function CategoryBars({ rows }: { rows: Row[] }) {
  if (rows.length === 0) return null;
  const max = Math.max(...rows.map((r) => r.total), 1);

  return (
    <section aria-labelledby="category-heading">
      <h3 id="category-heading" className="text-base font-semibold">
        By category
      </h3>
      <ul className="mt-4 space-y-3">
        {rows.map((r) => (
          <li
            key={r.category}
            className="grid grid-cols-[6.5rem_1fr_auto] items-center gap-x-4 sm:grid-cols-[10rem_1fr_auto]"
          >
            <span className="truncate" title={r.category}>
              {r.category}
            </span>
            <span
              aria-hidden="true"
              className="block h-1.5 rounded-[2px] bg-[#D5DDD7]"
            >
              <span
                className="block h-full rounded-[2px] bg-[#1C2A43]"
                style={{ width: `${Math.max((r.total / max) * 100, 2)}%` }}
              />
            </span>
            <span className="text-right tabular-nums">{money(r.total)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
