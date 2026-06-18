import Link from "next/link";
import type { CuriosityEntry, PersonEntry } from "@/domain/content/types";
import { renderInlineSafe } from "@/ui/shared/render-markdown-safe";

// Parses a `**See:**` pointer like "genesis/PEOPLE.md" into the source book slug.
function parseCrossBookSlug(pointer: string): string | null {
  const match = pointer.trim().match(/^([a-z][a-z-]*)\/PEOPLE\.md$/i);
  return match ? match[1].toLowerCase() : null;
}

// Prototype WIDE heuristic (assets/render-people.js): a field spans both columns
// when its label matches one of these (across locales) or its value is long.
const WIDE_LABEL =
  /event|arc|extra-biblical|archaeolog|places lived|mentioned in|curiosit|regions|location|generations|note|children|speech|key|ereignis|ort|erwähnt|kinder|lugar|mencion|hijos|eventos|local|filhos|menç/i;

const isWide = (label: string, value: string): boolean =>
  WIDE_LABEL.test(label) || value.length > 90;

// Prototype `.person .field`: mono accent label above a muted value.
function Field({
  label,
  value,
  wide,
  children,
}: {
  label: string;
  value?: string;
  wide?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div className={`field${wide ? " wide" : ""}`}>
      <span className="fl">{label}</span>
      {children ?? (
        <span
          className="fv"
          dangerouslySetInnerHTML={{ __html: renderInlineSafe(value ?? "—") }}
        />
      )}
    </div>
  );
}

function CrossBookSeeField({
  label,
  pointer,
  locale,
  bookLabels,
}: {
  label: string;
  pointer: string;
  locale: string;
  bookLabels: Record<string, string>;
}) {
  const slug = parseCrossBookSlug(pointer);
  if (!slug || !bookLabels[slug]) {
    return <Field label={label} value={pointer} wide />;
  }
  return (
    <Field label={label} wide>
      <span className="fv">
        <Link
          href={`/${locale}/${slug}/people`}
          className="text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
        >
          {bookLabels[slug]}
        </Link>
      </span>
    </Field>
  );
}

const CONFIDENCE_TONE: Record<string, string> = {
  VERIFIED: "bg-note-lexical/15 text-note-lexical",
  PROBABLE: "bg-note-lexical/10 text-note-lexical",
  POSSIBLE: "bg-note-theological/10 text-note-theological",
  UNCERTAIN: "bg-note-critical/10 text-note-critical",
  SPECULATIVE: "bg-note-critical/15 text-note-critical",
  DOCUMENTED: "bg-note-grammatical/15 text-note-grammatical",
};

function CuriositiesBlock({
  label,
  entries,
}: {
  label: string;
  entries: CuriosityEntry[];
}) {
  if (!entries.length) return null;
  return (
    <div className="mt-4 pt-3 border-t border-border-muted">
      <div className="font-[family-name:var(--font-mono)] text-[10.5px] tracking-[0.08em] uppercase text-accent mb-2">
        {label}
      </div>
      <div className="space-y-2">
        {entries.map((c) => (
          <div key={c.title} className="tt-note">
            <div className="nlab">
              <span className="font-bold text-text-muted">{c.claimType}</span>
              <span
                className={`px-1.5 py-0.5 rounded ${CONFIDENCE_TONE[c.confidence] ?? CONFIDENCE_TONE.UNCERTAIN}`}
              >
                {c.confidence}
              </span>
            </div>
            <div
              className="text-sm font-semibold text-text-primary mb-1"
              dangerouslySetInnerHTML={{ __html: renderInlineSafe(c.title) }}
            />
            <div
              className="ntext [&_em]:italic"
              dangerouslySetInnerHTML={{ __html: renderInlineSafe(c.content) }}
            />
            {c.source && <div className="src">{c.source}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * People-page profile card. Renders every authored field verbatim and in
 * authored order (prototype parity — `assets/render-people.js`), so no field is
 * dropped. The cross-book "See:" pointer renders as a link; the editorial note
 * and curiosities trail the field grid.
 */
export function PersonCard({
  person,
  labels,
  locale = "en",
  bookLabels,
  open = false,
}: {
  person: PersonEntry;
  locale?: string;
  open?: boolean;
  labels: {
    curiosities: string;
    crossBookSee: string;
    note: string;
    regionsSafeguard: string;
  };
  bookLabels: Record<string, string>;
}) {
  const fields = person.rawFields ?? [];
  return (
    <details name="people-acc" className="tt-person" open={open}>
      <summary>
        <span className="pname">{person.name}</span>
        {person.familiarName && person.familiarName !== person.name && (
          <span className="pfam">({person.familiarName})</span>
        )}
        {person.suffix && <span className="pfam"> — {person.suffix}</span>}
        {person.lifespan && <span className="plife">{person.lifespan}</span>}
      </summary>

      <div className="pbody">
        {person.crossBookSee && (
          <CrossBookSeeField
            label={labels.crossBookSee}
            pointer={person.crossBookSee}
            locale={locale}
            bookLabels={bookLabels}
          />
        )}
        {fields.map((f, i) => (
          <Field
            key={`${person.slug}-f${i}`}
            label={f.label}
            value={f.value}
            wide={isWide(f.label, f.value)}
          />
        ))}
        {person.note && <Field label={labels.note} value={person.note} wide />}
      </div>

      {/* Rule-29 anti-misuse safeguard: where the entry lists Table-of-Nations
          regions, the notice must stay on the page (it is dropped from the
          prototype's plain-field render, so we re-attach it here). */}
      {person.regionsByText && person.regionsByText.length > 0 && (
        <p className="mt-3 border-l-2 border-border-muted pl-3 text-[11px] leading-relaxed text-text-muted">
          {labels.regionsSafeguard}
        </p>
      )}

      {person.curiosities && person.curiosities.length > 0 && (
        <CuriositiesBlock
          label={labels.curiosities}
          entries={person.curiosities}
        />
      )}
    </details>
  );
}
