// Motion-In landing page content. Edit these labels and cards without changing JSX.
// A known working school photo used when an editorial image URL is unavailable.
export let FALLBACK_IMAGE = "/images/school/school-community.webp";

export let heroEvent = {
  month: "",
  day: "",
  year: "",
  category: "Vidya Academy",
  title: "News & Activities",
  meta: [],
  description: "Explore school events and student achievements at Vidya Academy.",
  ctaLabel: "Explore Events & Achievements",
  image: "/images/heroes/motion/desktop.webp",
  mobileImage: "/images/heroes/motion/mobile.webp",
};

export let motionSections = {
  eyebrow: "Motion-In",
  title: "Events & Achievements",
  introduction: "",
  cards: [
    {
      id: "events",
      title: "Events",
      description: "Rhymes and Chimes, Garden Visits, Festivals and Celebrations, Little Chef, Dance and Field Trips.",
      image: "/images/school/outdoor-group-play.webp",
      imageAlt: "Children taking part in an outdoor group activity",
      href: "/motion/events",
      linkLabel: "Explore Events",
    },
    {
      id: "achievements",
      title: "Achievements",
      description: "Karnataka Shikshana Rathna Award – Best Preschool and student participation in a State-Level Karate Championship.",
      image: "/images/school/karate-sparring.webp",
      imageAlt: "Students practising karate sparring in uniform",
      href: "/motion/achievements",
      linkLabel: "Explore Achievements",
    },
  ],
};

export function applyWordPressContent(content = {}) {
  if (!content || typeof content !== "object") return;
  if (Object.prototype.hasOwnProperty.call(content, "FALLBACK_IMAGE")) FALLBACK_IMAGE = content.FALLBACK_IMAGE;
  if (Object.prototype.hasOwnProperty.call(content, "heroEvent")) heroEvent = content.heroEvent;
  if (Object.prototype.hasOwnProperty.call(content, "motionSections")) motionSections = content.motionSections;
}
