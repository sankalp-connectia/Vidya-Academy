// Achievement entries and page copy. Add verified recognitions and participation here.
export let motionAchievementsPage = {
  headingAlign: "center",
  eyebrow: "",
  title: "Awards & Achievements",
  description: "Vidya Academy, Moodlakatte, received the Karnataka Shikshana Rathna Award for Best Preschool at a ceremony held at Ambedkar Bhavana, Bengaluru, in January 2025.",
  heroImage: "/images/heroes/achievements/desktop.webp",
  mobileImage: "/images/heroes/achievements/mobile.webp",
  heroImageAlt: "Students practising karate at Vidya Academy",
  backLabel: "Back to Motion-In",
  detailBackLabel: "Back to Achievements",
  readMoreLabel: "Read more",
  enquiryLabel: "Send an Enquiry",
};

export let achievements = [
  {
    slug: "karnataka-shikshana-rathna-award",
    bulletPoints: ["Best Preschool recognition for Vidya Academy, Moodlakatte", "Ceremony at Ambedkar Bhavana, Bengaluru, in January 2025"],
    category: "Recognition",
    title: "Karnataka Shikshana Rathna Award – Best Preschool",
    description: "Vidya Academy, Moodlakatte, received the Karnataka Shikshana Rathna Award for Best Preschool at a ceremony held at Ambedkar Bhavana, Bengaluru, in January 2025.",
    image: "/images/school/school-community.webp",
    imageAlt: "A large group of Vidya Academy students seated together",
    imageCaption: "A group photo of the Vidya Academy school community.",
    gallery: [
      {"image": "/images/school/academy-wall-sign.webp", "imageAlt": "Vidya Academy lettering on an interior wall", "caption": "Vidya Academy lettering on an interior wall."},
      {"image": "/images/school/academy-entrance-sign.webp", "imageAlt": "Vidya Academy signage above the entrance", "caption": "Vidya Academy signage above the entrance."},
    ],
    facts: [
      { label: "Recognition", value: "Karnataka Shikshana Rathna Award – Best Preschool" },
      { label: "Ceremony", value: "Ambedkar Bhavana, Bengaluru" },
      { label: "Date", value: "January 2025" },
    ],
    details: [
      "Vidya Academy, Moodlakatte, received the Karnataka Shikshana Rathna Award for Best Preschool at a ceremony held at Ambedkar Bhavana, Bengaluru, in January 2025.",
      "The recognition reflects the school’s commitment to nurturing young learners.",
      "It is a meaningful recognition of Vidya Academy’s work in early childhood education.",
    ],
  },
  {
    slug: "state-level-karate-championship",
    bulletPoints: ["Vidya Academy student participation at state level", "Championship held in Kundapura"],
    category: "Student Achievement",
    title: "State-Level Karate Championship",
    description: "Vidya Academy students participated successfully in the State Level Karate Championship held at Kundapura.",
    image: "/images/school/karate-sparring.webp",
    imageAlt: "Students practising karate sparring in uniform",
    imageCaption: "Karate practice at Vidya Academy.",
    gallery: [
      {"image": "/images/school/karate-class.webp", "imageAlt": "Children practising karate in a line", "caption": "Children practising karate in a line."},
      {"image": "/images/school/students-applauding.webp", "imageAlt": "Students seated together and applauding", "caption": "Students seated together and applauding."},
    ],
    facts: [
      { label: "Event", value: "State Level Karate Championship" },
      { label: "Location", value: "Kundapura" },
    ],
    details: [
      "Vidya Academy students participated successfully in the State Level Karate Championship held at Kundapura.",
      "The achievement reflects the school’s encouragement of activities beyond the classroom.",
    ],
  },
];

export function applyWordPressContent(content = {}) {
  if (!content || typeof content !== "object") return;
  if (Object.prototype.hasOwnProperty.call(content, "motionAchievementsPage")) motionAchievementsPage = content.motionAchievementsPage;
  if (Object.prototype.hasOwnProperty.call(content, "achievements")) {
    achievements = content.achievements.filter((item) => item && item.status !== "draft");
  }
}
