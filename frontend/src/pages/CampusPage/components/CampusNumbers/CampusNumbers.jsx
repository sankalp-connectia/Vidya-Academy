import { campusCopy } from "../../../../cms/siteContent.js";
import { campusFeatureImage, campusStats } from "../../../../cms/siteContent.js";
import {
  useLayoutEffect,
  useRef,
} from "react";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "./CampusNumbers.css";

gsap.registerPlugin(ScrollTrigger);


/* =========================================================
   FEATURE IMAGE
========================================================= */

;


/* =========================================================
   CAMPUS STATS
========================================================= */




/* =========================================================
   COMPONENT
========================================================= */

const CampusNumbers = () => {
  const sectionRef =
    useRef(null);

  const visualRef =
    useRef(null);

  const imageRef =
    useRef(null);

  const captionRef =
    useRef(null);

  const statsSectionRef =
    useRef(null);

  const headingRef =
    useRef(null);

  const statRefs =
    useRef([]);


  /* =========================================================
     GSAP
  ========================================================= */

  useLayoutEffect(() => {
    const section =
      sectionRef.current;

    const visual =
      visualRef.current;

    const image =
      imageRef.current;

    const caption =
      captionRef.current;

    const statsSection =
      statsSectionRef.current;

    const heading =
      headingRef.current;


    if (
      !section ||
      !visual ||
      !image ||
      !statsSection
    ) {
      return;
    }


    const mm =
      gsap.matchMedia();


    const ctx =
      gsap.context(() => {

        /* =====================================================
           DESKTOP IMAGE PARALLAX
        ===================================================== */

        mm.add(
          "(min-width: 769px)",

          () => {
            gsap.fromTo(
              image,

              {
                scale:
                  1.05,

                yPercent:
                  -2,
              },

              {
                scale:
                  1.01,

                yPercent:
                  2,

                ease:
                  "none",

                scrollTrigger: {
                  trigger:
                    visual,

                  start:
                    "top bottom",

                  end:
                    "bottom top",

                  scrub:
                    0.85,

                  invalidateOnRefresh:
                    true,
                },
              }
            );
          }
        );


        /* =====================================================
           MOBILE IMAGE
        ===================================================== */

        mm.add(
          "(max-width: 768px)",

          () => {
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
                    visual,

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
        );


        /* =====================================================
           IMAGE STATEMENT
        ===================================================== */

        if (
          caption
        ) {
          gsap.fromTo(
            caption,

            {
              opacity:
                0,

              y:
                18,
            },

            {
              opacity:
                1,

              y:
                0,

              duration:
                0.85,

              ease:
                "power3.out",

              scrollTrigger: {
                trigger:
                  visual,

                start:
                  "top 72%",

                once:
                  true,
              },
            }
          );
        }


        /* =====================================================
           STATS HEADING
        ===================================================== */

        if (
          heading
        ) {
          gsap.fromTo(
            heading,

            {
              opacity:
                0,

              y:
                20,
            },

            {
              opacity:
                1,

              y:
                0,

              duration:
                0.8,

              ease:
                "power3.out",

              scrollTrigger: {
                trigger:
                  statsSection,

                start:
                  "top 86%",

                once:
                  true,
              },
            }
          );
        }


        /* =====================================================
           STATS
        ===================================================== */

        const items =
          statRefs.current.filter(
            Boolean
          );


        gsap.fromTo(
          items,

          {
            opacity:
              0,

            y:
              22,
          },

          {
            opacity:
              1,

            y:
              0,

            duration:
              0.72,

            stagger:
              0.055,

            ease:
              "power3.out",

            scrollTrigger: {
              trigger:
                statsSection,

              start:
                "top 80%",

              once:
                true,
            },
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


    if (
      !image.complete
    ) {
      image.addEventListener(
        "load",
        refresh
      );
    }


    document.fonts
      ?.ready
      ?.then(
        refresh
      );


    window.addEventListener(
      "resize",
      handleResize,
      {
        passive: true,
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


      image.removeEventListener(
        "load",
        refresh
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
     JSX
  ========================================================= */

  return (
    <section
      ref={sectionRef}
      className="campus-numbers"
    >

      {/* =====================================================
          FULL WIDTH FEATURE IMAGE
      ===================================================== */}

      <div
        ref={visualRef}
        className="campus-numbers-visual"
      >

        <img
          ref={imageRef}

          src={campusFeatureImage}

          alt="Vidya Academy students practising karate in protective gloves"

          className="campus-numbers-image"

          loading="lazy"

          decoding="async"

          draggable="false"
        />


        <div
          className="campus-numbers-overlay"
          aria-hidden="true"
        />


        <p
          ref={captionRef}
          className="campus-numbers-visual-caption"
        >

          Every student finds their{" "}<span>footing.</span>

        </p>

      </div>


      {/* =====================================================
          NUMBERS
      ===================================================== */}

      <section
        ref={statsSectionRef}
        className="campus-numbers-stats"
      >

        <div className="campus-numbers-inner">

          <div
            ref={headingRef}
            className="campus-numbers-heading"
          >

            <h2 className="site-section-title">
              {campusCopy.numbers.title}
            </h2>

          </div>


          <div className="campus-numbers-grid">

            {campusStats.map(
              (
                stat,
                index
              ) => (

                <article
                  key={stat.id}

                  ref={
                    (element) => {
                      statRefs.current[
                        index
                      ] =
                        element;
                    }
                  }

                  className="campus-number-item"
                >

                  <strong>
                    {stat.value}
                  </strong>


                  <span>
                    {stat.label}
                  </span>

                </article>

              )
            )}

          </div>

        </div>

      </section>

    </section>
  );
};


export default CampusNumbers;