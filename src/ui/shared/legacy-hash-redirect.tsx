"use client";

import { useEffect } from "react";
import { useRouter } from "@/ui/navigation/locale-link";

/**
 * Phase 3 (P3-Q5) — one-time back-compat for pre-Phase-3 hash deep links.
 * Old view modes lived in the URL hash (`#study`, `#explore`, `#context`,
 * `#prophecy`) on a single chapter page. Those now have real URLs, so on the
 * Read route we map any legacy hash to its new path and `replace` to it.
 * Hashes are client-only (never sent to the server), so this must run client-side.
 */
const HASH_MAP: Record<string, "notes" | "deeper"> = {
  study: "notes",
  explore: "deeper",
  context: "deeper",
  prophecy: "deeper",
};

export function LegacyHashRedirect({
  book,
  chapterNum,
}: {
  book: string;
  chapterNum: number;
}) {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    const door = HASH_MAP[hash];
    if (door) {
      router.replace(`/${book}/chapter/${chapterNum}/${door}`);
    } else if (hash === "reading") {
      router.replace(`/${book}/chapter/${chapterNum}`);
    }
  }, [book, chapterNum, router]);

  return null;
}
