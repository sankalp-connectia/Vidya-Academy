import { aboutCopy } from "../../../../cms/siteContent.js";
import "./AboutContent.css";

export default function AboutContent() {
  const content = aboutCopy.content;

  return (
    <section className="about-content" aria-label="About Vidya Academy">
      <div className="about-content__inner">
        <div className="about-content__intro">
          {content.introduction.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
        </div>

        <div className="about-content__vision">
          <p className="about-content__eyebrow">Our purpose</p>
          <h2>{content.visionTitle}</h2>
          <p>{content.vision}</p>
        </div>

        <div className="about-content__mission">
          <div>
            <p className="about-content__eyebrow">How we work</p>
            <h2>{content.missionTitle}</h2>
          </div>
          <ul>
            {content.mission.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>

        <div className="about-content__principles">
          <article>
            <p className="about-content__eyebrow">Learning philosophy</p>
            <h2>{content.philosophyTitle}</h2>
            <p>{content.philosophy}</p>
          </article>
          <article>
            <p className="about-content__eyebrow">Together for each child</p>
            <h2>{content.partnershipTitle}</h2>
            <p>{content.partnership}</p>
          </article>
        </div>

        <div className="about-content__why">
          <div className="about-content__why-intro">
            <p className="about-content__eyebrow">A good beginning</p>
            <h2>{content.whyTitle}</h2>
            <p>{content.whyIntroduction}</p>
          </div>
          <ul>
            {content.whyItems.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>

        <aside className="about-content__happiness">
          <span aria-hidden="true">“</span>
          <div>
            <p className="about-content__eyebrow">A joyful school day</p>
            <h2>{content.happinessTitle}</h2>
            <p>{content.happiness}</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
