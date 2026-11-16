import { learningPathwaysCopy } from "../../../cms/siteContent.js";
import "./ContinuumSection.css";


export default function ContinuumSection({
  programmes,
}) {
  return (
    <section className="continuum-section">

      <div className="continuum-section__inner">

        {/* =========================================
            TITLE
        ========================================= */}

        <h2 className="site-section-title continuum-section__title pathways-reveal">
          {learningPathwaysCopy.continuum.title[0]}{" "}
          <span>{learningPathwaysCopy.continuum.title[1]}</span>
        </h2>


        {/* =========================================
            CONTINUUM LINE
        ========================================= */}

        <div className="continuum-section__line pathways-reveal">

          {programmes.map(
            (
              item,
              index
            ) => (
              <article
                key={item.id}
                className={`
                  continuum-section__item
                  continuum-section__item--${index + 1}
                `}
              >

                <span className="continuum-section__dot" />


                <strong>
                  {item.short}
                </strong>


                <span className="continuum-section__ages">
                  {item.ages}
                </span>


                <p>
                  {learningPathwaysCopy.continuum.programmeDescriptions[item.id]}
                </p>

              </article>
            )
          )}

        </div>


        {/* =========================================
            CLOSING
        ========================================= */}

        <p className="continuum-section__closing pathways-reveal">
          {learningPathwaysCopy.continuum.closing}
        </p>


        {/* =========================================
            BOTTOM CIRCLES
        ========================================= */}

        <div
          className="continuum-section__symbol pathways-reveal"
          aria-label="Learning continuum"
        >

          <span />

          <span />

          <span />

          <span />

        </div>

      </div>

    </section>
  );
}