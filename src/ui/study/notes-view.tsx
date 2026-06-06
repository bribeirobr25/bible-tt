import { getTranslations } from "next-intl/server";
import type { ChapterData } from "@/domain/content/types";
import { renderMarkdownSafe } from "@/ui/shared/render-markdown-safe";
import { GlossaryPanel } from "@/ui/study/glossary-panel";
import { SupplementaryPanel } from "@/ui/study/supplementary-section";
import { VerseCard } from "@/ui/study/verse-card";

/**
 * Phase 3 — the "Notes" door (formerly the Study mode). Reading guide, glossary,
 * supplementary sections, then verse-by-verse cards with deep-linkable anchors.
 */
export async function NotesView({ data }: { data: ChapterData }) {
  const t = await getTranslations();

  return (
    <div className="space-y-0">
      {data.readingGuide && (
        <details className="mb-6 border border-border rounded-lg">
          <summary className="px-4 py-3 cursor-pointer text-sm font-medium text-text-secondary hover:text-text-primary transition-colors duration-150 rounded-lg">
            {t("nav.readingGuide")}
          </summary>
          <div
            className="px-4 pb-4 text-sm leading-relaxed text-text-primary"
            dangerouslySetInnerHTML={{
              __html: renderMarkdownSafe(data.readingGuide, "note"),
            }}
          />
        </details>
      )}

      {data.glossary.length > 0 && (
        <div className="mb-6">
          <details className="border border-border rounded-lg">
            <summary className="px-4 py-3 cursor-pointer text-sm font-semibold uppercase tracking-wider text-text-secondary hover:text-accent transition-colors duration-150 select-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 rounded-lg">
              {t("glossary.title")}
            </summary>
            <div className="px-4 pb-4">
              <GlossaryPanel entries={data.glossary} />
            </div>
          </details>
        </div>
      )}

      {data.supplementarySections.length > 0 && (
        <SupplementaryPanel sections={data.supplementarySections} />
      )}

      {data.verses.map((verse) => (
        <VerseCard key={`v-${verse.number}`} verse={verse} />
      ))}
    </div>
  );
}
