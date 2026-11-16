# Update notes · November 2026

## WordPress plugin

- Updated the custom plugin to 1.9.21.
- Added the public read-only `GET /wp-json/vidya/v1/seo-pages/{slug}` endpoint, returning the published page, meta title, meta description, sanitized HTML, and page CSS.
- Added a WordPress editor field for page-scoped CSS. Unsafe HTML is filtered by WordPress; scripts and `@import` are not supported.
- Limited About hero image settings to the two photos rendered by the React hero: the main/focus image and the inset image.

## React frontend

- SEO landing pages request their page from WordPress by slug, update metadata, normalize WordPress media paths, and render custom HTML between the current navigation and footer. CSS selectors are scoped to the page wrapper.
- Made the shared app shell full viewport width so the navbar, page backgrounds, and footer have no outer desktop gutters or card frame.
- Restored a centered 1360px maximum width for Campus intro and photo grids so the collage keeps its intended image proportions on wide screens.
- Set the homepage hero to fill the available page width while keeping its video cover-cropped and its text in the centered inner container.
- Updated the blog index with a featured first story and a single-column phone layout; added article metadata/schema to story detail pages.
- Increased the floating mascot tap target on phones and scaled it up on extra-wide screens.
- Coalesced campus marquee remeasurement events and add enough identical track copies to fill wide screens without gaps.

## Latest layout correction

- The latest screenshot showed the Campus collage over-expanded. The collage is now capped at 1360px and centered; the homepage hero remains full bleed.
- Removed the homepage hero's short-height desktop cap so it fills the available viewport below the navigation bar without the white strip below it.
- Extended the shared fluid content container to the admissions, story, contact, and SEO guide page wrappers.
- Updated the Campus marquee to remeasure when its viewport changes and retain its animation position when image widths are recalculated.
- Aligned homepage hero content to the same fluid 1360px container and left edge used by the other page sections; removed its extra inner side padding.
- Page-level H1 headings retain the small left adjustment within their responsive containers.
- Aligned the Programs and Milestones hero copy inside a centered 1360px content frame while keeping their background images full bleed.
- Raised and responsively scaled the Campus hero heading and description so the copy remains inside the visible hero area on desktop and short laptop screens.

## WordPress update steps

Install the latest `wordpress/Vidya-Academy-CMS-1.9.27.zip` in **Plugins → Add New Plugin → Upload Plugin**, activate the update, then refresh the React site. Set `VITE_WORDPRESS_URL` to the WordPress site root (without `/wp-json`).

## Latest homepage and responsive refinements

- Aligned the homepage Welcome section and Learning Pillars cards to the shared responsive 1360px content container, removing their extra nested side gutters while keeping section backgrounds full width.
- Increased the floating mascot video slightly on phones and ultrawide screens.
- Added extra measured copies to both Campus marquee tracks so their loops remain covered on especially wide displays; existing animation progress is preserved during remeasurement.

## Blogs and custom page code

- Updated the plugin to 1.9.22. The Blogs page editor now accepts optional page HTML/CSS and meta title/description; custom HTML and CSS are exposed through the existing public content response.
- Blog post editing now accepts meta title/description and optional article HTML/CSS. The blog REST endpoint returns these fields after WordPress sanitization.
- Scoped blog custom CSS to its custom content wrapper, preserving the React navigation and footer.
- Changed the blog index to equal-width cards in a three-column desktop grid, with two columns on tablets and one on phones.
- Rebuilt the standard blog detail hero as a full-bleed responsive image with the article heading and summary overlaid for contrast.

## Campus and Programs refinement · 1.9.24

- Reworked the Programs page Additional Experiences section with five photos on the left and the experience copy on the right; it stacks cleanly on phones.
- Replaced the separate Campus Grounds and Campus Buildings blocks with one responsive Infrastructure photo gallery and removed both marquees from the page.
- Added an Our Upcoming Campus section with grouped future facilities from the supplied planning reference. Its image, title, description, categories, and facilities are editable in the WordPress Campus tab.
- Carried forward the bundled hero video and responsive About, Campus, and milestone photos in the updated plugin. The media migration changes only known old defaults and preserves URLs selected in WordPress.
- Fixed the CSS URL sanitizer PHP syntax error that prevented the previous plugin version from activating.

## Campus and Programs visual update · 1.9.25

- Added five labeled school photos for Rhymes and Chimes, Garden Visits, Festivals and Celebrations, Little Chef, and Dance and Field Trips.
- Kept the Additional Experiences and No Last Bench Concept copy on the right at desktop widths; the photo mosaic moves above the copy on phones.
- Polished the Infrastructure gallery and aligned it to the same responsive content width as the Upcoming Campus section.
- Added a six-panel illustrative image for planned campus facilities; the section labels it as illustrative and the image can be replaced in WordPress.

## Campus section order and alignment · 1.9.26

- Removed the small eyebrow labels from Infrastructure and Our Upcoming Campus.
- Placed each section description directly below its heading.
- Rebuilt the Infrastructure photo gallery as a uniform three-column grid at desktop, tablet, and phone widths.
- Updated the plugin to 1.9.26 and removed the retired Upcoming Campus eyebrow field from its defaults and old saved content.

## Programs and navigation update · 1.9.27

- Made the fifth Additional Experiences photo span the full content width on phones and switched the Infrastructure gallery to two aligned columns across screen sizes.
- Standardized the homepage, admissions, and Programs class cards around three bands: Play Group–Nursery, LKG–UKG, and Classes 1–8.
- Added a Mandatory Disclosure link to the React navigation that opens the school’s official disclosure page.
- Started Events, Achievements, legacy Blogs, and SEO landing page collections empty in both bundled defaults and WordPress; the plugin clears the earlier bundled sample entries once during upgrade.

## Homepage cards and disclosure page · 1.9.28

- Expanded the homepage admission cards to four groups: Play Group–Nursery, LKG–UKG, Classes 1–5, and Classes 6–8. The two older-class cards now use distinct classroom and student photos.
- Added an in-site `/mandatory-disclosure` page using Vidya Academy’s visual style, with editable school details and sections for verified facts and document links.
- Converted the previous external Mandatory Disclosure navigation item to the new in-site route, including saved WordPress navigation.
- Set Campus Infrastructure to three columns on larger screens and two columns on phones.

## Mandatory disclosure details · 1.9.29

- Rebuilt the in-site disclosure page as responsive tables matching the supplied screenshots: general information, documents, academics, teaching staff, infrastructure, and the declaration row.
- Added the school facts shown in the screenshots and a WordPress field for each document URL; linked PDFs open in a new tab.
- Added a one-time WordPress content migration so existing installs receive the new disclosure sections without replacing unrelated site content.
- The supplied disclosure website could not be reached when preparing this update. PDF URLs are left blank in the matching WordPress rows rather than guessing or using PDFs from another school.

## SEO landing page editor · 1.9.30

- Added a WordPress Media Library action that inserts an image tag at the cursor in each SEO page's raw HTML editor.
- Added an **Upload / choose PDF** action to every disclosure document row; selected PDFs are saved as their file URLs and shown as links on the public disclosure page.
- Kept separate page-scoped CSS, meta title and description, slug, draft/publish state, and search indexing controls in the SEO page editor.
- Confirmed the React route uses the published-by-slug REST API response, applies SEO metadata, and renders custom HTML/CSS inside the existing navbar/footer shell.
- Published endpoint sanitizes unsafe HTML and scopes page CSS so custom styles do not affect the shared navigation or footer.

## Small WordPress installer · 1.9.31

- Removed duplicate React brand, mascot, photo, and hero video files from the WordPress plugin package. The React app already ships these assets in `public/`.
- The WordPress API now preserves bundled relative asset paths so the React frontend resolves them from its own domain, including assets used inside custom SEO HTML and CSS.
- Reduced the plugin download so it fits common WordPress upload limits and avoids the generic “The link you followed has expired” upload error.
