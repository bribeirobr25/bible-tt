/**
 * The loader treats only an ABSENT file/dir as "no content" (→ null / []);
 * any other error must surface so the build fails loudly (audit §3.2,
 * STANDARDS §7) instead of becoming a silent 404.
 */
import { afterEach, describe, expect, it, vi } from "vitest";

const errno = (code: string) =>
  Object.assign(new Error(`${code}: simulated`), { code });

afterEach(() => {
  vi.resetModules();
  vi.doUnmock("node:fs/promises");
});

async function repoWith(failCode: string) {
  vi.doMock("node:fs/promises", () => {
    const fail = async () => {
      throw errno(failCode);
    };
    return { default: { readFile: fail, readdir: fail } };
  });
  return import("../fs-content-repository");
}

describe("fs-content-repository error handling", () => {
  it.each(["ENOENT", "ENOTDIR"])("%s reads as absent", async (code) => {
    const repo = await repoWith(code);
    await expect(repo.readChapter("en", "genesis", 1)).resolves.toBeNull();
    await expect(repo.readIntroduction("en", "genesis")).resolves.toBeNull();
    await expect(repo.listBooks("en")).resolves.toEqual([]);
    await expect(repo.listChapters("en", "genesis")).resolves.toEqual([]);
  });

  it("any other error is rethrown (never a silent 404)", async () => {
    const repo = await repoWith("EACCES");
    await expect(repo.readChapter("en", "genesis", 1)).rejects.toThrow(
      "EACCES",
    );
    await expect(repo.readPeople("en", "genesis")).rejects.toThrow("EACCES");
    await expect(repo.listBooks("en")).rejects.toThrow("EACCES");
    await expect(repo.listChapters("en", "genesis")).rejects.toThrow("EACCES");
  });
});
