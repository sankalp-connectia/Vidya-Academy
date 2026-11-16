import { applyWordPressContent as applySiteNavigation } from "./siteNavigation";
import { applyWordPressContent as applyHome } from "./pages/home";
import { applyWordPressContent as applyAbout } from "./pages/about";
import { applyWordPressContent as applyAdmissions } from "./pages/admissions";
import { applyWordPressContent as applyCampus } from "./pages/campus";
import { applyWordPressContent as applyLearningPathways } from "./pages/learningPathways";
import { applyWordPressContent as applyMotion } from "./pages/motion";
import { applyWordPressContent as applyMotionEvents } from "./pages/motionEvents";
import { applyWordPressContent as applyMotionAchievements } from "./pages/motionAchievements";
import { applyWordPressContent as applyContact } from "./pages/contact";
import { applyWordPressContent as applyNotFound } from "./pages/notFound";
import { applyWordPressContent as applyBlogs } from "./pages/blogs";
import legacySchoolPhotos from "./legacySchoolPhotos.json";

const contentUpdaters = {
  siteNavigation: applySiteNavigation,
  home: applyHome,
  about: applyAbout,
  admissions: applyAdmissions,
  campus: applyCampus,
  learningPathways: applyLearningPathways,
  motion: applyMotion,
  motionEvents: applyMotionEvents,
  motionAchievements: applyMotionAchievements,
  contact: applyContact,
  notFound: applyNotFound,
  blogs: applyBlogs,
};

// Existing WordPress saves can still point to the original stock photos.
// Replace those known URLs while preserving custom media and other edits.
function useBundledSchoolPhotos(content, replacements, prefix = "") {
  for (const [key, value] of Object.entries(content)) {
    const path = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === "object") {
      useBundledSchoolPhotos(value, replacements, path);
      continue;
    }
    if (typeof value !== "string" || !value.startsWith("https://")) continue;
    const matches = replacements[value.split("?")[0]];
    const match = matches?.find((entry) => entry.path === path)
      ?? (matches?.length === 1 ? matches[0] : null);
    if (!match) continue;
    content[key] = match.image;
    if (match.alt) content[match.alt[0]] = match.alt[1];
    if (match.gallery) content.gallery ??= match.gallery;
    if (match.imageCaption) content.imageCaption ??= match.imageCaption;
  }
}

async function loadWordPressBlogs(baseUrl) {
  const response = await fetch(`${baseUrl}/wp-json/vidya/v1/blogs?per_page=100&page=1`, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  if (!response.ok) return false;

  const payload = await response.json();
  const posts = Array.isArray(payload) ? payload : payload?.blogs ?? payload?.posts;
  if (!Array.isArray(posts)) return false;

  const totalPages = Number(payload?.totalPages ?? response.headers.get("X-WP-TotalPages") ?? 1);
  const allPosts = [...posts];
  for (let page = 2; page <= totalPages; page += 1) {
    const nextResponse = await fetch(`${baseUrl}/wp-json/vidya/v1/blogs?per_page=100&page=${page}`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });
    if (!nextResponse.ok) break;
    const nextPayload = await nextResponse.json();
    const nextPosts = Array.isArray(nextPayload) ? nextPayload : nextPayload?.blogs ?? nextPayload?.posts;
    if (!Array.isArray(nextPosts) || nextPosts.length === 0) break;
    allPosts.push(...nextPosts);
  }

  applyBlogs({ blogs: allPosts });
  return true;
}

export async function loadWordPressContent() {
  const baseUrl = import.meta.env.VITE_WORDPRESS_URL?.trim().replace(/\/+$/, "");
  if (!baseUrl) return false;

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 5000);
  try {
    const response = await fetch(`${baseUrl}/wp-json/vidya/v1/content`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`WordPress returned HTTP ${response.status}`);
    const payload = await response.json();
    if (!payload?.content || typeof payload.content !== "object") {
      throw new Error("WordPress returned an invalid content response");
    }
    for (const [key, applyContent] of Object.entries(contentUpdaters)) {
      const page = payload.content[key];
      if (page && typeof page === "object") {
        if (legacySchoolPhotos[key]) useBundledSchoolPhotos(page, legacySchoolPhotos[key]);
        applyContent(page);
      }
    }
    // The blog collection has its own endpoint so WordPress can manage posts
    // and featured images independently from the page-copy editor.
    try {
      await loadWordPressBlogs(baseUrl);
    } catch {
      // The blog endpoint is added by the matching WordPress plugin update.
      // Keep the bundled data usable while the frontend is deployed first.
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
  const baseUrl = import.meta.env.VITE_WORDPRESS_URL?.trim().replace(/\/+$/, "");
  if (!baseUrl) {
    throw new Error("The WordPress site URL is not configured for this frontend.");
  }

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
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || !result?.success) {
    throw new Error(result?.message || "We couldn’t send your enquiry. Please try again.");
  }
  return result;
}
