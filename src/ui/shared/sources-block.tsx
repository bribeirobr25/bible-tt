import { useLocale, useTranslations } from "next-intl";
import { Disclosure } from "@/ui/shared/disclosure";
import { renderMarkdownSafe } from "@/ui/shared/render-markdown-safe";

/**
 * "Sources Consulted" (Rule 29 §H / introduction §G): the source table plus the
 * Rule-28 editorial provenance, as a closed disclosure at the end of a
 * companion, introduction, PROPHECY or People page (audit B2, Decision D2).
 * One component for every page so the block cannot drift between them.
 */
export function SourcesBlock({
  sources,
  className,
}: {
  sources: string | undefined;
  className?: string;
}) {
  const t = useTranslations();
  const locale = useLocale();
  if (!sources?.trim()) return null;
  return (
    <section className={className}>
      <Disclosure summary={<span>{t("study.sourcesConsulted")}</span>}>
        <div
          className="body tt-sources text-text-secondary"
          dangerouslySetInnerHTML={{
            __html: renderMarkdownSafe(sources, "note", { locale }),
          }}
        />
      </Disclosure>
    </section>
  );
}
