import type { PersonEntry } from "@/domain/content/types";

const BAR_HEIGHT = 20;
const BAR_GAP = 6;
const LABEL_WIDTH = 130;
const LIFESPAN_WIDTH = 70;
const PADDING = 16;

const BAR_COLORS = [
  "var(--color-note-lexical)",
  "var(--color-note-grammatical)",
  "var(--color-note-theological)",
  "var(--color-accent)",
  "var(--color-note-critical)",
];

type Anchor = "creation" | "historical";

interface TimelineEntry {
  slug: string;
  displayName: string;
  start: number;
  end: number;
  lifespanLabel: string;
}

function pickAnchor(
  entries: PersonEntry[],
): { anchor: Anchor; entries: TimelineEntry[] } | null {
  const creationEntries: TimelineEntry[] = [];
  const historicalEntries: TimelineEntry[] = [];
  for (const e of entries) {
    const displayName = e.familiarName || e.name;
    const lifespanLabel = e.lifespan
      ? e.lifespan
          .replace(" years", "y")
          .replace(" anos", "a")
          .replace(" Jahre", "J")
          .replace(" años", "a")
      : "";
    if (e.yearFromCreation != null && e.yearFromCreationEnd != null) {
      creationEntries.push({
        slug: e.slug,
        displayName,
        start: e.yearFromCreation,
        end: e.yearFromCreationEnd,
        lifespanLabel,
      });
    } else if (e.historicalYear != null && e.historicalYearEnd != null) {
      historicalEntries.push({
        slug: e.slug,
        displayName,
        start: e.historicalYear,
        end: e.historicalYearEnd,
        lifespanLabel,
      });
    }
  }
  if (creationEntries.length === 0 && historicalEntries.length === 0)
    return null;
  if (creationEntries.length >= historicalEntries.length) {
    return { anchor: "creation", entries: creationEntries };
  }
  return { anchor: "historical", entries: historicalEntries };
}

export function PeopleTimeline({
  entries,
  title,
  captionCreation,
  captionHistorical,
}: {
  entries: PersonEntry[];
  title: string;
  captionCreation: string;
  captionHistorical: string;
}) {
  const picked = pickAnchor(entries);
  if (!picked) return null;
  const { anchor, entries: timelineEntries } = picked;
  if (timelineEntries.length === 0) return null;

  const minYear = Math.min(...timelineEntries.map((e) => e.start));
  const maxYear = Math.max(...timelineEntries.map((e) => e.end));
  const yearSpan = maxYear - minYear || 1;

  const chartWidth = 520;
  const svgWidth = LABEL_WIDTH + chartWidth + LIFESPAN_WIDTH + PADDING * 2;
  const svgHeight =
    timelineEntries.length * (BAR_HEIGHT + BAR_GAP) + PADDING * 2 + 30;

  const yearToX = (year: number) =>
    LABEL_WIDTH + PADDING + ((year - minYear) / yearSpan) * chartWidth;

  const tickInterval =
    yearSpan > 1500 ? 500 : yearSpan > 500 ? 200 : yearSpan > 100 ? 50 : 10;
  const firstTick = Math.ceil(minYear / tickInterval) * tickInterval;
  const ticks: number[] = [];
  for (let t = firstTick; t <= maxYear; t += tickInterval) {
    ticks.push(t);
  }

  const caption = anchor === "creation" ? captionCreation : captionHistorical;

  return (
    <div className="space-y-3">
      <h3 className="font-[family-name:var(--font-reading)] text-lg font-light text-text-primary">
        {title}
      </h3>
      <div className="overflow-x-auto border border-border rounded-lg bg-bg-paper p-4">
        <svg
          width="100%"
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          preserveAspectRatio="xMinYMin meet"
          role="img"
          aria-label={title}
          style={{ maxWidth: svgWidth, height: "auto" }}
        >
          {ticks.map((tick) => (
            <g key={tick}>
              <line
                x1={yearToX(tick)}
                y1={PADDING}
                x2={yearToX(tick)}
                y2={svgHeight - 30}
                className="stroke-border"
                strokeOpacity={0.6}
                strokeWidth={1}
              />
              <text
                x={yearToX(tick)}
                y={svgHeight - 10}
                textAnchor="middle"
                className="fill-text-muted"
                style={{ fontSize: "10px" }}
              >
                {tick}
              </text>
            </g>
          ))}

          {timelineEntries.map((entry, i) => {
            const y = PADDING + i * (BAR_HEIGHT + BAR_GAP);
            const x1 = yearToX(entry.start);
            const x2 = yearToX(entry.end);
            const barWidth = Math.max(x2 - x1, 2);
            const color = BAR_COLORS[i % BAR_COLORS.length];

            return (
              <g
                key={entry.slug}
                aria-label={`${entry.displayName}: ${entry.start} - ${entry.end}`}
              >
                <text
                  x={LABEL_WIDTH}
                  y={y + BAR_HEIGHT / 2 + 4}
                  textAnchor="end"
                  className="fill-text-primary"
                  style={{ fontSize: "11px" }}
                >
                  {entry.displayName}
                </text>
                <rect
                  x={x1}
                  y={y}
                  width={barWidth}
                  height={BAR_HEIGHT}
                  fill={color}
                  rx={3}
                  ry={3}
                  opacity={0.75}
                />
                {entry.lifespanLabel && (
                  <text
                    x={x2 + 8}
                    y={y + BAR_HEIGHT / 2 + 4}
                    textAnchor="start"
                    className="fill-text-secondary"
                    style={{ fontSize: "10px" }}
                  >
                    {entry.lifespanLabel}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
      <p className="text-xs text-text-muted italic">{caption}</p>
    </div>
  );
}
