import { introText, marqueeImages, groundsImages } from "../../../../cms/siteContent.js";
import {
  useLayoutEffect,
  useRef,
} from "react";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMeasuredMarquee } from "../../useMeasuredMarquee.js";

import "./CampusGrounds.css";


gsap.registerPlugin(
  ScrollTrigger
);


/* =========================================================
   INTRO TEXT
========================================================= */

;


/* =========================================================
   MARQUEE IMAGES

   ALL IMAGES NOW MATCH:
   "THE GROUNDS"

   - SCHOOL GROUND
   - CRICKET FIELD
   - PLAYGROUND
   - SPORTS COURT
========================================================= */




/* =========================================================
   CAMPUS GROUNDS PHOTO GRID

   01 — SCHOOL CRICKET GROUND
   02 — STUDENTS ON SCHOOL FIELD
   03 — CAMPUS SPORTS COMPLEX
   04 — INDIAN SCHOOL FOOTBALL GROUND
   05 — SCHOOL PLAYGROUND
   06 — OUTDOOR SPORTS COURT
   07 — SCHOOL BASKETBALL COURT
========================================================= */




/* =========================================================
   COMPONENT
========================================================= */

const CampusGrounds = () => {
  const sectionRef =
    useRef(null);

  const introSectionRef =
    useRef(null);

  const introTextRef =
    useRef(null);

  const marqueeTrackRef =
    useRef(null);

  const photoRefs =
    useRef([]);

  useMeasuredMarquee(
    marqueeTrackRef,
    "campus-grounds-marquee-group"
  );


  /* =========================================================
     GSAP
  ========================================================= */

  useLayoutEffect(() => {
    const section =
      sectionRef.current;

    const introSection =
      introSectionRef.current;

    const introTextElement =
      introTextRef.current;

    const marqueeTrack =
      marqueeTrackRef.current;


    if (
      !section ||
      !introSection ||
      !introTextElement ||
      !marqueeTrack
    ) {
      return undefined;
    }


    const mm =
      gsap.matchMedia();


    const ctx =
      gsap.context(() => {

        /* =====================================================
           INTRO WORD REVEAL
        ===================================================== */

        const words =
          introTextElement.querySelectorAll(
            ".campus-intro-word"
          );


        gsap.set(
          words,

          {
            color:
              "rgba(11, 130, 85, 0.14)",
          }
        );


        gsap.to(
          words,

          {
            color:
              "#0b8255",

            stagger: {
              each:
                0.011,
            },

            ease:
              "none",

            scrollTrigger: {
              trigger:
                introSection,

              start:
                "top 76%",

              end:
                "bottom 34%",

              scrub:
                0.7,

              invalidateOnRefresh:
                true,
            },
          }
        );


        /* =====================================================
           DESKTOP TEXT PARALLAX
        ===================================================== */

        mm.add(
          "(min-width: 769px)",

          () => {
            gsap.fromTo(
              introTextElement,

              {
                y:
                  12,
              },

              {
                y:
                  -12,

                ease:
                  "none",

                scrollTrigger: {
                  trigger:
                    introSection,

                  start:
                    "top bottom",

                  end:
                    "bottom top",

                  scrub:
                    0.8,

                  invalidateOnRefresh:
                    true,
                },
              }
            );
          }
        );


        /* =====================================================
           MARQUEE
        ===================================================== */

        /* =====================================================
           DESKTOP PHOTO REVEALS
        ===================================================== */

        mm.add(
          "(min-width: 769px)",

          () => {
            const photos =
              photoRefs.current.filter(
                Boolean
              );


            photos.forEach(
              (
                card,
                index
              ) => {
                const image =
                  card.querySelector(
                    "img"
                  );


                /* =============================================
                   CARD REVEAL
                ============================================= */

                gsap.fromTo(
                  card,

                  {
                    opacity:
                      0,

                    y:
                      36 +
                      (
                        index %
                        3
                      ) *
                      7,
                  },

                  {
                    opacity:
                      1,

                    y:
                      0,

                    ease:
                      "none",

                    scrollTrigger: {
                      trigger:
                        card,

                      start:
                        "top 94%",

                      end:
                        "top 72%",

                      scrub:
                        0.65,

                      invalidateOnRefresh:
                        true,
                    },
                  }
                );


                /* =============================================
                   IMAGE PARALLAX
                ============================================= */

                if (image) {
                  gsap.fromTo(
                    image,

                    {
                      scale:
                        1.05,

                      yPercent:
                        -2.5,
                    },

                    {
                      scale:
                        1,

                      yPercent:
                        2.5,

                      ease:
                        "none",

                      scrollTrigger: {
                        trigger:
                          card,

                        start:
                          "top bottom",

                        end:
                          "bottom top",

                        scrub:
                          0.72,

                        invalidateOnRefresh:
                          true,
                      },
                    }
                  );
                }
              }
            );
          }
        );


        /* =====================================================
           MOBILE PHOTO REVEALS
        ===================================================== */

        mm.add(
          "(max-width: 768px)",

          () => {
            const photos =
              photoRefs.current.filter(
                Boolean
              );


            photos.forEach(
              (
                card,
                index
              ) => {
                const image =
                  card.querySelector(
                    "img"
                  );


                gsap.fromTo(
                  card,

                  {
                    opacity:
                      0,

                    y:
                      20 +
                      (
                        index %
                        2
                      ) *
                      4,
                  },

                  {
                    opacity:
                      1,

                    y:
                      0,

                    duration:
                      0.68,

                    ease:
                      "power3.out",

                    scrollTrigger: {
                      trigger:
                        card,

                      start:
                        "top 92%",

                      once:
                        true,
                    },
                  }
                );


                if (image) {
                  gsap.fromTo(
                    image,

                    {
                      scale:
                        1.025,
                    },

                    {
                      scale:
                        1,

                      ease:
                        "none",

                      scrollTrigger: {
                        trigger:
                          card,

                        start:
                          "top bottom",

                        end:
                          "bottom top",

                        scrub:
                          0.4,

                        invalidateOnRefresh:
                          true,
                      },
                    }
                  );
                }
              }
            );
          }
        );


      }, section);


    /* =====================================================
       REFRESH
    ===================================================== */

    let resizeTimer;


    let previousWidth =
      window.innerWidth;


    const refresh =
      () => {
        ScrollTrigger.refresh();
      };


    const handleResize =
      () => {
        const currentWidth =
          window.innerWidth;


        if (
          Math.abs(
            currentWidth -
            previousWidth
          ) < 3
        ) {
          return;
        }


        previousWidth =
          currentWidth;


        clearTimeout(
          resizeTimer
        );


        resizeTimer =
          setTimeout(
            refresh,
            150
          );
      };


    const images =
      section.querySelectorAll(
        "img"
      );


    images.forEach(
      (image) => {
        if (
          !image.complete
        ) {
          image.addEventListener(
            "load",
            refresh
          );
        }
      }
    );


    document.fonts
      ?.ready
      ?.then(
        refresh
      );


    window.addEventListener(
      "resize",
      handleResize,
      {
        passive:
          true,
      }
    );


    requestAnimationFrame(
      () => {
        requestAnimationFrame(
          refresh
        );
      }
    );


    return () => {
      clearTimeout(
        resizeTimer
      );


      images.forEach(
        (image) => {
          image.removeEventListener(
            "load",
            refresh
          );
        }
      );


      window.removeEventListener(
        "resize",
        handleResize
      );


      mm.revert();

      ctx.revert();
    };

  }, []);


  /* =========================================================
     MARQUEE GROUP
  ========================================================= */

  const renderMarqueeGroup =
    (
      prefix,
      hidden = false
    ) => (

      <div
        className="campus-grounds-marquee-group"

        aria-hidden={
          hidden
            ? "true"
            : undefined
        }
      >

        {marqueeImages.map(
          (
            image,
            index
          ) => (

            <div
              key={`${prefix}-${index}`}
              className="campus-grounds-marquee-item"
            >

              <div className="campus-marquee-thumb">

                <img
                  src={image}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  draggable="false"
                />

              </div>


              <span>
                The Grounds
              </span>

            </div>

          )
        )}

      </div>

    );


  /* =========================================================
     JSX
  ========================================================= */

  return (
    <section
      ref={sectionRef}
      className="campus-grounds"
    >

      {/* =====================================================
          INTRO
      ===================================================== */}

      <section
        ref={introSectionRef}
        className="campus-intro"
      >

        <div className="campus-intro-inner">

          <p
            ref={introTextRef}
            className="campus-intro-text"
          >

            {introText
              .split(" ")
              .map(
                (
                  word,
                  index
                ) => (

                  <span
                    key={`${word}-${index}`}
                    className="campus-intro-word"
                  >
                    {word}{" "}
                  </span>

                )
              )}

          </p>

        </div>

      </section>


      {/* =====================================================
          GROUNDS
      ===================================================== */}

      <section className="campus-grounds-main">

        {/* =================================================
            MARQUEE
        ================================================= */}

        <div className="campus-grounds-marquee-section">

          <div className="campus-grounds-marquee-shell">

            <div
              ref={marqueeTrackRef}
              className="campus-grounds-marquee-track"
            >

              {renderMarqueeGroup(
                "first"
              )}


              {renderMarqueeGroup(
                "second",
                true
              )}

              {renderMarqueeGroup(
                "third",
                true
              )}

              {renderMarqueeGroup(
                "fourth",
                true
              )}

            </div>

          </div>

        </div>


        {/* =================================================
            DESCRIPTION
        ================================================= */}

        <div className="campus-grounds-caption">

          <p>
            Every outdoor space is a learning
            space. The architecture doesn't
            separate sport from study. It
            refuses to.
          </p>

        </div>


        {/* =================================================
            PHOTO GRID
        ================================================= */}

        <div className="campus-photo-grid">

          {groundsImages.map(
            (
              image,
              index
            ) => (

              <figure
                key={image.id}

                ref={
                  (element) => {
                    photoRefs.current[
                      index
                    ] =
                      element;
                  }
                }

                className={`
                  campus-photo
                  ${image.className}
                `}
              >

                <img
                  src={image.src}
                  alt={image.alt}

                  loading={
                    index < 3
                      ? "eager"
                      : "lazy"
                  }

                  decoding="async"

                  draggable="false"
                />

              </figure>

            )
          )}

        </div>

      </section>

    </section>
  );
};


export default CampusGrounds;
