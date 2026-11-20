import "./globals.css";

/**
 * Root 404 for paths outside any locale that the middleware skips (e.g. a
 * missing `/nope.txt`). The root layout returns bare children, so this page
 * renders its own document and loads the global stylesheet (audit B6).
 * Localized 404s live in `[locale]/not-found.tsx`.
 */
export default function RootNotFound() {
  return (
    <html lang="en">
      <body className="bg-bg-paper text-text-primary font-[family-name:var(--font-ui)] min-h-screen">
        <main className="max-w-[1320px] mx-auto px-[clamp(18px,4vw,52px)] pt-[clamp(48px,10vh,120px)] pb-[clamp(48px,8vh,90px)]">
          <div className="tt-ref">404</div>
          <h1 className="tt-chapter-title">Page not found</h1>
          <hr className="tt-seam mt-[26px]" />
          <p className="tt-lead max-w-[60ch] mt-[30px]">
            This page does not exist or has moved.
          </p>
          <div className="mt-[30px] flex flex-wrap gap-3.5">
            {/* Plain <a>: outside the locale tree; the middleware picks the
                visitor's locale for `/`. */}
            <a href="/" className="tt-btn tt-btn-deep">
              Go to the home page
            </a>
          </div>
        </main>
      </body>
    </html>
  );
}
