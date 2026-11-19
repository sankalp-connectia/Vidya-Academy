// Start with bundled content so all pages and images work without WordPress.
// Successful WordPress responses replace these values at runtime.
import offlineContent from "./offlineContent.json";

export let navbarData = null;
export let footerColumns = [];
export let socialLinks = [];
export let schoolDetails = null;
export let footerCopy = null;

export let homeCopy = null;
export let galleryImages = [];
export let faqItems = [];
export let lifeCards = [];
export let wayItems = [];
export let fallbackImage = "";
export let facts = [];
export let programs = [];
export let admissionFormCopy = null;
export let homeMedia = null;

export let aboutImages = [];
export let leaders = [];
export let statement = "";
export let outerRing = [];
export let conceptRing = [];
export let experienceRing = [];
export let learnerDimensions = [];
export let aboutEvents = [];
export let aboutCopy = null;

export let admissionsPage = null;
export let mandatoryDisclosure = null;

export let introText = "";
export let infrastructureTitle = "Infrastructure";
export let infrastructureImages = [];
export let marqueeImages = [];
export let groundsImages = [];
export let heroImages = [];
export let campusFallbackImage = "";
export let campusFallbackBuildingImage = "";
export let buildingMarqueeImages = [];
export let buildingImages = [];
export let campusFeatureImage = "";
export let campusStats = [];
export let campusCopy = null;
export let upcomingCampus = null;

export let programmes = [];
export let learningStages = [];
export let learningPathwaysCopy = null;
export let additionalExperienceImages = [];

export let motionFallbackImage = "";
export let heroEvent = null;
export let motionSections = null;
export let motionEventsPage = null;
export let motionEvents = [];
export let motionAchievementsPage = null;
export let achievements = [];

export let contactPage = null;
export let notFoundPage = null;
export let blogsPage = null;
export let blogs = [];
export let seoLandingPages = [];

const BLOG_PHOTO_FALLBACKS = [
  { terms: ["play", "activity", "experience", "creative"], image: "/images/school/learning-through-play.webp", alt: "Children learning through play at Vidya Academy" },
  { terms: ["class", "teacher", "learn", "education"], image: "/images/school/classroom-teacher.webp", alt: "A teacher supporting students in class" },
  { terms: ["sport", "karate", "cricket", "physical"], image: "/images/school/karate-class.webp", alt: "Students taking part in an activity at Vidya Academy" },
  { terms: ["campus", "school", "visit", "facility"], image: "/images/school/school-community.webp", alt: "The Vidya Academy school community" },
  { terms: ["art", "craft", "build", "creative"], image: "/images/school/building-blocks.webp", alt: "Students exploring and creating together" },
];

function localBlogPhoto(post, index) {
  const words = `${post?.title || ""} ${post?.description || post?.excerpt || ""}`.toLowerCase();
  const match = BLOG_PHOTO_FALLBACKS.find((photo) => photo.terms.some((term) => words.includes(term)));
  return match || BLOG_PHOTO_FALLBACKS[index % BLOG_PHOTO_FALLBACKS.length];
}

function isExternalStockPhoto(value) {
  return typeof value === "string" && /^https?:\/\/(?:images\.|plus\.)?unsplash\.com\//i.test(value);
}

function resolveBlogAsset(path) {
  const baseUrl = new URL(import.meta.env.BASE_URL || "/", window.location.origin);
  return new URL(path.replace(/^\/+/, ""), baseUrl).href;
}

function normalizeWordPressBlog(post, index) {
  const fallback = localBlogPhoto(post, index);
  const image = typeof post?.image === "string" ? post.image.trim() : "";
  const useLocalPhoto = !image || isExternalStockPhoto(image);
  return {
    ...post,
    image: useLocalPhoto ? resolveBlogAsset(fallback.image) : image,
    imageAlt: post?.imageAlt || fallback.alt || post?.title || "Vidya Academy blog photo",
    fallbackImage: resolveBlogAsset(fallback.image),
  };
}

function objectOrNull(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : null;
}

function listOrEmpty(value) {
  return Array.isArray(value) ? value : [];
}

function resolveCampusPhoto(path) {
  if (typeof path !== "string" || !path.startsWith("/images/")) return path;
  const baseUrl = new URL(import.meta.env.BASE_URL || "/", window.location.origin);
  return new URL(path.replace(/^\/+/, ""), baseUrl).href;
}

function listWithBundledDefaults(value, bundledDefaults) {
  const incoming = listOrEmpty(value);
  const defaults = listOrEmpty(bundledDefaults);
  const count = incoming.length || defaults.length;
  return Array.from({ length: count }, (_, index) => {
    const item = incoming[index];
    const fallback = defaults[index];
    if (typeof fallback === "string") return typeof item === "string" && item.trim() ? item : resolveCampusPhoto(fallback);
    if (fallback && typeof fallback === "object") {
      if (!item || typeof item !== "object" || Array.isArray(item)) return { ...fallback, src: resolveCampusPhoto(fallback.src) };
      return { ...fallback, ...item, src: typeof item.src === "string" && item.src.trim() ? item.src : resolveCampusPhoto(fallback.src) };
    }
    return item;
  }).filter((item) => item !== undefined);
}

export function applyWordPressContent(content) {
  if (!objectOrNull(content)) throw new Error("WordPress returned no website content.");
  for (const key of ["siteNavigation", "home", "about", "admissions", "mandatoryDisclosure", "campus", "learningPathways", "motion", "motionEvents", "motionAchievements", "contact", "notFound", "blogs"]) {
    if (!objectOrNull(content[key])) throw new Error(`WordPress is missing the ${key} content section.`);
  }

  const navigation = content.siteNavigation;
  navbarData = objectOrNull(navigation.navbarData);
  if (Array.isArray(navbarData?.links)) {
    navbarData = {
      ...navbarData,
      links: navbarData.links.map((link) =>
        link?.to === "/learning-pathways" && /^programs$/i.test(link.label?.trim())
          ? { ...link, label: "ACADEMICS" }
          : link,
      ),
    };
  }
  footerColumns = listOrEmpty(navigation.footerColumns);
  socialLinks = listOrEmpty(navigation.socialLinks);
  schoolDetails = objectOrNull(navigation.schoolDetails);
  footerCopy = objectOrNull(navigation.footerCopy);

  const home = content.home;
  homeCopy = objectOrNull(home.homeCopy);
  galleryImages = listOrEmpty(home.galleryImages);
  faqItems = listOrEmpty(home.faqItems);
  lifeCards = listOrEmpty(home.lifeCards);
  wayItems = listOrEmpty(home.wayItems);
  fallbackImage = typeof home.fallbackImage === "string" ? home.fallbackImage : "";
  facts = listOrEmpty(home.facts);
  programs = listOrEmpty(home.programs);
  admissionFormCopy = objectOrNull(home.admissionFormCopy);
  homeMedia = objectOrNull(home.homeMedia);

  const about = content.about;
  aboutImages = listOrEmpty(about.aboutImages);
  leaders = listOrEmpty(about.leaders);
  statement = typeof about.statement === "string" ? about.statement : "";
  outerRing = listOrEmpty(about.outerRing);
  conceptRing = listOrEmpty(about.conceptRing);
  experienceRing = listOrEmpty(about.experienceRing);
  learnerDimensions = listOrEmpty(about.learnerDimensions);
  aboutEvents = listOrEmpty(about.events);
  aboutCopy = objectOrNull(about.aboutCopy);

  admissionsPage = objectOrNull(content.admissions.admissionsPage);
  mandatoryDisclosure = objectOrNull(content.mandatoryDisclosure);

  const campus = content.campus;
  introText = typeof campus.introText === "string" ? campus.introText : "";
  infrastructureTitle = typeof campus.infrastructureTitle === "string" && campus.infrastructureTitle.trim()
    ? campus.infrastructureTitle
    : "Infrastructure";
  const legacyInfrastructureImages = [
    ...listOrEmpty(campus.groundsImages),
    ...listOrEmpty(campus.buildingImages),
  ];
  infrastructureImages = listWithBundledDefaults(
    listOrEmpty(campus.infrastructureImages).length ? campus.infrastructureImages : legacyInfrastructureImages,
    offlineContent.campus.infrastructureImages,
  ).map((photo, index) => {
    const fallback = offlineContent.campus.infrastructureImages[index];
    if (!fallback || photo.src === resolveCampusPhoto(fallback.src) || photo.src === fallback.src) return photo;
    const configured = (listOrEmpty(campus.infrastructureImages).length ? campus.infrastructureImages : legacyInfrastructureImages)[index];
    return { ...photo, caption: configured?.caption || configured?.alt || "" };
  });
  marqueeImages = listWithBundledDefaults(campus.marqueeImages, offlineContent.campus.marqueeImages);
  groundsImages = listWithBundledDefaults(campus.groundsImages, offlineContent.campus.groundsImages);
  heroImages = listOrEmpty(campus.heroImages);
  campusFallbackImage = typeof campus.FALLBACK_IMAGE === "string" ? campus.FALLBACK_IMAGE : "";
  campusFallbackBuildingImage = typeof campus.FALLBACK_BUILDING_IMAGE === "string" ? campus.FALLBACK_BUILDING_IMAGE : "";
  buildingMarqueeImages = listWithBundledDefaults(campus.buildingMarqueeImages, offlineContent.campus.buildingMarqueeImages);
  buildingImages = listWithBundledDefaults(campus.buildingImages, offlineContent.campus.buildingImages);
  campusFeatureImage = typeof campus.campusFeatureImage === "string" ? campus.campusFeatureImage : "";
  campusStats = listOrEmpty(campus.campusStats);
  campusCopy = objectOrNull(campus.campusCopy);
  upcomingCampus = objectOrNull(campus.upcomingCampus) || objectOrNull(offlineContent.campus.upcomingCampus);

  const pathways = content.learningPathways;
  programmes = listOrEmpty(pathways.programmes);
  learningStages = listOrEmpty(pathways.learningStages);
  learningPathwaysCopy = objectOrNull(pathways.learningPathwaysCopy);
  additionalExperienceImages = listWithBundledDefaults(
    learningPathwaysCopy?.careerGuidance?.experienceImages,
    offlineContent.learningPathways.learningPathwaysCopy.careerGuidance.experienceImages,
  );

  const motion = content.motion;
  motionFallbackImage = typeof motion.FALLBACK_IMAGE === "string" ? motion.FALLBACK_IMAGE : "";
  const motionHero = objectOrNull(motion.heroEvent);
  heroEvent = motionHero ? {
    ...motionHero,
    description: "Explore school events and student activities at Vidya Academy.",
    ctaLabel: "Explore Events",
  } : null;
  const motionSectionsContent = objectOrNull(motion.motionSections);
  const eventCard = listOrEmpty(motionSectionsContent?.cards).find((card) =>
    card?.id === "events" || card?.href === "/motion/events" || /^events$/i.test(card?.title || "")
  );
  motionSections = motionSectionsContent ? {
    ...motionSectionsContent,
    title: "Events",
    cards: eventCard ? [eventCard] : [],
  } : null;
  motionEventsPage = objectOrNull(content.motionEvents.motionEventsPage);
  motionEvents = listOrEmpty(content.motionEvents.events);
  motionAchievementsPage = objectOrNull(content.motionAchievements.motionAchievementsPage);
  achievements = listOrEmpty(content.motionAchievements.achievements);

  contactPage = objectOrNull(content.contact.contactPage);
  notFoundPage = objectOrNull(content.notFound.notFoundPage);
  blogsPage = objectOrNull(content.blogs.blogsPage);
  blogs = listOrEmpty(content.blogs.blogs);
  seoLandingPages = listOrEmpty(content.seoLandingPages);
}

export function applyWordPressBlogs(value) {
  blogs = listOrEmpty(value).map(normalizeWordPressBlog);
}

applyWordPressContent(offlineContent);
applyWordPressBlogs([]);
