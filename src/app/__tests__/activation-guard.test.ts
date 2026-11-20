/**
 * Static scan for the activation gate (audit B1, plan §B1.2): every route
 * under `src/app/[locale]/[book]/` must refuse an unactivated book before it
 * reads any content, and every dynamic page must 404 unknown params at the
 * router. A new `[book]` route that forgets the guard fails here.
 */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

const APP = path.resolve(__dirname, "..");
const BOOK_DIR = path.join(APP, "[locale]", "[book]");

function scan(name: string): string[] {
  return (readdirSync(BOOK_DIR, { recursive: true }) as string[])
    .filter((rel) => path.basename(rel) === name)
    .map((rel) => path.join(BOOK_DIR, rel))
    .sort();
}

const PAGES = scan("page.tsx");
const OG_ROUTES = scan("opengraph-image.tsx");
const rel = (f: string) => path.relative(APP, f);

/** Source text of `export [default] async function <name>` up to the next top-level export. */
function fnBody(src: string, header: RegExp): string | null {
  const m = header.exec(src);
  if (!m) return null;
  const rest = src.slice(m.index + m[0].length);
  const next = rest.search(/\nexport /);
  return next === -1 ? rest : rest.slice(0, next);
}

// Any content read: loader calls (`getChapterData(`, `getAvailableBooks(`, …)
// and `hasDeeperContent(` — but not next-intl's `getTranslations(`.
const CONTENT_READ = /\b(?!getTranslations\b)(get[A-Z]\w*|hasDeeperContent)\(/;

function guardPrecedesReads(body: string): boolean {
  const guard = body.indexOf("isActiveBook(");
  if (guard === -1) return false;
  const read = body.search(CONTENT_READ);
  return read === -1 || guard < read;
}

describe("activation guard — [book] pages", () => {
  it("finds all 7 [book] pages (the scan is not vacuous)", () => {
    expect(PAGES.map(rel)).toHaveLength(7);
  });

  it.each(PAGES.map((f) => [rel(f), f]))("%s", (_name, file) => {
    const src = readFileSync(file, "utf8");
    // No `dynamicParams = false`: on Next 16 every unmatched param then logs an
    // internal NoFallbackError before falling through to `[...rest]` — runtime
    // error noise on every 404. The in-page guard below is the B1 fix.
    expect(src).not.toMatch(/export const dynamicParams = false/);
    expect(src).toMatch(/export (async )?function generateStaticParams\(/);
    expect(src).not.toContain("AVAILABLE_BOOKS");

    const page = fnBody(src, /export default async function \w+/);
    expect(page, "default export").not.toBeNull();
    expect(page).toMatch(/if \(!isActiveBook\(book\)\) notFound\(\);/);
    expect(guardPrecedesReads(page ?? "")).toBe(true);

    const meta = fnBody(src, /export async function generateMetadata/);
    if (meta !== null) {
      expect(meta).toMatch(/isActiveBook\(book\)\)? return \{\};/);
      expect(guardPrecedesReads(meta)).toBe(true);
    }
  });
});

describe("activation guard — [book] opengraph-image routes", () => {
  it("finds all 7 [book] OG routes (the scan is not vacuous)", () => {
    expect(OG_ROUTES.map(rel)).toHaveLength(7);
  });

  it.each(OG_ROUTES.map((f) => [rel(f), f]))("%s", (_name, file) => {
    const src = readFileSync(file, "utf8");
    expect(src).not.toContain("AVAILABLE_BOOKS");
    const body = fnBody(src, /export default async function \w+/) ?? "";
    expect(body).toMatch(/if \(!isActiveBook\(book\)[^\n]*\) notFound\(\);/);
    const guard = body.indexOf("isActiveBook(");
    expect(guard).toBeGreaterThan(-1);
    expect(guard).toBeLessThan(body.indexOf("getTranslations("));
    // A metadata image route without its own generateStaticParams must not
    // set `dynamicParams = false`: under Turbopack that 404s every image.
    if (/export const dynamicParams = false/.test(src)) {
      expect(src).toMatch(/export (async )?function generateStaticParams\(/);
    }
  });
});

describe("404 routes (plan §B1.3)", () => {
  it("[locale]/[...rest] calls notFound()", () => {
    const f = path.join(APP, "[locale]", "[...rest]", "page.tsx");
    expect(readFileSync(f, "utf8")).toMatch(/notFound\(\)/);
  });

  it("localized [locale]/not-found.tsx exists", () => {
    expect(existsSync(path.join(APP, "[locale]", "not-found.tsx"))).toBe(true);
  });

  it("root not-found.tsx renders its own <html> and loads the stylesheet", () => {
    const src = readFileSync(path.join(APP, "not-found.tsx"), "utf8");
    expect(src).toMatch(/<html lang="en"/);
    expect(src).toMatch(/import "\.\/globals\.css";/);
  });
});
