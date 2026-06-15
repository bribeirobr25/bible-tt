import { SeparationHero } from "./separation-hero";

/**
 * Marketing sub-hero band (rules / start / books). A shorter WebGL separation
 * field, bottom-aligned, with a left-anchored kicker + display title + italic
 * serif tagline. The whole text block uses `mix-blend-difference` so the white
 * type stays legible across the light/dark seam. `-mt-16` bleeds it under the
 * transparent over-hero header.
 */
export function MarketingHero({
  kicker,
  title,
  tagline,
  titleMaxCh = 14,
  taglineMaxCh = 42,
  minH = "64svh",
}: {
  kicker: string;
  title: string;
  tagline: string;
  titleMaxCh?: number;
  taglineMaxCh?: number;
  minH?: string;
}) {
  return (
    <section
      className="relative isolate overflow-hidden bg-dark -mt-16 flex items-end"
      style={{ minHeight: minH, paddingBottom: "clamp(40px,7vh,80px)" }}
    >
      <SeparationHero />
      <div
        className="relative z-10 w-full max-w-[1320px] mx-auto px-[clamp(18px,4vw,52px)]"
        style={{ color: "#fff", mixBlendMode: "difference" }}
      >
        <p className="font-[family-name:var(--font-mono)] text-xs uppercase tracking-[0.2em] mb-[18px]">
          {kicker}
        </p>
        <h1 className="tt-display" style={{ maxWidth: `${titleMaxCh}ch` }}>
          {title}
        </h1>
        <p
          className="font-[family-name:var(--font-reading)] italic text-[clamp(1.1rem,2vw,1.5rem)] mt-[18px]"
          style={{ maxWidth: `${taglineMaxCh}ch` }}
        >
          {tagline}
        </p>
      </div>
    </section>
  );
}
