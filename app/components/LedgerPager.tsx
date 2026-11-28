import Link from "next/link";
import { shortDate } from "../../lib/format";

type Props = {
  page: number; // 1 = the most recent days
  pageCount: number;
  firstDate: string; // newest day on this page
  lastDate: string; // oldest day on this page
  currentYear: number;
  start?: string; // active date filter, kept in the links
  end?: string;
};

export default function LedgerPager({
  page,
  pageCount,
  firstDate,
  lastDate,
  currentYear,
  start,
  end,
}: Props) {
  if (pageCount <= 1) return null;

  const href = (p: number) => {
    const q = new URLSearchParams();
    if (start) q.set("start", start);
    if (end) q.set("end", end);
    if (p > 1) q.set("page", String(p));
    const qs = q.toString();
    return qs ? `/?${qs}` : "/";
  };

  const LINK =
    "text-sm font-semibold text-[#1C2A43] underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1C2A43]";
  const OFF = "text-sm text-[#9AA6B8]";

  const range =
    firstDate === lastDate
      ? shortDate(firstDate, currentYear)
      : `${shortDate(lastDate, currentYear)} to ${shortDate(firstDate, currentYear)}`;

  return (
    <nav
      aria-label="Expenses pages"
      className="mt-8 flex items-center justify-between border-t border-[#D5DDD7] pt-4"
    >
      {page > 1 ? (
        <Link href={href(page - 1)} className={LINK}>
          Newer
        </Link>
      ) : (
        <span className={OFF}>Newer</span>
      )}

      <p className="text-sm text-[#5E6D84]" aria-live="polite">
        {range}. Page {page} of {pageCount}.
      </p>

      {page < pageCount ? (
        <Link href={href(page + 1)} className={LINK}>
          Older
        </Link>
      ) : (
        <span className={OFF}>Older</span>
      )}
    </nav>
  );
}
