import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import ArticleGallery from "../../../../components/ArticleGallery/ArticleGallery";
import ResponsiveImage from "../../../../components/ResponsiveImage/ResponsiveImage";
import { motionFallbackImage as FALLBACK_IMAGE } from "../../../../cms/siteContent.js";
import { motionEventsPage } from "../../../../cms/siteContent.js";
import { motionAchievementsPage } from "../../../../cms/siteContent.js";
import NotFoundPage from "../../../NotFoundPage/NotFoundPage";
import "./MotionStoryPage.css";

function handleImageError(event) {
  const image = event.currentTarget;
  if (image.dataset.fallbackApplied) return;
  image.dataset.fallbackApplied = "true";
  if (FALLBACK_IMAGE) image.src = FALLBACK_IMAGE;
  else { image.removeAttribute("src"); image.hidden = true; }
}

export default function MotionStoryPage({ items, type }) {
  const { slug } = useParams();
  const item = items.find((entry) => entry.slug === slug);
  if (!item) return <NotFoundPage />;

  const isEvent = type === "events";
  const page = isEvent ? motionEventsPage : motionAchievementsPage;
  const backPath = isEvent ? "/motion/events" : "/motion/achievements";
  const detailsHtml = typeof item.detailsHtml === "string" ? item.detailsHtml.trim() : "";
  const paragraphs = detailsHtml ? [] : (Array.isArray(item.details) ? item.details.filter((text) => text && text !== item.description) : []);
  const highlights = Array.isArray(item.bulletPoints) ? item.bulletPoints.filter(Boolean) : [];
  const facts = Array.isArray(item.facts) ? item.facts : [];

  return (
    <article className={`motion-story motion-story--${isEvent ? "event" : "achievement"}`}>
      <header className="motion-story__hero">
        <div className="motion-story__hero-inner">
          <div className="motion-story__hero-copy">
            <Link className="motion-story__return" to={backPath}>
              <ArrowLeft size={17} aria-hidden="true" /> {page.detailBackLabel}
            </Link>
            <h1 className="site-page-title">{item.title}</h1>
            {item.category && <p className="motion-story__category">{item.category}</p>}
            {item.description && <p className="motion-story__summary">{item.description}</p>}
          </div>
          <figure className="motion-story__cover-figure">
            <ResponsiveImage
              pictureClassName="motion-story__cover-picture"
              className="motion-story__cover"
              src={item.image || FALLBACK_IMAGE}
              mobileImage={item.mobileImage}
              alt={item.imageAlt || ""}
              width="1440"
              height="1080"
              fetchPriority="high"
              onError={handleImageError}
            />
          {item.imageHeading && <h2 className="motion-story__image-heading">{item.imageHeading}</h2>}
            {item.imageCaption && <figcaption>{item.imageCaption}</figcaption>}
          </figure>
        </div>
      </header>

      <div className="motion-story__content">
        {(detailsHtml || paragraphs.length > 0 || highlights.length > 0 || facts.length > 0) && (
          <div className="motion-story__details">
            {(detailsHtml || paragraphs.length > 0) && (
              <section className="motion-story__body" aria-labelledby="motion-story-details">
                <h2 className="site-content-title" id="motion-story-details">{isEvent ? "About the event" : "About the achievement"}</h2>
                {detailsHtml
                  ? <div className="motion-story__rich-content" dangerouslySetInnerHTML={{ __html: detailsHtml }} />
                  : paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
              </section>
            )}
            {(highlights.length > 0 || facts.length > 0) && (
              <aside className="motion-story__highlights" aria-labelledby="motion-story-highlights">
                <h2 className="site-content-title" id="motion-story-highlights">Highlights</h2>
                {highlights.length > 0 && <ul>{highlights.map((point, index) => <li key={index}>{point}</li>)}</ul>}
                {facts.length > 0 && (
                  <dl>
                    {facts.map(({ label, value }, index) => <div key={index}><dt>{label}</dt><dd>{value}</dd></div>)}
                  </dl>
                )}
              </aside>
            )}
          </div>
        )}

        <ArticleGallery images={item.gallery} headingId="motion-story-gallery" title={item.galleryTitle || "School photos"} />

        <footer className="motion-story__footer">
          <Link className="motion-story__enquiry" to="/contact#enquiry">
            {page.enquiryLabel} <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
        </footer>
      </div>
    </article>
  );
}
