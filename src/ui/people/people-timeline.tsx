import type { PersonEntry } from "@/domain/content/types";
import { AM_FLOOD } from "@/ui/people/genesis-watersheds";

// Prototype geometry (docs/redesign/site/genesis/people.html inline SVG).
const W = 1000;
const PAD_L = 120;
const PAD_R = 30;
const PAD_T = 20;
const ROW_H = 38;

type Anchor = "creation" | "historical";

interface TimelineEntry {
  slug: string;
  displayName: string;
  start: number;
  end: number;
  /** No death formula — "taken" (Chanokh/Enoch); rendered as a dashed bar. */
  taken: boolean;
}

function pickAnchor(
  entries: PersonEntry[],
): { anchor: Anchor; entries: TimelineEntry[] } | null {
  const creation: TimelineEntry[] = [];
  const historical: TimelineEntry[] = [];
  for (const e of entries) {
    const taken = e.name === "Chanokh" || e.familiarName === "Enoch";
    // A bar label must stay short — strip any verbose "(…)" qualifier authored
    // into the Familiar-name field (e.g. Abram's "(name changed … out of scope)").
    const displayName = (e.familiarName || e.name)
      .replace(/\s*\(.*$/, "")
      .trim();
    const base = { slug: e.slug, displayName, taken };
    if (e.yearFromCreation != null && e.yearFromCreationEnd != null) {
      creation.push({
        ...base,
        start: e.yearFromCreation,
        end: e.yearFromCreationEnd,
      });
    } else if (e.historicalYear != null && e.historicalYearEnd != null) {
      historical.push({
        ...base,
        start: e.historicalYear,
        end: e.historicalYearEnd,
      });
    }
  }
  if (creation.length === 0 && historical.length === 0) return null;
  const chosen = creation.length >= historical.length ? creation : historical;
  chosen.sort((a, b) => a.start - b.start);
  return {
    anchor: creation.length >= historical.length ? "creation" : "historical",
    entries: chosen,
  };
}

export function PeopleTimeline({
  entries,
  book,
  kicker,
  captionCreation,
  captionHistorical,
}: {
  entries: PersonEntry[];
  book: string;
  kicker: string;
  captionCreation: string;
  captionHistorical: string;
}) {
  const picked = pickAnchor(entries);
  if (!picked) return null;
  const { anchor } = picked;
  let rows = picked.entries;
  // Genesis: the chart is the Gen-5 line Adam → Noah, so stop at Noah (the
  // post-flood patriarchs Shem/Terah/Avram have their own genealogy table).
  if (book === "genesis" && anchor === "creation") {
    const noahIdx = rows.findIndex((e) => e.slug === "noach");
    if (noahIdx >= 0) rows = rows.slice(0, noahIdx + 1);
  }
  if (rows.length === 0) return null;

  const isAM = anchor === "creation";
  const showFlood = book === "genesis" && isAM;
  const caption = isAM ? captionCreation : captionHistorical;

  const minYear = Math.min(0, ...rows.map((e) => e.start));
  const maxEnd = Math.max(...rows.map((e) => e.end));
  // Round the axis up to the next 500 + headroom for the trailing year label.
  const maxYr = Math.ceil((maxEnd + 60) / 500) * 500;
  const plotW = W - PAD_L - PAD_R;
  const span = maxYr - minYear || 1;
  const x = (yr: number) => PAD_L + ((yr - minYear) / span) * plotW;

  const axisBottom = PAD_T + rows.length * ROW_H + 6;
  const svgHeight = axisBottom + 30;

  const ticks: number[] = [];
  for (let yr = Math.ceil(minYear / 500) * 500; yr <= maxEnd; yr += 500) {
    ticks.push(yr);
  }

  return (
    <section className="my-[clamp(40px,6vh,70px)]">
      <p className="tt-kick">{kicker}</p>
      <div className="overflow-x-auto rounded-xl border border-border bg-bg-surface p-[18px]">
        <svg
          width="100%"
          viewBox={`0 0 ${W} ${svgHeight}`}
          preserveAspectRatio="xMinYMin meet"
          role="img"
          aria-label={kicker}
          style={{ height: "auto" }}
        >
          {ticks.map((yr) => (
            <g key={`tick-${yr}`}>
              <line
                x1={x(yr)}
                y1={PAD_T}
                x2={x(yr)}
                y2={axisBottom}
                stroke="var(--color-border)"
                strokeWidth={1}
              />
              <text
                x={x(yr)}
                y={axisBottom + 16}
                textAnchor="middle"
                fill="var(--color-text-muted)"
                fontFamily="var(--font-mono)"
                style={{ fontSize: "11px" }}
              >
                {isAM ? `AM ${yr}` : yr}
              </text>
            </g>
          ))}

          {showFlood && AM_FLOOD <= maxEnd && (
            <g>
              <line
                x1={x(AM_FLOOD)}
                y1={PAD_T - 6}
                x2={x(AM_FLOOD)}
                y2={axisBottom}
                stroke="var(--color-ochre)"
                strokeWidth={2}
                strokeDasharray="2 3"
              />
              <text
                x={x(AM_FLOOD)}
                y={PAD_T - 9}
                textAnchor="middle"
                fill="var(--color-ochre)"
                fontFamily="var(--font-mono)"
                style={{ fontSize: "11px" }}
              >
                {`Flood · ${AM_FLOOD}`}
              </text>
            </g>
          )}

          {rows.map((e, i) => {
            const yy = PAD_T + i * ROW_H + 10;
            const x0 = x(e.start);
            const x1 = x(e.end);
            const w = Math.max(2, x1 - x0);
            return (
              <g
                key={e.slug}
                aria-label={`${e.displayName}: ${e.start}–${e.end}`}
              >
                <text
                  x={PAD_L - 12}
                  y={yy + 13}
                  textAnchor="end"
                  fill="var(--color-text-primary)"
                  fontFamily="var(--font-reading)"
                  style={{ fontSize: "13px" }}
                >
                  {e.displayName}
                </text>
                <rect
                  x={x0}
                  y={yy}
                  width={w}
                  height={18}
                  rx={4}
                  fill={e.taken ? "none" : "var(--color-petrol)"}
                  opacity={e.taken ? 1 : 0.85}
                  stroke={e.taken ? "var(--color-ochre)" : "none"}
                  strokeWidth={e.taken ? 2 : 0}
                  strokeDasharray={e.taken ? "4 3" : undefined}
                />
                <text
                  x={x1 + 6}
                  y={yy + 13}
                  fill="var(--color-text-muted)"
                  fontFamily="var(--font-mono)"
                  style={{ fontSize: "10.5px" }}
                >
                  {`${e.end - e.start}${e.taken ? " · taken" : ""}`}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      <p className="mono mt-3 text-text-muted text-xs">{caption}</p>
    </section>
  );
}
