import { moneyCompact } from "../../lib/format";
import { C } from "../../lib/theme";
import { EARLY_DAYS, type Tone } from "../../lib/pace";

type Props = {
  daily: number[]; // spending per day, index 0 = day 1, length = days in month
  day: number; // today (1-based)
  daysInMonth: number;
  budget: number | null;
  tone: Tone;
  label: string; // accessible description of the chart
};

type Variant = {
  w: number;
  h: number;
  padL: number;
  padR: number;
  padT: number;
  padB: number;
  font: number;
  tickEvery: number;
  className: string;
};

const DESKTOP: Variant = {
  w: 860,
  h: 300,
  padL: 56,
  padR: 84,
  padT: 16,
  padB: 34,
  font: 12,
  tickEvery: 5,
  className: "hidden sm:block h-auto w-full",
};

const MOBILE: Variant = {
  w: 380,
  h: 220,
  padL: 46,
  padR: 64,
  padT: 14,
  padB: 30,
  font: 11,
  tickEvery: 10,
  className: "block sm:hidden h-auto w-full",
};

// Draw the spent line left to right once on load. Skipped for reduced motion.
const CSS = `@keyframes pace-draw{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}
.pace-draw{stroke-dasharray:1;animation:pace-draw 700ms ease-out both}
@media (prefers-reduced-motion:reduce){.pace-draw{animation:none}}`;

/** Smallest "round" step so that four steps cover the top value with a little headroom. */
function niceStep(maxVal: number): number {
  const target = (maxVal * 1.08) / 4;
  const pow = Math.pow(10, Math.floor(Math.log10(target)));
  for (const m of [1, 2, 2.5, 5, 10]) {
    if (m * pow >= target) return m * pow;
  }
  return 10 * pow;
}

const f = (n: number) => n.toFixed(1);

function Chart({
  v,
  daily,
  day,
  daysInMonth,
  budget,
  tone,
  label,
}: Props & { v: Variant }) {
  const cum: number[] = [];
  let run = 0;
  for (let i = 0; i < day; i++) {
    run += daily[i] ?? 0;
    cum.push(run);
  }
  const spent = run;

  const showProjection = day > EARLY_DAYS && day < daysInMonth && spent > 0;
  const projected = showProjection ? (spent / day) * daysInMonth : spent;

  const top = Math.max(budget ?? 0, spent, showProjection ? projected : 0, 1);
  const step = niceStep(top);
  const yMax = step * 4;

  const plotW = v.w - v.padL - v.padR;
  const plotH = v.h - v.padT - v.padB;
  const x = (d: number) => v.padL + (d / daysInMonth) * plotW;
  const y = (val: number) => v.padT + (1 - val / yMax) * plotH;

  const projColor =
    tone === "over" ? C.crimson : tone === "warn" ? C.amber : C.slate;

  const spentD = [
    `M ${f(x(0))} ${f(y(0))}`,
    ...cum.map((val, i) => `L ${f(x(i + 1))} ${f(y(val))}`),
  ].join(" ");

  const yTicks = [0, 1, 2, 3, 4].map((i) => i * step);
  const xTicks: number[] = [1];
  for (let d = v.tickEvery; d <= daysInMonth; d += v.tickEvery) xTicks.push(d);

  // Direct labels on the right edge instead of a legend; nudge apart if they collide.
  const rightLabels: { text: string; y: number; fill: string }[] = [];
  if (budget != null)
    rightLabels.push({ text: "budget", y: y(budget), fill: C.slate });
  if (showProjection)
    rightLabels.push({ text: "projected", y: y(projected), fill: C.ink });
  rightLabels.sort((a, b) => a.y - b.y);
  for (let i = 1; i < rightLabels.length; i++) {
    const minY = rightLabels[i - 1].y + v.font + 4;
    if (rightLabels[i].y < minY) rightLabels[i].y = minY;
  }

  const spentLabelY =
    y(spent) - 10 < v.padT + v.font ? y(spent) + v.font + 8 : y(spent) - 10;

  return (
    <svg
      viewBox={`0 0 ${v.w} ${v.h}`}
      role="img"
      aria-label={label}
      className={v.className}
      style={{ fontVariantNumeric: "tabular-nums" }}
    >
      {yTicks.map((t) => (
        <g key={t}>
          <line
            x1={v.padL}
            x2={v.w - v.padR}
            y1={y(t)}
            y2={y(t)}
            stroke={C.rule}
            strokeWidth={1}
          />
          <text
            x={v.padL - 8}
            y={y(t) + 4}
            textAnchor="end"
            fontSize={v.font}
            fill={C.slate}
          >
            {moneyCompact(t)}
          </text>
        </g>
      ))}

      {xTicks.map((d) => (
        <text
          key={d}
          x={x(d)}
          y={v.h - v.padB + v.font + 8}
          textAnchor="middle"
          fontSize={v.font}
          fill={C.slate}
        >
          {d}
        </text>
      ))}

      {budget != null && (
        <line
          x1={x(0)}
          x2={x(daysInMonth)}
          y1={y(budget)}
          y2={y(budget)}
          stroke={C.slate}
          strokeWidth={2}
          strokeDasharray="1 5"
          strokeLinecap="round"
        />
      )}

      {showProjection && (
        <>
          <line
            x1={x(day)}
            y1={y(spent)}
            x2={x(daysInMonth)}
            y2={y(projected)}
            stroke={projColor}
            strokeWidth={2.5}
            strokeDasharray="8 5"
          />
          <circle
            cx={x(daysInMonth)}
            cy={y(projected)}
            r={3.5}
            fill={projColor}
          />
        </>
      )}

      <path
        d={spentD}
        fill="none"
        stroke={C.ink}
        strokeWidth={2.5}
        strokeLinejoin="round"
        strokeLinecap="round"
        pathLength={1}
        className="pace-draw"
      />
      <circle
        cx={x(day)}
        cy={y(spent)}
        r={4.5}
        fill={C.ink}
        stroke={C.paper}
        strokeWidth={2}
      />
      <text
        x={x(day) - 8}
        y={spentLabelY}
        textAnchor="end"
        fontSize={v.font}
        fill={C.ink}
      >
        spent
      </text>

      {rightLabels.map((l) => (
        <text
          key={l.text}
          x={v.w - v.padR + 8}
          y={l.y + 4}
          fontSize={v.font}
          fill={l.fill}
        >
          {l.text}
        </text>
      ))}
    </svg>
  );
}

export default function PaceChart(props: Props) {
  return (
    <>
      <style>{CSS}</style>
      <Chart {...props} v={DESKTOP} />
      <Chart {...props} v={MOBILE} />
    </>
  );
}
