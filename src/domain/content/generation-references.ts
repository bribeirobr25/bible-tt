import type { GenerationReference } from "./types";

/**
 * Canonical reference figures for the GenerationEntry.reference field.
 *
 * Convention: lowercase, no diacritics, transliteration-first form.
 * Add to this set as new books arrive (Phase 12 may add yitschaq, yaaqov, etc.).
 *
 * Unknown references render as the slug capitalised — the type itself is
 * `string`, so authoring is not blocked on registry updates.
 */
export const KNOWN_GENERATION_REFERENCES: ReadonlySet<GenerationReference> =
  new Set<GenerationReference>(["adam", "noach", "avram", "mosheh", "david"]);

/**
 * Per-locale display labels for known references. Falls back to the
 * slug capitalised when a locale-specific form is not registered.
 */
export const GENERATION_REFERENCE_LABELS: Record<
  GenerationReference,
  Record<string, string>
> = {
  adam: { en: "Adam", "pt-br": "Adão", de: "Adam", es: "Adán" },
  noach: { en: "Noah", "pt-br": "Noé", de: "Noah", es: "Noé" },
  avram: { en: "Abraham", "pt-br": "Abraão", de: "Abraham", es: "Abrahán" },
  mosheh: { en: "Moses", "pt-br": "Moisés", de: "Mose", es: "Moisés" },
  david: { en: "David", "pt-br": "Davi", de: "David", es: "David" },
};

export function generationReferenceLabel(
  reference: GenerationReference,
  locale: string,
): string {
  const labels = GENERATION_REFERENCE_LABELS[reference];
  if (labels?.[locale]) return labels[locale];
  if (labels?.en) return labels.en;
  return reference.charAt(0).toUpperCase() + reference.slice(1);
}
