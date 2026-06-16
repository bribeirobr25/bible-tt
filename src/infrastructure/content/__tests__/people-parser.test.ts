import * as fs from "node:fs";
import * as path from "node:path";
import { describe, expect, it, vi } from "vitest";
import { parsePeopleMarkdown } from "../people-parser";

const CONTENT_ROOT = path.join(process.cwd(), "content");

function readPeople(locale: string, book: string): string {
  const filePath = path.join(CONTENT_ROOT, locale, book, "PEOPLE.md");
  if (!fs.existsSync(filePath)) return "";
  return fs.readFileSync(filePath, "utf-8");
}

describe("people-parser", () => {
  describe("basic parsing", () => {
    it("parses EN Genesis PEOPLE.md without error", () => {
      const raw = readPeople("en", "genesis");
      expect(raw.length).toBeGreaterThan(0);
      const result = parsePeopleMarkdown(raw, "genesis");
      expect(result.book).toBe("genesis");
      expect(result.entries.length).toBeGreaterThan(0);
    });

    it("parses EN Matthew PEOPLE.md without error", () => {
      const raw = readPeople("en", "matthew");
      expect(raw.length).toBeGreaterThan(0);
      const result = parsePeopleMarkdown(raw, "matthew");
      expect(result.book).toBe("matthew");
      expect(result.entries.length).toBeGreaterThan(0);
    });

    it("all 4 locales parse Genesis PEOPLE.md", () => {
      for (const locale of ["en", "pt-br", "de", "es"]) {
        const raw = readPeople(locale, "genesis");
        if (!raw) continue;
        const result = parsePeopleMarkdown(raw, "genesis");
        expect(result.entries.length).toBeGreaterThan(0);
      }
    });

    it("all 4 locales parse Matthew PEOPLE.md", () => {
      for (const locale of ["en", "pt-br", "de", "es"]) {
        const raw = readPeople(locale, "matthew");
        if (!raw) continue;
        const result = parsePeopleMarkdown(raw, "matthew");
        expect(result.entries.length).toBeGreaterThan(0);
      }
    });
  });

  describe("field extraction", () => {
    const raw = readPeople("en", "genesis");
    const result = parsePeopleMarkdown(raw, "genesis");

    it("extracts person name", () => {
      const adam = result.entries.find((e) => e.name.includes("Adam"));
      expect(adam).toBeDefined();
      expect(adam?.name).toContain("Adam");
    });

    it("extracts name meaning", () => {
      const adam = result.entries.find((e) => e.name.includes("Adam"));
      expect(adam?.nameMeaning).toBeDefined();
    });

    it("extracts lifespan", () => {
      const adam = result.entries.find((e) => e.name.includes("Adam"));
      expect(adam?.lifespan).toContain("930");
    });

    it("extracts father", () => {
      const seth = result.entries.find(
        (e) => e.name.includes("Shet") || e.name.includes("Seth"),
      );
      expect(seth).toBeDefined();
      expect(seth?.father).toContain("Adam");
    });

    it("extracts children as array", () => {
      const adam = result.entries.find((e) => e.name.includes("Adam"));
      expect(adam?.children).toBeDefined();
      expect(Array.isArray(adam?.children)).toBe(true);
      expect(adam?.children?.length).toBeGreaterThan(0);
    });
  });

  describe("new fields (v3.2 expansion)", () => {
    const raw = readPeople("en", "genesis");
    const result = parsePeopleMarkdown(raw, "genesis");

    it("extracts familiar name", () => {
      const noah = result.entries.find(
        (e) => e.name.includes("Noach") || e.name.includes("Noah"),
      );
      expect(noah).toBeDefined();
      expect(noah?.familiarName).toBeDefined();
    });

    it("extracts profession", () => {
      const noah = result.entries.find(
        (e) => e.name.includes("Noach") || e.name.includes("Noah"),
      );
      expect(noah?.profession).toBeDefined();
    });

    it("extracts hometown", () => {
      const abram = result.entries.find(
        (e) => e.name.includes("Avram") || e.name.includes("Abram"),
      );
      expect(abram).toBeDefined();
      expect(abram?.hometown).toBeDefined();
    });

    it("extracts places lived as array", () => {
      const abram = result.entries.find(
        (e) => e.name.includes("Avram") || e.name.includes("Abram"),
      );
      expect(abram?.placesLived).toBeDefined();
      expect(Array.isArray(abram?.placesLived)).toBe(true);
    });

    it("extracts archaeological evidence", () => {
      const adam = result.entries.find((e) => e.name.includes("Adam"));
      expect(adam?.archaeologicalEvidence).toBeDefined();
    });

    it("extracts historicity status", () => {
      const adam = result.entries.find((e) => e.name.includes("Adam"));
      expect(adam?.historicityStatus).toBeDefined();
      expect([
        "VERIFIED",
        "PROBABLE",
        "POSSIBLE",
        "UNCERTAIN",
        "LITERARY",
      ]).toContain(adam?.historicityStatus);
    });

    it("extracts year from creation for timeline", () => {
      const adam = result.entries.find((e) => e.name.includes("Adam"));
      expect(adam?.yearFromCreation).toBe(0);
      expect(adam?.yearFromCreationEnd).toBe(930);
      expect(adam?.timelineAnchor).toBe("creation");
    });

    it("extracts character arc", () => {
      const abram = result.entries.find(
        (e) => e.name.includes("Avram") || e.name.includes("Abram"),
      );
      expect(abram?.characterArc).toBeDefined();
    });

    it("extracts books appearing in", () => {
      const adam = result.entries.find((e) => e.name.includes("Adam"));
      expect(adam?.booksAppearingIn).toBeDefined();
      expect(Array.isArray(adam?.booksAppearingIn)).toBe(true);
    });
  });

  describe("non-person headings excluded", () => {
    const raw = readPeople("en", "genesis");
    const result = parsePeopleMarkdown(raw, "genesis");

    it("does not include Summary Table as a person", () => {
      const summaryEntry = result.entries.find((e) =>
        e.name.includes("Summary Table"),
      );
      expect(summaryEntry).toBeUndefined();
    });

    it("does not include Sources as a person", () => {
      const sourcesEntry = result.entries.find((e) =>
        e.name.includes("Sources"),
      );
      expect(sourcesEntry).toBeUndefined();
    });
  });

  // The People-page redesign render relies on rawFields + genealogies + sources
  // being preserved verbatim. These gates prove no authored content is dropped,
  // across all four locales (incl. the genealogy-heading skip for DE/ES).
  describe("redesign no-data-loss extraction", () => {
    it("all 4 locales yield exactly 24 Genesis person entries (no junk tables)", () => {
      for (const locale of ["en", "pt-br", "de", "es"]) {
        const r = parsePeopleMarkdown(readPeople(locale, "genesis"), "genesis");
        expect(r.entries.length, `${locale} entry count`).toBe(24);
        // No genealogy-table heading leaked in as a person.
        expect(
          r.entries.some((e) =>
            /genealog|tabela|tabla|übersicht/i.test(e.name),
          ),
          `${locale} no genealogy-table person`,
        ).toBe(false);
      }
    });

    it("preserves homonyms via suffix-disambiguated unique slugs", () => {
      const r = parsePeopleMarkdown(readPeople("en", "genesis"), "genesis");
      const lemekhs = r.entries.filter((e) => e.name === "Lemekh");
      expect(lemekhs.length).toBe(2);
      expect(new Set(lemekhs.map((e) => e.slug)).size).toBe(2);
      expect(lemekhs.map((e) => e.suffix).sort()).toEqual([
        "Cainite line",
        "Sethite line",
      ]);
    });

    it("preserves every authored field verbatim in rawFields", () => {
      const r = parsePeopleMarkdown(readPeople("en", "genesis"), "genesis");
      const adam = r.entries.find((e) => e.name === "Adam");
      const labels = adam?.rawFields?.map((f) => f.label) ?? [];
      // Fields the old curated card silently dropped must now be present.
      for (const l of [
        "Origin",
        "Location(s)",
        "First mention",
        "Mentioned in",
        "Key events",
      ]) {
        expect(labels, `Adam rawFields missing ${l}`).toContain(l);
      }
      expect(adam?.note).toMatch(/ha-adam/);
    });

    it("parses both genealogy tables — each with its note — across all 4 locales", () => {
      for (const locale of ["en", "pt-br", "de", "es"]) {
        const r = parsePeopleMarkdown(readPeople(locale, "genesis"), "genesis");
        expect(r.genealogies?.length, `${locale} genealogies`).toBe(2);
        for (const g of r.genealogies ?? []) {
          expect(g.headers.length, `${locale} headers`).toBe(7);
          expect(g.rows.length, `${locale} rows`).toBe(10);
          // Each table keeps its own note (the Gen-5 flood note was misplaced
          // after the Sources heading in PT/DE/ES — relocated to its table).
          expect(g.note, `${locale} genealogy note`).toBeTruthy();
        }
      }
    });

    it("captures the Sources Consulted section for genesis, matthew and john", () => {
      for (const book of ["genesis", "matthew", "john"]) {
        for (const locale of ["en", "pt-br", "de", "es"]) {
          const r = parsePeopleMarkdown(readPeople(locale, book), book);
          expect(r.sources, `${locale}/${book} sources`).toBeTruthy();
        }
      }
    });
  });

  describe("NT people (Matthew)", () => {
    const raw = readPeople("en", "matthew");
    const result = parsePeopleMarkdown(raw, "matthew");

    it("extracts historical year for NT figures", () => {
      const herod = result.entries.find((e) => e.name.includes("Herod"));
      if (herod) {
        expect(herod.historicalYear).toBeDefined();
        expect(herod.timelineAnchor).toBe("historical");
      }
    });

    it("extracts extra-biblical mentions", () => {
      const herod = result.entries.find((e) => e.name.includes("Herod"));
      if (herod) {
        expect(herod.extraBiblicalMentions).toBeDefined();
        expect(herod.extraBiblicalMentions).toContain("Josephus");
      }
    });
  });

  // ============================================================
  // Phase 1B — exact-match alias table per locale (resolves AUDIT §3.5)
  // ============================================================
  describe("Phase 1B — per-locale field alias resolution", () => {
    function _makeEntry(label: string, value: string): string {
      return `## Test (Test)\n\n**${label}:** ${value}\n**First mention:** Gen 1:1\n**Mentioned in:** Gen 1:1\n`;
    }

    it("EN: 'Age when became father' routes to ageAtFatherhood, not father", () => {
      const md = `## Test (Test)\n\n**Father:** the actual father\n**Age when became father:** 130 (at Seth's birth)\n**First mention:** Gen 1:1\n**Mentioned in:** Gen 1:1\n`;
      const r = parsePeopleMarkdown(md, "genesis");
      expect(r.entries[0].father).toBe("the actual father");
      expect(r.entries[0].ageAtFatherhood).toBe("130 (at Seth's birth)");
    });

    it("PT: 'Idade ao tornar-se pai' routes to ageAtFatherhood, not father", () => {
      const md = `## Teste (Teste)\n\n**Pai:** o pai real\n**Idade ao tornar-se pai:** 130 (ao nascer Sete)\n**Primeira menção:** Gn 1:1\n**Mencionado em:** Gn 1:1\n`;
      const r = parsePeopleMarkdown(md, "genesis");
      expect(r.entries[0].father).toBe("o pai real");
      expect(r.entries[0].ageAtFatherhood).toBe("130 (ao nascer Sete)");
    });

    it("DE: 'Alter bei erster Vaterschaft' routes to ageAtFatherhood, not father", () => {
      const md = `## Test (Test)\n\n**Vater:** der echte Vater\n**Alter bei erster Vaterschaft:** 130 (bei Sets Geburt)\n**Erste Erwähnung:** Gen 1:1\n**Erwähnt in:** Gen 1:1\n`;
      const r = parsePeopleMarkdown(md, "genesis");
      expect(r.entries[0].father).toBe("der echte Vater");
      expect(r.entries[0].ageAtFatherhood).toBe("130 (bei Sets Geburt)");
    });

    it("ES: 'Edad al hacerse padre' routes to ageAtFatherhood, not father", () => {
      const md = `## Prueba (Prueba)\n\n**Padre:** el padre real\n**Edad al hacerse padre:** 130 (al nacer Set)\n**Primera mención:** Gn 1:1\n**Mencionado en:** Gn 1:1\n`;
      const r = parsePeopleMarkdown(md, "genesis");
      expect(r.entries[0].father).toBe("el padre real");
      expect(r.entries[0].ageAtFatherhood).toBe("130 (al nacer Set)");
    });

    it("DE: 'Heimatort' routes to hometown", () => {
      const md = `## Test (Test)\n\n**Heimatort:** Garten Eden\n**First mention:** Gen 1:1\n**Mentioned in:** Gen 1:1\n`;
      const r = parsePeopleMarkdown(md, "genesis");
      expect(r.entries[0].hometown).toBe("Garten Eden");
    });

    it("DE: 'Orte, an denen er lebte' routes to placesLived", () => {
      const md = `## Test (Test)\n\n**Orte, an denen er lebte:** Eden, Osten\n**First mention:** Gen 1:1\n**Mentioned in:** Gen 1:1\n`;
      const r = parsePeopleMarkdown(md, "genesis");
      expect(r.entries[0].placesLived).toEqual(["Eden", "Osten"]);
    });

    it("DE: 'Gesellschaftliche Schicht' routes to socialClass", () => {
      const md = `## Test (Test)\n\n**Gesellschaftliche Schicht:** nicht zutreffend\n**First mention:** Gen 1:1\n**Mentioned in:** Gen 1:1\n`;
      const r = parsePeopleMarkdown(md, "genesis");
      expect(r.entries[0].socialClass).toBe("nicht zutreffend");
    });

    it("DE: 'Charakterbogen' routes to characterArc", () => {
      const md = `## Test (Test)\n\n**Charakterbogen:** Eine Reise.\n**First mention:** Gen 1:1\n**Mentioned in:** Gen 1:1\n`;
      const r = parsePeopleMarkdown(md, "genesis");
      expect(r.entries[0].characterArc).toBe("Eine Reise.");
    });

    it("DE: 'Historischer Status' routes to historicityStatus", () => {
      const md = `## Test (Test)\n\n**Historischer Status:** LITERARISCH\n**First mention:** Gen 1:1\n**Mentioned in:** Gen 1:1\n`;
      const r = parsePeopleMarkdown(md, "genesis");
      expect(r.entries[0].historicityStatus).toBe("LITERARY");
    });

    it("PT: 'Locais onde viveu' routes to placesLived", () => {
      const md = `## Teste (Teste)\n\n**Locais onde viveu:** Éden, leste\n**First mention:** Gen 1:1\n**Mentioned in:** Gen 1:1\n`;
      const r = parsePeopleMarkdown(md, "genesis");
      expect(r.entries[0].placesLived).toEqual(["Éden", "leste"]);
    });

    it("DE Genesis fixture: real-world labels all parse correctly", () => {
      const raw = readPeople("de", "genesis");
      if (!raw) return;
      const r = parsePeopleMarkdown(raw, "genesis");
      const adam = r.entries.find((e) => e.name.includes("Adam"));
      expect(adam).toBeDefined();
      expect(adam?.father).toContain("keiner");
      expect(adam?.ageAtFatherhood).toContain("130");
      expect(adam?.hometown).toContain("Eden");
      expect(adam?.placesLived).toBeDefined();
      expect(Array.isArray(adam?.placesLived)).toBe(true);
      expect(adam?.socialClass).toBeDefined();
      expect(adam?.characterArc).toBeDefined();
      expect(adam?.historicityStatus).toBe("LITERARY");
    });

    it("PT Genesis fixture: father not overwritten by age-at-fatherhood", () => {
      const raw = readPeople("pt-br", "genesis");
      if (!raw) return;
      const r = parsePeopleMarkdown(raw, "genesis");
      const adam = r.entries.find(
        (e) => e.name.includes("Adam") || e.name.includes("Adão"),
      );
      expect(adam).toBeDefined();
      expect(adam?.father).toContain("nenhum");
      expect(adam?.ageAtFatherhood).toContain("130");
    });

    it("fallback substring path: unknown label containing a known substring routes correctly", () => {
      // Plan §1B explicitly required this case. The label `Hometown of birth` is
      // not in EXACT_LABEL_ALIASES, but the substring `hometown` is — fallback
      // should route this to `hometown`.
      const md = `## Test (Test)\n\n**Hometown of birth:** Ur of the Kasdim\n**First mention:** Gen 11:28\n**Mentioned in:** Gen 11:28\n`;
      const r = parsePeopleMarkdown(md, "genesis");
      expect(r.entries[0].hometown).toBe("Ur of the Kasdim");
    });

    it("fallback prefers longer alias (no substring collision)", () => {
      // `## Test` has both `Father` and `Age when became father` lines.
      // The longer alias must win in fallback ordering, so neither field
      // overwrites the other regardless of file order.
      const md = `## Test (Test)\n\n**Age when became father:** 130\n**Father:** the actual father\n**First mention:** Gen 1:1\n**Mentioned in:** Gen 1:1\n`;
      const r = parsePeopleMarkdown(md, "genesis");
      expect(r.entries[0].ageAtFatherhood).toBe("130");
      expect(r.entries[0].father).toBe("the actual father");
    });
  });

  // ============================================================
  // Phase 1A / §0.11 — TT H2 not parsed as person entry
  // ============================================================
  describe("Phase 1A — TT H2 negative test", () => {
    it("does not produce a PersonEntry for the 'Transparent Translation' H2", () => {
      const md = `# Genesis — People\n## The Transparent Translation (TT)\n\n**Book:** Genesis\n**Status:** provisional\n\n## Adam (Adam)\n\n**Meaning:** human\n**First mention:** Gen 1:1\n**Mentioned in:** Gen 1:1\n`;
      const r = parsePeopleMarkdown(md, "genesis");
      expect(
        r.entries.find((e) => e.name.includes("Transparent Translation")),
      ).toBeUndefined();
      expect(r.entries.find((e) => e.name.includes("Adam"))).toBeDefined();
    });

    it("does not produce a PersonEntry for localized 'Transparente' H2", () => {
      const md = `# Génesis — Personas\n## La Traducción Transparente (TT)\n\n**Libro:** Génesis\n\n## Adán (Adán)\n\n**Significado:** humano\n**Primera mención:** Gn 1:1\n**Mencionado en:** Gn 1:1\n`;
      const r = parsePeopleMarkdown(md, "genesis");
      expect(
        r.entries.find((e) => /Transparente/i.test(e.name)),
      ).toBeUndefined();
      expect(r.entries.find((e) => e.name.includes("Adán"))).toBeDefined();
    });

    it("does not produce a PersonEntry for DE 'Transparente Übersetzung' H2", () => {
      const md = `# Genesis — Personen\n## Die Transparente Übersetzung (TT)\n\n**Buch:** Genesis\n\n## Adam (Adam)\n\n**Bedeutung:** Mensch\n**Erste Erwähnung:** Gen 1:1\n**Erwähnt in:** Gen 1:1\n`;
      const r = parsePeopleMarkdown(md, "genesis");
      expect(
        r.entries.find((e) => /Transparente/i.test(e.name)),
      ).toBeUndefined();
      expect(r.entries.find((e) => e.name.includes("Adam"))).toBeDefined();
    });

    it("does not produce a PersonEntry for PT 'Tradução Transparente' H2", () => {
      const md = `# Gênesis — Pessoas\n## A Tradução Transparente (TT)\n\n**Livro:** Gênesis\n\n## Adam (Adão)\n\n**Significado:** humano\n**Primeira menção:** Gn 1:1\n**Mencionado em:** Gn 1:1\n`;
      const r = parsePeopleMarkdown(md, "genesis");
      expect(
        r.entries.find((e) => /Transparente|Tradução/i.test(e.name)),
      ).toBeUndefined();
      expect(r.entries.find((e) => e.name.includes("Adam"))).toBeDefined();
    });
  });

  // ============================================================
  // Phase 1H — new field parsing
  // ============================================================
  describe("Phase 1H — new field parsing", () => {
    it("parses generationsFrom inline list", () => {
      const md = `## Test (Test)\n\n**Generations from:** adam (15, via Seth, Gen 5); noach (5, via Shem)\n**First mention:** Gen 1:1\n**Mentioned in:** Gen 1:1\n`;
      const r = parsePeopleMarkdown(md, "genesis");
      expect(r.entries[0].generationsFrom).toBeDefined();
      expect(r.entries[0].generationsFrom?.length).toBe(2);
      expect(r.entries[0].generationsFrom?.[0].reference).toBe("adam");
      expect(r.entries[0].generationsFrom?.[0].count).toBe(15);
      expect(r.entries[0].generationsFrom?.[0].line).toBe("via Seth");
      expect(r.entries[0].generationsFrom?.[1].reference).toBe("noach");
      expect(r.entries[0].generationsFrom?.[1].count).toBe(5);
    });

    it("parses regionsByText inline list with confidence", () => {
      const md = `## Test (Test)\n\n**Regions by text:** Cush (Gen 10:6, DOCUMENTED); Mitsrayim (Gen 10:6, DOCUMENTED)\n**First mention:** Gen 1:1\n**Mentioned in:** Gen 1:1\n`;
      const r = parsePeopleMarkdown(md, "genesis");
      expect(r.entries[0].regionsByText).toBeDefined();
      expect(r.entries[0].regionsByText?.length).toBe(2);
      expect(r.entries[0].regionsByText?.[0].region).toBe("Cush");
      expect(r.entries[0].regionsByText?.[0].verse).toBe("Gen 10:6");
      expect(r.entries[0].regionsByText?.[0].confidence).toBe("DOCUMENTED");
    });

    it("parses Curiosities H3 subsection with H4 entries", () => {
      const md = `## Test (Test)\n\n**First mention:** Gen 1:1\n**Mentioned in:** Gen 1:1\n\n### Curiosities\n\n#### First fact\n**Claim type:** TEXTUAL\n**Confidence:** VERIFIED\n**Content:** A textual fact.\n**Source:** Gen 1:1\n\n#### Second fact\n**Claim type:** SCIENTIFIC COMPARISON\n**Confidence:** DOCUMENTED\n**Content:** A scientific observation.\n`;
      const r = parsePeopleMarkdown(md, "genesis");
      expect(r.entries[0].curiosities).toBeDefined();
      expect(r.entries[0].curiosities?.length).toBe(2);
      expect(r.entries[0].curiosities?.[0].title).toBe("First fact");
      expect(r.entries[0].curiosities?.[0].claimType).toBe("TEXTUAL");
      expect(r.entries[0].curiosities?.[0].confidence).toBe("VERIFIED");
      expect(r.entries[0].curiosities?.[0].content).toBe("A textual fact.");
      expect(r.entries[0].curiosities?.[0].source).toBe("Gen 1:1");
      expect(r.entries[0].curiosities?.[1].title).toBe("Second fact");
      expect(r.entries[0].curiosities?.[1].source).toBeUndefined();
    });

    it("Curiosities subsection does not consume the next entry", () => {
      const md = `## First (First)\n\n**First mention:** Gen 1:1\n**Mentioned in:** Gen 1:1\n\n### Curiosities\n\n#### Fact A\n**Claim type:** TEXTUAL\n**Confidence:** VERIFIED\n**Content:** content\n\n## Second (Second)\n\n**First mention:** Gen 2:1\n**Mentioned in:** Gen 2:1\n`;
      const r = parsePeopleMarkdown(md, "genesis");
      expect(r.entries.length).toBe(2);
      expect(r.entries[0].curiosities?.length).toBe(1);
      expect(r.entries[1].name).toContain("Second");
      expect(r.entries[1].curiosities).toBeUndefined();
    });
  });

  describe("cross-book see-only entries (Phase 6 follow-up)", () => {
    it("extracts crossBookSee + inBook for EN Avraham (Matthew)", () => {
      const raw = readPeople("en", "matthew");
      const result = parsePeopleMarkdown(raw, "matthew");
      const avraham = result.entries.find((e) => e.name.startsWith("Avraham"));
      expect(avraham).toBeDefined();
      expect(avraham?.crossBookSee).toBe("genesis/PEOPLE.md");
      expect(avraham?.inBook).toContain("First in the genealogy");
    });

    it("extracts inBook across all 4 locales for see-only entries", () => {
      const locales = ["en", "pt-br", "de", "es"];
      for (const locale of locales) {
        const raw = readPeople(locale, "matthew");
        const result = parsePeopleMarkdown(raw, "matthew");
        const tamar = result.entries.find((e) => e.name.startsWith("Tamar"));
        expect(tamar, `${locale}: Tamar entry`).toBeDefined();
        expect(tamar?.crossBookSee, `${locale}: crossBookSee`).toBeDefined();
        expect(tamar?.inBook, `${locale}: inBook`).toBeDefined();
      }
    });

    it("PT-BR Matthew Yeshua resolves Menções extrabíblicas (no hyphen)", () => {
      const raw = readPeople("pt-br", "matthew");
      const result = parsePeopleMarkdown(raw, "matthew");
      const yeshua = result.entries.find((e) => e.name.startsWith("Yeshua"));
      expect(yeshua).toBeDefined();
      expect(yeshua?.extraBiblicalMentions).toContain("Tácito");
    });
  });

  describe("heading auto-extracts familiarName (6.6B)", () => {
    it("'## Adam (Adam)' yields name='Adam', familiarName='Adam'", () => {
      const md = `## Adam (Adam)\n\n**First mention:** Gen 1:1\n**Mentioned in:** Gen 1:1\n`;
      const r = parsePeopleMarkdown(md, "genesis");
      expect(r.entries[0].name).toBe("Adam");
      expect(r.entries[0].familiarName).toBe("Adam");
    });

    it("'## Avraham (Abraão)' yields name='Avraham', familiarName='Abraão'", () => {
      const md = `## Avraham (Abraão)\n\n**First mention:** Gn 12:1\n**Mentioned in:** Gn 12:1\n`;
      const r = parsePeopleMarkdown(md, "genesis");
      expect(r.entries[0].name).toBe("Avraham");
      expect(r.entries[0].familiarName).toBe("Abraão");
    });

    it("'## Tamar' (no parens) yields name='Tamar', familiarName=undefined", () => {
      const md = `## Tamar\n\n**First mention:** Mt 1:3\n**Mentioned in:** Mt 1:3\n`;
      const r = parsePeopleMarkdown(md, "matthew");
      expect(r.entries[0].name).toBe("Tamar");
      expect(r.entries[0].familiarName).toBeUndefined();
    });

    it("explicit '**Familiar name:**' field overrides heading-extracted value", () => {
      const md = `## Avraham (Abraham)\n\n**Familiar name:** Abraham (the father of nations)\n**First mention:** Gn 12:1\n**Mentioned in:** Gn 12:1\n`;
      const r = parsePeopleMarkdown(md, "genesis");
      expect(r.entries[0].name).toBe("Avraham");
      expect(r.entries[0].familiarName).toBe("Abraham (the father of nations)");
    });
  });

  describe("duplicate-slug detection (parser hardening)", () => {
    it("emits console.warn when two entries share the same slug", () => {
      const md = `## Ya'aqov (Jacob)\n\n**First mention:** Gn 25:26\n**Mentioned in:** Gn 25–50\n\n## Ya'aqov (James)\n\n**First mention:** Mt 13:55\n**Mentioned in:** Mt 13:55\n`;
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const r = parsePeopleMarkdown(md, "matthew");
      expect(r.entries).toHaveLength(2);
      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Duplicate slug "ya\'aqov"'),
      );
      warnSpy.mockRestore();
    });

    it("does NOT warn when two homonymous source-names use different transliterations (the documented mitigation)", () => {
      const md = `## Ya'aqov (Jacob)\n\n**First mention:** Gn 25:26\n**Mentioned in:** Gn 25–50\n\n## Iakobos (James)\n\n**See:** acts/PEOPLE.md\n**In Matthew:** Named at Matt 13:55.\n`;
      const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
      const r = parsePeopleMarkdown(md, "matthew");
      expect(r.entries).toHaveLength(2);
      expect(r.entries[0].slug).toBe("ya'aqov");
      expect(r.entries[1].slug).toBe("iakobos");
      expect(warnSpy).not.toHaveBeenCalled();
      warnSpy.mockRestore();
    });
  });
});
