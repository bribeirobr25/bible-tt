/**
 * The first `**Status:**` value of a content file (Rule 28 front matter), or
 * undefined when the file has none. Shared by the book-level parsers so every
 * badge reads the same field; chapters keep their own metadata block.
 */
export function extractStatus(raw: string): string | undefined {
  // Some ES book-level files label the field "Estado" / "Estatus".
  const m = raw.match(/^\*\*(?:Status|Estado|Estatus):\*\*\s*(.+?)\s*$/m);
  return m ? m[1] : undefined;
}
