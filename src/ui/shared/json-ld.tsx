import { type JsonLdData, serializeJsonLd } from "./serialize-json-ld";

/**
 * Renders a schema.org JSON-LD script. Data is author-controlled (no user
 * input); it is still escaped so no string can break out of the script tag.
 */
export function JsonLd({ data }: { data: JsonLdData }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }}
    />
  );
}
