import Link from "next/link";
import type { CuriosityEntry, PersonEntry } from "@/domain/content/types";
import { ClaimBadge } from "@/ui/enrichment/claim-badge";
import { renderInlineSafe } from "@/ui/shared/render-markdown-safe";

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
  book,
  locale,
  bookLabels,
}: {
  label: string;
  pointer: string;
  book?: string;
  locale: string;
  bookLabels: Record<string, string>;
}) {
  if (!book || !bookLabels[book]) {
    return <Field label={label} value={pointer} wide />;
  }
  return (
    <Field label={label} wide>
      <span className="fv">
        <Link
          href={`/${locale}/${book}/people`}
          className="text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
        >
          {bookLabels[book]}
        </Link>
      </span>
    </Field>
  );
}

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
              <ClaimBadge claimType={c.claimType} confidence={c.confidence} />
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
            book={person.crossBookSeeBook}
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
