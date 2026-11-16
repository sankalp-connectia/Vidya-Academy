import { learningPathwaysCopy } from "../../../cms/siteContent.js";
import "./CareerGuidance.css";

const experiencePhotos = [
  { src: "/images/school/circle-time.webp", alt: "Children sharing songs and rhymes in a circle", label: "Rhymes & chimes" },
  { src: "/images/school/friends-on-the-lawn.webp", alt: "Children spending time together outdoors", label: "Garden visits" },
  { src: "/images/school/students-applauding.webp", alt: "Children celebrating a school activity together", label: "Festivals & celebrations" },
  { src: "/images/school/lunchtime.webp", alt: "Children learning to share and enjoy food together", label: "Little Chef" },
  { src: "/images/school/outdoor-group-play.webp", alt: "Children enjoying movement and group activities outdoors", label: "Dance & field trips" },
];

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
          {experiencePhotos.map((photo, index) => (
            <figure className={`career-guidance__tile career-guidance__tile--${index + 1}`} key={photo.src}>
              <img src={photo.src} alt={photo.alt} loading="lazy" decoding="async" />
              <figcaption>{photo.label}</figcaption>
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

          <aside className="career-guidance__approach">
            <h3>{learningPathwaysCopy.careerGuidance.classroomApproach.title}</h3>
            <p>{learningPathwaysCopy.careerGuidance.classroomApproach.description}</p>
          </aside>
        </div>
      </div>
    </section>
  );
}
