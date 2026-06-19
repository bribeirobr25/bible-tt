/** Join class-name parts with single spaces, dropping falsy values (no trailing space). */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
