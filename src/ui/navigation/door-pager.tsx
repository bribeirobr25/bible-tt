import { Link } from "@/ui/navigation/locale-link";

type PagerLink = { href: string; label: string };

/**
 * Door-aware pager (Notes/Deeper): cross-links to sibling doors / sections
 * rather than the chapter prev/next — matches the prototype's `.tt-pager`.
 */
export function DoorPager({
  left,
  right,
}: {
  left?: PagerLink;
  right?: PagerLink;
}) {
  return (
    <nav className="tt-pager" aria-label="Chapter navigation">
      {left ? (
        <Link href={left.href}>
          <span className="pl" aria-hidden="true">
            ←
          </span>
          <span className="font-[family-name:var(--font-reading)] text-[1.2rem]">
            {left.label}
          </span>
        </Link>
      ) : (
        <span />
      )}
      {right ? (
        <Link className="right" href={right.href}>
          <span className="pl" aria-hidden="true">
            →
          </span>
          <span className="font-[family-name:var(--font-reading)] text-[1.2rem]">
            {right.label}
          </span>
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
