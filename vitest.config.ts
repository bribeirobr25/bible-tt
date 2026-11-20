import { defineConfig } from "vitest/config";
import path from "node:path";

export default defineConfig({
  test: {
    include: [
      "src/**/*.test.ts",
      "scripts/**/*.test.ts",
      "scripts/**/*.test.mjs",
    ],
    // Several suites scan the whole corpus (conservation ≈ 2.5 s/test alone); under
    // parallel workers the 5 s default flakes. A flake on `main` blocks every merge
    // (required check, enforce_admins), so the budget is explicit.
    testTimeout: 30_000,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
