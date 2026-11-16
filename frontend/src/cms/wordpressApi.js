import { applyWordPressBlogs, applyWordPressContent } from "./siteContent";
import legacySchoolPhotos from "../data/legacySchoolPhotos.json";

const MIN_WORDPRESS_PLUGIN_VERSION = "1.9.31";

function resolveBundledAssetPaths(value) {
  if (Array.isArray(value)) return value.map(resolveBundledAssetPaths);
  if (!value || typeof value !== "object") return value;

  return Object.fromEntries(
    Object.entries(value).map(([key, child]) => {
      if (typeof child === "string" && /^\/(?:brand|mascots|images|videos|media)\//i.test(child)) {
        const base = new URL(import.meta.env.BASE_URL || "/", window.location.origin);
        return [key, new URL(child.replace(/^\/+/, ""), base).href];
      }
      if (typeof child === "string" && /^\/mascot-doll(?:1)?\.(?:mp4|webm)(?:[?#]|$)/i.test(child)) {
        const base = new URL(import.meta.env.BASE_URL || "/", window.location.origin);
        return [key, new URL(child.replace(/^\/+/, ""), base).href];
      }
      return [key, resolveBundledAssetPaths(child)];
    }),
  );
}

function useBundledSchoolPhotos(content, replacements, prefix = "") {
  if (!content || typeof content !== "object") return;
  for (const [key, value] of Object.entries(content)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object") {
      useBundledSchoolPhotos(value, replacements, path);
      continue;
    }
    if (typeof value !== "string" || !/^https?:\/\//i.test(value)) continue;
    const matches = replacements[value.split("?")[0]];
    const match = matches?.find((entry) => entry.path === path)
      ?? (matches?.length === 1 ? matches[0] : null);
    if (match) {
      content[key] = match.image;
      if (match.alt) content[match.alt[0]] = match.alt[1];
      if (match.gallery) content.gallery ??= match.gallery;
      if (match.imageCaption) content.imageCaption ??= match.imageCaption;
      continue;
    }
    if (/unsplash\.com|istockphoto\.com|pexels\.com|pixabay\.com/i.test(value)
      && /image|photo|gallery|marquee|hero|logo|src|poster|thumbnail/i.test(path)) {
      content[key] = "/images/school/school-community.webp";
    }
  }
}

function normalizeBaseUrl(value) {
  return String(value || "").trim().replace(/\/+$/, "");
}

function normalizeWordPressMediaUrls(value, wordpressUrl) {
  if (Array.isArray(value)) return value.map((item) => normalizeWordPressMediaUrls(item, wordpressUrl));
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, normalizeWordPressMediaUrls(item, wordpressUrl)]));
  }
  if (typeof value !== "string") return value;

  const wordpress = new URL(wordpressUrl);
  if (wordpress.protocol !== "https:") return value;
  const host = wordpress.host.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return value.replace(new RegExp(`http:\\/\\/${host}(?=[:/])`, "gi"), `https://${wordpress.host}`);
}

function versionAtLeast(actual, minimum) {
  const numbers = (value) => String(value || "").split(".").map((part) => Number.parseInt(part, 10) || 0);
  const left = numbers(actual);
  const right = numbers(minimum);
  for (let index = 0; index < Math.max(left.length, right.length); index += 1) {
    if ((left[index] || 0) > (right[index] || 0)) return true;
    if ((left[index] || 0) < (right[index] || 0)) return false;
  }
  return true;
}

async function loadWordPressBlogs(baseUrl) {
  const response = await fetch(`${baseUrl}/wp-json/vidya/v1/blogs?per_page=100&page=1`, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`WordPress blog endpoint returned HTTP ${response.status}.`);

  const payload = await response.json();
  const posts = Array.isArray(payload) ? payload : payload?.blogs ?? payload?.posts;
  if (!Array.isArray(posts)) throw new Error("WordPress returned an invalid blogs response.");

  const totalPages = Number(payload?.totalPages ?? response.headers.get("X-WP-TotalPages") ?? 1);
  const allPosts = [...normalizeWordPressMediaUrls(posts, baseUrl)];
  for (let page = 2; page <= totalPages; page += 1) {
    const nextResponse = await fetch(`${baseUrl}/wp-json/vidya/v1/blogs?per_page=100&page=${page}`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!nextResponse.ok) break;
    const nextPayload = await nextResponse.json();
    const nextPosts = Array.isArray(nextPayload) ? nextPayload : nextPayload?.blogs ?? nextPayload?.posts;
    if (!Array.isArray(nextPosts) || nextPosts.length === 0) break;
    allPosts.push(...normalizeWordPressMediaUrls(nextPosts, baseUrl));
  }

  applyWordPressBlogs(allPosts);
}

export async function loadWordPressContent() {
  const baseUrl = normalizeBaseUrl(import.meta.env.VITE_WORDPRESS_URL);
  if (!baseUrl) return false;

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 12000);
  try {
    const response = await fetch(`${baseUrl}/wp-json/vidya/v1/content`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`WordPress returned HTTP ${response.status}.`);
    const payload = await response.json();
    if (!payload?.content || typeof payload.content !== "object") {
      throw new Error("WordPress returned an invalid content response.");
    }
    if (!versionAtLeast(payload.version, MIN_WORDPRESS_PLUGIN_VERSION)) {
      throw new Error(`Update the Vidya Academy Content Manager plugin to ${MIN_WORDPRESS_PLUGIN_VERSION} or later. The current site API is ${payload.version || "unknown"}.`);
    }

    const content = resolveBundledAssetPaths(normalizeWordPressMediaUrls(payload.content, baseUrl));
    for (const [page, replacements] of Object.entries(legacySchoolPhotos)) {
      if (content[page] && typeof content[page] === "object") {
        useBundledSchoolPhotos(content[page], replacements);
      }
    }
    applyWordPressContent(resolveBundledAssetPaths(content));
    try {
      await loadWordPressBlogs(baseUrl);
    } catch {
      // Page content can still come from WordPress if the blog route is unavailable.
    }
    return true;
  } finally {
    window.clearTimeout(timeout);
  }
}

export function enquiryFieldKey(name = "", label = "") {
  const value = `${name} ${label}`.toLowerCase();
  if (/phone|mobile|whatsapp/.test(value)) return "phone";
  if (/e[-\s]?mail/.test(value)) return "email";
  if (/address|location/.test(value)) return "address";
  if (/age/.test(value)) return "child_age";
  if (/parent|guardian|(^|\s)name/.test(value)) return "name";
  return `custom:${name || label}`;
}

export async function submitWordPressEnquiry(formElement) {
  const baseUrl = normalizeBaseUrl(import.meta.env.VITE_WORDPRESS_URL);
  if (!baseUrl) throw new Error("The WordPress site URL is not configured for this frontend.");

  const rawFields = new FormData(formElement);
  const payload = {
    extra_fields: {},
    website: String(rawFields.get("website") || ""),
  };

  for (const [key, value] of rawFields.entries()) {
    if (key === "website") continue;
    if (key.startsWith("custom:")) {
      payload.extra_fields[key.slice("custom:".length)] = String(value);
    } else if (["name", "phone", "email", "address", "child_age", "class", "message"].includes(key)) {
      payload[key] = String(value);
    } else {
      payload.extra_fields[key] = String(value);
    }
  }

  const response = await fetch(`${baseUrl}/wp-json/vidya/v1/enquiry`, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result?.success) {
    throw new Error(result?.message || "We couldn’t send your enquiry. Please try again.");
  }
  return result;
}

