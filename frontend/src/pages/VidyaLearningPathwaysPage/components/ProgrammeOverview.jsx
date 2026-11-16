import { learningStages } from "../../../cms/siteContent.js";
import { Link } from "react-router-dom";
import "./ProgrammeOverview.css";





function ArrowIcon() {
  return (
    <svg
      className="programme-overview__arrow"
      width="15"
      height="15"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M3 9H14"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      <path
        d="M10 5L14 9L10 13"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}


export default function ProgrammeOverview() {
  return (
    <section
      className="programme-overview"
      aria-label="Vidya Academy learning stages"
    >

      <div className="programme-overview__grid">

        {learningStages.map(
          (item) => (
            <article
              key={item.id}
              id={item.id}
              className="programme-overview__card pathways-reveal"
            >

              <div className="programme-overview__top">

                <span className="programme-overview__range">
                  {item.range}
                </span>


                <h2 className="programme-overview__name">
                  {item.title}
                </h2>

              </div>


              <div
                className="programme-overview__divider"
              />


              <p className="programme-overview__summary">
                {item.summary}
              </p>


              <Link
                to={`/learning-pathways#${item.exploreTarget}`}
                className="programme-overview__link"
              >

                <span className="programme-overview__link-text">
                  Explore
                </span>


                <ArrowIcon />

              </Link>

            </article>
          )
        )}

      </div>

    </section>
  );
}
