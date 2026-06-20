import { getTranslations } from "next-intl/server";
import type { ChapterData, NoteType } from "@/domain/content/types";
import { Disclosure } from "@/ui/shared/disclosure";
import { renderMarkdownSafe } from "@/ui/shared/render-markdown-safe";
import { GlossaryPanel } from "@/ui/study/glossary-panel";
import { NOTE_TYPE_TOKENS } from "@/ui/study/note-block";
import { SupplementaryPanel } from "@/ui/study/supplementary-section";
import { VerseCard } from "@/ui/study/verse-card";

// Legend chips, derived from the single NOTE_TYPE_TOKENS map (note-block) so the
// note-type → color mapping has one source.
const CHIPS = (Object.keys(NOTE_TYPE_TOKENS) as NoteType[]).map((type) => ({
  key: type.toLowerCase(),
  color: NOTE_TYPE_TOKENS[type],
}));

/**
 * Phase 3 — the "Notes" door. Reading guide → note-type legend → (jump-links to
 * the chapter-wide patterns waiting at the bottom) → verse-by-verse cards →
 * glossary → supplementary patterns. The reading guide + supplementary share the
 * page-wide `notes-acc` accordion (first open, rest closed, exclusive).
 */
export async function NotesView({ data }: { data: ChapterData }) {
  const t = await getTranslations();
  const supp = data.supplementarySections;

  return (
    <div>
      {data.readingGuide && (
        <Disclosure
          name="notes-acc"
          className="max-w-[46rem] mx-auto"
          open
          summary={<span>{t("nav.readingGuide")}</span>}
        >
          <div
            className="body text-text-primary"
            dangerouslySetInnerHTML={{
              __html: renderMarkdownSafe(data.readingGuide, "note"),
            }}
          />
        </Disclosure>
      )}

      <div className="max-w-[46rem] mx-auto mb-5 flex flex-wrap gap-2.5">
        {CHIPS.map((c) => (
          <span
            key={c.key}
            className="inline-flex items-center gap-[7px] font-[family-name:var(--font-mono)] text-[10.5px] tracking-[0.06em] uppercase border border-border rounded-full px-2.5 py-1 text-text-muted"
          >
            <span
              className="w-[7px] h-[7px] rounded-full"
              style={{ background: c.color }}
              aria-hidden="true"
            />
            {t(`notes.${c.key}`)}
          </span>
        ))}
      </div>

      {supp.length > 0 && (
        <div className="max-w-[46rem] mx-auto mb-6 rounded-lg border border-border bg-bg-surface px-4 py-3">
          <p className="font-[family-name:var(--font-mono)] text-[10.5px] tracking-[0.1em] uppercase text-accent mb-2">
            {t("notes.supplementary")}
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1.5">
            {supp.map((s, i) => (
              <a
                key={`jump-${i}`}
                href={`#supp-${i}`}
                className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-accent transition-colors duration-150"
              >
                <span aria-hidden="true">↓</span>
                {s.title}
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="verses max-w-[46rem] mx-auto">
        {data.verses.map((verse) => (
          <VerseCard key={`v-${verse.number}`} verse={verse} />
        ))}
      </div>

      {data.glossary.length > 0 && (
        <section className="max-w-[46rem] mx-auto mt-[60px]">
          <p className="tt-kick">{t("glossary.title")}</p>
          <GlossaryPanel entries={data.glossary} />
        </section>
      )}

      {supp.length > 0 && (
        <section className="max-w-[46rem] mx-auto mt-[60px]">
          <p className="tt-kick">{t("notes.supplementary")}</p>
          <SupplementaryPanel sections={supp} firstOpen={!data.readingGuide} />
        </section>
      )}
    </div>
  );
}
