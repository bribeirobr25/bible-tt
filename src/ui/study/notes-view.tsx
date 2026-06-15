import { getTranslations } from "next-intl/server";
import type { ChapterData } from "@/domain/content/types";
import { renderMarkdownSafe } from "@/ui/shared/render-markdown-safe";
import { GlossaryPanel } from "@/ui/study/glossary-panel";
import { SupplementaryPanel } from "@/ui/study/supplementary-section";
import { VerseCard } from "@/ui/study/verse-card";

const CHIPS = [
  { key: "critical", color: "var(--color-note-critical)" },
  { key: "lexical", color: "var(--color-note-lexical)" },
  { key: "grammatical", color: "var(--color-note-grammatical)" },
  { key: "theological", color: "var(--color-note-theological)" },
] as const;

/**
 * Phase 3 — the "Notes" door. Prototype flow: note-type legend → verse-by-verse
 * cards (deep-linkable anchors) → glossary → supplementary patterns. An optional
 * reading guide stays at the top as a disclosure.
 */
export async function NotesView({ data }: { data: ChapterData }) {
  const t = await getTranslations();

  return (
    <div>
      {data.readingGuide && (
        <details className="tt-details max-w-[46rem] mx-auto">
          <summary>
            <span>{t("nav.readingGuide")}</span>
            <span className="chev" aria-hidden="true">
              ›
            </span>
          </summary>
          <div
            className="body text-text-primary"
            dangerouslySetInnerHTML={{
              __html: renderMarkdownSafe(data.readingGuide, "note"),
            }}
          />
        </details>
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

      {data.supplementarySections.length > 0 && (
        <section className="max-w-[46rem] mx-auto mt-[60px]">
          <SupplementaryPanel sections={data.supplementarySections} />
        </section>
      )}
    </div>
  );
}
