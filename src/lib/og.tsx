import { ImageResponse } from "next/og";
import { SITE_NAME } from "@/lib/seo";

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

// Hex approximations of the OKLCH design tokens (satori has no oklch support).
const PAPER = "#F5F1E8"; // --color-bg-paper
const INK = "#2A2620"; // --color-text-primary
const SECONDARY = "#5C554B"; // --color-text-secondary
const ACCENT = "#1F6A7D"; // --color-accent (Phase 5: deep teal/petrol)

function clamp(text: string, max: number): string {
  const t = text.replace(/\s+/g, " ").trim();
  return t.length > max ? `${t.slice(0, max - 1).trimEnd()}…` : t;
}

/** Branded OG card (1200×630). All nodes use display:flex per satori requirements. */
export function renderOgImage(opts: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  const eyebrow = clamp(opts.eyebrow, 60).toUpperCase();
  const title = clamp(opts.title, 70);
  const subtitle = opts.subtitle ? clamp(opts.subtitle, 140) : "";

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: PAPER,
        padding: 80,
        borderTop: `12px solid ${ACCENT}`,
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 26,
          letterSpacing: 6,
          color: ACCENT,
          fontWeight: 600,
        }}
      >
        {eyebrow}
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            display: "flex",
            fontSize: 88,
            lineHeight: 1.05,
            color: INK,
            fontWeight: 600,
          }}
        >
          {title}
        </div>
        {subtitle ? (
          <div
            style={{
              display: "flex",
              marginTop: 24,
              fontSize: 34,
              lineHeight: 1.3,
              color: SECONDARY,
            }}
          >
            {subtitle}
          </div>
        ) : null}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
        }}
      >
        <div style={{ display: "flex", fontSize: 24, color: SECONDARY }}>
          {SITE_NAME}
        </div>
        <div
          style={{
            display: "flex",
            height: 8,
            width: 120,
            backgroundColor: ACCENT,
            borderRadius: 4,
          }}
        />
      </div>
    </div>,
    { ...OG_SIZE },
  );
}
