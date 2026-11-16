import { heroEvent, motionFallbackImage as FALLBACK_IMAGE } from "../../../../cms/siteContent.js";
import ResponsiveImage from "../../../../components/ResponsiveImage/ResponsiveImage";
import {
  useLayoutEffect,
  useRef,
} from "react";

import gsap from "gsap";

import "./MotionHero.css";


/* =========================================================
   FEATURED EVENT
========================================================= */




/* =========================================================
   FALLBACK
========================================================= */

;


/* =========================================================
   ARROW
========================================================= */

function ArrowIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M5 12H18"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />

      <path
        d="M14 8L18 12L14 16"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}


/* =========================================================
   MOTION HERO
========================================================= */

const MotionHero = () => {
  const sectionRef =
    useRef(null);

  const imageRef =
    useRef(null);

  const contentRef =
    useRef(null);

  const dateRef =
    useRef(null);


  /* =========================================================
     FALLBACK IMAGE
  ========================================================= */

  const handleImageError =
    (event) => {
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


  /* =========================================================
     INTRO ANIMATION

     IMPORTANT:
     NO SCROLLTRIGGER.
     NO SCROLL PARALLAX.
     NO SCROLL-BASED TRANSFORMS.

     This removes the intermittent white gap.
  ========================================================= */

  useLayoutEffect(() => {
    const section =
      sectionRef.current;

    const image =
      imageRef.current;

    const content =
      contentRef.current;

    const date =
      dateRef.current;


    if (
      !section ||
      !image ||
      !content
    ) {
      return undefined;
    }


    const ctx =
      gsap.context(
        () => {

          /* ===============================================
             IMAGE
          =============================================== */

          gsap.set(
            image,
            {
              scale: 1.055,

              transformOrigin:
                "50% 50%",

              force3D: true,
            }
          );


          /* ===============================================
             CONTENT
          =============================================== */

          gsap.set(
            content.children,
            {
              opacity: 0,

              y: 24,
            }
          );


          /* ===============================================
             DATE
          =============================================== */

          if (date) {
            gsap.set(
              date,
              {
                opacity: 0,

                y: -12,
              }
            );
          }


          /* ===============================================
             TIMELINE
          =============================================== */

          const timeline =
            gsap.timeline({
              defaults: {
                overwrite: "auto",
              },
            });


          timeline.to(
            image,
            {
              scale: 1,

              duration: 1.45,

              ease: "power3.out",

              force3D: true,
            },
            0
          );


          timeline.to(
            content.children,
            {
              opacity: 1,

              y: 0,

              duration: 0.85,

              stagger: 0.065,

              ease: "power3.out",
            },
            0.12
          );


          if (date) {
            timeline.to(
              date,
              {
                opacity: 1,

                y: 0,

                duration: 0.75,

                ease: "power3.out",
              },
              0.26
            );
          }

        },

        section
      );


    return () => {
      ctx.revert();
    };

  }, []);


  /* =========================================================
     JSX
  ========================================================= */

  return (
    <section
      ref={sectionRef}
      className="motion-hero"
      data-navbar-hero
    >

      {/* =====================================================
          BACKGROUND MEDIA

          ABSOLUTELY STATIC DURING SCROLL.
      ===================================================== */}

      <div className="motion-hero-media">

        <ResponsiveImage
          ref={imageRef}
          src={heroEvent.image}
          mobileImage={heroEvent.mobileImage}
          alt={heroEvent.title}
          className="motion-hero-image"
          loading="eager"
          fetchPriority="high"
          decoding="async"
          draggable="false"
          onError={handleImageError}
        />

      </div>


      {/* =====================================================
          OVERLAY
      ===================================================== */}

      <div
        className="motion-hero-overlay"
        aria-hidden="true"
      />


      {/* =====================================================
          DATE
      ===================================================== */}

      {heroEvent.month || heroEvent.day || heroEvent.year ? <div
        ref={dateRef}
        className="motion-hero-date"
      >

        <span className="motion-hero-date-month">
          {heroEvent.month}
        </span>


        <strong className="motion-hero-date-day">
          {heroEvent.day}
        </strong>


        <span className="motion-hero-date-year">
          {heroEvent.year}
        </span>

      </div> : null}


      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div
        ref={contentRef}
        className="motion-hero-content"
      >

        <span className="motion-hero-category">
          {heroEvent.category}
        </span>


        <h1 className="site-page-title motion-hero-title">
          {heroEvent.title}
        </h1>


        <div className="motion-hero-meta">

          {heroEvent.meta.map(
            (
              item,
              index
            ) => (

              <div
                key={item}
                className="motion-hero-meta-item"
              >

                {index !== 0 && (

                  <span
                    className="motion-hero-meta-dot"
                    aria-hidden="true"
                  />

                )}


                <span>
                  {item}
                </span>

              </div>

            )
          )}

        </div>


        <p className="motion-hero-description">
          {heroEvent.description}
        </p>


        <a
          href="#motion-events"
          className="motion-hero-button"
        >

          <span>
            {heroEvent.ctaLabel}
          </span>


          <ArrowIcon />

        </a>

      </div>

    </section>
  );
};


export default MotionHero;
