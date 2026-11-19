import { additionalExperienceImages, learningPathwaysCopy } from "../../../cms/siteContent.js";
import "./CareerGuidance.css";

export default function CareerGuidance() {
  const sourcePoints = Array.isArray(learningPathwaysCopy.careerGuidance.points)
    ? learningPathwaysCopy.careerGuidance.points
    : [];
  const points = sourcePoints.length > 5
    ? [...sourcePoints.slice(0, 4), sourcePoints.slice(4).join(" · ")]
    : sourcePoints;

  return (
    <section className="career-guidance" aria-labelledby="career-guidance-title">
      <div className="career-guidance__inner">
        <div className="career-guidance__gallery" aria-label="Additional learning experiences">
          {additionalExperienceImages.slice(0, 5).filter((photo) => photo?.src).map((photo, index) => (
            <figure className={`career-guidance__tile career-guidance__tile--${index + 1}`} key={`${photo.src}-${index}`}>
              <img src={photo.src} alt={photo.alt || photo.label || "An additional learning experience at Vidya Academy"} loading="lazy" decoding="async" />
            </figure>
          ))}
        </div>

        <div className="career-guidance__copy pathways-reveal">
          <h2 className="site-section-title" id="career-guidance-title">
            {learningPathwaysCopy.careerGuidance.title[0]}{" "}
            <span>{learningPathwaysCopy.careerGuidance.title[1]}</span>
          </h2>

          {learningPathwaysCopy.careerGuidance.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}

          <ul>
            {points.map((point) => (
              <li key={point}>
                <span className="career-guidance__dot" aria-hidden="true" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
