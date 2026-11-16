import { aboutCopy } from "../../../../cms/siteContent.js";
import {
  useLayoutEffect,
  useRef,
} from "react";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "./AboutFaculty.css";

gsap.registerPlugin(ScrollTrigger);


/* =========================================================
   ABOUT FACULTY
========================================================= */

const AboutFaculty = () => {
  const sectionRef =
    useRef(null);

  const introRef =
    useRef(null);

  const mosaicRef =
    useRef(null);


  useLayoutEffect(() => {
    const section =
      sectionRef.current;

    const intro =
      introRef.current;

    const mosaic =
      mosaicRef.current;


    if (
      !section ||
      !intro ||
      !mosaic
    ) {
      return;
    }


    const mm =
      gsap.matchMedia();


    const ctx =
      gsap.context(() => {

        /* =====================================================
           INTRO
        ===================================================== */

        const introItems =
          intro.querySelectorAll(
            "[data-faculty-reveal]"
          );


        gsap.fromTo(
          introItems,

          {
            opacity:
              0,

            y:
              28,
          },

          {
            opacity:
              1,

            y:
              0,

            duration:
              0.85,

            stagger:
              0.07,

            ease:
              "power3.out",

            scrollTrigger: {
              trigger:
                intro,

              start:
                "top 84%",

              once:
                true,
            },
          }
        );


        /* =====================================================
           DESKTOP / TABLET
        ===================================================== */

        mm.add(
          "(min-width: 769px)",

          () => {
            const cards =
              mosaic.querySelectorAll(
                ".about-faculty-tile"
              );


            gsap.fromTo(
              cards,

              {
                opacity:
                  0,

                y:
                  46,
              },

              {
                opacity:
                  1,

                y:
                  0,

                stagger:
                  0.045,

                ease:
                  "none",

                scrollTrigger: {
                  trigger:
                    mosaic,

                  start:
                    "top 92%",

                  end:
                    "top 61%",

                  scrub:
                    0.5,
                },
              }
            );


            /* =================================================
               IMAGE PARALLAX
            ================================================= */

            const images =
              mosaic.querySelectorAll(
                ".about-faculty-tile--image img"
              );


            images.forEach(
              (image) => {

                gsap.fromTo(
                  image,

                  {
                    scale:
                      1.055,

                    yPercent:
                      -2,
                  },

                  {
                    scale:
                      1,

                    yPercent:
                      2,

                    ease:
                      "none",

                    scrollTrigger: {
                      trigger:
                        image.parentElement,

                      start:
                        "top bottom",

                      end:
                        "bottom top",

                      scrub:
                        0.55,
                    },
                  }
                );

              }
            );
          }
        );


        /* =====================================================
           MOBILE
        ===================================================== */

        mm.add(
          "(max-width: 768px)",

          () => {
            const cards =
              mosaic.querySelectorAll(
                ".about-faculty-tile"
              );


            cards.forEach(
              (
                card,
                index
              ) => {

                gsap.fromTo(
                  card,

                  {
                    opacity:
                      0,

                    y:
                      26,
                  },

                  {
                    opacity:
                      1,

                    y:
                      0,

                    duration:
                      0.7,

                    delay:
                      (
                        index %
                        2
                      ) *
                      0.04,

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


      window.removeEventListener(
        "resize",
        handleResize
      );


      mm.revert();

      ctx.revert();
    };

  }, []);


  return (
    <section
      ref={sectionRef}

      className="about-faculty"
    >

      <div className="about-faculty-inner">

        {/* =================================================
            INTRO

            SMALL "THE FACULTY" TEXT REMOVED
        ================================================= */}

        <div
          ref={introRef}

          className="about-faculty-intro"
        >

          {/* LEFT */}

          <div className="about-faculty-heading-wrap">

            <p className="about-faculty-eyebrow" data-faculty-reveal>
              {aboutCopy.faculty.eyebrow}
            </p>

            <h2
              className="site-section-title about-faculty-heading"

              data-faculty-reveal
            >

              <span className="about-faculty-heading-main">
                {aboutCopy.faculty.title[0]}{" "}
              </span>
              <span className="about-faculty-heading-soft">
                {aboutCopy.faculty.title[1]}
              </span>
              <span className="about-faculty-heading-main">
                {" "}{aboutCopy.faculty.title[2]}
              </span>

            </h2>

          </div>


          {/* =================================================
              QUOTE
          ================================================= */}

          <article
            className="about-faculty-quote-card"

            data-faculty-reveal
          >

            <span className="about-faculty-quote-mark" aria-hidden="true">
              “
            </span>

            <p className="about-faculty-quote-label">
              {aboutCopy.faculty.quoteLabel}
            </p>

            <p className="about-faculty-quote">
              {aboutCopy.faculty.quote}
            </p>


            <div className="about-faculty-author">

              <div className="about-faculty-author-image">

                <img
                  src={aboutCopy.faculty.images.quote.src}

                  alt={aboutCopy.faculty.images.quote.alt}

                  loading="lazy"

                  decoding="async"
                />

              </div>


              <div className="about-faculty-author-copy">

                <strong>
                  {aboutCopy.faculty.author.name}
                </strong>

                <span>
                  {aboutCopy.faculty.author.school}
                </span>

              </div>

            </div>

          </article>

        </div>


        {/* =================================================
            MOSAIC
        ================================================= */}

        <div
          ref={mosaicRef}

          className="about-faculty-mosaic"
        >

          {/* =================================================
              01 — GREEN
          ================================================= */}

          <article
            className="
              about-faculty-tile
              about-faculty-tile--large
            "
          >

            <span className="about-faculty-tile-label">
              {aboutCopy.faculty.tiles[0].label}
            </span>


            <strong className="about-faculty-number">
              {aboutCopy.faculty.tiles[0].heading}
            </strong>


            <p>
              {aboutCopy.faculty.tiles[0].description}
            </p>

          </article>


          {/* =================================================
              02 — IMAGE
          ================================================= */}

          <figure
            className="
              about-faculty-tile
              about-faculty-tile--image
              about-faculty-tile--image-one
            "
          >

            <img
              src={aboutCopy.faculty.images.collaboration.src}

              alt={aboutCopy.faculty.images.collaboration.alt}

              loading="lazy"

              decoding="async"

              draggable="false"
            />


            <figcaption>

              <span>
                {aboutCopy.faculty.images.collaboration.label}
              </span>

              <strong>
                {aboutCopy.faculty.images.collaboration.caption}
              </strong>

            </figcaption>

          </figure>


          {/* =================================================
              03 — ORANGE
          ================================================= */}

          <article
            className="
              about-faculty-tile
              about-faculty-tile--orange
            "
          >

            <span className="about-faculty-tile-label">
              {aboutCopy.faculty.tiles[1].label}
            </span>


            <strong className="about-faculty-number">
              {aboutCopy.faculty.tiles[1].heading}
            </strong>


            <p>
              {aboutCopy.faculty.tiles[1].description}
            </p>

          </article>


          {/* =================================================
              04 — CREAM
          ================================================= */}

          <article
            className="
              about-faculty-tile
              about-faculty-tile--cream
            "
          >

            <span className="about-faculty-tile-label">
              {aboutCopy.faculty.tiles[2].label}
            </span>


            <strong className="
              about-faculty-number
              about-faculty-number--word
            ">
              {aboutCopy.faculty.tiles[2].heading}
            </strong>


            <p>
              {aboutCopy.faculty.tiles[2].description}
            </p>

          </article>


          {/* =================================================
              05 — IMAGE
          ================================================= */}

          <figure
            className="
              about-faculty-tile
              about-faculty-tile--image
              about-faculty-tile--image-two
            "
          >

            <img
              src={aboutCopy.faculty.images.guidance.src}

              alt={aboutCopy.faculty.images.guidance.alt}

              loading="lazy"

              decoding="async"

              draggable="false"
            />


            <figcaption>

              <span>
                {aboutCopy.faculty.images.guidance.label}
              </span>


              <strong>
                {aboutCopy.faculty.images.guidance.caption}
              </strong>

            </figcaption>

          </figure>

        </div>

      </div>

    </section>
  );
};


export default AboutFaculty;