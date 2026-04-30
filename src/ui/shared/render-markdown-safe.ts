type MarkdownSubset = "prose" | "note";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function renderMarkdownSafe(
  text: string,
  subset: MarkdownSubset
): string {
  let html = escapeHtml(text);

  if (subset === "note") {
    // Bold must come before italic to avoid ** being consumed by *
    html = html.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");
    html = html.replace(/\n- /g, "<br/>• ");
    html = html.replace(/\n/g, "<br/>");
  } else {
    // Prose: italic only, newlines become spaces
    html = html.replace(/\*([^*]+)\*/g, "<em>$1</em>");
    html = html.replace(/\n/g, " ");
  }

  return html;
}
