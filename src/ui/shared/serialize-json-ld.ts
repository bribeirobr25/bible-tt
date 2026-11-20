export type JsonLdData = Record<string, unknown> | Record<string, unknown>[];

// U+2028 / U+2029, built from code points so no raw separator sits in source.
const LINE_SEPARATORS = new RegExp(
  `[${String.fromCharCode(0x2028, 0x2029)}]`,
  "g",
);

/**
 * JSON-serializes schema.org data for an inline `<script type="application/ld+json">`.
 * Every `<`, `>` and `&` becomes its JSON unicode escape (backslash-u003c etc.;
 * still valid JSON with the same parsed value), so content can never close
 * the script (`</script>`) or open an HTML comment (`<!--`). U+2028/U+2029
 * are escaped the same way for old JS parsers. Audit §3.2 latent risk
 * (plan §B1.6).
 */
export function serializeJsonLd(data: JsonLdData): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(LINE_SEPARATORS, (c) => `\\u${c.charCodeAt(0).toString(16)}`);
}
