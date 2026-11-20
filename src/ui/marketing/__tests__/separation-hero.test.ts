/** B8 (launch fixes) — WebGL hero resize redraw + context release. */
import { describe, expect, it, vi } from "vitest";
import {
  createResizeHandler,
  releaseRenderer,
} from "@/ui/marketing/separation-hero";

function harness(redrawStatic: (() => void) | null) {
  const calls: string[] = [];
  const handler = createResizeHandler({
    getSize: () => ({ width: 400, height: 300 }),
    setSize: (w, h) => calls.push(`setSize:${w}x${h}`),
    setResolution: (w, h) => calls.push(`res:${w}x${h}`),
    pixelRatio: () => 1.5,
    redrawStatic: redrawStatic
      ? () => {
          calls.push("render");
          redrawStatic();
        }
      : null,
  });
  return { handler, calls };
}

describe("createResizeHandler (B8)", () => {
  it("reduced motion: redraws the static frame after every resize (setSize clears the buffer)", () => {
    const { handler, calls } = harness(() => {});
    handler();
    handler();
    expect(calls).toEqual([
      "setSize:400x300",
      "res:600x450",
      "render",
      "setSize:400x300",
      "res:600x450",
      "render",
    ]);
  });

  it("animated: does not render from the resize handler (the loop repaints)", () => {
    const { handler, calls } = harness(null);
    handler();
    expect(calls).toEqual(["setSize:400x300", "res:600x450"]);
  });
});

describe("releaseRenderer (B8)", () => {
  it("forces context loss before dispose", () => {
    const order: string[] = [];
    const renderer = {
      forceContextLoss: vi.fn(() => order.push("forceContextLoss")),
      dispose: vi.fn(() => order.push("dispose")),
    };
    releaseRenderer(renderer);
    expect(order).toEqual(["forceContextLoss", "dispose"]);
  });
});
