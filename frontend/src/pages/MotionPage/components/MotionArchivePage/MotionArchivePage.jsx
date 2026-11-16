import { Link } from "react-router-dom";
import { motionFallbackImage as FALLBACK_IMAGE } from "../../../../cms/siteContent.js";
import ResponsiveImage from "../../../../components/ResponsiveImage/ResponsiveImage";
import "./MotionArchivePage.css";

function handleImageError(event) {
  const image = event.currentTarget;
  if (image.dataset.fallbackApplied === "true") return;
  image.dataset.fallbackApplied = "true";
  if (FALLBACK_IMAGE) image.src = FALLBACK_IMAGE;
  else { image.removeAttribute("src"); image.hidden = true; }
}

export default function MotionArchivePage({ page, items, detailBase }) {
  const hasHero = Boolean(page.heroImage);

  return (
    <main className={`motion-archive${hasHero ? " motion-archive--featured" : ""}`}>
      <div className="motion-archive__inner">
        {hasHero ? (
          <header className="motion-archive__hero">
            <ResponsiveImage src={page.heroImage} mobileImage={page.mobileImage} alt={page.heroImageAlt ?? ""} onError={handleImageError} />
            <span className="motion-archive__hero-shade" aria-hidden="true" />
            <div className="motion-archive__hero-copy">
              <h1 className="site-page-title">{page.title}</h1>
              <p>{page.description}</p>
            </div>
          </header>
        ) : (
          <>
            {page.backLabel ? <Link className="motion-archive__back" to="/motion">{page.backLabel}</Link> : null}
            <header className={`motion-archive__heading${page.headingAlign === "center" ? " motion-archive__heading--center" : ""}`}>
              {page.eyebrow ? <p>{page.eyebrow}</p> : null}
              <h1 className="site-page-title">{page.title}</h1>
              <div>{page.description}</div>
            </header>
          </>
        )}
        {items.length ? (
          <div className="motion-archive__grid">
            {items.map((item) => (
              <article className="motion-archive-card" key={item.slug}>
                <Link className="motion-archive-card__image" to={`${detailBase}/${item.slug}`} aria-label={`Read ${item.title}`}>
                  <img src={item.image} alt={item.imageAlt} loading="lazy" decoding="async" onError={handleImageError} />
                </Link>
                <div className="motion-archive-card__body">
                  {item.category ? <p className="motion-archive-card__category">{item.category}</p> : null}
                  <h2><Link to={`${detailBase}/${item.slug}`}>{item.title}</Link></h2>
                  {item.description ? <p className="motion-archive-card__description">{item.description}</p> : null}
                  <Link className="motion-archive-card__link" to={`${detailBase}/${item.slug}`}>{page.readMoreLabel}</Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <section className="motion-archive__empty" aria-live="polite">
            <span className="motion-archive__empty-mark" aria-hidden="true">✳</span>
            <p className="motion-archive__empty-kicker">{hasHero ? "Coming soon" : page.title}</p>
            <h2>{page.emptyTitle || `No ${detailBase.includes("achievements") ? "achievements" : "events"} yet`}</h2>
            <p>{page.emptyDescription || "New updates will appear here soon."}</p>
          </section>
        )}
        {!hasHero && page.backLabel ? <Link className="motion-archive__back motion-archive__back--bottom" to="/motion"><span aria-hidden="true">←</span>{page.backLabel}</Link> : null}
      </div>
    </main>
  );
}
