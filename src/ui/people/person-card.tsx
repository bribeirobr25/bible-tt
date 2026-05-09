import { ShieldAlert } from "lucide-react";
import { generationReferenceLabel } from "@/domain/content/generation-references";
import type {
  CuriosityEntry,
  GenerationEntry,
  PersonEntry,
  RegionByText,
} from "@/domain/content/types";
import { renderInlineSafe } from "@/ui/shared/render-markdown-safe";

const HISTORICITY_COLORS: Record<string, string> = {
  VERIFIED: "bg-note-lexical/15 text-note-lexical",
  PROBABLE: "bg-note-lexical/10 text-note-lexical",
  POSSIBLE: "bg-note-theological/10 text-note-theological",
  UNCERTAIN: "bg-note-critical/10 text-note-critical",
  LITERARY: "bg-bg-muted text-text-muted",
};

function Field({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex gap-2 text-xs">
      <span className="font-medium text-text-muted shrink-0 w-28">{label}</span>
      <span
        className="text-text-secondary"
        dangerouslySetInnerHTML={{ __html: renderInlineSafe(value) }}
      />
    </div>
  );
}

function ListField({
  label,
  values,
}: {
  label: string;
  values?: string[] | null;
}) {
  if (!values || values.length === 0) return null;
  return (
    <div className="flex gap-2 text-xs">
      <span className="font-medium text-text-muted shrink-0 w-28">{label}</span>
      <span className="text-text-secondary">{values.join(", ")}</span>
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
    <div className="flex gap-2 text-xs">
      <span className="font-medium text-text-muted shrink-0 w-28">{label}</span>
      <span className="flex flex-wrap gap-1.5">
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
    <div className="mt-3 pt-2 border-t border-border-muted">
      <div className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
        {label}
      </div>
      <div className="space-y-2">
        {entries.map((c) => (
          <div
            key={c.title}
            className="border-l-2 border-l-border bg-bg-muted/50 rounded-r-md px-3 py-2"
          >
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted font-[family-name:var(--font-mono)]">
                {c.claimType}
              </span>
              <span
                className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded ${CONFIDENCE_TONE[c.confidence] ?? CONFIDENCE_TONE.UNCERTAIN}`}
              >
                {c.confidence}
              </span>
            </div>
            <div
              className="text-xs font-semibold text-text-primary mb-1"
              dangerouslySetInnerHTML={{ __html: renderInlineSafe(c.title) }}
            />
            <div
              className="text-xs text-text-secondary"
              dangerouslySetInnerHTML={{ __html: renderInlineSafe(c.content) }}
            />
            {c.source && (
              <div className="text-[10px] text-text-muted italic mt-1">
                {c.source}
              </div>
            )}
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
    <div className="mt-3 pt-2 border-t border-border-muted">
      <div className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
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
}: {
  person: PersonEntry;
  locale?: string;
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
  };
}) {
  const historicityColor =
    HISTORICITY_COLORS[person.historicityStatus || "UNCERTAIN"] ||
    HISTORICITY_COLORS.UNCERTAIN;

  return (
    <details className="group border border-border rounded-lg overflow-hidden">
      <summary className="flex items-center gap-3 px-4 py-3 cursor-pointer select-none hover:bg-bg-surface transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-lg">
        <div className="flex-1">
          <span className="font-[family-name:var(--font-reading)] text-sm font-semibold text-text-primary">
            {person.name}
          </span>
          {person.familiarName && person.familiarName !== person.name && (
            <span className="text-xs text-text-muted ml-2">
              ({person.familiarName})
            </span>
          )}
        </div>
        {person.lifespan && (
          <span className="text-xs text-text-muted tabular-nums">
            {person.lifespan}
          </span>
        )}
        {person.historicityStatus && (
          <span
            className={`text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded ${historicityColor}`}
          >
            {person.historicityStatus}
          </span>
        )}
        <svg
          className="w-4 h-4 text-text-muted transition-transform duration-200 group-open:rotate-90"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          aria-hidden="true"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </summary>
      <div className="px-4 pb-4 pt-2 space-y-1.5 border-t border-border-muted">
        {person.generationsFrom && person.generationsFrom.length > 0 && (
          <GenerationsBlock
            label={labels.generationsFrom}
            entries={person.generationsFrom}
            locale={locale}
          />
        )}
        <Field label={labels.meaning} value={person.nameMeaning} />
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
        <Field label={labels.lifespan} value={person.lifespan} />
        <Field label={labels.causeOfDeath} value={person.causeOfDeath} />
        <Field label={labels.characterArc} value={person.characterArc} />
        <ListField label={labels.booksIn} values={person.booksAppearingIn} />
        {(person.archaeologicalEvidence || person.extraBiblicalMentions) && (
          <div className="mt-3 pt-2 border-t border-border-muted space-y-1.5">
            <Field
              label={labels.archaeology}
              value={person.archaeologicalEvidence}
            />
            <Field
              label={labels.extraBiblical}
              value={person.extraBiblicalMentions}
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
      </div>
    </details>
  );
}
