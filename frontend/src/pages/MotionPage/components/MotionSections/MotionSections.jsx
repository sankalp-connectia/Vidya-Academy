import { Link } from "react-router-dom";
import { motionSections } from "../../../../cms/siteContent.js";
import "./MotionSections.css";

export default function MotionSections() {
  return (
    <section className="motion-sections" id="motion-events" aria-labelledby="motion-sections-title">
      <div className="motion-sections__inner">
        <header className="motion-sections__heading">
          <p className="motion-sections__eyebrow">{motionSections.eyebrow}</p>
          <h2 id="motion-sections-title" className="site-section-title">{motionSections.title}</h2>
          {motionSections.introduction ? <p className="motion-sections__intro">{motionSections.introduction}</p> : null}
        </header>
        <div className="motion-sections__grid">
          {motionSections.cards.map((card, index) => (
            <Link className={`motion-section-card motion-section-card--${card.id}`} to={card.href} key={card.id} style={{ "--card-index": index }}>
              <span className="motion-section-card__media">
                <img src={card.image} alt={card.imageAlt} loading="lazy" decoding="async" />
              </span>
              <span className="motion-section-card__copy">
                <span className="motion-section-card__title">{card.title}</span>
                <span className="motion-section-card__description">{card.description}</span>
                <span className="motion-section-card__link">{card.linkLabel}<span aria-hidden="true">↗</span></span>
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
