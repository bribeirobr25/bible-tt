import { useTranslations } from "next-intl";
import { renderInlineSafe } from "@/ui/shared/render-markdown-safe";

/**
 * The shared `.src` source-attribution line for enrichment cards + book-context
 * motifs: `enrichment.source` i18n string, rendered via `renderInlineSafe`.
 * Callers keep their own `{source && …}` guard — this always renders the `<p>`.
 * (Not used by person-card, whose curiosity source is a plain `<div>` with raw text.)
 */
export function SourceLine({ source }: { source: string }) {
  const t = useTranslations();
  return (
    <p
      className="src"
      dangerouslySetInnerHTML={{
        __html: renderInlineSafe(t("enrichment.source", { source })),
      }}
    />
  );
}
