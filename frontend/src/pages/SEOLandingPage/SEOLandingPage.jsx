import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { seoLandingPages } from "../../cms/siteContent.js";
import NotFoundPage from "../NotFoundPage/NotFoundPage.jsx";
import SEOHead from "../../components/SEO/SEOHead.jsx";
import scopeCss from "./scopeCss.js";
import "./SEOLandingPage.css";

function publishedPages() {
  return seoLandingPages.filter((page) => page && page.slug && page.title && page.status !== "draft");
}

function normalizeLandingPageAssets(page, wordpressUrl) {
  if (!page || typeof page !== "object") return page;
  const publicBase = new URL(import.meta.env.BASE_URL || "/", window.location.origin);
  const normalizePath = (path) => {
    if (/^\/(?:brand|images|mascots|media|videos)\//i.test(path)) return new URL(path.slice(1), publicBase).href;
    if (/^\/wp-content\/uploads\//i.test(path)) return new URL(path, wordpressUrl).href;
    return path;
  };
  const normalizeValue = (value) => {
    if (Array.isArray(value)) return value.map(normalizeValue);
    if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, normalizeValue(child)]));
    if (typeof value === "string" && /^\/(?:images|videos|wp-content\/uploads)\//i.test(value)) return normalizePath(value);
    return value;
  };
  const normalized = normalizeValue(page);
  normalized.contentHtml = String(normalized.contentHtml || "").replace(
    /(\b(?:src|poster|href)\s*=\s*)(["'])(\/(?:brand|images|mascots|media|videos|wp-content\/uploads)\/[^"']*)\2/gi,
    (_, attribute, quote, path) => `${attribute}${quote}${normalizePath(path)}${quote}`,
  );
  normalized.customCss = String(normalized.customCss || "").replace(
    /url\(\s*(["']?)(\/(?:brand|images|mascots|media|videos|wp-content\/uploads)\/[^"')]+)\1\s*\)/gi,
    (_, quote, path) => `url(${quote}${normalizePath(path)}${quote})`,
  );
  return normalized;
}

function internalPath(value, fallback = "/contact#enquiry") {
  const path = String(value || fallback).trim();
  return path.startsWith("/") && !path.startsWith("//") ? path : fallback;
}

function faqSchema(page) {
  const questions = (page.faqs || []).filter((faq) => faq?.question?.trim() && faq?.answer?.trim());
  if (!questions.length) return undefined;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}

export function SEOLandingIndexPage() {
  const pages = publishedPages();
  const schema = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "School guides | Vidya Academy",
    url: `${window.location.origin}/schools`,
  }), []);

  return (
    <main className="school-guides-index">
      <SEOHead
        title="School guides | Vidya Academy Kundapura"
        description="Explore school information and family guides from Vidya Academy in Moodlakatte, Kundapura."
        canonicalPath="/schools"
        noindex={pages.length === 0}
        schema={schema}
      />
      <div className="school-guides-index__shell">
        <header className="school-guides-index__heading">
          <div className="school-guides-index__masthead"><span>Vidya Academy</span><span>Kundapura · Family guides</span></div>
          <h1 className="site-page-title">School guides for families</h1>
          <p>Clear, useful information to help families understand learning, admissions and school life.</p>
        </header>

        {pages.length ? (
          <section className="school-guides-index__list" aria-label="Published school guides">
            {pages.map((page, index) => (
              <article className="school-guide-preview" key={page.slug}>
                <span className="school-guide-preview__index" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
                <div className="school-guide-preview__copy">
                  <p>{page.category || "School guide"}</p>
                  <h2><Link to={`/schools/${page.slug}`}>{page.title}</Link></h2>
                  {page.metaDescription && <p className="school-guide-preview__summary">{page.metaDescription}</p>}
                  <Link className="school-guide-preview__link" to={`/schools/${page.slug}`} aria-label={`Open guide: ${page.title}`}>
                    Open guide <ArrowUpRight size={16} aria-hidden="true" />
                  </Link>
                </div>
                {page.hero?.image && <div className="school-guide-preview__image"><img src={page.hero.image} alt="" loading="lazy" decoding="async" /></div>}
              </article>
            ))}
          </section>
        ) : (
          <section className="school-guides-index__empty" role="status">
            <span>Guides</span>
            <div><h2>School guides are being prepared</h2><p>Published family guides will appear here.</p></div>
          </section>
        )}
      </div>
    </main>
  );
}

export default function SEOLandingPage() {
  const { slug = "" } = useParams();
  const [result, setResult] = useState({ slug: "", page: null, loading: true });

  useEffect(() => {
    const baseUrl = String(import.meta.env.VITE_WORDPRESS_URL || "").trim().replace(/\/+$/, "");
    const localPage = publishedPages().find((item) => item.slug === slug) || null;
    if (!baseUrl) {
      setResult({ slug, page: localPage, loading: false });
      return undefined;
    }
    const controller = new AbortController();
    setResult({ slug, page: null, loading: true });
    fetch(`${baseUrl}/wp-json/vidya/v1/seo-pages/${encodeURIComponent(slug)}`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error(`WordPress returned HTTP ${response.status}.`);
        return response.json();
      })
      .then((page) => setResult({ slug, page: normalizeLandingPageAssets(page, baseUrl), loading: false }))
      .catch(() => {
        if (!controller.signal.aborted) setResult({ slug, page: null, loading: false });
      });
    return () => controller.abort();
  }, [slug]);

  const page = result.slug === slug && !result.loading ? result.page : null;
  const loading = result.slug !== slug || result.loading;

  const schema = useMemo(() => {
    if (!page) return undefined;
    const breadcrumb = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: window.location.origin },
        { "@type": "ListItem", position: 2, name: "School guides", item: `${window.location.origin}/schools` },
        { "@type": "ListItem", position: 3, name: page.title, item: `${window.location.origin}/schools/${page.slug}` },
      ],
    };
    const faq = faqSchema(page);
    return faq ? { "@context": "https://schema.org", "@graph": [breadcrumb, faq] } : breadcrumb;
  }, [page]);

  if (loading) {
    return (
      <>
        <SEOHead title="Loading school guide | Vidya Academy" description="Loading school information from Vidya Academy." canonicalPath={`/schools/${slug}`} noindex />
        <section className="school-guide-loading" role="status" aria-live="polite">Loading this school guide…</section>
      </>
    );
  }

  if (!page) {
    return (
      <>
        <SEOHead title="Page not found | Vidya Academy" description="This school guide could not be found." canonicalPath={`/schools/${slug}`} noindex />
        <NotFoundPage />
      </>
    );
  }

  const hero = page.hero || {};
  const sections = (page.sections || []).filter((section) => section?.heading || section?.paragraphs?.some(Boolean) || section?.bulletPoints?.some(Boolean));
  const faqs = (page.faqs || []).filter((faq) => faq?.question?.trim() && faq?.answer?.trim());
  const contentHtml = typeof page.contentHtml === "string" ? page.contentHtml.trim() : "";
  const customCss = typeof page.customCss === "string" ? page.customCss : "";
  const templateStyle = ["classic", "spotlight", "editorial"].includes(page.templateStyle) ? page.templateStyle : "classic";
  const canonicalPath = internalPath(page.canonicalPath, `/schools/${page.slug}`);
  const description = page.metaDescription?.trim() || hero.intro?.trim() || "Explore school information from Vidya Academy in Kundapura.";
  const image = hero.image?.trim() || "";
  const highlights = (page.highlights || []).filter((item) => item?.label && item?.value);

  if (contentHtml) {
    return (
      <>
        <SEOHead
          title={page.metaTitle?.trim() || page.seoTitle?.trim() || `${page.title} | Vidya Academy`}
          description={description}
          canonicalPath={canonicalPath}
          noindex={page.searchVisibility === "noindex"}
          image={image}
          schema={schema}
        />
        <section id="seo-custom-page" className="seo-custom-landing" aria-label={page.title}>
          {customCss && <style>{scopeCss(customCss, page.slug)}</style>}
          <div className="seo-custom-landing__body" dangerouslySetInnerHTML={{ __html: contentHtml }} />
        </section>
      </>
    );
  }

  return (
    <main className={`school-guide school-guide--${templateStyle}`}>
      <SEOHead
        title={page.metaTitle?.trim() || page.seoTitle?.trim() || `${page.title} | Vidya Academy`}
        description={description}
        canonicalPath={canonicalPath}
        noindex={page.searchVisibility === "noindex"}
        image={image}
        schema={schema}
      />
      <div className="school-guide__shell">
        <header className={`school-guide__opening${image ? " has-image" : ""}`}>
          <div className="school-guide__opening-copy">
            <p className="school-guide__category">{page.category || "Vidya Academy · Kundapura"}</p>
            <h1 className="site-page-title">{hero.heading || page.title}</h1>
            {hero.intro && <p className="school-guide__intro">{hero.intro}</p>}
          </div>
          {image && (
            <figure className="school-guide__cover">
            <picture>
              {hero.mobileImage && <source media="(max-width: 768px)" srcSet={hero.mobileImage} />}
              <img src={image} alt={hero.imageAlt || ""} fetchPriority="high" />
            </picture>
            {hero.imageHeading && <h2 className="school-guide__image-heading">{hero.imageHeading}</h2>}
            {hero.imageCaption && <figcaption>{hero.imageCaption}</figcaption>}
            </figure>
          )}
        </header>

        {highlights.length > 0 && (
          <section className="school-guide__facts" aria-label="At a glance">
            {highlights.map((item, index) => (
              <div className="school-guide__fact" key={`${item.label}-${index}`}>
                <strong>{item.value}</strong><span>{item.label}</span>
              </div>
            ))}
          </section>
        )}

        <div className="school-guide__content">
          {contentHtml ? (
            <article className="school-guide__article school-guide__article--html" dangerouslySetInnerHTML={{ __html: contentHtml }} />
          ) : (
            <article className="school-guide__article">
              {sections.map((section, index) => (
                <section className={`school-guide__section${section.image ? " has-image" : ""}`} key={`${section.heading || "section"}-${index}`}>
                  <div className="school-guide__section-copy">
                    {section.heading && <h2>{section.heading}</h2>}
                    {(section.paragraphs || []).filter(Boolean).map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}
                    {section.bulletPoints?.filter(Boolean).length > 0 && <ul>{section.bulletPoints.filter(Boolean).map((point, pointIndex) => <li key={pointIndex}>{point}</li>)}</ul>}
                  </div>
                  {section.image && <figure className="school-guide__section-figure"><img className="school-guide__section-image" src={section.image} alt={section.imageAlt || ""} loading="lazy" decoding="async" />{section.imageHeading && <h3>{section.imageHeading}</h3>}{section.imageCaption && <figcaption>{section.imageCaption}</figcaption>}</figure>}
                </section>
              ))}
            </article>
          )}
        </div>

        {faqs.length > 0 && (
          <section className="school-guide__faq" aria-labelledby="school-guide-faq-title">
            <div className="school-guide__faq-heading"><span>Useful to know</span><h2 id="school-guide-faq-title">Questions families ask</h2></div>
            <div className="school-guide__faq-list">
              {faqs.map((faq, index) => <details key={`${faq.question}-${index}`}><summary>{faq.question}</summary><p>{faq.answer}</p></details>)}
            </div>
          </section>
        )}

        {page.relatedLinks?.some((item) => item?.label && item?.href) && (
          <nav className="school-guide__related" aria-label="Related school information">
            <h2>Related information</h2>
            <ul>{page.relatedLinks.filter((item) => item?.label && item?.href).map((item, index) => <li key={`${item.href}-${index}`}><Link to={internalPath(item.href, "/")}>{item.label}<ArrowUpRight size={15} aria-hidden="true" /></Link></li>)}</ul>
          </nav>
        )}

        {(page.contactHeading?.trim() || page.contactDescription?.trim()) && (
          <section className="school-guide__contact">
            <div><p>Vidya Academy · Moodlakatte</p>{page.contactHeading?.trim() && <h2>{page.contactHeading}</h2>}{page.contactDescription?.trim() && <p>{page.contactDescription}</p>}</div>
          </section>
        )}
      </div>
    </main>
  );
}
