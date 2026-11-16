// Event entries and page copy. Add, edit, or remove objects in `events` as needed.
// Keep descriptions to school-approved information from the source document.
export let motionEventsPage = {
  headingAlign: "center",
  eyebrow: "",
  title: "Events",
  description: "Additional experiences include Rhymes and Chimes, Garden Visits, Festivals and Celebrations, Little Chef, Dance and Field Trips.",
  heroImage: "/images/heroes/events/desktop.webp",
  mobileImage: "/images/heroes/events/mobile.webp",
  heroImageAlt: "Children taking part in an outdoor activity at Vidya Academy",
  backLabel: "Back to Motion-In",
  detailBackLabel: "Back to Events",
  readMoreLabel: "Read more",
  enquiryLabel: "Send an Enquiry",
};

export let events = [
  {
    slug: "rhymes-and-chimes",
    bulletPoints: ["Rhymes, songs and listening activities", "Practice with pronunciation and rhythm", "Confidence in spoken language"],
    category: "",
    title: "Rhymes and Chimes",
    description: "",
    details: ["Rhymes, songs and listening activities help children develop listening skills, pronunciation, rhythm and confidence in spoken language."],
    image: "/images/school/students-applauding.webp",
    imageAlt: "Students seated together and applauding",
    imageCaption: "Students gathered and applauding at Vidya Academy.",
    gallery: [
      {"image": "/images/school/circle-time.webp", "imageAlt": "Children sitting together in a circle", "caption": "Children sitting together in a circle."},
      {"image": "/images/school/preschool-circle.webp", "imageAlt": "Children seated together during a group activity", "caption": "Children seated together during a group activity."},
    ],
  },
  {
    slug: "garden-visits",
    bulletPoints: ["Time in the school’s gardens", "Opportunities to connect with nature"],
    category: "",
    title: "Garden Visits",
    description: "",
    details: ["The school’s green surroundings and gardens encourage children to connect with nature."],
    image: "/images/school/outdoor-mindfulness.webp",
    imageAlt: "Children sitting quietly on the outdoor lawn",
    imageCaption: "Children on the lawn at Vidya Academy.",
    gallery: [
      {"image": "/images/school/friends-on-the-lawn.webp", "imageAlt": "Two children sitting together on the lawn", "caption": "Two children sitting together on the lawn."},
      {"image": "/images/school/campus-courtyard.webp", "imageAlt": "A student in the courtyard by the arched walkway", "caption": "A student in the courtyard by the arched walkway."},
    ],
  },
  {
    slug: "festivals-and-celebrations",
    bulletPoints: ["Festivals and celebrations are part of the curriculum"],
    category: "",
    title: "Festivals and Celebrations",
    description: "",
    details: ["Festivals and Celebrations are listed among the school’s curriculum activities."],
    image: "/images/school/school-community.webp",
    imageAlt: "A large group of Vidya Academy students seated together",
    imageCaption: "The Vidya Academy school community.",
    gallery: [
      {"image": "/images/school/students-applauding.webp", "imageAlt": "Students seated together and applauding", "caption": "Students seated together and applauding."},
      {"image": "/images/school/school-friends.webp", "imageAlt": "Four students talking together on campus", "caption": "Four students talking together on campus."},
    ],
  },
  {
    slug: "little-chef",
    bulletPoints: ["Exploring fruits, vegetables and colours", "Learning about healthy food choices through age-appropriate activities"],
    category: "",
    title: "Little Chef",
    description: "",
    details: ["Children explore food, fruits, vegetables, colours and healthy choices through age-appropriate activities and experiences."],
    image: "/images/school/lunchtime.webp",
    imageAlt: "A student eating lunch at school",
    imageCaption: "A lunchtime moment at Vidya Academy.",
    gallery: [
      {"image": "/images/school/water-break.webp", "imageAlt": "A child drinking from a cup", "caption": "A child drinking from a cup."},
      {"image": "/images/school/early-writing.webp", "imageAlt": "A child writing at a yellow classroom table", "caption": "A child writing at a yellow classroom table."},
    ],
  },
  {
    slug: "dance",
    bulletPoints: ["Movement and physical development", "Dance as a curriculum activity"],
    category: "",
    title: "Dance",
    description: "",
    details: ["Movement and physical development are part of the school’s learning approach. Dance is listed among the curriculum activities."],
    image: "/images/school/covered-play-activity.webp",
    imageAlt: "Children moving together through the covered activity area",
    imageCaption: "Movement and play in the covered activity area.",
    gallery: [
      {"image": "/images/school/outdoor-group-play.webp", "imageAlt": "Children taking part in an outdoor group activity", "caption": "Children taking part in an outdoor group activity."},
      {"image": "/images/school/covered-activity-court.webp", "imageAlt": "Children playing in the covered school court", "caption": "Children playing in the covered school court."},
    ],
  },
  {
    slug: "field-trips",
    bulletPoints: ["Learning by doing through field experiences", "Field trips as a curriculum activity"],
    category: "",
    title: "Field Trips",
    description: "",
    details: ["Field experiences give children varied opportunities to learn by doing. Field Trips are listed among the school’s curriculum activities."],
    image: "/images/school/school-bus.webp",
    imageAlt: "Students beside a Vidya Academy school bus",
    imageCaption: "Students beside the Vidya Academy school bus.",
    gallery: [
      {"image": "/images/school/school-entrance.webp", "imageAlt": "Students walking through the green school gate", "caption": "Students walking through the green school gate."},
      {"image": "/images/school/students-in-corridor.webp", "imageAlt": "A group of students walking through a school corridor", "caption": "A group of students walking through a school corridor."},
    ],
  },
];

export function applyWordPressContent(content = {}) {
  if (!content || typeof content !== "object") return;
  if (Object.prototype.hasOwnProperty.call(content, "motionEventsPage")) motionEventsPage = content.motionEventsPage;
  if (Object.prototype.hasOwnProperty.call(content, "events")) {
    events = content.events.filter((item) => item && item.status !== "draft");
  }
}
