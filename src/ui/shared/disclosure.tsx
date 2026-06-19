import type { ReactNode } from "react";
import { cx } from "@/ui/shared/cx";

/**
 * The shared `<details className="tt-details">` accordion scaffold — the
 * repeated `<details>` + `<summary>` + chevron. The body `<div>` varies per
 * site (children vs `dangerouslySetInnerHTML`, different classes), so the caller
 * passes it as `children`.
 *
 * The accordion *behavior* (exclusivity via native `details[name]`, first-open,
 * `.chev` rotation) lives entirely in `globals.css` — this only emits markup,
 * identically to the hand-rolled sites it replaces.
 *
 * - `summary` is a slot: simple text/`<span>` or a rich node.
 * - `chevron` (default true) appends the `›` as the last summary child. Pass
 *   `chevron={false}` when the summary embeds its own chevron (grouped with a
 *   badge), so it isn't double-rendered.
 */
export function Disclosure({
  name,
  open,
  id,
  className,
  summary,
  chevron = true,
  children,
}: {
  name?: string;
  open?: boolean;
  id?: string;
  className?: string;
  summary: ReactNode;
  chevron?: boolean;
  children: ReactNode;
}) {
  return (
    <details
      name={name}
      id={id}
      className={cx("tt-details", className)}
      open={open}
    >
      <summary>
        {summary}
        {chevron && (
          <span className="chev" aria-hidden="true">
            ›
          </span>
        )}
      </summary>
      {children}
    </details>
  );
}
