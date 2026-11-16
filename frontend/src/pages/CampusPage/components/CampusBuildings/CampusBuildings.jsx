import { campusFallbackBuildingImage as FALLBACK_BUILDING_IMAGE, buildingMarqueeImages, buildingImages } from "../../../../cms/siteContent.js";
import {
  useLayoutEffect,
  useRef,
} from "react";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMeasuredMarquee } from "../../useMeasuredMarquee.js";

import "./CampusBuildings.css";


gsap.registerPlugin(
  ScrollTrigger
);


/* =========================================================
   FALLBACK

   Used automatically if any remote image fails.
========================================================= */

;


/* =========================================================
   BUILDING MARQUEE IMAGES

   01 — SCHOOL BUILDING
   02 — INDIAN SCHOOL VERANDA
   03 — SCHOOL AUDITORIUM
   04 — ACADEMIC BUILDING
========================================================= */




/* =========================================================
   BUILDING PHOTO GRID

   01 — SCHOOL FRONT / MAIN BLOCK
   02 — INDIAN VERANDA / CORRIDOR
   03 — SCHOOL AUDITORIUM
   04 — SCHOOL HALLWAY
   05 — CAMPUS COURTYARD / BUILDING
   06 — ACADEMIC BLOCK
   07 — INDIAN SCHOOL AUDITORIUM
========================================================= */




/* =========================================================
   COMPONENT
========================================================= */

const CampusBuildings = () => {
  const sectionRef =
    useRef(null);

  const marqueeTrackRef =
    useRef(null);

  const captionRef =
    useRef(null);

  const photoRefs =
    useRef([]);

  useMeasuredMarquee(
    marqueeTrackRef,
    "campus-buildings-marquee-group"
  );


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
        image.dataset
          .fallbackApplied ===
        "true"
      ) {
        return;
      }


      image.dataset
        .fallbackApplied =
        "true";


      if (FALLBACK_BUILDING_IMAGE) {
        image.src = FALLBACK_BUILDING_IMAGE;
      } else {
        image.removeAttribute("src");
        image.hidden = true;
      }
    };


  /* =========================================================
     ANIMATIONS
  ========================================================= */

  useLayoutEffect(() => {
    const section =
      sectionRef.current;

    const marqueeTrack =
      marqueeTrackRef.current;

    const caption =
      captionRef.current;


    if (
      !section ||
      !marqueeTrack
    ) {
      return undefined;
    }


    const mm =
      gsap.matchMedia();


    const ctx =
      gsap.context(() => {

        /* =====================================================
           INFINITE MARQUEE
        ===================================================== */

        /* =====================================================
           SUBTLE MARQUEE DRIFT
        ===================================================== */

        const marqueeShell =
          section.querySelector(
            ".campus-buildings-marquee-shell"
          );


        if (
          marqueeShell
        ) {
          gsap.fromTo(
            marqueeShell,

            {
              x:
                8,
            },

            {
              x:
                -8,

              ease:
                "none",

              scrollTrigger: {
                trigger:
                  section,

                start:
                  "top bottom",

                end:
                  "bottom top",

                scrub:
                  1,

                invalidateOnRefresh:
                  true,
              },
            }
          );
        }


        /* =====================================================
           CAPTION REVEAL
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

              ease:
                "none",

              scrollTrigger: {
                trigger:
                  caption,

                start:
                  "top 92%",

                end:
                  "top 78%",

                scrub:
                  0.5,

                invalidateOnRefresh:
                  true,
              },
            }
          );
        }


        /* =====================================================
           DESKTOP PHOTOS
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

                if (
                  image
                ) {
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
           MOBILE PHOTOS
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


                /* =============================================
                   MOBILE CARD REVEAL
                ============================================= */

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


                /* =============================================
                   MOBILE IMAGE PARALLAX
                ============================================= */

                if (
                  image
                ) {
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


    /* =====================================================
       IMAGE LOAD REFRESH
    ===================================================== */

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


    /* =====================================================
       CLEANUP
    ===================================================== */

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
        className="campus-buildings-marquee-group"

        aria-hidden={
          hidden
            ? "true"
            : undefined
        }
      >

        {buildingMarqueeImages.map(
          (
            image,
            index
          ) => (

            <div
              key={`${prefix}-${index}`}
              className="campus-buildings-marquee-item"
            >

              <div className="campus-buildings-thumb">

                <img
                  src={
                    image
                  }

                  alt=""

                  loading="lazy"

                  decoding="async"

                  draggable="false"

                  onError={
                    handleImageError
                  }
                />

              </div>


              <span>
                The Buildings
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
      className="campus-buildings"
    >

      {/* =====================================================
          MARQUEE
      ===================================================== */}

      <div className="campus-buildings-marquee-section">

        <div className="campus-buildings-marquee-shell">

          <div
            ref={marqueeTrackRef}
            className="campus-buildings-marquee-track"
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


      {/* =====================================================
          DESCRIPTION
      ===================================================== */}

      <div
        ref={captionRef}
        className="campus-buildings-caption"
      >

        <p>

          <span className="campus-buildings-caption-accent">
            Open light. Thoughtful lines.
          </span>

          {" "}

          Spaces designed to give ideas,
          imagination and learning room
          to grow.

        </p>

      </div>


      {/* =====================================================
          BUILDING PHOTOS
      ===================================================== */}

      <div className="campus-buildings-grid">

        {buildingImages.map(
          (
            image,
            index
          ) => (

            <figure
              key={
                image.id
              }

              ref={
                (
                  element
                ) => {
                  photoRefs.current[
                    index
                  ] =
                    element;
                }
              }

              className={`
                campus-building-photo
                ${image.className}
              `}
            >

              <img
                src={
                  image.src
                }

                alt={
                  image.alt
                }

                loading={
                  index <
                  3
                    ? "eager"
                    : "lazy"
                }

                fetchPriority={
                  index === 0
                    ? "high"
                    : "auto"
                }

                decoding="async"

                draggable="false"

                onError={
                  handleImageError
                }
              />

            </figure>

          )
        )}

      </div>

    </section>
  );
};


export default CampusBuildings;
