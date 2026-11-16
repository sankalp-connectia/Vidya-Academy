export let notFoundPage = {
  eyebrow: "404 · Page not found",
  title: "This page isn’t here.",
  description: "The page may have moved, or the link may be out of date. Head back to Vidya Academy to continue exploring.",
  homeLink: "Back to Home",
};

export function applyWordPressContent(content = {}) {
  if (!content || typeof content !== "object") return;
  if (Object.prototype.hasOwnProperty.call(content, "notFoundPage")) notFoundPage = content.notFoundPage;
}
