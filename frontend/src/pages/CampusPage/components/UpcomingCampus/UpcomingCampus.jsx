import { upcomingCampus } from "../../../../cms/siteContent.js";
import "./UpcomingCampus.css";

const existingFacilities = new Set([
  "auditorium",
  "high school classrooms",
  "foundation and secondary classrooms",
  "library",
]);

export default function UpcomingCampus() {
  if (!upcomingCampus) return null;

  const groups = Array.isArray(upcomingCampus.groups) ? upcomingCampus.groups : [];
  const facilities = groups
    .flatMap((group) => Array.isArray(group?.facilities) ? group.facilities : [])
    .filter((facility) => typeof facility === "string" && facility.trim() && !existingFacilities.has(facility.trim().toLowerCase()));

  return (
    <section className="upcoming-campus" aria-labelledby="upcoming-campus-title">
      <div className="upcoming-campus__inner">
        <header className="upcoming-campus__intro">
          <h2 id="upcoming-campus-title">{upcomingCampus.title}</h2>
          <p className="upcoming-campus__description">{upcomingCampus.description}</p>
        </header>

        <div className="upcoming-campus__content">
          <figure className="upcoming-campus__visual">
            <img
              src={upcomingCampus.image || "/media/upcoming-campus-facilities.jpg"}
              alt={upcomingCampus.imageAlt || "Illustrative collage of school interiors and outdoor facilities"}
              loading="lazy"
              decoding="async"
            />
            <figcaption>Illustrative imagery for planned spaces</figcaption>
          </figure>

          <section className="upcoming-campus__group">
            <h3>Planned facilities</h3>
            <ul>
              {facilities.map((facility) => (
                <li key={facility}>{facility}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </section>
  );
}
