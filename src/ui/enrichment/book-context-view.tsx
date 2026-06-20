import { useTranslations } from "next-intl";
import type { BookContextData } from "@/domain/content/types";
import { Disclaimer } from "@/ui/shared/disclaimer";
import { Disclosure } from "@/ui/shared/disclosure";
import {
  renderInlineSafe,
  renderMarkdownSafe,
} from "@/ui/shared/render-markdown-safe";
import { SourceLine } from "@/ui/shared/source-line";
import { ClaimBadge } from "./claim-badge";

// Phase 9 — Book Context view. Motifs render in AUTHORING ORDER, each as a
// collapsible (page-wide `bg-acc` accordion: first open, rest closed, exclusive).
export function BookContextView({ data }: { data: BookContextData }) {
  const t = useTranslations();

  if (data.motifs.length === 0) {
    return (
      <div className="tt-deeper-section py-16 text-center">
        <p className="text-sm text-text-muted italic">{t("nav.comingSoon")}</p>
      </div>
    );
  }

  return (
    <div className="tt-deeper-section">
      {data.disclaimer && <Disclaimer text={data.disclaimer} />}

      {data.motifs.map((motif, i) => (
        <Disclosure
          key={motif.slug}
          name="bg-acc"
          open={i === 0}
          summary={
            <span className="flex flex-col gap-1">
              <span
                className="font-[family-name:var(--font-reading)] text-[1.15rem]"
                dangerouslySetInnerHTML={{
                  __html: renderInlineSafe(motif.title),
                }}
              />
              {motif.chapters.length > 0 && (
                <span className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.06em] uppercase text-text-muted">
                  {t("bookContext.chapters")} {motif.chapters.join(", ")}
                </span>
              )}
            </span>
          }
        >
          <div className="body">
            <div className="tt-enrich">
              <div className="labels">
                <ClaimBadge
                  claimType={motif.claimType}
                  confidence={motif.confidence}
                />
              </div>
              <div
                className="ebody [&_em]:italic"
                dangerouslySetInnerHTML={{
                  __html: renderMarkdownSafe(motif.body, "note"),
                }}
              />
              {motif.source && <SourceLine source={motif.source} />}
            </div>
          </div>
        </Disclosure>
      ))}
    </div>
  );
}
