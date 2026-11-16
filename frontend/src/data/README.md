# Site content data

Edit public page copy, links, form labels, lists, and image references in the matching file under `pages/`. Keep the existing components and CSS for page structure and visual style. Shared routes and school contact details live in `siteNavigation.js`.

## Page data, in page order

1. `pages/home.js` — Home hero, welcome copy, development areas, class cards, FAQs, and enquiry form.
2. `pages/learningPathways.js` — Programs/Curriculum activities and the published academic pattern.
3. `pages/admissions.js` — Admission classes, enquiry steps, contact details, and eligibility notes.
4. `pages/campus.js` — Campus/Facilities headings, descriptions, and verified facilities.
5. `pages/motion.js` — Motion-In hero content and its two landing cards.
6. `pages/motionEvents.js` — Events page copy and the event/activity list. Add or edit entries in the `events` array; each `slug` becomes `/motion/events/:slug`. `details` is an array of approved paragraphs for that event. If it is empty, the page uses the shared event description above the array.
7. `pages/motionAchievements.js` — Achievements hero copy and verified recognition/participation entries. Add or edit entries in the `achievements` array; each `slug` becomes `/motion/achievements/:slug`. Use `details` for approved detail-page paragraphs and `facts` for short verified items such as a date or venue.
8. `pages/about.js` — About, vision, mission, educational philosophy, trust leadership, and recognition.
9. `pages/contact.js` — Contact page headings and enquiry form fields.
10. `pages/blogs.js` — Blog archive copy and published article data. The archive sorts newest posts first and displays six per page; each `slug` becomes `/blogs/:slug`. Each post can include `title`, `description`, `image`, `imageAlt`, `publishedAt`, and `content` sections with `heading` and `paragraphs`.
11. `siteNavigation.js` — navigation labels, footer links, contact details, and shared footer copy.

The logo links to Home. The navigation labels are Programs, Admissions, Campus, Motion-In, and About. The Enquire button and footer contact link open Contact. Public school copy should come from `VIDYA ACADEMY content(2).pdf`; leave details absent from that document unfilled and confirm flagged items with the school before publishing.
