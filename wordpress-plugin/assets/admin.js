(() => {
  const groups = {
    navbar: [
      { title: "Logo and navigation links", paths: [["navbarData", "logo"], ["navbarData", "links"]] },
      { title: "Enquiry button", paths: [["navbarData", "cta"]] },
    ],
    footer: [
      { title: "Footer link columns", paths: [["footerColumns"]] },
      { title: "School contact details", paths: [["schoolDetails"]] },
      { title: "Footer text and social links", paths: [["footerCopy"], ["socialLinks"]] },
    ],
    home: [
      { title: "Hero", paths: [["homeCopy", "hero"]] },
      { title: "About Vidya Academy", paths: [["homeCopy", "philosophy"], ["galleryImages"], ["homeMedia"]] },
      { title: "Programs", paths: [["homeCopy", "programsTitle"], ["programs"]] },
      { title: "Life at School", paths: [["homeCopy", "lifeTitle"], ["lifeCards"]] },
      { title: "The Vidya Way", paths: [["homeCopy", "wayTitle"], ["wayItems"]] },
      { title: "Trividha Shikshana", paths: [["homeCopy", "learningPillarsHeading"], ["homeCopy", "learningPillarsLogo"], ["homeCopy", "learningPillars"]] },
      { title: "Quick Facts", paths: [["homeCopy", "factsTitle"], ["facts"], ["fallbackImage"]] },
      { title: "Parent FAQs and Enquiry Form", paths: [["homeCopy", "faq"], ["admissionFormCopy"]] },
    ],
    learningPathways: [
      { title: "Hero", paths: [["learningPathwaysCopy", "hero"]] },
      { title: "Learning Stages", paths: [["learningStages"]] },
      { title: "Learning Approach", paths: [["learningPathwaysCopy", "journey"], ["learningPathwaysCopy", "continuum"]] },
      { title: "Programs", paths: [["programmes"]] },
      { title: "Career Guidance", paths: [["learningPathwaysCopy", "careerGuidance"]] },
    ],
    admissions: [
      { title: "Hero", paths: [["admissionsPage", "hero"]] },
      { title: "How to Enquire", paths: [["admissionsPage", "sections"], ["admissionsPage", "steps"]] },
      { title: "Classes Open for Admission", paths: [["admissionsPage", "stages"]] },
      { title: "Admissions Contact Callout", paths: [["admissionsPage", "contact"]] },
    ],
    mandatoryDisclosure: [
      { title: "Disclosure page heading", paths: [["pageTitle"], ["description"]] },
      { title: "School contact details", paths: [["schoolDetails"]] },
      { title: "Disclosure tables and PDF links", paths: [["sections"]] },
    ],
    campus: [
      { title: "Hero", paths: [["campusCopy", "hero"], ["heroImages"]] },
      { title: "Infrastructure", paths: [["introText"], ["groundsImages"], ["buildingImages"], ["FALLBACK_BUILDING_IMAGE"], ["FALLBACK_IMAGE"]] },
      { title: "Our Upcoming Campus", paths: [["upcomingCampus"]] },
      { title: "Campus Facts", paths: [["campusCopy", "numbers"], ["campusStats"], ["campusFeatureImage"]] },
    ],
    motion: [
      { title: "Motion-In Hero", paths: [["heroEvent"]] },
      { title: "Events and Achievements Cards", paths: [["motionSections"], ["FALLBACK_IMAGE"]] },
    ],
    motionEvents: [
      { title: "Events Page Heading and Buttons", paths: [["motionEventsPage"]] },
    ],
    motionAchievements: [
      { title: "Achievements Page Heading and Buttons", paths: [["motionAchievementsPage"]] },
    ],
    about: [
      { title: "Hero", paths: [["aboutCopy", "hero"], ["aboutImages"]] },
      { title: "Our Story", paths: [["statement"], ["aboutCopy", "content"]] },
      { title: "Chairman’s Voice", paths: [["aboutCopy", "chairmanVoice"]] },
      { title: "Leadership", paths: [["aboutCopy", "leadership"], ["leaders"]] },
      { title: "Learning Approach", paths: [["aboutCopy", "way"], ["conceptRing"], ["experienceRing"], ["learnerDimensions"], ["outerRing"]] },
      { title: "Award and Recognition", paths: [["aboutCopy", "year"], ["events"]] },
    ],
    contact: [
      { title: "Hero", paths: [["contactPage", "hero"]] },
      { title: "Contact Details", paths: [["contactPage", "details"]] },
      { title: "Enquiry Form", paths: [["contactPage", "form"]] },
    ],
    notFound: [{ title: "404 Page", paths: [["notFoundPage"]] }],
    blogs: [{ title: "Blog Page Heading and Copy", paths: [["blogsPage"]] }],
    // This tab edits the collection itself (unlike nested page sections).
    seoLandingPages: [{ title: "School guide pages", paths: [[]] }],
  };

  const names = {
    siteNavigation: "Navbar & Footer",
    navbarData: "Navbar",
    logo: "Logo",
    cta: "Enquiry button",
    footerColumns: "Footer columns",
    footerCopy: "Footer text",
    imageAlt: "Image description (alt text)",
    imageHeading: "Image heading (optional)",
    imageCaption: "Image caption (optional)",
    galleryTitle: "Photo gallery heading (optional)",
    caption: "Photo caption (optional)",
    targetKeyword: "Main search phrase",
    seoTitle: "Meta title (Google result title)",
    metaTitle: "Meta title (Google result title)",
    metaDescription: "Google result description",
    canonicalPath: "Canonical path (usually leave blank)",
    upcomingCampus: "Our Upcoming Campus",
    pageTitle: "Page heading",
    schoolDetails: "School details",
    items: "Disclosure facts or document links",
    detail: "Information",
    groups: "Facility groups",
    facilities: "Facilities",
    searchVisibility: "Search visibility (index or noindex)",
    hero: "Hero content",
    highlights: "Highlights",
    sections: "Content sections",
    faqs: "Questions and answers",
    relatedLinks: "Related page links",
    contactHeading: "Contact section heading",
    contactDescription: "Contact section text",
    contactButton: "Contact button label",
    templateStyle: "Visual page template",
    contentHtml: "Custom page HTML",
    customCss: "Custom page CSS (scoped to this page)",
    paragraphs: "Paragraphs — one per line",
    bulletPoints: "Bullet points — one per line",
    title: "Title",
    slug: "URL slug",
    description: "Short description",
    category: "Category",
    image: "Card and detail image",
    details: "Paragraphs — one per line",
    bulletPoints: "Bullet points — one item per line",
    footerColumns: "Footer Links",
    footerCopy: "Footer Text",
    schoolDetails: "School Contact Details",
    socialLinks: "Social Links",
    homeCopy: "Homepage Text",
    galleryImages: "About Images",
    faqItems: "FAQs",
    facts: "Quick Facts",
    programmes: "Programs",
    learningStages: "Learning Stages",
    motionEventsPage: "Events Page Heading and Buttons",
    motionAchievementsPage: "Achievements Page Heading and Buttons",
    mobileImage: "Mobile hero image (phone, optional)",
    mascotImage: "Enquiry mascot image",
    video: "Hero background video",
    mobileVideo: "Phone hero video (optional)",
    learningPillarsLogo: "Trividha Shikshana logo",
    learningPillars: "Shikshana cards",
    src: "Image or Link URL",
    href: "PDF or document URL",
    linkLabel: "PDF link label",
    to: "Page Link",
    alt: "Image Description",
    imageAlt: "Image Description",
    cta: "Enquiry Button",
  };
  const humanize = (key) => names[key] || String(key)
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/^./, (char) => char.toUpperCase());

  const element = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  const valueAtPath = (object, path) => path.reduce((value, key) => value == null ? undefined : value[key], object);
  const setAtPath = (object, path, value) => {
    let parent = object;
    for (const part of path.slice(0, -1)) parent = parent[part];
    parent[path[path.length - 1]] = value;
  };
  const blankCopy = (value) => {
    if (Array.isArray(value)) return [];
    if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, blankCopy(child)]));
    if (typeof value === "number") return 0;
    if (typeof value === "boolean") return false;
    return "";
  };
  const textList = (path) => /paragraphs|tags|classOptions|meta|details|bulletPoints|points|title$/i.test(String(path[path.length - 1]));
  const slugify = (value) => String(value || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  const isImageField = (key) => /^(src|image|logo|photo|poster|thumbnail|.*Image|FALLBACK_IMAGE|FALLBACK_BUILDING_IMAGE)$/i.test(String(key));
  const isVideoField = (key) => /video/i.test(String(key));
  const isLongText = (key, value) => /description|paragraph|quote|answer|bio|introduction|message|content|summary|continuation/i.test(String(key))
    || (typeof value === "string" && (value.length > 100 || value.includes("\n")));

  function mobileHeroListItem(rootValue, listKey, flagKey, requestedIndex, fallbackIndex) {
    const list = Array.isArray(rootValue?.[listKey]) ? rootValue[listKey] : [];
    const flaggedIndex = list.findIndex((item) => item && item[flagKey]);
    const heroIndex = flaggedIndex >= 0 ? flaggedIndex : Math.min(fallbackIndex, Math.max(0, list.length - 1));
    return Number(requestedIndex) === heroIndex;
  }

  function isHeroImagePath(page, fieldPath, rootValue) {
    const pageName = String(page || "").toLowerCase();
    const route = fieldPath.map(String).join(".").toLowerCase();
    const campusHero = pageName === "campus" && route.match(/^heroimages\.(\d+)(?:\.|$)/);
    if (campusHero) return mobileHeroListItem(rootValue, "heroImages", "center", campusHero[1], 4);
    const aboutHero = pageName === "about" && route.match(/^aboutimages\.(\d+)(?:\.|$)/);
    if (aboutHero) return mobileHeroListItem(rootValue, "aboutImages", "focus", aboutHero[1], 0);
    if ((pageName === "motionevents" && /^events\.\d+(?:\.|$)/.test(route))
      || (pageName === "motionachievements" && /^achievements\.\d+(?:\.|$)/.test(route))) return true;
    return /(^|\.)(hero|heroimage|heroevent)(\.|$)/.test(route)
      || (pageName === "seolandingpages" && /\d+\.hero(?:\.|$)/.test(route));
  }

  function hasMobileHeroField(page, fieldPath, rootValue) {
    return String(fieldPath[fieldPath.length - 1]).toLowerCase() === "mobileimage"
      && isHeroImagePath(page, fieldPath.slice(0, -1), rootValue);
  }

  function imageSizeHelp(page, path, key, rootValue) {
    const pageName = String(page || "").toLowerCase();
    const route = path.map(String).join(".").toLowerCase();
    const isMobile = /^mobileimage$/i.test(String(key));
    const isStoryHero = ((pageName === "motionevents" && /events\.\d+/.test(route))
      || (pageName === "motionachievements" && /achievements\.\d+/.test(route)));
    const isHero = isHeroImagePath(page, path, rootValue);

    if (/navbardata\.logo|learningpillarslogo|intrologoimage/.test(route)) {
      const size = /intrologoimage/.test(route) ? "1200 × 900 px" : /learningpillarslogo/.test(route) ? "1200 × 1028 px" : "800 × 240 px";
      return `Logo: ${size}. Use a transparent PNG or WebP and include clear padding.`;
    }
    if (/mascotimage/.test(route) || /faq.*mascot/.test(route)) {
      return "Mascot: 600 × 720 px, transparent PNG or WebP. Keep the full figure visible; one image works across all devices.";
    }
    if (/admissionspage\.hero/.test(route)) {
      return "Admissions mascot: 900 × 1100 px, transparent PNG or WebP. One image works across all devices.";
    }
    if (isHero) {
      const desktopSize = isStoryHero ? "1600 × 1200 px" : "1920 × 1080 px";
      const mobileSize = isStoryHero ? "900 × 1200 px" : "900 × 1600 px";
      return isMobile
        ? `PHONE HERO IMAGE · ${mobileSize}. Used on screens 768 px wide and below. If blank, the desktop image is used.`
        : `DESKTOP / TABLET HERO IMAGE · ${desktopSize}. Upload a second, separately framed phone image below (${mobileSize}).`;
    }

    let size = "1600 × 1000 px";
    let label = "Photo";
    if (pageName === "home" && /galleryimages/.test(route)) { size = "960 × 1080 px"; label = "Homepage gallery photo"; }
    else if (pageName === "home" && /programs/.test(route)) { size = "720 × 1200 px"; label = "Program card photo"; }
    else if (pageName === "home" && /lifecards/.test(route)) { size = "1000 × 940 px"; label = "Life at School photo"; }
    else if (pageName === "home" && /wayitems/.test(route)) { size = "840 × 910 px"; label = "Vidya Way photo"; }
    else if (pageName === "home" && /facts/.test(route)) { size = "1000 × 750 px"; label = "Quick Facts photo"; }
    else if (pageName === "home" && /learningpillars/.test(route)) { size = "600 × 720 px"; label = "Shikshana mascot"; }
    else if (pageName === "about" && /leaders/.test(route)) { size = "1000 × 1200 px"; label = "Leadership portrait"; }
    else if (pageName === "campus" && /groundsimages|buildingimages|marqueeimages|campusfeatureimage/.test(route)) { label = "Campus photo"; }
    else if (/gallery|faculty|guidance|content/.test(route)) { label = "Photo"; }
    return `${label}: ${size}. ONE IMAGE for desktop, tablet, and phone; the website crops it responsively. Keep faces and key details near the centre.`;
  }

  function makeField(value, path, key, state) {
    const field = element("label", "vidya-cms-field");
    const page = state.root.dataset.page;
    const blogIndexPage = page === "blogs" && path[0] === "blogsPage";
    const isMobileHero = key === "mobileImage" && hasMobileHeroField(page, path, state.value);
    const isDesktopHero = isHeroImagePath(page, path, state.value) && /^(image|src|heroimage)$/i.test(String(key));
    const fieldLabel = isMobileHero ? "Mobile hero image (phone, optional)"
      : isDesktopHero ? "Desktop hero image (tablet and laptop)"
        : humanize(key);
    field.append(element("span", "vidya-cms-field-label", fieldLabel));
    if (state.root.dataset.page === "seoLandingPages" && key === "templateStyle") {
      const select = element("select", "vidya-cms-input");
      const choices = [
        ["classic", "Classic — balanced hero and article"],
        ["spotlight", "Spotlight — bold green feature layout"],
        ["editorial", "Editorial — centered, narrow article"],
      ];
      choices.forEach(([optionValue, label]) => {
        const option = element("option", "", label);
        option.value = optionValue;
        option.selected = (value || "classic") === optionValue;
        select.append(option);
      });
      select.addEventListener("change", () => { setAtPath(state.value, path, select.value); state.sync(); });
      field.append(select);
      field.append(element("span", "description vidya-cms-field-help", "Choose the page design. The site keeps its header, responsive layout, and enquiry section."));
      return field;
    }
    if ((page === "seoLandingPages" || blogIndexPage) && key === "contentHtml") {
      const input = element("textarea", "vidya-cms-input vidya-cms-html-input");
      input.rows = 18;
      input.spellcheck = false;
      input.value = typeof value === "string" ? value : "";
      input.placeholder = "Paste the page body HTML here. Example: <section class=\"hero\"><h1>...</h1><img src=\"...\" alt=\"...\"></section>";
      input.addEventListener("input", () => { setAtPath(state.value, path, input.value); state.sync(); });
      field.append(input);
      if (page === "seoLandingPages") {
        const addImage = element("button", "button vidya-cms-media", "Upload / insert image into HTML");
        addImage.type = "button";
        addImage.addEventListener("click", () => {
          if (!window.wp?.media) return;
          const frame = window.wp.media({
            title: "Upload or choose an image for this landing page",
            button: { text: "Insert image into HTML" },
            library: { type: "image" },
            multiple: false,
          });
          frame.on("select", () => {
            const media = frame.state().get("selection").first().toJSON();
            const escapeAttribute = (text) => String(text || "").replace(/[&<>\"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" })[character]);
            const snippet = `<img src="${escapeAttribute(media.url)}" alt="${escapeAttribute(media.alt || media.title || "")}">`;
            input.focus();
            input.setRangeText(snippet, input.selectionStart, input.selectionEnd, "end");
            input.dispatchEvent(new Event("input", { bubbles: true }));
          });
          frame.open();
        });
        field.append(addImage);
      }
      field.append(element("span", "description vidya-cms-field-help", blogIndexPage
        ? "Optional: paste a custom Blogs page body. The normal listing is used when this is blank. WordPress removes unsafe HTML; the React navigation and footer stay in place."
        : "Paste the complete page body HTML here, including headings, sections, links, and images. Use the image button to upload/select a Media Library image and insert its HTML. Add CSS in the separate scoped CSS field below. WordPress removes unsafe markup such as scripts; the React navigation and footer stay in place."));
      return field;
    }
    if ((page === "seoLandingPages" || blogIndexPage) && key === "customCss") {
      const input = element("textarea", "vidya-cms-input vidya-cms-html-input vidya-cms-css-input");
      input.rows = 18;
      input.spellcheck = false;
      input.value = typeof value === "string" ? value : "";
      input.placeholder = ".hero { background: #f4f1e7; }\n.hero h1 { color: #07583d; }";
      input.addEventListener("input", () => { setAtPath(state.value, path, input.value); state.sync(); });
      field.append(input);
      field.append(element("span", "description vidya-cms-field-help", "CSS is automatically scoped to this page so its selectors cannot style the site navigation or footer. Script code and @import are not supported."));
      return field;
    }
    if (state.root.dataset.page === "seoLandingPages" && (key === "status" || key === "searchVisibility")) {
      const select = element("select", "vidya-cms-input");
      const options = key === "status" ? [["draft", "Draft (hidden from visitors)"], ["published", "Published"]] : [["noindex", "Noindex (hidden from search engines)"], ["index", "Index (allow search engines)"]];
      options.forEach(([optionValue, label]) => {
        const option = element("option", "", label);
        option.value = optionValue;
        option.selected = (value || (key === "status" ? "draft" : "noindex")) === optionValue;
        select.append(option);
      });
      select.addEventListener("change", () => { setAtPath(state.value, path, select.value); state.sync(); });
      field.append(select);
      return field;
    }
    if (state.root.dataset.page === "mandatoryDisclosure" && key === "href") {
      const input = element("input", "vidya-cms-input");
      input.type = "url";
      input.value = typeof value === "string" ? value : "";
      input.placeholder = "Upload a PDF or paste its URL";
      input.addEventListener("input", () => { setAtPath(state.value, path, input.value); state.sync(); });
      field.append(input);
      const choosePdf = element("button", "button vidya-cms-media", "Upload / choose PDF");
      choosePdf.type = "button";
      choosePdf.addEventListener("click", () => {
        if (!window.wp?.media) return;
        const frame = window.wp.media({
          title: "Upload or choose a disclosure PDF",
          button: { text: "Use this PDF" },
          library: { type: "application", mime: "application/pdf" },
          multiple: false,
        });
        frame.on("select", () => {
          const media = frame.state().get("selection").first().toJSON();
          const isPdf = String(media.mime || media.mime_type || "").toLowerCase() === "application/pdf"
            || new URL(media.url, window.location.href).pathname.toLowerCase().endsWith(".pdf");
          if (!isPdf) {
            window.alert("Please choose a PDF document.");
            return;
          }
          input.value = media.url;
          input.dispatchEvent(new Event("input", { bubbles: true }));
        });
        frame.open();
      });
      field.append(choosePdf);
      field.append(element("span", "description vidya-cms-field-help", "Upload the official PDF to the WordPress Media Library or choose an existing PDF. Visitors will see a link in this disclosure row."));
      return field;
    }
    const multiline = isLongText(key, value);
    const input = element(multiline ? "textarea" : "input", "vidya-cms-input");
    input.dataset.fieldKey = String(key);
    input.dataset.itemPath = JSON.stringify(path.slice(0, -1));
    if (multiline) input.rows = Math.min(7, Math.max(3, Math.ceil((String(value || "").length || 80) / 90)));
    else input.type = typeof value === "number" ? "number" : "text";
    input.value = value == null ? "" : String(value);
    input.placeholder = /url|src|href|video|^to$/i.test(String(key)) ? "Paste a URL or site path" : `Enter ${humanize(key).toLowerCase()}`;
    input.addEventListener("input", () => {
      const previousValue = valueAtPath(state.value, path);
      const next = input.type === "number" && input.value !== "" ? Number(input.value) : input.value;
      setAtPath(state.value, path, next);
      const isSeoPage = path.some((part) => part === "seoLandingPages");
      const isSlugManaged = isSeoPage || path.some((part) => part === "events" || part === "achievements");
      if (key === "title" && isSlugManaged) {
        const itemPath = path.slice(0, -1);
        const slugPath = [...itemPath, "slug"];
        const existingSlug = valueAtPath(state.value, slugPath);
        if (!existingSlug || existingSlug === slugify(previousValue)) {
          const nextSlug = slugify(input.value);
          setAtPath(state.value, slugPath, nextSlug);
          const slugField = [...state.root.querySelectorAll("[data-field-key='slug']")]
            .find((field) => field.dataset.itemPath === JSON.stringify(itemPath));
          if (slugField) slugField.value = nextSlug;
        }
      }
      state.sync();
    });
    field.append(input);
    if (key === "slug" && (path.some((part) => part === "events" || part === "achievements") || path.some((part) => part === "seoLandingPages"))) {
      field.append(element("span", "description vidya-cms-field-help", "Fills from the title automatically. Edit it any time."));
    }

    if (state.root.dataset.page === "seoLandingPages" && key === "targetKeyword") {
      field.append(element("span", "description vidya-cms-field-help", "Use one specific family search question. Write original information for this page; avoid publishing near-identical pages for many locations."));
    }
    if (state.root.dataset.page === "seoLandingPages" && key === "canonicalPath") {
      field.append(element("span", "description vidya-cms-field-help", "Leave blank to use /schools/your-page-slug. Only set this when the page should point to a different canonical URL."));
    }

    const isVideo = isVideoField(key);
    const isImage = isImageField(key);
    if (isImage || isVideo) {
      const mediaType = isVideo ? "video" : "image";
      const imageGuide = isImage ? imageSizeHelp(state.root.dataset.page, path, key, state.value) : "";
      if (imageGuide) field.append(element("span", "description vidya-cms-field-help vidya-cms-image-size-help", imageGuide));
      const isBundledLocalAsset = typeof value === "string" && (/^\/(?:brand|images|mascots|media|videos)\//.test(value) || /^\/mascot-doll/i.test(value));
      if (value && isImage && !isBundledLocalAsset) {
        const preview = element("img", "vidya-cms-image-preview");
        preview.src = String(value);
        preview.alt = "Selected image preview";
        preview.loading = "lazy";
        field.append(preview);
      }
      const choose = element("button", "button vidya-cms-media", `Upload / choose ${mediaType}`);
      choose.type = "button";
      choose.addEventListener("click", () => {
        if (!window.wp?.media) return;
        const frame = window.wp.media({
          title: `Upload or choose a ${mediaType}`,
          button: { text: `Use this ${mediaType}` },
          library: { type: mediaType },
          multiple: false,
        });
        frame.on("select", () => {
          const media = frame.state().get("selection").first().toJSON();
          input.value = media.url;
          input.dispatchEvent(new Event("input", { bubbles: true }));
          if (!isImage) return;
          let previewNode = field.querySelector(".vidya-cms-image-preview");
          if (!previewNode) {
            previewNode = element("img", "vidya-cms-image-preview");
            previewNode.alt = "Selected image preview";
            field.insertBefore(previewNode, choose);
          }
          previewNode.src = media.url;
        });
        frame.open();
      });
      field.append(choose);
    }
    const mediaHelp = {
      video: "Desktop video: 1600 × 900 or 1920 × 1080 px H.264 MP4. Paste a direct streamable URL or choose a Media Library video. For a 1.1 GB file, use video hosting/object storage with byte-range streaming.",
      mobileVideo: "Phone video: 720 × 1280 px H.264 MP4. Upload a portrait version here when the framing differs; otherwise it reuses the desktop video.",
      mascotVideo: "Back-to-top mascot: this is the only visible mascot; no still image or poster is used. Recommended: transparent WebM (VP9 with alpha), portrait 484 × 736 px (or 600 × 900 px), 24–30 fps, and a short seamless loop. Keep the full mascot inside the frame; aim for under 2 MB. MP4 does not reliably preserve transparency. Large files should use video hosting/object storage with byte-range streaming.",
    };
    const help = mediaHelp[key];
    if (help) field.append(element("span", "description vidya-cms-field-help", help));
    return field;
  }

  function getItemTitle(item, index) {
    if (Array.isArray(item)) return `Link group ${index + 1}`;
    if (!item || typeof item !== "object") return `Item ${index + 1}`;
    const key = ["title", "name", "label", "question", "short", "slug", "id"].find((candidate) => item[candidate]);
    return `${key ? String(item[key]).slice(0, 55) : "Item"} ${index + 1}`;
  }

  function collectionLabel(path, state) {
    const key = path.length ? path[path.length - 1] : state.root.dataset.page;
    if (key === "seoLandingPages") return "School guide pages";
    return humanize(key || "Items");
  }

  function renderValue(value, path, state, rerender) {
    const wrap = element("div", "vidya-cms-fields");
    if (Array.isArray(value)) {
      if (value.length > 0 && value.every((item) => item === null || ["string", "number", "boolean"].includes(typeof item))) {
        const field = element("label", "vidya-cms-field");
        field.append(element("span", "vidya-cms-field-label", `${humanize(path[path.length - 1])} — one per line`));
        const input = element("textarea", "vidya-cms-input");
        input.rows = Math.min(8, Math.max(3, value.length));
        input.value = value.join("\n");
        input.addEventListener("input", () => {
          setAtPath(state.value, path, input.value.split(/\r?\n/).filter((line) => line.trim() !== ""));
          state.sync();
        });
        field.append(input);
        wrap.append(field);
        return wrap;
      }
      if (value.length === 0 && textList(path)) {
        const field = element("label", "vidya-cms-field");
        field.append(element("span", "vidya-cms-field-label", `${humanize(path[path.length - 1])} — one per line`));
        const input = element("textarea", "vidya-cms-input");
        input.rows = 3;
        input.placeholder = "Enter one item per line";
        input.addEventListener("input", () => {
          setAtPath(state.value, path, input.value.split(/\r?\n/).filter((line) => line.trim() !== ""));
          state.sync();
        });
        field.append(input);
        wrap.append(field);
        return wrap;
      }

      const list = element("div", "vidya-cms-list");
      const collectionName = collectionLabel(path, state);
      list.append(element("div", "vidya-cms-list-heading", `${collectionName} (${value.length})`));
      value.forEach((item, index) => {
        const details = element("details", "vidya-cms-item");
        details.append(element("summary", "vidya-cms-item-summary", getItemTitle(item, index)));
        const body = element("div", "vidya-cms-item-body");
        if (item && typeof item === "object") body.append(renderValue(item, [...path, index], state, rerender));
        else body.append(makeField(item, [...path, index], path[path.length - 1], state));
        const actions = element("div", "vidya-cms-item-actions");
        const up = element("button", "button", "Move up");
        up.type = "button";
        up.disabled = index === 0;
        up.addEventListener("click", () => { [value[index - 1], value[index]] = [value[index], value[index - 1]]; rerender(); });
        const down = element("button", "button", "Move down");
        down.type = "button";
        down.disabled = index === value.length - 1;
        down.addEventListener("click", () => { [value[index + 1], value[index]] = [value[index], value[index + 1]]; rerender(); });
        const remove = element("button", "button-link-delete", "Remove");
        remove.type = "button";
        if (state.root.dataset.page === "about" && path[path.length - 1] === "aboutImages" && value.length <= 2) {
          remove.disabled = true;
          remove.title = "The About hero uses exactly two images.";
        }
        remove.addEventListener("click", () => {
          if (!window.confirm(`Remove “${getItemTitle(item, index)}”? Remember to save the page.`)) return;
          value.splice(index, 1);
          rerender();
        });
        actions.append(up, down, remove);
        body.append(actions);
        details.append(body);
        list.append(details);
      });
      const addName = path.length ? humanize(path[path.length - 1]).replace(/s$/, "") : "School guide page";
      const add = element("button", "button button-secondary vidya-cms-add", `+ Add ${addName}`);
      add.type = "button";
      if (state.root.dataset.page === "about" && path[path.length - 1] === "aboutImages" && value.length >= 2) {
        add.disabled = true;
        add.title = "The About hero uses exactly two images.";
      }
      add.addEventListener("click", () => {
        if (value.length) value.push(blankCopy(value[0]));
        else if (path[path.length - 1] === "linkGroups") value.push([]);
        else if (state.root.dataset.page === "seoLandingPages") value.push({
          title: "", slug: "", status: "draft", targetKeyword: "", seoTitle: "", metaDescription: "",
          canonicalPath: "", searchVisibility: "noindex", category: "", templateStyle: "classic",
          hero: { eyebrow: "", heading: "", intro: "", image: "", mobileImage: "", imageAlt: "", imageHeading: "", imageCaption: "" },
          contentHtml: "", customCss: "", highlights: [], sections: [], faqs: [], relatedLinks: [], contactHeading: "", contactDescription: "",
        });
        else if (textList(path)) value.push("");
      else value.push({ title: "", slug: "", description: "", details: [], bulletPoints: [], image: "", imageAlt: "" });
        rerender();
      });
      list.append(add);
      wrap.append(list);
      return wrap;
    }

    if (value && typeof value === "object") {
      const isHomeHero = state.root.dataset.page === "home" && path.join(".") === "homeCopy.hero";
      let entries = Object.entries(value);
      if (state.root.dataset.page === "seoLandingPages" && path.length === 1 && /^\d+$/.test(String(path[0]))) {
        const order = ["title", "slug", "status", "targetKeyword", "seoTitle", "metaTitle", "metaDescription", "canonicalPath", "searchVisibility", "category", "contentHtml", "customCss", "hero", "highlights", "sections", "faqs", "relatedLinks", "contactHeading", "contactDescription"];
        entries = entries.sort(([left], [right]) => {
          const leftIndex = order.indexOf(left);
          const rightIndex = order.indexOf(right);
          return (leftIndex < 0 ? order.length : leftIndex) - (rightIndex < 0 ? order.length : rightIndex);
        });
      }
      entries.forEach(([key, child]) => {
        if (state.root.dataset.page === "seoLandingPages" && key === "templateStyle") return;
        if (isHomeHero && (key === "desktopImage" || key === "mobileImage")) return;
        if (state.root.dataset.page === "seoLandingPages" && ["ctaLabel", "ctaHref", "contactButton"].includes(key)) return;
        if (key === "mobileImage" && !hasMobileHeroField(state.root.dataset.page, [...path, key], state.value)) return;
        if (child && typeof child === "object") {
          const subsection = element("div", "vidya-cms-subsection");
          subsection.append(element("h4", "vidya-cms-subsection-title", humanize(key)));
          subsection.append(renderValue(child, [...path, key], state, rerender));
          wrap.append(subsection);
        } else {
          wrap.append(makeField(child, [...path, key], key, state));
        }
      });
      return wrap;
    }
    wrap.append(makeField(value, path, path[path.length - 1], state));
    return wrap;
  }

  function renderEditor(root, state) {
    const pageGroups = groups[root.dataset.page] || Object.keys(state.value).map((key) => ({ title: humanize(key), paths: [[key]] }));
    const expanded = new Set([...root.querySelectorAll(".vidya-cms-section[open]")].map((node) => node.dataset.section));
    root.replaceChildren();
    const imageRule = element("div", "vidya-cms-image-rules");
    imageRule.append(element("strong", "", "Image upload rule"));
    imageRule.append(element("span", "", " Only fields labeled Desktop hero image need an optional phone version. Every other photo uses one image for desktop, tablet, and mobile."));
    root.append(imageRule);
    pageGroups.forEach((group, index) => {
      const section = element("details", "vidya-cms-section");
      section.dataset.section = group.title;
      section.open = expanded.size ? expanded.has(group.title) : index === 0;
      section.append(element("summary", "vidya-cms-section-summary", group.title));
      group.paths.forEach((path) => {
        const value = valueAtPath(state.value, path);
        const fields = renderValue(value, path, state, state.rerender);
        if (group.paths.length > 1) {
          const subgroup = element("div", "vidya-cms-subsection");
          subgroup.append(element("h4", "vidya-cms-subsection-title", humanize(path[path.length - 1])));
          subgroup.append(fields);
          section.append(subgroup);
        } else {
          section.append(fields);
        }
      });
      root.append(section);
    });
    state.sync();
  }

  document.querySelectorAll(".vidya-cms-editor").forEach((root) => {
    const state = {
      value: JSON.parse(root.dataset.content || "{}"),
      hidden: root.parentElement.querySelector(".vidya-cms-json"),
      root,
      sync() { this.hidden.value = JSON.stringify(this.value); },
      rerender() { renderEditor(root, this); },
    };
    root._vidyaCmsState = state;
    state.rerender();
  });

  const tabs = [...document.querySelectorAll(".vidya-cms-tab")];
  tabs.forEach((tab) => tab.addEventListener("click", () => {
    tabs.forEach((other) => {
      const active = other === tab;
      other.classList.toggle("is-active", active);
      other.setAttribute("aria-selected", active ? "true" : "false");
      const panel = document.getElementById(other.dataset.panel);
      panel.hidden = !active;
      panel.classList.toggle("is-active", active);
    });
  }));

  document.getElementById("vidya-cms-form")?.addEventListener("submit", () => {
    document.querySelectorAll(".vidya-cms-editor").forEach((root) => root._vidyaCmsState.sync());
  });

  const blogTitle = document.getElementById("vidya-blog-title");
  const blogSlug = document.getElementById("vidya-blog-slug");
  if (blogTitle && blogSlug) {
    let slugWasEdited = false;
    let lastAutoSlug = slugify(blogTitle.value);
    if (!blogSlug.value) blogSlug.value = lastAutoSlug;
    blogTitle.addEventListener("input", () => {
      const currentSlug = blogSlug.value.trim();
      if (!slugWasEdited || !currentSlug || currentSlug === lastAutoSlug) {
        lastAutoSlug = slugify(blogTitle.value);
        blogSlug.value = lastAutoSlug;
        slugWasEdited = false;
      }
    });
    blogSlug.addEventListener("input", () => {
      slugWasEdited = blogSlug.value.trim() !== lastAutoSlug;
    });
  }

  const motionTitle = document.getElementById("vidya-motion-title");
  const motionSlug = document.getElementById("vidya-motion-slug");
  if (motionTitle && motionSlug) {
    let slugWasEdited = false;
    let lastAutoSlug = slugify(motionTitle.value);
    if (!motionSlug.value) motionSlug.value = lastAutoSlug;
    motionTitle.addEventListener("input", () => {
      const currentSlug = motionSlug.value.trim();
      if (!slugWasEdited || !currentSlug || currentSlug === lastAutoSlug) {
        lastAutoSlug = slugify(motionTitle.value);
        motionSlug.value = lastAutoSlug;
        slugWasEdited = false;
      }
    });
    motionSlug.addEventListener("input", () => {
      slugWasEdited = motionSlug.value.trim() !== lastAutoSlug;
    });
  }

  const motionImage = document.getElementById("vidya-motion-image");
  const motionPreview = document.getElementById("vidya-motion-image-preview");
  const motionChoose = document.getElementById("vidya-motion-choose-image");
  const motionRemove = document.getElementById("vidya-motion-remove-image");
  if (motionImage && motionPreview && motionChoose && window.wp?.media) {
    motionChoose.addEventListener("click", () => {
      const frame = window.wp.media({ title: "Choose an image", button: { text: "Use this image" }, library: { type: "image" }, multiple: false });
      frame.on("select", () => {
        const selected = frame.state().get("selection").first().toJSON();
        motionImage.value = selected.url;
        motionPreview.src = selected.sizes?.medium?.url || selected.url;
        motionPreview.classList.add("has-image");
        if (motionRemove) motionRemove.hidden = false;
        const altInput = document.querySelector("input[name='item_image_alt']");
        const captionInput = document.querySelector("input[name='item_image_caption']");
        if (altInput) altInput.value = selected.alt || "";
        if (captionInput) captionInput.value = "";
      });
      frame.open();
    });
  }
  motionRemove?.addEventListener("click", () => {
    if (motionImage) motionImage.value = "";
    if (motionPreview) { motionPreview.removeAttribute("src"); motionPreview.classList.remove("has-image"); }
    motionRemove.hidden = true;
  });

  const motionMobileImage = document.getElementById("vidya-motion-mobile-image");
  const motionMobilePreview = document.getElementById("vidya-motion-mobile-image-preview");
  const motionMobileChoose = document.getElementById("vidya-motion-choose-mobile-image");
  const motionMobileRemove = document.getElementById("vidya-motion-remove-mobile-image");
  motionMobileChoose?.addEventListener("click", () => {
    if (!window.wp?.media) return;
    const frame = window.wp.media({ title: "Choose a mobile hero image", button: { text: "Use this mobile image" }, library: { type: "image" }, multiple: false });
    frame.on("select", () => {
      const selected = frame.state().get("selection").first().toJSON();
      motionMobileImage.value = selected.url;
      motionMobilePreview.src = selected.sizes?.medium?.url || selected.url;
      motionMobilePreview.classList.add("has-image");
      if (motionMobileRemove) motionMobileRemove.hidden = false;
    });
    frame.open();
  });
  motionMobileRemove?.addEventListener("click", () => {
    if (motionMobileImage) motionMobileImage.value = "";
    if (motionMobilePreview) { motionMobilePreview.removeAttribute("src"); motionMobilePreview.classList.remove("has-image"); }
    motionMobileRemove.hidden = true;
  });

  document.querySelectorAll("[data-story-photo]").forEach((field) => {
    const url = field.querySelector("[data-photo-url]");
    const preview = field.querySelector("[data-photo-preview]");
    const choose = field.querySelector("[data-photo-choose]");
    const remove = field.querySelector("[data-photo-remove]");
    const alt = field.querySelector("[data-photo-alt]");
    const caption = field.querySelector("[data-photo-caption]");
    choose.addEventListener("click", () => {
      if (!window.wp?.media) return;
      const frame = window.wp.media({
        title: "Choose a gallery image",
        button: { text: "Use this image" },
        library: { type: "image" },
        multiple: false,
      });
      frame.on("select", () => {
        const image = frame.state().get("selection").first().toJSON();
        url.value = image.url;
        preview.src = image.sizes?.medium?.url || image.url;
        preview.classList.add("has-image");
        alt.value = image.alt || "";
        remove.hidden = false;
      });
      frame.open();
    });
    remove.addEventListener("click", () => {
      url.value = "";
      alt.value = "";
      caption.value = "";
      preview.removeAttribute("src");
      preview.classList.remove("has-image");
      remove.hidden = true;
    });
  });

  document.querySelectorAll(".vidya-cms-status-select").forEach((select) => {
    const form = select.closest("form");
    const button = form?.querySelector("button[type='submit']");
    if (!button) return;
    const kind = form.querySelector("input[name='kind']")?.value;
    const label = kind === "events" ? "Event" : kind === "achievements" ? "Achievement" : "FAQ";
    const updateLabel = () => {
      button.textContent = select.value === "draft" ? "Save as draft" : label === "FAQ" ? "Publish FAQ" : `Publish ${label}`;
    };
    select.addEventListener("change", updateLabel);
    updateLabel();
  });

  const imageId = document.getElementById("vidya-blog-image-id");
  const imagePreview = document.getElementById("vidya-blog-image-preview");
  const selectImage = document.getElementById("vidya-blog-select-image");
  const removeImage = document.getElementById("vidya-blog-remove-image");
  if (imageId && imagePreview && selectImage && window.wp?.media) {
    let frame;
    selectImage.addEventListener("click", () => {
      frame = window.wp.media({ title: "Choose a featured image", button: { text: "Use this image" }, library: { type: "image" }, multiple: false });
      frame.on("select", () => {
        const selected = frame.state().get("selection").first().toJSON();
        imageId.value = selected.id;
        imagePreview.src = selected.sizes?.medium?.url || selected.url;
        imagePreview.classList.add("has-image");
        if (removeImage) removeImage.hidden = false;
        const altInput = document.querySelector("input[name='blog_image_alt']");
        if (altInput && !altInput.value) altInput.value = selected.alt || selected.title || "";
      });
      frame.open();
    });
  }
  removeImage?.addEventListener("click", () => {
    if (imageId) imageId.value = "";
    if (imagePreview) { imagePreview.removeAttribute("src"); imagePreview.classList.remove("has-image"); }
    removeImage.hidden = true;
  });

  const blogMobileImageId = document.getElementById("vidya-blog-mobile-image-id");
  const blogMobilePreview = document.getElementById("vidya-blog-mobile-image-preview");
  const blogMobileSelect = document.getElementById("vidya-blog-mobile-select-image");
  const blogMobileRemove = document.getElementById("vidya-blog-mobile-remove-image");
  blogMobileSelect?.addEventListener("click", () => {
    if (!window.wp?.media) return;
    const frame = window.wp.media({ title: "Choose a mobile blog hero image", button: { text: "Use this mobile image" }, library: { type: "image" }, multiple: false });
    frame.on("select", () => {
      const selected = frame.state().get("selection").first().toJSON();
      blogMobileImageId.value = selected.id;
      blogMobilePreview.src = selected.sizes?.medium?.url || selected.url;
      blogMobilePreview.classList.add("has-image");
      if (blogMobileRemove) blogMobileRemove.hidden = false;
    });
    frame.open();
  });
  blogMobileRemove?.addEventListener("click", () => {
    if (blogMobileImageId) blogMobileImageId.value = "";
    if (blogMobilePreview) { blogMobilePreview.removeAttribute("src"); blogMobilePreview.classList.remove("has-image"); }
    blogMobileRemove.hidden = true;
  });
})();
