import HomeImage from "../HomeImage";
import { homeCopy } from "../../../../cms/siteContent.js";
import { fallbackImage, facts } from "../../../../cms/siteContent.js";
import { useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./QuickFacts.css";

gsap.registerPlugin(ScrollTrigger);

/* =========================================================
   FALLBACK IMAGE
========================================================= */

;


/* =========================================================
   QUICK FACTS DATA
   8 TOTAL
   4 TOP + 4 BOTTOM
========================================================= */




/* =========================================================
   SPLIT 4 + 4
========================================================= */

/* =========================================================
   FACT CARD
========================================================= */

function FactCard({
  fact,
  duplicate = false,
}) {
  const handleImageError = (event) => {
    const image = event.currentTarget;

    if (fallbackImage && image.src !== new URL(fallbackImage, window.location.href).href) image.src = fallbackImage;
    else if (!fallbackImage) {
      image.removeAttribute("src");
      image.hidden = true;
    }
  };

  return (
    <article
      className="quick-marquee-card"
      aria-hidden={
        duplicate
          ? "true"
          : undefined
      }
    >
      {/* =================================================
          FULL IMAGE
      ================================================= */}

      <HomeImage
        mobileImage={fact.mobileImage}
        src={fact.image}
        alt={
          duplicate
            ? ""
            : fact.title
        }
        className="quick-marquee-image"
        loading="lazy"
        decoding="async"
        draggable="false"
        onError={handleImageError}
      />

      {/* =================================================
          CONTENT
      ================================================= */}

      <div className="quick-marquee-content">
        <strong className="quick-marquee-value">
          {fact.value}
        </strong>

        <h3>{fact.title}</h3>

        <div className="quick-marquee-description-wrap">
          <p>
            {fact.description}
          </p>
        </div>
      </div>
    </article>
  );
}


/* =========================================================
   FACT GROUP
========================================================= */

function FactGroup({
  items,
  duplicate = false,
}) {
  return (
    <div
      className="quick-marquee-group"
      aria-hidden={
        duplicate
          ? "true"
          : undefined
      }
    >
      {items.map((fact) => (
        <FactCard
          key={`${fact.id}-${
            duplicate
              ? "copy"
              : "original"
          }`}
          fact={fact}
          duplicate={duplicate}
        />
      ))}
    </div>
  );
}


/* =========================================================
   MOBILE AUTO SLIDER
========================================================= */

/* =========================================================
   QUICK FACTS
========================================================= */

export default function QuickFacts() {
  const topFacts = facts.slice(0, 4);
  const bottomFacts = facts.slice(4, 8);
  const sectionRef =
    useRef(null);

  const topRowRef =
    useRef(null);

  const bottomRowRef =
    useRef(null);

  const topTrackRef =
    useRef(null);

  const bottomTrackRef =
    useRef(null);


  /* =========================================================
     ANIMATION
  ========================================================= */

  useLayoutEffect(() => {
    const section =
      sectionRef.current;

    const topRow =
      topRowRef.current;

    const bottomRow =
      bottomRowRef.current;

    const topTrack =
      topTrackRef.current;

    const bottomTrack =
      bottomTrackRef.current;

    if (
      !section ||
      !topRow ||
      !bottomRow ||
      !topTrack ||
      !bottomTrack
    ) {
      return;
    }

    const mm =
      gsap.matchMedia();

    const ctx =
      gsap.context(() => {
        /* =====================================================
           BASELINE
        ===================================================== */

        gsap.set(
          [
            topRow,
            bottomRow,
          ],
          {
            opacity: 1,
            x: 0,
            y: 0,
          }
        );


        /* =====================================================
           DESKTOP
        ===================================================== */

        mm.add(
          "(min-width: 769px)",
          () => {
            topRow.scrollLeft = 0;

            bottomRow.scrollLeft = 0;


            /* =================================================
               INITIAL POSITIONS
            ================================================= */

            gsap.set(
              topTrack,
              {
                xPercent: 0,
              }
            );

            gsap.set(
              bottomTrack,
              {
                xPercent: -50,
              }
            );


            /* =================================================
               TOP ROW
               LEFT
            ================================================= */

            const topTween =
              gsap.to(
                topTrack,
                {
                  xPercent: -50,
                  duration: 19,
                  repeat: -1,
                  ease: "none",
                }
              );


            /* =================================================
               BOTTOM ROW
               RIGHT
            ================================================= */

            const bottomTween =
              gsap.to(
                bottomTrack,
                {
                  xPercent: 0,
                  duration: 21,
                  repeat: -1,
                  ease: "none",
                }
              );


            /* =================================================
               SUBTLE VERTICAL DEPTH
            ================================================= */

            const topDepth =
              gsap.fromTo(
                topRow,
                {
                  y: 10,
                },
                {
                  y: -10,
                  ease: "none",
                  scrollTrigger: {
                    trigger: section,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1,
                    invalidateOnRefresh: true,
                  },
                }
              );


            const bottomDepth =
              gsap.fromTo(
                bottomRow,
                {
                  y: -8,
                },
                {
                  y: 8,
                  ease: "none",
                  scrollTrigger: {
                    trigger: section,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 1,
                    invalidateOnRefresh: true,
                  },
                }
              );


            /* =================================================
               SCROLL VELOCITY
            ================================================= */

            let settleCall = null;

            const velocityTrigger =
              ScrollTrigger.create({
                trigger: section,

                start: "top bottom",

                end: "bottom top",

                onUpdate: (self) => {
                  const velocity =
                    Math.abs(
                      self.getVelocity()
                    );

                  const speed =
                    Math.min(
                      1.7,
                      1 +
                        velocity /
                          3500
                    );

                  topTween.timeScale(
                    speed
                  );

                  bottomTween.timeScale(
                    speed
                  );

                  if (settleCall) {
                    settleCall.kill();
                  }

                  settleCall =
                    gsap.delayedCall(
                      0.15,
                      () => {
                        gsap.to(
                          topTween,
                          {
                            timeScale: 1,
                            duration: 0.5,
                            ease: "power3.out",
                          }
                        );

                        gsap.to(
                          bottomTween,
                          {
                            timeScale: 1,
                            duration: 0.5,
                            ease: "power3.out",
                          }
                        );
                      }
                    );
                },
              });


            return () => {
              topTween.kill();

              bottomTween.kill();

              topDepth.kill();

              bottomDepth.kill();

              velocityTrigger.kill();

              if (settleCall) {
                settleCall.kill();
              }

              gsap.set(
                [
                  topTrack,
                  bottomTrack,
                  topRow,
                  bottomRow,
                ],
                {
                  clearProps:
                    "transform",
                }
              );
            };
          }
        );


        /* =====================================================
           MOBILE MARQUEES
           Animate the duplicated track directly so touch scrolling,
           lost pointer events, or browser scroll restoration cannot
           leave either row stranded mid-loop.
        ===================================================== */

        mm.add(
          "(max-width: 768px)",
          () => {
            const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
            const rows = [
              { track: topTrack, from: 0, to: -50, duration: 28 },
              { track: bottomTrack, from: -50, to: 0, duration: 30 },
            ];

            const tweens = rows.map(({ track, from, to, duration }) => {
              gsap.set(track, { xPercent: from });
              if (reducedMotion) return null;
              return gsap.to(track, {
                xPercent: to,
                duration,
                repeat: -1,
                ease: "none",
              });
            });

            return () => tweens.forEach((tween) => tween?.kill());
          }
        );
      }, section);


    /* =========================================================
       REFRESH SCROLLTRIGGER
    ========================================================= */

    let refreshFrame = null;

    let refreshTimeout = null;

    const refresh = () => {
      if (refreshFrame) {
        cancelAnimationFrame(
          refreshFrame
        );
      }

      refreshFrame =
        requestAnimationFrame(
          () => {
            ScrollTrigger.refresh();
          }
        );
    };

    refreshTimeout =
      window.setTimeout(
        refresh,
        100
      );

    if (
      document.fonts &&
      document.fonts.ready
    ) {
      document.fonts.ready.then(
        refresh
      );
    }

    window.addEventListener(
      "load",
      refresh
    );

    window.addEventListener(
      "resize",
      refresh
    );

    let resizeObserver = null;

    if (
      "ResizeObserver" in window
    ) {
      resizeObserver =
        new ResizeObserver(
          () => {
            refresh();
          }
        );

      resizeObserver.observe(
        section
      );
    }


    return () => {
      clearTimeout(
        refreshTimeout
      );

      if (refreshFrame) {
        cancelAnimationFrame(
          refreshFrame
        );
      }

      window.removeEventListener(
        "load",
        refresh
      );

      window.removeEventListener(
        "resize",
        refresh
      );

      if (resizeObserver) {
        resizeObserver.disconnect();
      }

      mm.revert();

      ctx.revert();
    };
  }, []);


  /* =========================================================
     RETURN
  ========================================================= */

  return (
    <section
      ref={sectionRef}
      className="quick-facts"
      id="quick-facts"
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="quick-facts-header">
        <h2 className="site-section-title quick-facts-heading">
          <span className="quick-facts-heading-main">
            {homeCopy.factsTitle[0]}
          </span>{" "}
          <span className="quick-facts-heading-soft">
            {homeCopy.factsTitle[1]}
          </span>
        </h2>
      </div>


      {/* =====================================================
          4 + 4 IMAGE WALL
      ===================================================== */}

      <div className="quick-marquee-wall">

        {/* =================================================
            TOP ROW — 4 IMAGES
        ================================================= */}

        <div
          ref={topRowRef}
          className="
            quick-marquee-row
            quick-marquee-row--top
          "
        >
          <div
            ref={topTrackRef}
            className="quick-marquee-track"
          >
            <FactGroup
              items={topFacts}
            />

            <FactGroup
              items={topFacts}
              duplicate
            />
          </div>
        </div>


        {/* =================================================
            BOTTOM ROW — 4 IMAGES
        ================================================= */}

        <div
          ref={bottomRowRef}
          className="
            quick-marquee-row
            quick-marquee-row--bottom
          "
        >
          <div
            ref={bottomTrackRef}
            className="quick-marquee-track"
          >
            <FactGroup
              items={bottomFacts}
            />

            <FactGroup
              items={bottomFacts}
              duplicate
            />
          </div>
        </div>

      </div>
    </section>
  );
}
