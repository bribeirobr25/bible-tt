import { describe, expect, it } from "vitest";
import { serializeJsonLd } from "../serialize-json-ld";

const LS = String.fromCharCode(0x2028);
const PS = String.fromCharCode(0x2029);

describe("serializeJsonLd", () => {
  it("cannot close the script tag or open an HTML comment", () => {
    const data = {
      name: "</script><script>alert(1)</script>",
      description: "<!-- x --> & </SCRIPT>",
    };
    const out = serializeJsonLd(data);
    expect(out).not.toMatch(/<\/script/i);
    expect(out).not.toContain("<!--");
    expect(out).not.toMatch(/[<>&]/);
  });

  it("stays valid JSON with the same value", () => {
    const data = [
      { "@type": "Book", name: "a < b > c & d", sep: `x${LS}y${PS}z` },
      { "@type": "BreadcrumbList", itemListElement: [] },
    ];
    const out = serializeJsonLd(data);
    expect(out).not.toContain(LS);
    expect(out).not.toContain(PS);
    expect(out).toContain("\\u2028");
    expect(JSON.parse(out)).toEqual(data);
  });

  it("leaves ordinary data byte-identical to JSON.stringify", () => {
    const data = { "@context": "https://schema.org", name: "Gênesis — 1" };
    expect(serializeJsonLd(data)).toBe(JSON.stringify(data));
  });
});
