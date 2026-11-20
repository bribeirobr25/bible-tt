import { useTranslations } from "next-intl";
import { Link } from "@/ui/navigation/locale-link";

const WRAP = "max-w-[1320px] mx-auto px-[clamp(18px,4vw,52px)]";

/**
 * Localized 404 (audit B6, plan §B1.3). Rendered inside the locale layout
 * (fonts, app bar, footer, `<html lang>`) for every `notFound()` under
 * `[locale]` — guarded `[book]` routes and the `[...rest]` catch-all.
 * Next injects `<meta name="robots" content="noindex">` for the 404 status.
 */
export default function LocaleNotFound() {
  const t = useTranslations("notFound");
  return (
    <>
      <div className={`tt-chapter-head ${WRAP}`}>
        <div className="tt-title-row">
          <div>
            <div className="tt-ref">404</div>
            <h1 className="tt-chapter-title">{t("title")}</h1>
          </div>
        </div>
        <hr className="tt-seam mt-[26px]" />
      </div>
      <main
        className={WRAP}
        style={{
          paddingTop: "clamp(36px,6vh,64px)",
          paddingBottom: "clamp(48px,8vh,90px)",
        }}
      >
        <p className="tt-lead max-w-[60ch]">{t("body")}</p>
        <div className="mt-[30px] flex flex-wrap gap-3.5">
          <Link href="/" className="tt-btn tt-btn-deep">
            {t("home")}
          </Link>
          <Link href="/books" className="tt-btn tt-btn-ghost">
            {t("books")}
          </Link>
        </div>
      </main>
    </>
  );
}
