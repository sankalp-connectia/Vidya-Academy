import { aboutCopy, aboutEvents as events } from "../../../../cms/siteContent.js";
import "./AboutYear.css";

export default function AboutYear() {
  return (
    <section className="about-year" aria-labelledby="about-year-title">
      <div className="about-year__inner">
        <div className="about-year__intro">
          <p className="about-year__eyebrow">{aboutCopy.year.eyebrow}</p>
          <h2 id="about-year-title" className="site-section-title">{aboutCopy.year.title}</h2>
          <p>{aboutCopy.year.introduction}</p>
        </div>
        <div className="about-year__grid">
          {aboutCopy.year.featuredEventTitles.map((title) => events.find((event) => event.title === title)).filter(Boolean).map((event) => (
            <article className="about-year__card" key={event.title}>
              <div className="about-year__image">
                <img src={event.image} alt={event.title} loading="lazy" decoding="async" />
              </div>
              <div className="about-year__copy">
                <p className="about-year__date">{event.displayDate}</p>
                <h3>{event.title}</h3>
                <p>{event.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
