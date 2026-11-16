export let admissionsPage = {
  hero: {
    eyebrow: "Admissions at Vidya Academy",
    title: "Admissions at Vidya Academy",
    description:
      "Choosing the right beginning for your child matters. Vidya Academy welcomes families looking for a nurturing, engaging and child-centred learning environment in Moodlakatte, Kundapura.",
    image: "/images/vidya-admission-mascot.png",
    imageAlt: "Vidya Academy admission mascot",
  },
  sections: {
    heroScroll: "Explore admissions",
    processEyebrow: "How to enquire",
    processTitle: "How to Enquire",
    processDescription:
      "Contact Vidya Academy, share your child’s age and the class you are interested in, speak with the school team, visit the campus, and complete the admission process as guided by the school.",
    stagesEyebrow: "Classes open for admission",
    stagesTitle: "Find the class for your child",
    stagesLink: "Explore curriculum",
    programmeLink: "View curriculum",
    documentsEyebrow: "Before you apply",
    documentsTitle: "Admission details",
    documentsDescription:
      "Please contact Vidya Academy to confirm the current admission process, documents and eligibility details.",
    contactEyebrow: "Contact Vidya Academy",
    enquireButton: "Enquire About Admission",
    visitButton: "Schedule a Campus Visit",
  },
  introduction: {
    eyebrow: "Admissions at Vidya Academy",
    title: "A nurturing beginning for your child.",
    description:
      "Choosing the right beginning for your child matters. Vidya Academy welcomes families looking for a nurturing, engaging and child-centred learning environment in Moodlakatte, Kundapura.",
  },
  steps: [
    {
      title: "Contact Vidya Academy",
      description:
        "Contact Vidya Academy using the phone number or enquiry form.",
    },
    {
      title: "Share your child’s age and class",
      description:
        "Share your child’s age and the class you are interested in.",
    },
    {
      title: "Speak with the school team",
      description:
        "Speak with the school team about the programme, facilities and admission process.",
    },
    {
      title: "Visit the campus",
      description:
        "Visit the campus to understand the learning environment.",
    },
    {
      title: "Complete the admission process",
      description:
        "Complete the admission process as guided by the school.",
    },
  ],
  stages: [
    {
      name: "Play Group – Nursery",
      short: "PG–Nursery",
      description: "Play Group and Nursery.",
      href: "/learning-pathways#pyp",
      tone: "green",
    },
    {
      name: "LKG – UKG",
      short: "LKG–UKG",
      description: "Lower Kindergarten and Upper Kindergarten.",
      href: "/learning-pathways#myp",
      tone: "gold",
    },
    {
      name: "Classes 1–8",
      short: "1–8",
      description: "Classes 1 through 8. Contact the school to confirm current class availability.",
      href: "/learning-pathways#dp",
      tone: "sage",
    },
  ],
  documents: [],
  note:
    "The PDF asks the school to confirm the current admission process, documents and eligibility details before publishing them.",
  contact: {
    title: "Enquire About Admission",
    description:
      "Contact the school by phone or email, or send an enquiry through the website.",
    address:
      "1172/1 Railway Station Road, Moodlakatte, Kundapura – 576217, Karnataka, India",
    email: "vidyaacademy2024@gmail.com",
    phone: "+91 91480 19301",
  },
};

export function applyWordPressContent(content = {}) {
  if (!content || typeof content !== "object") return;
  if (Object.prototype.hasOwnProperty.call(content, "admissionsPage")) admissionsPage = content.admissionsPage;
}
