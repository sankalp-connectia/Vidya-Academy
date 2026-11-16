import { Link } from "react-router-dom";
import { homeCopy } from "../../../../cms/siteContent.js";
import HomeImage from "../HomeImage";
import "./LearningPillars.css";

const programLinks = [
  "/learning-pathways#pyp",
  "/learning-pathways#myp",
  "/learning-pathways#dp",
];
const fallbackPillarImages = [
  "/mascots/mascot-body.png",
  "/mascots/mascot-mind.png",
  "/mascots/mascot-heart.png",
];

export default function LearningPillars() {
  const pillars = Array.isArray(homeCopy.learningPillars) ? homeCopy.learningPillars : [];
  const heading = Array.isArray(homeCopy.learningPillarsHeading) ? homeCopy.learningPillarsHeading : [];

  const logo = homeCopy.learningPillarsLogo;
  const logoImage = logo?.image || "/brand/trividha-shikshana.webp";

  return (
    <section
      className="learning-pillars"
      aria-labelledby="learning-pillars-title"
    >
      <div className="learning-pillars__inner">
        <header className="learning-pillars__header">
          <h2 id="learning-pillars-title" className="site-section-title">
            <span>{heading[0]}</span>{" "}
            <span className="learning-pillars__heading-accent">{heading[1]}</span>
          </h2>
          {logoImage && <img
            className="learning-pillars__logo"
            src={logoImage}
            alt={logo?.imageAlt ?? "Trividha Shikshana, Vidya Academy’s holistic education for the body, mind, heart and soul."}
            width="1355"
            height="1160"
            loading="lazy"
            decoding="async"
          />}
        </header>

        <div className="learning-pillars__grid">
          {pillars.map((pillar, index) => {
            return (
              <Link
                className={`learning-pillar learning-pillar--${index + 1}`}
                key={`${pillar.title}-${index}`}
                to={programLinks[index] || "/learning-pathways"}
                aria-label={`${pillar.title}, ${pillar.subtitle}. Explore in Programs.`}
              >
                <div className="learning-pillar__art" aria-hidden="true">
                  <HomeImage
                    className="learning-pillar__mascot"
                    src={pillar.image || fallbackPillarImages[index]}
                    mobileImage={pillar.mobileImage}
                    alt=""
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="learning-pillar__copy">
                  <h3>{pillar.title}</h3>
                  <p className="learning-pillar__subtitle">{pillar.subtitle}</p>
                  <p className="learning-pillar__description">{pillar.description}</p>
                  <span className="learning-pillar__link">Explore</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
