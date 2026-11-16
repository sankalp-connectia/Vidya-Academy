import { useEffect } from "react";

function upsertMeta(selector, attributes, content) {
  let node = document.head.querySelector(selector);
  const created = !node;
  if (!node) {
    node = document.createElement("meta");
    Object.entries(attributes).forEach(([key, value]) => node.setAttribute(key, value));
    document.head.append(node);
  }
  const previous = node.getAttribute("content");
  node.setAttribute("content", content);
  return () => {
    if (created) node.remove();
    else if (previous === null) node.removeAttribute("content");
    else node.setAttribute("content", previous);
  };
}

export default function SEOHead({ title, description, canonicalPath, noindex = false, image, schema }) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title;

    const cleanups = [
      upsertMeta('meta[name="description"]', { name: "description" }, description),
      upsertMeta('meta[name="robots"]', { name: "robots" }, noindex ? "noindex,follow" : "index,follow"),
      upsertMeta('meta[property="og:title"]', { property: "og:title" }, title),
      upsertMeta('meta[property="og:description"]', { property: "og:description" }, description),
      upsertMeta('meta[property="og:type"]', { property: "og:type" }, "website"),
      upsertMeta('meta[name="twitter:card"]', { name: "twitter:card" }, image ? "summary_large_image" : "summary"),
      upsertMeta('meta[name="twitter:title"]', { name: "twitter:title" }, title),
      upsertMeta('meta[name="twitter:description"]', { name: "twitter:description" }, description),
    ];

    cleanups.push(upsertMeta('meta[property="og:image"]', { property: "og:image" }, image || ""));
    cleanups.push(upsertMeta('meta[name="twitter:image"]', { name: "twitter:image" }, image || ""));

    const canonicalUrl = new URL(canonicalPath || window.location.pathname, window.location.origin);
    let canonical = document.head.querySelector('link[rel="canonical"]');
    const createdCanonical = !canonical;
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.append(canonical);
    }
    const previousCanonical = canonical.href;
    canonical.href = canonicalUrl.href;

    let schemaScript;
    if (schema) {
      schemaScript = document.createElement("script");
      schemaScript.type = "application/ld+json";
      schemaScript.textContent = JSON.stringify(schema).replace(/</g, "\\u003c");
      document.head.append(schemaScript);
    }

    return () => {
      document.title = previousTitle;
      cleanups.reverse().forEach((cleanup) => cleanup());
      if (createdCanonical) canonical.remove();
      else canonical.href = previousCanonical;
      schemaScript?.remove();
    };
  }, [title, description, canonicalPath, noindex, image, schema]);

  return null;
}
