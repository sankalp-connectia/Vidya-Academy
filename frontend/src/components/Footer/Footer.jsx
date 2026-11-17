import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Footer.css";
import { Link, useLocation } from "react-router-dom";
import { footerColumns, footerCopy, schoolDetails as SCHOOL, socialLinks } from "../../cms/siteContent.js";

gsap.registerPlugin(ScrollTrigger);


/* =========================================================
   MASCOT VIDEO
========================================================= */

function isFaqLink(link) {
  const destination = (link.to || link.href || "").trim();
  if (/^\/?(?:#faqs?|faqs?\/?)$/i.test(destination)) return true;
  return ["/#faq", "/#faqs", "/faq", "/faqs", "/faq/", "/faqs/"]
    .some((path) => destination.toLowerCase() === `${window.location.origin.toLowerCase()}${path}`);
}

function SocialIcon({ name }) {
  if (name === "Instagram") return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="1.7" /><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.7" /><circle cx="17.6" cy="6.7" r="1" fill="currentColor" /></svg>;
  if (name === "Facebook") return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 21v-8h2.8l.4-3.1h-3.2V8c0-.9.3-1.5 1.6-1.5h1.7V3.7c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2H7.3V13h2.8v8h3.4Z" /></svg>;
  return <svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M21.6 7.2a2.6 2.6 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4a2.6 2.6 0 0 0-1.8 1.8A27 27 0 0 0 2 12a27 27 0 0 0 .4 4.8 2.6 2.6 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.6 2.6 0 0 0 1.8-1.8A27 27 0 0 0 22 12a27 27 0 0 0-.4-4.8Z" stroke="currentColor" strokeWidth="1.6" /><path d="m10 15.2 5.2-3.2L10 8.8v6.4Z" fill="currentColor" /></svg>;
}


/* =========================================================
   SCHOOL DETAILS
========================================================= */

/* =========================================================
   ICONS
========================================================= */

function WhatsAppIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M20.5 11.65a8.48 8.48 0 0 1-12.55 7.43L3 20.45l1.34-4.82a8.47 8.47 0 1 1 16.16-3.98Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        d="M8.16 7.72c.25-.43.52-.44.76-.45h.45c.18 0 .37.07.47.33l.82 1.98c.1.24.08.43-.06.63l-.62.82c-.12.16-.12.3-.03.47.37.74.94 1.39 1.61 1.91.66.51 1.36.87 2.12 1.08.2.06.35 0 .48-.16l.77-.93c.16-.2.36-.25.59-.16l1.93.87c.26.12.39.27.41.48.04.44-.16 1.17-.48 1.58-.45.6-1.21.99-2.05.99-1.05 0-2.87-.55-4.87-2.24-1.63-1.38-2.83-3.03-3.33-4.4-.37-.93-.28-1.89.03-2.8.1-.28.2-.51.34-.75Z"
        fill="currentColor"
      />
    </svg>
  );
}


function LocationIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M20 10.5C20 15.5 12 22 12 22S4 15.5 4 10.5a8 8 0 1 1 16 0Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <circle
        cx="12"
        cy="10"
        r="2.5"
        fill="currentColor"
      />
    </svg>
  );
}


function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6.5 3.5 9 3l2 5-2.5 1.8c1.1 2.3 2.9 4.1 5.2 5.2l1.8-2.5 5 2-.5 2.5c-.3 1.5-1.6 2.5-3.1 2.5C10.7 19.5 4.5 13.3 4.5 5.1c0-1.5 1-2.8 2-1.6Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}


function EmailIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="14"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />

      <path
        d="m4 7 8 6 8-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}


/* =========================================================
   FOOTER
========================================================= */

export default function Footer() {
  const { pathname } = useLocation();
  const [mascotVisible, setMascotVisible] = useState(false);
  const isIPhone = typeof navigator !== "undefined" && /iPhone|iPod/i.test(navigator.userAgent || "");
  const mascotVideo = footerCopy.mascotVideo || "/mascot-doll1.webm";
  const footerNavigation = footerColumns.map((column, index) => {
    if (index !== 0 || !Array.isArray(column.links)) return column;
    const links = column.links.filter((link) => link.to !== "/schools");
    return { ...column, links: [...links, { label: "School guides", to: "/schools" }] };
  });
  const footerRef =
    useRef(null);

  const containerRef =
    useRef(null);

  useEffect(() => {
    let frame = 0;

    const updateMascotVisibility = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const hero = document.querySelector(
          "[data-navbar-hero], .about-hero, .page-hero, .raya-hero, .campus-hero"
        );

        if (!hero) {
          setMascotVisible(window.scrollY > 120);
          return;
        }

        setMascotVisible(hero.getBoundingClientRect().bottom <= 80);
      });
    };

    updateMascotVisibility();
    window.addEventListener("scroll", updateMascotVisibility, { passive: true });
    window.addEventListener("resize", updateMascotVisibility);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", updateMascotVisibility);
      window.removeEventListener("resize", updateMascotVisibility);
    };
  }, [pathname]);

  /* =========================================================
     VIDEO
  ========================================================= */

  const handleVideoReady =
    (event) => {
      const video =
        event.currentTarget;

      video.muted =
        true;

      video
        .play()
        .catch(
          () => {}
        );
    };


  /* =========================================================
     FOOTER ANIMATIONS

     IMPORTANT FIX:
     NEVER MOVE THE FOOTER ROOT.

     ONLY MOVE THE INNER CONTENT.
  ========================================================= */

  useLayoutEffect(() => {
    const footer =
      footerRef.current;

    const container =
      containerRef.current;


    if (
      !footer ||
      !container
    ) {
      return undefined;
    }


    /* remove any old GSAP transform
       that may still exist on footer */

    gsap.set(
      footer,
      {
        clearProps:
          "transform",
      }
    );


    const reducedMotion =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;


    const ctx =
      gsap.context(() => {
        if (
          reducedMotion
        ) {
          return;
        }


        /* =====================================================
           FOOTER INNER REVEAL
        ===================================================== */

        gsap.fromTo(
          container,

          {
            yPercent:
              2,
          },

          {
            yPercent:
              0,

            ease:
              "none",

            scrollTrigger: {
              trigger:
                footer,

              start:
                "top bottom",

              end:
                "top 82%",

              scrub:
                1.8,

              invalidateOnRefresh:
                true,
            },
          }
        );


        /* =====================================================
           LEFT INFO
        ===================================================== */

        gsap.fromTo(
          ".vidya-footer-info",

          {
            y:
              18,

            opacity:
              0.65,
          },

          {
            y:
              0,

            opacity:
              1,

            ease:
              "power2.out",

            scrollTrigger: {
              trigger:
                footer,

              start:
                "top 91%",

              end:
                "top 72%",

              scrub:
                1.5,
            },
          }
        );


        /* =====================================================
           COLUMNS
        ===================================================== */

        gsap.fromTo(
          ".vidya-footer-column",

          {
            y:
              14,

            opacity:
              0.55,
          },

          {
            y:
              0,

            opacity:
              1,

            stagger:
              0.07,

            ease:
              "power2.out",

            scrollTrigger: {
              trigger:
                footer,

              start:
                "top 90%",

              end:
                "top 72%",

              scrub:
                1.5,
            },
          }
        );


        /* =====================================================
           WORDMARK
        ===================================================== */

        gsap.fromTo(
          ".vidya-footer-large-name",

          {
            y:
              14,

            opacity:
              0.55,
          },

          {
            y:
              0,

            opacity:
              1,

            ease:
              "power2.out",

            scrollTrigger: {
              trigger:
                ".vidya-footer-brand",

              start:
                "top 98%",

              end:
                "top 80%",

              scrub:
                1.3,
            },
          }
        );


        /* =====================================================
           BOTTOM
        ===================================================== */

        gsap.fromTo(
          ".vidya-footer-bottom",

          {
            y:
              10,

            opacity:
              0.55,
          },

          {
            y:
              0,

            opacity:
              1,

            ease:
              "power2.out",

            scrollTrigger: {
              trigger:
                ".vidya-footer-bottom",

              start:
                "top 98%",

              end:
                "top 86%",

              scrub:
                1.4,
            },
          }
        );

      }, footer);


    let resizeTimer;


    const handleResize =
      () => {
        clearTimeout(
          resizeTimer
        );


        resizeTimer =
          setTimeout(
            () => {
              ScrollTrigger.refresh();
            },
            120
          );
      };


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
          () => {
            ScrollTrigger.refresh();
          }
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


      ctx.revert();
    };

  }, []);


  /* =========================================================
     WHATSAPP
  ========================================================= */

  const whatsappNumber =
    SCHOOL.whatsapp.replace(
      /\D/g,
      ""
    );


  const whatsappHref =
    whatsappNumber
      ? `https://wa.me/${whatsappNumber}`
      : "#faq";


  const hasWhatsapp =
    Boolean(
      whatsappNumber
    );


  /* =========================================================
     BACK TO TOP
  ========================================================= */

  const handleGoToTop =
    () => {
      window.scrollTo({
        top:
          0,

        behavior:
          "smooth",
      });
    };


  /* =========================================================
     JSX
  ========================================================= */

  return (
    <>

      {/* =====================================================
          FIXED MASCOT
      ===================================================== */}

      {!isIPhone && (
  <button
          type="button"
          className={`vidya-site-mascot${mascotVisible ? " vidya-site-mascot--visible" : ""}`}
          onClick={handleGoToTop}
          aria-label="Back to top"
        >

          {mascotVisible && <video
            className="vidya-site-mascot-video"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            disablePictureInPicture
            aria-hidden="true"
            onCanPlay={handleVideoReady}
          >
            <source src={mascotVideo} type={/\.webm(?:[?#]|$)/i.test(mascotVideo) ? "video/webm" : "video/mp4"} />
          </video>}

        </button>
      )}


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer
        ref={footerRef}
        id="footer"
        className="vidya-footer"
      >

        <div
          ref={containerRef}
          className="vidya-footer-container"
        >

          {/* =================================================
              MAIN
          ================================================= */}

          <div className="vidya-footer-main">

            {/* ===============================================
                SCHOOL INFO
            =============================================== */}

            <div className="vidya-footer-info">

              <p className="vidya-footer-description">
                {footerCopy.description}
              </p>


              <div className="vidya-footer-details">

                <div className="vidya-footer-detail">

                  <span className="detail-icon">
                    <LocationIcon />
                  </span>

                  <span>
                    {SCHOOL.location}
                  </span>

                </div>


                <div className="vidya-footer-detail">

                  <span className="detail-icon">
                    <PhoneIcon />
                  </span>

                  <a href={`tel:${SCHOOL.phone.replace(/[^+\d]/g, "")}`}>
                    {SCHOOL.phone}
                  </a>

                </div>


                <div className="vidya-footer-detail">

                  <span className="detail-icon">
                    <EmailIcon />
                  </span>

                  <a href={`mailto:${SCHOOL.email}`}>
                    {SCHOOL.email}
                  </a>

                </div>

              </div>


              {hasWhatsapp && (
                <div className="vidya-footer-actions">

                <a
                  className="vidya-footer-whatsapp"
                  href={whatsappHref}
                  target={
                    hasWhatsapp
                      ? "_blank"
                      : undefined
                  }
                  rel={
                    hasWhatsapp
                      ? "noopener noreferrer"
                      : undefined
                  }
                >

                  <WhatsAppIcon />

                  <span>
                    Chat on WhatsApp
                  </span>

                </a>

                </div>
              )}

            </div>


            {/* ===============================================
                NAVIGATION
            =============================================== */}

            <nav
              className="vidya-footer-navigation"
              aria-label="Footer navigation"
            >

              {footerNavigation.map(
                (column) => (

                  <div
                    className="vidya-footer-column"
                    key={column.title}
                  >

                    <h3>
                      {column.title}
                    </h3>


                    {column.linkGroups ? (
                      <div className="vidya-footer-institution-links">
                        {column.linkGroups.map((group, groupIndex) => (
                          <ul key={`${column.title}-${groupIndex}`}>
                            {group.map((link) => (
                              <li key={`${column.title}-${link.label}`}>
                                <a href={link.href} target="_blank" rel="noreferrer">
                                  {link.label}
                                </a>
                              </li>
                            ))}
                          </ul>
                        ))}
                      </div>
                    ) : (
                      <ul>
                        {column.links.map((link) => (
                          <li key={`${column.title}-${link.label}`}>
                            {isFaqLink(link) ? (
                              <Link to="/#faq">{link.label}</Link>
                            ) : link.external ? (
                              <a href={link.href} target="_blank" rel="noreferrer">{link.label}</a>
                            ) : (
                              <Link to={link.to}>{link.label}</Link>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}

                  </div>

                )
              )}

            </nav>

          </div>


          {/* =================================================
              LARGE VIDYA ACADEMY
          ================================================= */}

          <div className="vidya-footer-brand">

            <div className="vidya-footer-wordmark-window">

              <h2 className="vidya-footer-large-name">
                {footerCopy.brandTitle}
              </h2>

            </div>

          </div>


          {/* =================================================
              BOTTOM
          ================================================= */}

          <div className="vidya-footer-bottom">

            <p className="vidya-footer-copyright">
              ©{" "}
              {new Date().getFullYear()}{" "}
              {footerCopy.copyrightName}. {footerCopy.copyrightNotice}
            </p>
            <nav className="vidya-footer-socials" aria-label="Vidya Academy social media">
              {socialLinks.map((social) => {
                return (
                  <a key={social.label} href={social.href} target="_blank" rel="noreferrer" aria-label={`Vidya Academy on ${social.label}`}>
                    <SocialIcon name={social.label} />
                  </a>
                );
              })}
            </nav>

          </div>

        </div>

      </footer>

    </>
  );
}
