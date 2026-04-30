import { useTranslations } from "next-intl";
import type { EnrichmentSection, EnrichmentEntry, ConfidenceLevel } from "@/domain/content/types";
import { ConfidenceIndicator } from "./confidence-indicator";

const SECTION_INTRO_KEYS: Record<string, string> = {
  "source-text-features": "enrichment.introSourceText",
  "ane-parallels": "enrichment.introAneParallels",
  "historical-archaeological": "enrichment.introHistorical",
  "linguistic-philological": "enrichment.introLinguistic",
  scientific: "enrichment.introScientific",
  "later-reception": "enrichment.introReception",
  curiosities: "enrichment.introCuriosities",
};

const HEDGE_START_KEYS: Partial<Record<ConfidenceLevel, string>> = {
  PROBABLE: "enrichment.hedgeStartProbable",
  POSSIBLE: "enrichment.hedgeStartPossible",
  UNCERTAIN: "enrichment.hedgeStartUncertain",
  SPECULATIVE: "enrichment.hedgeStartSpeculative",
};

const HEDGE_MID_KEYS: Partial<Record<ConfidenceLevel, string>> = {
  PROBABLE: "enrichment.hedgeMidProbable",
  POSSIBLE: "enrichment.hedgeMidPossible",
  UNCERTAIN: "enrichment.hedgeMidUncertain",
  SPECULATIVE: "enrichment.hedgeMidSpeculative",
};

function narrativeContent(entry: EnrichmentEntry): string {
  let text = entry.content
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .replace(/\n- /g, " ")
    .replace(/\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (text.length > 600) {
    const sentences = text.split(/(?<=[.!?])\s+/);
    let shortened = "";
    for (const s of sentences) {
      if ((shortened + s).length > 500) break;
      shortened += (shortened ? " " : "") + s;
    }
    text = shortened || text.slice(0, 500) + "…";
  }

  return text;
}

function EntryParagraph({ entry, isFirst, t }: { entry: EnrichmentEntry; isFirst: boolean; t: ReturnType<typeof useTranslations> }) {
  const hedgeKeys = isFirst ? HEDGE_START_KEYS : HEDGE_MID_KEYS;
  const hedgeKey = hedgeKeys[entry.confidence];
  const prefix = hedgeKey ? t(hedgeKey) : "";
  const content = narrativeContent(entry);

  return (
    <div className="flex gap-3 items-start">
      <ConfidenceIndicator level={entry.confidence} label={t(`confidence.${entry.confidence.toLowerCase()}`)} />
      <p className="font-[family-name:var(--font-reading)] text-base md:text-lg leading-[1.8] text-text-primary">
        {prefix && <span className="text-text-secondary">{prefix}</span>}
        {content}
        {entry.source && (
          <span className="text-text-muted text-sm"> ({entry.source})</span>
        )}
      </p>
    </div>
  );
}

export function NarrativeSection({ section }: { section: EnrichmentSection }) {
  const t = useTranslations();
  const introKey = SECTION_INTRO_KEYS[section.id];

  if (section.id === "sources") return null;

  return (
    <section className="space-y-5">
      <h2 className="font-[family-name:var(--font-reading)] text-xl md:text-2xl font-light text-text-primary">
        {section.title}
      </h2>
      {introKey && (
        <p className="font-[family-name:var(--font-reading)] text-base md:text-lg leading-[1.8] text-text-secondary italic">
          {t(introKey)}
        </p>
      )}
      {section.entries.map((entry, i) => (
        <EntryParagraph key={`${section.id}-${i}`} entry={entry} isFirst={i === 0} t={t} />
      ))}
    </section>
  );
}
