import { notFound } from "next/navigation";

/**
 * Catch-all for any unmatched path under a locale (next-intl pattern), so the
 * localized `[locale]/not-found.tsx` renders inside the locale layout instead
 * of the bare root 404 (plan §B1.3). Unknown books/chapters 404 inside their
 * own `[book]` pages via the `isActiveBook` guard / missing data.
 *
 * No `generateStaticParams`: the page is rendered on demand and never cached
 * per URL. The legacy `/:locale/:book/:chapter(\d+)` redirect in
 * next.config.ts runs before routing, so it is unaffected.
 */
export default function CatchAllNotFound() {
  notFound();
}
