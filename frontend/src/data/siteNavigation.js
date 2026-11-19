export let navbarData = {
  logo: {
    src: "/images/vidya-academy-navbar.png",
    alt: "Vidya Academy",
    to: "/",
  },
  links: [
    { label: "ACADEMICS", to: "/learning-pathways" },
    { label: "ADMISSIONS", to: "/admissions" },
    { label: "CAMPUS", to: "/campus" },
    { label: "MILESTONE", to: "/motion" },
    { label: "ABOUT", to: "/about" },
    { label: "MANDATORY DISCLOSURE", to: "/mandatory-disclosure" },
  ],
  cta: { label: "ENQUIRE", to: "/contact" },
};

export let footerColumns = [
  {
    title: "School",
    links: [
      { label: "About us", to: "/about" },
      { label: "Campus", to: "/campus" },
      { label: "Motion-in", to: "/motion" },
        { label: "Programs", to: "/learning-pathways" },
        { label: "Contact", to: "/contact" },
    ],
  },
  {
    title: "Admissions",
    links: [
      { label: "Admissions", to: "/admissions" },
      { label: "Start an enquiry", to: "/contact" },
      { label: "Blogs", to: "/blogs" },
      { label: "FAQs", to: "/#faq" },
    ],
  },
  {
    title: "Our Institutions",
    linkGroups: [
      [
        { label: "Moodlakatte Institutes of Technology", href: "https://www.mitkundapura.com/", external: true },
        { label: "Moodlakatte College of Nursing", href: "https://mcnkundapura.com/", external: true },
        { label: "IMJ Institutes of Science and Commerce", href: "https://imjisc.com/", external: true },
        { label: "Moodlakatte College of Physiotherapy", href: "https://mcopt.in/", external: true },
      ],
      [
        { label: "IMJ College of Allied Health Sciences", href: "https://imjcoahs.com/", external: true },
        { label: "Moodlakatte Institute of Paramedical Sciences", href: "https://www.mipskundapura.com/", external: true },
        { label: "IMJ Institute of Research", href: "https://imjir.org/", external: true },
      ],
    ],
  },
];

export let socialLinks = [
  { label: "Instagram", href: "https://www.instagram.com/thevidyaacademy/" },
  { label: "Facebook", href: "https://www.facebook.com/thevidyaacademy/" },
  { label: "YouTube", href: "https://www.youtube.com/channel/UCBGiAGbk6pDo0AlaALEQMXQ" },
];

export let schoolDetails = {
  location: "1172/1 Railway Station Road, Moodlakatte, Kundapura – 576217, Karnataka, India",
  phone: "+91 91480 19301",
  email: "vidyaacademy2024@gmail.com",
  whatsapp: "+91 91480 19301",
};

export let footerCopy = {
  description: "A nurturing learning environment where children learn with curiosity, grow with confidence and discover the joy of learning.",
  copyrightName: "Vidya Academy",
  copyrightNotice: "All rights reserved.",
  brandTitle: "VIDYA ACADEMY",
};

export function applyWordPressContent(content = {}) {
  if (!content || typeof content !== "object") return;
  if (Object.prototype.hasOwnProperty.call(content, "navbarData")) {
    const links = Array.isArray(content.navbarData?.links) ? content.navbarData.links : [];
    const disclosureUrl = "/mandatory-disclosure";
    const disclosureLinks = links.map((link) => (
      String(link?.label || "").toLowerCase().includes("mandatory disclosure") || link?.to === "https://vidyaacademy.school.in/mandatory-public-disclosure/"
        ? { ...link, label: "MANDATORY DISCLOSURE", to: disclosureUrl, external: false }
        : link
    ));
    const hasDisclosure = disclosureLinks.some((link) => link.to === disclosureUrl);
    navbarData = {
      ...content.navbarData,
      links: hasDisclosure ? disclosureLinks : [...disclosureLinks, { label: "MANDATORY DISCLOSURE", to: disclosureUrl }],
    };
  }
  if (Object.prototype.hasOwnProperty.call(content, "footerColumns")) {
    footerColumns = content.footerColumns.map((column) => {
      if (column.title !== "Admissions" || !Array.isArray(column.links)) return column;
      if (column.links.some((link) => link.to === "/blogs" || link.label?.toLowerCase() === "blogs")) return column;
      return { ...column, links: [...column.links, { label: "Blogs", to: "/blogs" }] };
    });
  }
  if (Object.prototype.hasOwnProperty.call(content, "socialLinks")) socialLinks = content.socialLinks;
  if (Object.prototype.hasOwnProperty.call(content, "schoolDetails")) schoolDetails = content.schoolDetails;
  if (Object.prototype.hasOwnProperty.call(content, "footerCopy")) footerCopy = content.footerCopy;
}
