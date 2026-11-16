import { learningPathwaysCopy } from "../../../cms/siteContent.js";
import "./LearningJourney.css";

export default function LearningJourney({
  stages,
}) {
  return (
    <section className="learning-journey">

      <div className="learning-journey__inner">

        <span className="learning-journey__eyebrow pathways-reveal">
          {learningPathwaysCopy.journey.eyebrow}
        </span>


        <h2 className="site-section-title learning-journey__title pathways-reveal">
          {learningPathwaysCopy.journey.title[0]}
          <br />
          {learningPathwaysCopy.journey.title[1]}
        </h2>


        <div className="learning-journey__timeline pathways-reveal">

          {stages.map(
            (stage) => (
              <article
                key={stage.id}
                className="learning-journey__item"
              >

                <span className="learning-journey__dot" />


                <strong>
                  {stage.cardTitle}
                </strong>


                <span>
                  {stage.label}
                </span>

              </article>
            )
          )}

        </div>


        <p className="learning-journey__closing pathways-reveal">
          {learningPathwaysCopy.journey.closing}
        </p>

      </div>

    </section>
  );
}
