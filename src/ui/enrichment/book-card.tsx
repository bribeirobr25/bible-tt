import type { BookCardField } from "@/domain/content/types";

/**
 * Phase 5b — the book "tight card": a 5-row at-a-glance summary
 * (What · When · Who · To whom · Why), replacing the long overview dump on the
 * book landing. Labels are authored (localized) in the content.
 */
export function BookCard({
  fields,
  title,
}: {
  fields: BookCardField[];
  title: string;
}) {
  return (
    <section
      aria-label={title}
      className="border border-border rounded-lg bg-bg-surface p-5 md:p-6"
    >
      <h2 className="text-xs uppercase tracking-[0.18em] text-text-muted font-[family-name:var(--font-ui)] mb-4">
        {title}
      </h2>
      <dl className="space-y-3">
        {fields.map((f) => (
          <div
            key={f.label}
            className="grid grid-cols-1 sm:grid-cols-[7rem_1fr] gap-x-4 gap-y-0.5"
          >
            <dt className="text-sm font-semibold text-accent">{f.label}</dt>
            <dd className="text-sm text-text-primary leading-relaxed">
              {f.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
