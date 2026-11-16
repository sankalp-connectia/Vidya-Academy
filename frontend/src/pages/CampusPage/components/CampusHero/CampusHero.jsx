import { campusCopy } from "../../../../cms/siteContent.js";
import { heroImages, campusFallbackImage as FALLBACK_IMAGE } from "../../../../cms/siteContent.js";
import ResponsiveImage from "../../../../components/ResponsiveImage/ResponsiveImage";
import {
  useLayoutEffect,
  useRef,
  useState,
  useEffect,
} from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "./CampusHero.css";


gsap.registerPlugin(ScrollTrigger);


/* =========================================================
   CAMPUS IMAGES
========================================================= */




;


/* =========================================================
   CAMPUS HERO
========================================================= */

const CampusHero = () => {
  const [isSmallDevice, setIsSmallDevice] = useState(
    () => window.matchMedia("(max-width: 768px)").matches,
  );

  const sectionRef =
    useRef(null);

  const stageRef =
    useRef(null);

  const wallRef =
    useRef(null);

  const centerCardRef =
    useRef(null);

  const contentRef =
    useRef(null);

  const shadeRef =
    useRef(null);

  const scrollRef =
    useRef(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 768px)");
    const updateDeviceSize = (event) => setIsSmallDevice(event.matches);
    mediaQuery.addEventListener("change", updateDeviceSize);
    return () => mediaQuery.removeEventListener("change", updateDeviceSize);
  }, []);

  const mobileHeroImage =
    heroImages.find((image) => image.center) || heroImages[4] || heroImages[0];


  /* =========================================================
     IMAGE FALLBACK
  ========================================================= */

  const handleImageError =
    (event) => {
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


      if (FALLBACK_IMAGE) {
        image.src = FALLBACK_IMAGE;
      } else {
        image.removeAttribute("src");
        image.hidden = true;
      }
    };


  /* =========================================================
     GSAP
  ========================================================= */

  useLayoutEffect(() => {
    const section =
      sectionRef.current;

    const stage =
      stageRef.current;

    const wall =
      wallRef.current;

    const centerCard =
      centerCardRef.current;

    const content =
      contentRef.current;

    const shade =
      shadeRef.current;

    const scrollHint =
      scrollRef.current;


    if (
      !section ||
      !stage ||
      !wall ||
      !centerCard ||
      !content ||
      !shade
    ) {
      return undefined;
    }


    const mm =
      gsap.matchMedia();


    const ctx =
      gsap.context(
        () => {

          /* =================================================
             DESKTOP / LAPTOP
          ================================================= */

          mm.add(
            "(min-width: 769px)",

            () => {

              /* =============================================
                 START SCALE
              ============================================= */

              const getStartScale =
                () => {
                  const stageWidth =
                    stage.clientWidth;

                  const stageHeight =
                    stage.clientHeight;

                  const cardWidth =
                    centerCard.offsetWidth;

                  const cardHeight =
                    centerCard.offsetHeight;


                  if (
                    !stageWidth ||
                    !stageHeight ||
                    !cardWidth ||
                    !cardHeight
                  ) {
                    return 3.25;
                  }


                  const scaleX =
                    stageWidth /
                    cardWidth;


                  const scaleY =
                    stageHeight /
                    cardHeight;


                  /*
                    Slight overscan prevents any tiny
                    blank edge while fully zoomed in.
                  */

                  return (
                    Math.max(
                      scaleX,
                      scaleY
                    ) *
                    1.045
                  );
                };


              /* =============================================
                 INITIAL STATES
              ============================================= */

              gsap.set(
                wall,

                {
                  x: 0,
                  y: 0,

                  xPercent: 0,
                  yPercent: 0,

                  scale:
                    getStartScale,

                  rotation: 0,

                  transformOrigin:
                    "50% 50%",

                  force3D: true,
                }
              );


              gsap.set(
                content,

                {
                  opacity: 1,

                  x: 0,
                  y: 0,

                  scale: 1,
                }
              );


              gsap.set(
                shade,

                {
                  opacity: 1,
                }
              );


              if (scrollHint) {
                gsap.set(
                  scrollHint,

                  {
                    opacity: 1,
                    y: 0,
                  }
                );
              }


              /* =============================================
                 MASTER TIMELINE

                 PIN THE STAGE.

                 IMPORTANT:
                 Parent section has AUTO height in CSS.

                 Therefore pinSpacing can expand the
                 section normally and the next section
                 cannot slide over the Campus hero.
              ============================================= */

              const timeline =
                gsap.timeline({

                  defaults: {
                    ease: "none",
                  },

                  scrollTrigger: {
                    trigger:
                      section,

                    start:
                      "top top",

                    /*
                      A controlled zoom duration.

                      No manual 200vh CSS track.
                    */

                    end:
                      () =>
                        `+=${
                          Math.round(
                            Math.max(
                              stage.clientHeight *
                                (window.innerWidth <= 768 ? 0.78 : 1.15),
                              window.innerWidth <= 768 ? 440 : 680
                            )
                          )
                        }`,

                    scrub: 0.9,

                    pin:
                      stage,

                    /*
                      THIS MUST STAY TRUE.

                      ScrollTrigger creates real document
                      space below the pinned stage.
                    */

                    pinSpacing:
                      true,

                    anticipatePin:
                      1,

                    invalidateOnRefresh:
                      true,

                    fastScrollEnd:
                      false,

                    refreshPriority:
                      1,
                  },
                });


              /* =============================================
                 SMALL START HOLD
              ============================================= */

              timeline.to(
                {},
                {
                  duration: 0.05,
                }
              );


              /* =============================================
                 CONTENT OUT
              ============================================= */

              timeline.to(
                content,

                {
                  opacity: 0,

                  y: -30,

                  scale: 0.992,

                  duration: 0.2,

                  ease: "power1.out",
                },

                0.05
              );


              /* =============================================
                 SCROLL HINT OUT
              ============================================= */

              if (scrollHint) {

                timeline.to(
                  scrollHint,

                  {
                    opacity: 0,

                    y: 8,

                    duration: 0.15,
                  },

                  0.05
                );

              }


              /* =============================================
                 SHADE OUT
              ============================================= */

              timeline.to(
                shade,

                {
                  opacity: 0,

                  duration: 0.3,

                  ease: "power1.out",
                },

                0.06
              );


              /* =============================================
                 WALL ZOOM OUT
              ============================================= */

              timeline.to(
                wall,

                {
                  scale: 1,

                  x: 0,
                  y: 0,

                  xPercent: 0,
                  yPercent: 0,

                  duration: 0.83,

                  ease: "power2.inOut",

                  force3D: true,
                },

                0.08
              );


              /* =============================================
                 VERY SMALL FINAL HOLD

                 Enough to see the finished collage,
                 but not enough to feel like empty space.
              ============================================= */

              timeline.to(
                {},
                {
                  duration: 0.06,
                }
              );


              return () => {
                timeline
                  .scrollTrigger
                  ?.kill();


                timeline.kill();
              };

            }
          );




        },

        section
      );


    /* =========================================================
       REFRESH HANDLING
    ========================================================= */

    let refreshTimer;


    let previousWidth =
      document
        .documentElement
        .clientWidth;


    let previousHeight =
      document
        .documentElement
        .clientHeight;


    let previousDpr =
      window.devicePixelRatio;


    const refresh =
      (
        delay = 110
      ) => {

        clearTimeout(
          refreshTimer
        );


        refreshTimer =
          window.setTimeout(
            () => {

              ScrollTrigger.refresh(
                true
              );


              ScrollTrigger.update();

            },
            delay
          );

      };


    const handleResize =
      () => {

        const width =
          document
            .documentElement
            .clientWidth;


        const height =
          document
            .documentElement
            .clientHeight;


        const dpr =
          window.devicePixelRatio;


        const widthChanged =
          Math.abs(
            width -
            previousWidth
          ) >= 2;


        const heightChanged =
          Math.abs(
            height -
            previousHeight
          ) >= 4;


        const dprChanged =
          Math.abs(
            dpr -
            previousDpr
          ) >= 0.01;


        const isDesktop =
          width >
          768;


        if (
          !widthChanged &&
          !dprChanged &&
          !(
            isDesktop &&
            heightChanged
          )
        ) {
          return;
        }


        previousWidth =
          width;


        previousHeight =
          height;


        previousDpr =
          dpr;


        refresh();

      };


    /* =========================================================
       WAIT FOR IMAGES
    ========================================================= */

    const images =
      Array.from(
        section.querySelectorAll(
          "img"
        )
      );


    const imagePromises =
      images.map(
        (image) => {

          if (
            image.complete &&
            image.naturalWidth >
              0
          ) {

            if (
              typeof image.decode ===
              "function"
            ) {

              return image
                .decode()
                .catch(
                  () => {}
                );

            }


            return Promise.resolve();

          }


          return new Promise(
            (resolve) => {

              const done =
                () => {
                  resolve();
                };


              image.addEventListener(
                "load",
                done,
                {
                  once: true,
                }
              );


              image.addEventListener(
                "error",
                done,
                {
                  once: true,
                }
              );

            }
          );

        }
      );


    Promise
      .allSettled(
        imagePromises
      )
      .then(
        () => {
          refresh(20);
        }
      );


    document.fonts
      ?.ready
      ?.then(
        () => {
          refresh(20);
        }
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
          () => {

            ScrollTrigger.refresh(
              true
            );

          }
        );

      }
    );


    return () => {

      clearTimeout(
        refreshTimer
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
      className="campus-hero"
      data-navbar-hero
    >

      <div
        ref={stageRef}
        className="campus-hero-stage"
      >

        {/* =================================================
            PERMANENT BACKGROUND

            Prevents blank flashes while Chrome
            recomposites the collage.
        ================================================= */}

        <div
          className="campus-hero-safety"
          aria-hidden="true"
        >

          <ResponsiveImage
            src={mobileHeroImage?.src || FALLBACK_IMAGE}
            mobileImage={mobileHeroImage?.mobileImage}
            alt=""
            loading="eager"
            fetchPriority="high"
            decoding="async"
            draggable="false"
            onError={
              handleImageError
            }
          />

        </div>


        {/* =================================================
            3 × 3 WALL
        ================================================= */}

        <div
          ref={wallRef}
          className="campus-zoom-wall"
        >

          {(isSmallDevice
            ? [mobileHeroImage].filter(Boolean)
            : heroImages).map(
            (image) => {

              const isCenter =
                image.center;


              return (
                <figure
                  key={image.id}

                  ref={
                    isCenter
                      ? centerCardRef
                      : null
                  }

                  className={`
                    campus-wall-card
                    campus-wall-card--${image.id}
                    ${
                      isCenter
                        ? "campus-wall-card--center"
                        : ""
                    }
                  `}
                >

                  <ResponsiveImage
                    src={image.src}
                    mobileImage={isSmallDevice ? image.mobileImage : undefined}
                    alt={image.alt}
                    className="campus-wall-image"
                    loading="eager"
                    fetchPriority={
                      isCenter
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
              );

            }
          )}

        </div>


        {/* =================================================
            SHADE
        ================================================= */}

        <div
          ref={shadeRef}
          className="campus-hero-shade"
          aria-hidden="true"
        />


        {/* =================================================
            CONTENT
        ================================================= */}

        <div
          ref={contentRef}
          className="campus-hero-content"
        >

          <span className="campus-hero-kicker">
            {campusCopy.hero.eyebrow}
          </span>


          <h1 className="site-page-title campus-hero-title">

            <span className="campus-hero-title-main">
              {campusCopy.hero.title[0]}
            </span>


            <span className="campus-hero-title-accent">
              {campusCopy.hero.title[1]}
            </span>

          </h1>


          <p className="campus-hero-description">

            {campusCopy.hero.description}

          </p>

        </div>


        {/* =================================================
            SCROLL HINT
        ================================================= */}

        <div
          ref={scrollRef}
          className="campus-hero-scroll"
        >

          <span>
            Scroll to explore
          </span>

          <i />

        </div>

      </div>

    </section>
  );
};


export default CampusHero;
