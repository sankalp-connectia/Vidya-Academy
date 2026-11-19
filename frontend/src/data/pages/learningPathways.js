// Curriculum and academic-pattern copy from the Vidya Academy content PDF.
export let programmes = [
  {
    id: "pyp",
    short: "PLAY",
    name: "Learning Through Play",
    ages: "Play Group – Class 1",
    accent: "#d9a500",
    summary: "Structured learning with play, creativity, language and movement.",
    eyebrow: "A meaningful start",
    title: "A Holistic, Play-Based Learning Experience",
    paragraphs: [
      "The Vidya Academy curriculum is designed to make learning active, engaging and meaningful. Children participate in structured activities that support early literacy, numeracy, communication, creativity, social skills, physical development and independence.",
      "The school works with Key Education Foundation as a learning partner to support innovative teaching approaches and opportunities for logical reasoning, problem-solving and solution-building.",
      "Share & Care and Open Sesame give children opportunities to communicate, share ideas, cooperate, build relationships and express themselves. Library Time, Tune-In Time, Fun with Math, Eat & Treat, Art & Craft and Play Time bring stories, rhymes, early mathematics, healthy food, creativity and active exploration into learning."
    ],
    tags: ["Play-based learning", "Communication", "Independence"],
    links: [],
    image: "/images/school/building-blocks.webp",
    imageAlt: "Children working together with colourful building blocks",
    quote: "",
    quoteName: "",
    stats: []
  },
  {
    id: "myp",
    short: "EXPLORE",
    name: "Creative and Experiential Learning",
    ages: "Across the learning experience",
    accent: "#d9544d",
    summary: "Children explore ideas through stories, music, art, food and practical activities.",
    eyebrow: "Learning through experience",
    title: "Activities that build curiosity and confidence",
    paragraphs: [
      "Open interaction sessions give children opportunities to talk, listen, build relationships and express themselves. Story sessions and guided reading introduce children to books and language, building listening, vocabulary, early literacy and an interest in books.",
      "Rhymes, songs and listening activities support pronunciation, rhythm and confidence in spoken language. Counting, sorting, board games and abacus-based activities introduce early mathematical thinking in an enjoyable and practical way.",
      "Painting, colouring, sketching and paper craft give children opportunities to express ideas, strengthen fine-motor skills and develop creativity. Play supports observation, exploration, simple problem-solving and physical and cognitive development."
    ],
    tags: ["Share & Care", "Library Time", "Tune-In Time", "Fun with Math", "Art & Craft", "Play Time"],
    links: [],
    image: "/images/school/classroom-writing.webp",
    imageAlt: "Children writing together at a classroom table",
    quote: "",
    quoteName: "",
    stats: []
  },
  {
    id: "dp",
    short: "GROW",
    name: "Additional Experiences",
    ages: "Age-appropriate activities",
    accent: "#5672d4",
    summary: "Garden visits, festivals, cooking, dance and field trips complement classroom learning.",
    eyebrow: "Additional experiences",
    title: "A strong foundation for lifelong learning",
    paragraphs: [
      "Additional experiences include Rhymes and Chimes, Garden Visits, Festivals and Celebrations, Little Chef, Dance and Field Trips.",
      "Academic pattern: Play Group, 1.5–2.5 years; Nursery, 2.5–3.5 years; LKG, 3.5–4.5 years; UKG, 4.5–5.5 years; Class 1, 6 years. Contact the school to confirm current eligibility and age cut-offs."
    ],
    tags: ["Garden Visits", "Little Chef", "Dance", "Field Trips"],
    links: [],
    image: "/images/school/lifelong-learning-5721.webp",
    imageAlt: "Two Vidya Academy students sitting together by the school garden",
    quote: "",
    quoteName: "",
    stats: []
  }
];

export let learningStages = [
  { id: "kindergarten", range: "Play Group – Nursery", title: "Early Years", summary: "Play Group ages 1.5–2.5 years and Nursery ages 2.5–3.5 years. Contact the school to confirm current eligibility.", exploreTarget: "pyp" },
  { id: "primary-middle", range: "LKG – UKG", title: "Kindergarten", summary: "LKG ages 3.5–4.5 years and UKG ages 4.5–5.5 years.", exploreTarget: "myp" },
  { id: "senior-school", range: "Class 1 – Class 8", title: "Primary & Middle", summary: "Primary ages 6–11 years (Classes 1–5) and Middle ages 11–14 years (Classes 6–8).", exploreTarget: "dp" }
];

export let learningPathwaysCopy = {
  hero: {
    title: ["A Holistic,", "Play-Based Learning", "Experience"],
    introduction: "The Vidya Academy curriculum is designed to make learning active, engaging and meaningful. Children participate in structured activities that support early literacy, numeracy, communication, creativity, social skills, physical development and independence."
  },
  journey: {
    eyebrow: "Academic pattern",
    title: ["A learning journey", "built around the child"],
    closing: "Children are encouraged to explore activities based on their interests while learning through interaction."
  },
  continuum: {
    title: ["Learning through", "play and discovery"],
    closing: "Our approach combines structured learning with creative and experiential activities.",
    programmeDescriptions: {
      pyp: "A planned mix of foundational learning and play.",
      myp: "Experiences that support communication and creativity.",
      dp: "Activities that nurture confidence and independence."
    }
  },
  careerGuidance: {
    title: ["Additional", "experiences"],
    paragraphs: ["Rhymes and Chimes, Garden Visits, Festivals and Celebrations, Little Chef, Dance and Field Trips."],
    points: ["Rhymes and Chimes", "Garden visits", "Festivals and celebrations", "Little Chef", "Dance", "Field trips"],
    image: "/images/school/student-guidance.webp",
    imageAlt: "Students meeting with a staff member"
  }
};

learningPathwaysCopy.hero.image = {
  src: "/images/heroes/events/desktop.webp",
  mobileImage: "/images/heroes/programs/running-students-mobile.webp",
  alt: "Vidya Academy students running together along a covered school walkway"
};

export function applyWordPressContent(content = {}) {
  if (!content || typeof content !== "object") return;
  if (Object.prototype.hasOwnProperty.call(content, "programmes")) programmes = content.programmes;
  if (Object.prototype.hasOwnProperty.call(content, "learningStages")) learningStages = content.learningStages;
  if (Object.prototype.hasOwnProperty.call(content, "learningPathwaysCopy")) learningPathwaysCopy = content.learningPathwaysCopy;
}
