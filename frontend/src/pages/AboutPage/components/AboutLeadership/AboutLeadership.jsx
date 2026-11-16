import { aboutCopy } from "../../../../cms/siteContent.js";
import { leaders } from "../../../../cms/siteContent.js";
import {
  useLayoutEffect,
  useRef,
} from "react";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "./AboutLeadership.css";

gsap.registerPlugin(ScrollTrigger);


/* =========================================================
   LEADERS
========================================================= */




/* =========================================================
   COMPONENT
========================================================= */

const AboutLeadership = () => {
  const sectionRef =
    useRef(null);

  const headerRef =
    useRef(null);

  const cardRefs =
    useRef([]);


  useLayoutEffect(() => {
    const section =
      sectionRef.current;

    const header =
      headerRef.current;


    if (!section || !header) {
      return;
    }


    const mm =
      gsap.matchMedia();


    const ctx =
      gsap.context(() => {

        /* =====================================================
           HEADER
        ===================================================== */

        const headerItems =
          header.querySelectorAll(
            "[data-leadership-reveal]"
          );


        gsap.fromTo(
          headerItems,
          {
            opacity: 0,
            y: 28,
          },
          {
            opacity: 1,
            y: 0,

            duration: 0.85,

            stagger: 0.07,

            ease:
              "power3.out",

            scrollTrigger: {
              trigger:
                header,

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
              cardRefs.current.filter(
                Boolean
              );


            cards.forEach(
              (
                card,
                index
              ) => {

                gsap.fromTo(
                  card,
                  {
                    opacity: 0,

                    y:
                      38 +
                      (index % 4) * 5,
                  },
                  {
                    opacity: 1,

                    y: 0,

                    ease:
                      "none",

                    scrollTrigger: {
                      trigger:
                        card,

                      start:
                        "top 93%",

                      end:
                        "top 76%",

                      scrub:
                        0.45,
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
              cardRefs.current.filter(
                Boolean
              );


            cards.forEach(
              (
                card,
                index
              ) => {

                gsap.fromTo(
                  card,
                  {
                    opacity: 0,
                    y: 26,
                  },
                  {
                    opacity: 1,
                    y: 0,

                    duration:
                      0.7,

                    delay:
                      (index % 2) *
                      0.04,

                    ease:
                      "power3.out",

                    scrollTrigger: {
                      trigger:
                        card,

                      start:
                        "top 91%",

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


    const refresh = () => {
      ScrollTrigger.refresh();
    };


    const handleResize = () => {
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
        passive: true,
      }
    );


    requestAnimationFrame(() => {
      requestAnimationFrame(
        refresh
      );
    });


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
      className="about-leadership"
    >

      <div className="about-leadership-inner">

        {/* =================================================
            HEADER
        ================================================= */}

        <header
          ref={headerRef}
          className="about-leadership-header"
        >

          <h2
            className="site-section-title about-leadership-title"
            data-leadership-reveal
          >

            <span className="about-leadership-title-main">
              {aboutCopy.leadership.title[0]}
            </span>
            {" "}
            <span className="about-leadership-title-soft">
              {aboutCopy.leadership.title[1]}
            </span>

          </h2>


          <p
            className="about-leadership-intro"
            data-leadership-reveal
          >
            {aboutCopy.leadership.introduction}
          </p>

        </header>


        {/* =================================================
            GRID
        ================================================= */}

        <div className="about-leadership-grid">

          {leaders.map(
            (
              leader,
              index
            ) => (

              <article
                key={`${leader.role}-${leader.name}`}

                ref={
                  (element) => {
                    cardRefs.current[
                      index
                    ] =
                      element;
                  }
                }

                className={`about-leader-card ${leader.image ? "" : "about-leader-card--text"}`}
              >

                {leader.image ? <figure className="about-leader-image">

                  <img
                    src={
                      leader.image
                    }

                    alt={
                      leader.imageAlt || leader.name
                    }

                    loading="lazy"

                    decoding="async"

                    draggable="false"
                  />

                </figure> : null}


                <div className="about-leader-content">

                  <div className="about-leader-heading">

                    <h3 className="about-leader-name">
                      {leader.name}
                    </h3>


                    <span className="about-leader-role">
                      {leader.role}
                    </span>

                  </div>


                  {leader.quote ? (
                    <blockquote className="about-leader-quote">
                      “{leader.quote}”
                    </blockquote>
                  ) : null}


                  {leader.bio ? <p className="about-leader-bio">{leader.bio}</p> : null}

                </div>

              </article>

            )
          )}

        </div>

      </div>

    </section>
  );
};


export default AboutLeadership;
