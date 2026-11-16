import { upcomingCampus } from "../../../../cms/siteContent.js";
import "./UpcomingCampus.css";

export default function UpcomingCampus() {
  if (!upcomingCampus) return null;

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
              alt={upcomingCampus.imageAlt || "Illustrative views of planned school facilities: a library, auditorium, classroom, dining hall, swimming pool and sports court"}
              loading="lazy"
              decoding="async"
            />
            <figcaption>Illustrative imagery for planned spaces</figcaption>
          </figure>

          <div className="upcoming-campus__groups">
            {upcomingCampus.groups?.map((group) => (
              <section className="upcoming-campus__group" key={group.id}>
                <h3>{group.title}</h3>
                <ul>
                  {group.facilities?.map((facility) => (
                    <li key={facility}>{facility}</li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
