import { ShieldAlert } from "lucide-react";
import Link from "next/link";
import { generationReferenceLabel } from "@/domain/content/generation-references";
import type {
  CuriosityEntry,
  GenerationEntry,
  PersonEntry,
  RegionByText,
} from "@/domain/content/types";
import { renderInlineSafe } from "@/ui/shared/render-markdown-safe";

// Parses a `**See:**` pointer like "genesis/PEOPLE.md" into the source book slug.
function parseCrossBookSlug(pointer: string): string | null {
  const match = pointer.trim().match(/^([a-z][a-z-]*)\/PEOPLE\.md$/i);
  return match ? match[1].toLowerCase() : null;
}

// Prototype `.person .field`: mono accent label above a muted value.
function Field({
  label,
  value,
  wide,
}: {
  label: string;
  value?: string | null;
  wide?: boolean;
}) {
  if (!value) return null;
  return (
    <div className={`field${wide ? " wide" : ""}`}>
      <span className="fl">{label}</span>
      <span
        className="fv"
        dangerouslySetInnerHTML={{ __html: renderInlineSafe(value) }}
      />
    </div>
  );
}

function ListField({
  label,
  values,
  wide,
}: {
  label: string;
  values?: string[] | null;
  wide?: boolean;
}) {
  if (!values || values.length === 0) return null;
  return (
    <div className={`field${wide ? " wide" : ""}`}>
      <span className="fl">{label}</span>
      <span
        className="fv"
        dangerouslySetInnerHTML={{
          __html: renderInlineSafe(values.join(", ")),
        }}
      />
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
    <div className="field wide">
      <span className="fl">{label}</span>
      <span className="fv">
        <Link
          href={`/${locale}/${slug}/people`}
          className="text-accent hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-sm"
        >
          {bookLabels[slug]}
        </Link>
      </span>
    </div>
  );
}

function GenerationsBlock({
  label,
  entries,
  locale,
}: {
  label: string;
  entries: GenerationEntry[];
  locale: string;
}) {
  if (!entries.length) return null;
  return (
    <div className="field wide">
      <span className="fl">{label}</span>
      <span className="fv flex flex-wrap gap-1.5">
        {entries.map((g) => (
          <span
            key={`${g.reference}-${g.count}`}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-bg-muted text-text-secondary text-[10px]"
            title={[g.line, g.source].filter(Boolean).join(" · ")}
          >
            <span className="font-medium">
              {generationReferenceLabel(g.reference, locale)}
            </span>
            <span>·</span>
            <span>{g.count}</span>
          </span>
        ))}
      </span>
    </div>
  );
}

const CONFIDENCE_TONE: Record<string, string> = {
  VERIFIED: "bg-note-lexical/15 text-note-lexical",
  PROBABLE: "bg-note-lexical/10 text-note-lexical",
  POSSIBLE: "bg-note-theological/10 text-note-theological",
  UNCERTAIN: "bg-note-critical/10 text-note-critical",
  SPECULATIVE: "bg-bg-muted text-text-muted",
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

function RegionsByTextBlock({
  label,
  safeguardText,
  entries,
}: {
  label: string;
  safeguardText: string;
  entries: RegionByText[];
}) {
  if (!entries.length) return null;
  return (
    <div className="mt-4 pt-3 border-t border-border-muted">
      <div className="font-[family-name:var(--font-mono)] text-[10.5px] tracking-[0.08em] uppercase text-accent mb-2">
        {label}
      </div>
      <div className="flex items-start gap-2 px-3 py-2 mb-2 bg-bg-muted/50 rounded-md border border-border-muted">
        <ShieldAlert
          size={14}
          strokeWidth={1.5}
          className="text-text-muted shrink-0 mt-0.5"
          aria-hidden
        />
        <p className="text-[11px] text-text-secondary leading-relaxed">
          {safeguardText}
        </p>
      </div>
      <ul className="space-y-1.5">
        {entries.map((r) => (
          <li
            key={`${r.region}-${r.verse}`}
            className="flex flex-wrap items-baseline gap-2 text-xs"
          >
            <span className="font-semibold text-text-primary">{r.region}</span>
            <span className="text-text-muted">·</span>
            <span className="text-text-secondary">{r.verse}</span>
            <span
              className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded ${CONFIDENCE_TONE[r.confidence] ?? CONFIDENCE_TONE.UNCERTAIN}`}
            >
              {r.confidence}
            </span>
            {r.note && (
              <span className="text-text-muted text-[11px] basis-full">
                {r.note}
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

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
    meaning: string;
    lifespan: string;
    profession: string;
    hometown: string;
    father: string;
    mother: string;
    siblings: string;
    spouses: string;
    children: string;
    placesLived: string;
    causeOfDeath: string;
    ageAtFatherhood: string;
    socialClass: string;
    historicity: string;
    archaeology: string;
    extraBiblical: string;
    characterArc: string;
    booksIn: string;
    curiosities: string;
    generationsFrom: string;
    regionsByText: string;
    regionsByTextSafeguard: string;
    inBook: string;
    crossBookSee: string;
    birthYear: string;
    deathYear: string;
  };
  bookLabels: Record<string, string>;
}) {
  return (
    <details name="people-acc" className="tt-person" open={open}>
      <summary>
        <span className="pname">{person.name}</span>
        {person.familiarName && person.familiarName !== person.name && (
          <span className="pfam">({person.familiarName})</span>
        )}
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
        {person.inBook && (
          <Field label={labels.inBook} value={person.inBook} wide />
        )}
        <Field label={labels.meaning} value={person.nameMeaning} />
        <Field label={labels.lifespan} value={person.lifespan} />
        <Field label={labels.birthYear} value={person.birthYear} />
        <Field label={labels.deathYear} value={person.deathYear} />
        <Field label={labels.profession} value={person.profession} />
        <Field label={labels.socialClass} value={person.socialClass} />
        <Field label={labels.hometown} value={person.hometown} />
        <ListField label={labels.placesLived} values={person.placesLived} />
        <Field label={labels.father} value={person.father} />
        <Field label={labels.mother} value={person.mother} />
        <ListField label={labels.siblings} values={person.siblings} />
        <ListField label={labels.spouses} values={person.spouses} />
        <ListField label={labels.children} values={person.children} />
        <Field label={labels.ageAtFatherhood} value={person.ageAtFatherhood} />
        <Field label={labels.causeOfDeath} value={person.causeOfDeath} />
        <Field label={labels.historicity} value={person.historicityStatus} />
        <Field label={labels.characterArc} value={person.characterArc} wide />
        <ListField
          label={labels.booksIn}
          values={person.booksAppearingIn}
          wide
        />
        <Field
          label={labels.archaeology}
          value={person.archaeologicalEvidence}
          wide
        />
        <Field
          label={labels.extraBiblical}
          value={person.extraBiblicalMentions}
          wide
        />
      </div>

      {person.generationsFrom && person.generationsFrom.length > 0 && (
        <div className="pbody pt-3">
          <GenerationsBlock
            label={labels.generationsFrom}
            entries={person.generationsFrom}
            locale={locale}
          />
        </div>
      )}
      {person.regionsByText && person.regionsByText.length > 0 && (
        <RegionsByTextBlock
          label={labels.regionsByText}
          safeguardText={labels.regionsByTextSafeguard}
          entries={person.regionsByText}
        />
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
