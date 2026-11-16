export let contactPage = {
  hero: {
    eyebrow: "Vidya Academy · Moodlakatte, Kundapura",
    title: "Contact Vidya Academy",
    description:
      "Have questions about admissions, classes, facilities or the learning programme? Our school team is available to help you understand the right learning option for your child.",
  },
  details: {
    title: "Contact Vidya Academy",
    addressLabel: "Address",
    phoneLabel: "Phone",
    emailLabel: "Email",
    directions: "Get Directions",
    call: "Call the School",
    emailAction: "Send an Email",
  },
  form: {
    eyebrow: "Send an Enquiry",
    title: "How can we help your family?",
    fields: [
      { name: "Parent/Guardian Name", label: "Parent/Guardian Name", type: "text", required: true },
      { name: "Phone Number", label: "Phone Number", type: "tel", required: true },
      { name: "Email", label: "Email", type: "email", required: true },
      { name: "Address/Location", label: "Address/Location", type: "text", required: false },
      { name: "Child’s Age", label: "Child’s Age", type: "text", required: false },
    ],
    classLabel: "Class Interested In",
    classPlaceholder: "Select a class",
    classOptions: ["Play Group", "Nursery", "LKG", "UKG", "Class 1", "Class 2", "Class 3–8"],
    messageLabel: "Message",
    submit: "Send an Enquiry",
  },
};

export function applyWordPressContent(content = {}) {
  if (!content || typeof content !== "object") return;
  if (Object.prototype.hasOwnProperty.call(content, "contactPage")) contactPage = content.contactPage;
}
