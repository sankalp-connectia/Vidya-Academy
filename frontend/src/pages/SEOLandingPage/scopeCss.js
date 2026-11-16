const PREFIX = "#seo-custom-page";

function matchingBrace(source, openIndex) {
  let depth = 1;
  let quote = "";
  let comment = false;
  for (let index = openIndex + 1; index < source.length; index += 1) {
    const char = source[index];
    const next = source[index + 1];
    if (comment) {
      if (char === "*" && next === "/") { comment = false; index += 1; }
      continue;
    }
    if (quote) {
      if (char === "\\") { index += 1; continue; }
      if (char === quote) quote = "";
      continue;
    }
    if (char === "/" && next === "*") { comment = true; index += 1; continue; }
    if (char === "\"" || char === "'") { quote = char; continue; }
    if (char === "{") depth += 1;
    if (char === "}" && --depth === 0) return index;
  }
  return -1;
}

function splitSelectors(selectorText) {
  const selectors = [];
  let start = 0;
  let quote = "";
  let depth = 0;
  for (let index = 0; index < selectorText.length; index += 1) {
    const char = selectorText[index];
    if (quote) {
      if (char === "\\") index += 1;
      else if (char === quote) quote = "";
      continue;
    }
    if (char === "\"" || char === "'") quote = char;
    else if (char === "(" || char === "[") depth += 1;
    else if (char === ")" || char === "]") depth = Math.max(0, depth - 1);
    else if (char === "," && depth === 0) {
      selectors.push(selectorText.slice(start, index).trim());
      start = index + 1;
    }
  }
  selectors.push(selectorText.slice(start).trim());
  return selectors.filter(Boolean);
}

function scopedSelector(selector) {
  const normalized = selector
    .replace(/(^|\s)(?:html|body|:root)(?=\b|\s|[.#:>+~]|\[)/gi, `$1${PREFIX}`)
    .replace(/\.seo-custom-landing\b/g, PREFIX)
    .replace(/#root\b/g, PREFIX);
  return normalized === PREFIX || normalized.startsWith(`${PREFIX} `) || normalized.startsWith(`${PREFIX}:`)
    ? normalized
    : `${PREFIX} ${normalized}`;
}

function scopeRules(source) {
  let output = "";
  let cursor = 0;
  while (cursor < source.length) {
    let open = -1;
    let semicolon = -1;
    let quote = "";
    let comment = false;
    for (let index = cursor; index < source.length; index += 1) {
      const char = source[index];
      const next = source[index + 1];
      if (comment) {
        if (char === "*" && next === "/") { comment = false; index += 1; }
        continue;
      }
      if (quote) {
        if (char === "\\") index += 1;
        else if (char === quote) quote = "";
        continue;
      }
      if (char === "/" && next === "*") { comment = true; index += 1; continue; }
      if (char === "\"" || char === "'") { quote = char; continue; }
      if (char === "{") { open = index; break; }
      if (char === ";") { semicolon = index; break; }
    }
    if (open < 0) {
      output += source.slice(cursor, semicolon < 0 ? source.length : semicolon + 1);
      break;
    }
    const close = matchingBrace(source, open);
    if (close < 0) break;
    const prelude = source.slice(cursor, open).trim();
    const body = source.slice(open + 1, close);
    if (/^@(media|supports|container|layer|document)\b/i.test(prelude)) {
      output += `${prelude}{${scopeRules(body)}}`;
    } else if (/^@(?:-webkit-)?keyframes\b/i.test(prelude)) {
      output += `${prelude}{${body}}`;
    } else if (/^@(font-face|counter-style|property)\b/i.test(prelude)) {
      output += `${prelude}{${body}}`;
    } else if (!prelude.startsWith("@")) {
      output += `${splitSelectors(prelude).map(scopedSelector).join(",")}{${body}}`;
    }
    cursor = close + 1;
  }
  return output;
}

export default function scopeCss(css, slug = "page") {
  if (typeof css !== "string" || !css.trim()) return "";
  const safeSlug = String(slug).replace(/[^a-z0-9_-]/gi, "-");
  const keyframes = new Map();
  let source = css.replace(/@(?:-webkit-)?keyframes\s+([\w-]+)/gi, (match, name) => {
    const scopedName = `seo-${safeSlug}-${name}`;
    keyframes.set(name, scopedName);
    return match.replace(name, scopedName);
  });
  for (const [name, scopedName] of keyframes) {
    const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    source = source.replace(new RegExp(`(animation(?:-name)?\\s*:[^;}]*?)\\b${escaped}\\b`, "gi"), `$1${scopedName}`);
  }
  source = source.replace(/@import\b[^;]*;?/gi, "");
  return `${scopeRules(source)}\n${PREFIX}{position:relative!important;isolation:isolate!important;z-index:0!important;max-width:100%!important;}`;
}
