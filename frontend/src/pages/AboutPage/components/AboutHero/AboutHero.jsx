import { aboutCopy, aboutImages } from "../../../../cms/siteContent.js";
import ResponsiveImage from "../../../../components/ResponsiveImage/ResponsiveImage";
import "./AboutHero.css";

export default function AboutHero() {
  const { hero } = aboutCopy;
  const mainImage = aboutImages.find((image) => image.focus) ?? aboutImages[0];
  const detailImage = aboutImages.find((image) => image.id === "02") ?? aboutImages[1];

  return (
    <section className="about-hero" aria-labelledby="about-hero-title">
      <div className="about-hero__inner">
        <div className="about-hero__copy">
          <p className="about-hero__eyebrow">{hero.eyebrow}</p>
          <h1 id="about-hero-title" className="site-page-title">
            {hero.lines.map((line, index) => (
              <span key={`${line}-${index}`}>{line}</span>
            ))}
            <span className="about-hero__accent">{hero.accent}</span>
          </h1>
          <p className="about-hero__description">{hero.description}</p>
          <span className="about-hero__rule" aria-hidden="true" />
        </div>

        <div className="about-hero__visual">
          <figure className="about-hero__main-image">
            <ResponsiveImage src={mainImage.src} mobileImage={mainImage.mobileImage} alt={mainImage.alt} fetchPriority="high" />
          </figure>
          <figure className="about-hero__detail-image">
            <ResponsiveImage src={detailImage.src} mobileImage={detailImage.mobileImage} alt={detailImage.alt} />
          </figure>
          <p className="about-hero__caption">{hero.galleryCaption}</p>
        </div>
      </div>
    </section>
  );
}
