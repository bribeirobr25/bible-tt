type JsonLdData = Record<string, unknown> | Record<string, unknown>[];

/** Renders a schema.org JSON-LD script. Data is author-controlled (no user input). */
export function JsonLd({ data }: { data: JsonLdData }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
