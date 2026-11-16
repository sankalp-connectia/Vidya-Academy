import HomeImage from "../HomeImage";
import { homeCopy, homeMedia } from "../../../../cms/siteContent.js";
import { galleryImages } from "../../../../cms/siteContent.js";
import "./About.css";


/* =========================================================
   GALLERY
========================================================= */

/* =========================================================
   CURVE DATA
========================================================= */

const curveLevels = [
  { inset: -120, apex: 8 },
  { inset: -82, apex: 42 },
  { inset: -44, apex: 76 },
  { inset: -6, apex: 110 },

  { inset: 32, apex: 144 },
  { inset: 70, apex: 178 },
  { inset: 108, apex: 212 },
  { inset: 146, apex: 246 },

  { inset: 184, apex: 280 },
  { inset: 222, apex: 314 },
  { inset: 260, apex: 348 },
  { inset: 298, apex: 382 },

  { inset: 336, apex: 416 },
  { inset: 374, apex: 450 },
  { inset: 412, apex: 484 },
  { inset: 450, apex: 518 },

  { inset: 488, apex: 552 },
  { inset: 526, apex: 586 },
  { inset: 564, apex: 620 },
  { inset: 602, apex: 654 },

  { inset: 640, apex: 688 },
  { inset: 678, apex: 722 },
];


/* =========================================================
   CURVE PATH
========================================================= */

const buildReverseUPath = (
  inset,
  apex
) => {
  const left =
    inset;

  const right =
    1600 - inset;

  const center =
    800;

  const bottom =
    1000;


  const shoulder =
    Math.min(
      850,
      Math.max(
        apex + 185,
        220
      )
    );


  const innerControl =
    Math.max(
      80,
      (
        right -
        left
      ) *
        0.19
    );


  return `
    M ${left} ${bottom}

    C
      ${left}
      ${shoulder}

      ${center - innerControl}
      ${apex}

      ${center}
      ${apex}

    C
      ${center + innerControl}
      ${apex}

      ${right}
      ${shoulder}

      ${right}
      ${bottom}
  `;
};


/* =========================================================
   SECONDARY CURVES
========================================================= */

const secondaryCurveLevels =
  curveLevels
    .slice(
      0,
      -1
    )
    .map(
      (
        current,
        index
      ) => {
        const next =
          curveLevels[
            index + 1
          ];


        return {
          inset:
            (
              current.inset +
              next.inset
            ) /
            2,

          apex:
            (
              current.apex +
              next.apex
            ) /
            2,
        };
      }
    );


/* =========================================================
   CURVE SVG
========================================================= */

function AboutCurveLines() {
  return (
    <svg
      className="vidya-about-curves"
      viewBox="0 0 1600 1000"
      preserveAspectRatio="none"
      aria-hidden="true"
    >

      <g className="vidya-about-curves-main">

        {curveLevels.map(
          (
            curve,
            index
          ) => (

            <path
              key={`main-${index}`}
              d={
                buildReverseUPath(
                  curve.inset,
                  curve.apex
                )
              }
            />

          )
        )}

      </g>


      <g className="vidya-about-curves-secondary">

        {secondaryCurveLevels.map(
          (
            curve,
            index
          ) => (

            <path
              key={`secondary-${index}`}
              d={
                buildReverseUPath(
                  curve.inset,
                  curve.apex
                )
              }
            />

          )
        )}

      </g>

    </svg>
  );
}


/* =========================================================
   ABOUT
========================================================= */

const About = () => {
  const FALLBACK_IMAGE = homeMedia.aboutFallback;


  /* =========================================================
     IMAGE FALLBACK
  ========================================================= */

  const handleImageError =
    (
      event
    ) => {
      const image =
        event.currentTarget;


      if (
        image.dataset.fallbackApplied ===
        "true"
      ) {
        return;
      }


      image.dataset.fallbackApplied =
        "true";


      if (FALLBACK_IMAGE) {
        image.src = FALLBACK_IMAGE;
      } else {
        image.removeAttribute("src");
        image.hidden = true;
      }
    };


  return (
    <section
      className="vidya-about"
      id="about"
    >

      {/* =====================================================
          WHITE CONTENT SECTION
      ===================================================== */}

      <section className="vidya-about-intro">

        <div className="vidya-about-intro-inner">

          {/* ===============================================
              TITLE
          =============================================== */}

          <h2 className="site-section-title vidya-about-intro-title">

            <span className="vidya-about-title-dark">
              {homeCopy.philosophy.title[0]}
            </span>

            {" "}

            <span className="vidya-about-title-light">
              {homeCopy.philosophy.title[1]}
            </span>

          </h2>


          {/* ===============================================
              DIVIDER
          =============================================== */}

          <div className="vidya-about-intro-divider" />


          {/* ===============================================
              CONTENT
          =============================================== */}

          <div className="vidya-about-copy-grid">
            {homeCopy.philosophy.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>


          {/* ===============================================
              CLOSING COPY
          =============================================== */}

          <p className="vidya-about-intro-closing">

            {homeCopy.philosophy.closing}

          </p>


          {/* ===============================================
              VALUES
          =============================================== */}

          <div className="vidya-about-intro-values">

            <span>
              LEARN
            </span>

            <i />

            <span>
              EXPLORE
            </span>

            <i />

            <span>
              GROW
            </span>

          </div>

        </div>

      </section>


      {/* =====================================================
          GREEN IMAGE SECTION

          NORMAL FLOW.
          NO PARALLAX.
          NO STICKY.
          NO PIN.
          NO FAKE SCROLL HEIGHT.
      ===================================================== */}

      <section className="vidya-about-story">

        {/* ===============================================
            CURVED LINE BACKGROUND
        =============================================== */}

        <div
          className="vidya-about-green-lines"
          aria-hidden="true"
        >

          <AboutCurveLines />

        </div>


        {/* ===============================================
            IMAGE GRID
        =============================================== */}

        <div className="vidya-about-gallery">

          {galleryImages.map(
            (
              item,
              index
            ) => (

              <article
                key={
                  item.id
                }

                className={`
                  vidya-about-gallery-card
                  vidya-about-gallery-card--${
                    index + 1
                  }
                `}
              >

                <HomeImage
                  mobileImage={item.mobileImage}
                  src={
                    item.image
                  }

                  alt={
                    item.alt
                  }

                  loading="lazy"

                  decoding="async"

                  draggable="false"

                  onError={
                    handleImageError
                  }
                />


                <div className="vidya-about-gallery-overlay" />


                <div className="vidya-about-gallery-badge">

                  <span>
                    {
                      item.badge
                    }
                  </span>

                </div>

              </article>

            )
          )}

        </div>

      </section>

    </section>
  );
};


export default About;
