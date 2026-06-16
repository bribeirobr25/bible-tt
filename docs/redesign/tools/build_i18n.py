#!/usr/bin/env python3
"""Build the redesign UI dictionary (EN/PT/DE/ES) from the project's own
messages/*.json, so translations are authentic. Emits assets/i18n.js."""
import json, pathlib

ROOT = pathlib.Path("/Users/simonekugler/Desktop/bible-tt")
MSG = ROOT / "src/infrastructure/i18n/messages"
OUT = ROOT / "docs/redesign/site/assets/i18n.js"
LOCALES = ["en", "pt-br", "de", "es"]

msgs = {loc: json.loads((MSG / f"{loc}.json").read_text(encoding="utf-8")) for loc in LOCALES}

def gget(loc, path, fallback=""):
    cur = msgs[loc]
    for k in path.split("."):
        if isinstance(cur, dict) and k in cur: cur = cur[k]
        else: return fallback
    return cur

# (dictKey -> messages path); pulled per-locale, EN fallback
FROM_MSG = {
    "nav.books": "nav.books",
    "nav.start": "start.title",
    "nav.rules": "landing.ctaRules",
    "nav.startReading": "landing.cta",
    "nav.home": "nav.home",
    "door.read": "nav.doorRead",
    "door.notes": "nav.doorNotes",
    "door.deeper": "nav.doorDeeper",
    "ui.chapterOverview": "nav.chapterOverview",
    "ui.background": "nav.bookContext",
    "ui.people": "people.title",
    "ui.introduction": "introduction.title",
    "ui.prev": "chapter.prev",
    "ui.next": "chapter.next",
    "ui.glossary": "glossary.title",
    "ui.atAGlance": "nav.atAGlance",
    # study surfaces (deeper / people / background / intro / notes / prophecy)
    # ui.source is defined in MANUAL (authored citation term "Fonte"/"Quelle"/"Fuente"),
    # which differs from glossary.sourceWord ("Origem"/"Origen") used in the glossary.
    "ui.chapters": "bookContext.chapters",
    "ui.continuousReading": "chapter.reading",
    "ui.verseStudy": "chapter.study",
    "notes.critical": "notes.critical",
    "notes.lexical": "notes.lexical",
    "notes.grammatical": "notes.grammatical",
    "notes.theological": "notes.theological",
    "glossary.sourceWord": "glossary.sourceWord",
    "glossary.translation": "glossary.translation",
    "glossary.notes": "glossary.notes",
    "prophecy.title": "prophecy.title",
    "prophecy.disclaimer": "prophecy.disclaimer",
    "prophecy.textSays": "prophecy.fields.textSays",
    "prophecy.context": "prophecy.fields.context",
    "prophecy.subject": "prophecy.fields.subject",
    "prophecy.readings": "prophecy.fields.readings",
    "prophecy.status": "prophecy.fields.status",
    "prophecy.note": "prophecy.fields.scholarlyNote",
    "book.genesis": "book.genesis",
    "book.john": "book.john",
    "book.matthew": "book.matthew",
    # landing
    "landing.heroHeadline": "landing.heroHeadline",
    "landing.heroSub": "landing.heroSub",
    "landing.heroSupport": "landing.heroSupport",
    "landing.languageTagline": "landing.languageTagline",
    "landing.cta": "landing.cta",
    "landing.ctaStartHere": "landing.ctaStartHere",
    "landing.ctaRules": "landing.ctaRules",
    "landing.differenceTitle": "landing.differenceTitle",
    "landing.differenceDesc": "landing.differenceDesc",
    "landing.conventional": "landing.conventional",
    "landing.conventionalVerse": "landing.conventionalVerse",
    "landing.transparent": "landing.transparent",
    "landing.diff1title": "landing.diff1title", "landing.diff1": "landing.diff1",
    "landing.diff2title": "landing.diff2title", "landing.diff2": "landing.diff2",
    "landing.diff3title": "landing.diff3title", "landing.diff3": "landing.diff3",
    "landing.diff4title": "landing.diff4title", "landing.diff4": "landing.diff4",
    "landing.howTitle": "landing.howTitle",
    "landing.howReading": "landing.howReading",
    "landing.howStudy": "landing.howStudy",
    "landing.howDeeper": "landing.howDeeper",
    "landing.whoTitle": "landing.whoTitle",
    "landing.who1": "landing.who1", "landing.who2": "landing.who2", "landing.who3": "landing.who3",
    "landing.scopeTitle": "landing.scopeTitle",
    "landing.scope": "landing.scope", "landing.scopeNot": "landing.scopeNot",
}
# redesign-specific labels not present in messages (authentic short translations)
MANUAL = {
    "ui.provisional": {"en":"Provisional","pt-br":"Provisório","de":"Vorläufig","es":"Provisional"},
    "ui.allBooks":    {"en":"All books","pt-br":"Todos os livros","de":"Alle Bücher","es":"Todos los libros"},
    "ui.method":      {"en":"Method","pt-br":"Método","de":"Methode","es":"Método"},
    "ui.howItWorks":  {"en":"How it works","pt-br":"Como funciona","de":"Wie es funktioniert","es":"Cómo funciona"},
    "ui.read":        {"en":"Read","pt-br":"Ler","de":"Lesen","es":"Leer"},
    "ui.source":      {"en":"Source","pt-br":"Fonte","de":"Quelle","es":"Fuente"},
    "ui.note":        {"en":"Note","pt-br":"Nota","de":"Anmerkung","es":"Nota"},
    "ui.figures":     {"en":"figures","pt-br":"figuras","de":"Personen","es":"figuras"},
    "ui.profiles":    {"en":"Profiles","pt-br":"Perfis","de":"Profile","es":"Perfiles"},
    "ui.genealogyTables": {"en":"Genealogy tables","pt-br":"Tabelas genealógicas","de":"Genealogische Tabellen","es":"Tablas genealógicas"},
    "ui.sourcesConsulted": {"en":"Sources consulted","pt-br":"Fontes consultadas","de":"Konsultierte Quellen","es":"Fuentes consultadas"},
    "ui.deeperBackground": {"en":"Background","pt-br":"Contexto","de":"Hintergrund","es":"Contexto"},
    "ui.prophecies":  {"en":"Prophecies","pt-br":"Profecias","de":"Prophezeiungen","es":"Profecías"},
    "ui.link":        {"en":"Link","pt-br":"Link","de":"Link","es":"Enlace"},
    "ui.copied":      {"en":"Copied","pt-br":"Copiado","de":"Kopiert","es":"Copiado"},
    "ui.supplementary": {"en":"Supplementary — patterns across the chapter","pt-br":"Complementar — padrões ao longo do capítulo","de":"Ergänzend — Muster im ganzen Kapitel","es":"Complementario — patrones a lo largo del capítulo"},
    "ui.verseByVerse": {"en":"Verse-by-verse study","pt-br":"Estudo versículo por versículo","de":"Vers-für-Vers-Studie","es":"Estudio versículo por versículo"},
    "ui.noProphecy":  {"en":"No prophecy entries for this chapter.","pt-br":"Nenhuma entrada de profecia para este capítulo.","de":"Keine Prophezeiungseinträge für dieses Kapitel.","es":"No hay entradas de profecía para este capítulo."},
    "ui.search":      {"en":"Search","pt-br":"Buscar","de":"Suche","es":"Buscar"},
    "ui.searchPlaceholder": {"en":"Search verses, notes, people…","pt-br":"Buscar versículos, notas, pessoas…","de":"Verse, Notizen, Personen suchen…","es":"Buscar versículos, notas, personas…"},
    "ui.localePreviewNote": {
        "en":"Some explanatory framing on this page is shown in English in this preview.",
        "pt-br":"Parte do texto explicativo desta página aparece em inglês nesta prévia.",
        "de":"Einige erläuternde Texte auf dieser Seite erscheinen in dieser Vorschau auf Englisch.",
        "es":"Parte del texto explicativo de esta página aparece en inglés en esta vista previa."},
}

dict_ = {loc: {} for loc in LOCALES}
for key, path in FROM_MSG.items():
    for loc in LOCALES:
        dict_[loc][key] = gget(loc, path, gget("en", path, ""))
for key, vals in MANUAL.items():
    for loc in LOCALES:
        dict_[loc][key] = vals.get(loc, vals["en"])

labels = {"en":"English","pt-br":"Português","de":"Deutsch","es":"Español"}
OUT.write_text(
    "window.I18N = " + json.dumps(dict_, ensure_ascii=False) + ";\n"
    "window.I18N_LABELS = " + json.dumps(labels, ensure_ascii=False) + ";\n", encoding="utf-8")
miss = [(loc,k) for loc in LOCALES for k,v in dict_[loc].items() if not v]
print(f"i18n.js written — {len(FROM_MSG)+len(MANUAL)} keys × {len(LOCALES)} locales")
if miss: print("MISSING:", miss[:20])
else: print("no missing values")
