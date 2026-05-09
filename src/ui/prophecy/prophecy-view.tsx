"use client";

import { useTranslations } from "next-intl";
import type {
  ConfidenceLevel,
  FulfillmentStatus,
  ProphecyData,
  ProphecyEntry,
} from "@/domain/content/types";
import { renderMarkdownSafe } from "@/ui/shared/render-markdown-safe";

const FULFILLMENT_COLORS: Record<FulfillmentStatus, string> = {
  FULFILLED: "bg-note-lexical/15 text-note-lexical",
  PARTIAL: "bg-note-theological/10 text-note-theological",
  CLAIMED: "bg-note-grammatical/10 text-note-grammatical",
  UNFULFILLED: "bg-bg-muted text-text-muted",
  DEBATED: "bg-note-critical/10 text-note-critical",
  MULTI_STAGE: "bg-note-theological/15 text-note-theological",
};

const FULFILLMENT_KEYS: Record<FulfillmentStatus, string> = {
  FULFILLED: "prophecy.fulfillment.fulfilled",
  PARTIAL: "prophecy.fulfillment.partial",
  CLAIMED: "prophecy.fulfillment.claimed",
  UNFULFILLED: "prophecy.fulfillment.unfulfilled",
  DEBATED: "prophecy.fulfillment.debated",
  MULTI_STAGE: "prophecy.fulfillment.multiStage",
};

const CONFIDENCE_KEYS: Record<ConfidenceLevel, string> = {
  VERIFIED: "confidence.verified",
  PROBABLE: "confidence.probable",
  POSSIBLE: "confidence.possible",
  UNCERTAIN: "confidence.uncertain",
  SPECULATIVE: "confidence.speculative",
  DOCUMENTED: "confidence.documented",
};

function ProphecyCard({ entry }: { entry: ProphecyEntry }) {
  const t = useTranslations();

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      <div className="px-4 py-3 bg-bg-surface border-b border-border">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="font-[family-name:var(--font-ui)] text-sm font-semibold">
            {entry.title}
          </h3>
          <span
            className={`text-xs font-semibold uppercase px-2 py-0.5 rounded ${FULFILLMENT_COLORS[entry.fulfillmentStatus]}`}
          >
            {t(FULFILLMENT_KEYS[entry.fulfillmentStatus])}
          </span>
        </div>
        <p className="text-xs text-text-muted mt-1 font-[family-name:var(--font-mono)]">
          {entry.verseRef}
        </p>
      </div>
      <div className="px-4 py-3 space-y-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">
            {t("prophecy.fields.textSays")}
          </p>
          <p className="text-sm leading-relaxed text-text-primary font-[family-name:var(--font-reading)]">
            {entry.textSays}
          </p>
        </div>
        {entry.context && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">
              {t("prophecy.fields.context")}
            </p>
            <p className="text-sm leading-relaxed text-text-secondary">
              {entry.context}
            </p>
          </div>
        )}
        {entry.readings.length > 0 && (
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
              {t("prophecy.fields.readings")}
            </p>
            <div className="space-y-2">
              {entry.readings.map((r, i) => (
                <div key={`r-${i}`} className="pl-3 border-l-2 border-border">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-bold text-text-secondary">
                      {r.tradition}
                      {r.subTradition ? ` / ${r.subTradition}` : ""}
                    </span>
                    <span className="text-xs px-1.5 py-0.5 rounded bg-bg-muted text-text-muted">
                      {t(CONFIDENCE_KEYS[r.confidence])}
                    </span>
                  </div>
                  <p
                    className="text-sm text-text-primary"
                    dangerouslySetInnerHTML={{
                      __html: renderMarkdownSafe(r.reading, "note"),
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        {entry.fulfillmentNotes && (
          <p className="text-xs text-text-muted italic">
            {entry.fulfillmentNotes}
          </p>
        )}
      </div>
    </div>
  );
}

export function ProphecyView({ data }: { data: ProphecyData }) {
  const t = useTranslations();

  if (data.entries.length === 0) return null;

  return (
    <div className="space-y-6">
      <p className="text-sm text-text-secondary italic font-[family-name:var(--font-reading)]">
        {t("prophecy.disclaimer")}
      </p>
      {data.entries.map((entry, i) => (
        <ProphecyCard key={`p-${i}`} entry={entry} />
      ))}
    </div>
  );
}
