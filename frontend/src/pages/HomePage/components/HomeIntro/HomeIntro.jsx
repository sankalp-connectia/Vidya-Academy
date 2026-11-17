import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";

import { createPortal } from "react-dom";
import { homeCopy } from "../../../../cms/siteContent.js";
import "./HomeIntro.css";

/* =========================================================
   VIDYA ACADEMY HOME INTRO

   2 SECOND HOLD
   SLOW SMOOTH ZOOM
   SOFT WHITE TRANSITION
   TRANSPARENT END
========================================================= */

export default function IntroReveal({
  onComplete,
}) {
  /* =========================================================
     DEVICE
  ========================================================= */

  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.matchMedia(
      "(max-width: 768px)"
    ).matches;
  });

  useEffect(() => {
    const query = window.matchMedia("(max-width: 768px)");
    const updateDevice = () => setIsMobile(query.matches);
    query.addEventListener?.("change", updateDevice);
    return () => query.removeEventListener?.("change", updateDevice);
  }, []);

  /* =========================================================
     STATE
  ========================================================= */

  const [started, setStarted] =
    useState(false);

  const [finished, setFinished] =
    useState(false);

  /* =========================================================
     REFS
  ========================================================= */

  const completedRef =
    useRef(false);

  const previousOverflowRef = useRef({ html: "", body: "" });

  /* =========================================================
     SVG IDS
  ========================================================= */

  const reactId = useId();

  const cleanId =
    reactId.replace(/:/g, "");

  const maskId =
    `vidya-intro-mask-${cleanId}`;

  const blackFilterId =
    `vidya-black-filter-${cleanId}`;

  /* =========================================================
     SVG SIZE
  ========================================================= */

  const viewWidth =
    isMobile ? 1000 : 1920;

  const viewHeight =
    isMobile ? 1600 : 1080;

  const centerX =
    viewWidth / 2;

  const centerY =
    viewHeight / 2;

  /* =========================================================
     LOGO SIZE
  ========================================================= */

  const logoWidth =
    isMobile ? 320 : 430;

  const logoHeight =
    isMobile ? 344 : 463;

  const logoX =
    centerX - logoWidth / 2;

  const logoY =
    centerY - logoHeight / 2;

  /* =========================================================
     ZOOM ORIGIN

     Zoom toward upper transparent
     part of the logo.
  ========================================================= */

  const zoomOriginX =
    centerX;

  const zoomOriginY =
    logoY + logoHeight * 0.23;

  /* =========================================================
     LOCK PAGE
  ========================================================= */

  const releaseScrollLock = useCallback(() => {
    document.documentElement.style.overflow =
      previousOverflowRef.current.html;
    document.body.style.overflow =
      previousOverflowRef.current.body;
    document.body.classList.remove("vidya-page-intro-active");
  }, []);

  useEffect(() => {
    previousOverflowRef.current = {
      html: document.documentElement.style.overflow,
      body: document.body.style.overflow,
    };
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    document.body.classList.add("vidya-page-intro-active");

    return releaseScrollLock;
  }, [releaseScrollLock]);

  /* =========================================================
     START INTRO

     Begin on first paint; the hero video must not gate the
     intro because video readiness varies by network/device.
  ========================================================= */

  useEffect(() => {
    if (started) {
      return;
    }

    let cancelled = false;
    let frame1;
    let frame2;

    const startIntro = () => {
      if (cancelled) {
        return;
      }

      frame1 =
        requestAnimationFrame(() => {
          frame2 =
            requestAnimationFrame(() => {
              if (!cancelled) {
                setStarted(true);
              }
            });
        });
    };

    startIntro();

    return () => {
      cancelled = true;

      if (frame1) {
        cancelAnimationFrame(
          frame1
        );
      }

      if (frame2) {
        cancelAnimationFrame(
          frame2
        );
      }
    };
  }, [
    started,
  ]);

  /* =========================================================
     COMPLETE INTRO
  ========================================================= */

  const completeIntro =
    useCallback(() => {
      if (completedRef.current) {
        return;
      }

      completedRef.current = true;

      releaseScrollLock();

      setFinished(true);

      onComplete?.();
    }, [
      onComplete,
      releaseScrollLock,
    ]);

  /* =========================================================
     SAFETY TIMER
  ========================================================= */

  useEffect(() => {
    if (!started) {
      return;
    }

    const timer =
      window.setTimeout(
        completeIntro,
        isMobile
          ? 4500
          : 5000
      );

    return () => {
      window.clearTimeout(
        timer
      );
    };
  }, [
    started,
    isMobile,
    completeIntro,
  ]);

  /* =========================================================
     FINISH AFTER ZOOM
  ========================================================= */

  const handleZoomEnd =
    useCallback(
      (event) => {
        if (
          event.animationName ===
            "vidyaLogoZoomDesktop" ||
          event.animationName ===
            "vidyaLogoZoomMobile"
        ) {
          completeIntro();
        }
      },
      [
        completeIntro,
      ]
    );

  /* =========================================================
     SSR / FINISHED
  ========================================================= */

  if (
    typeof document === "undefined" ||
    finished
  ) {
    return null;
  }

  /* =========================================================
     RENDER
  ========================================================= */

  return createPortal(
    <div
      className={[
        "vidya-intro",

        started
          ? "vidya-intro--started"
          : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <svg
        className="vidya-intro-svg"

        viewBox={
          `0 0 ${viewWidth} ${viewHeight}`
        }

        preserveAspectRatio="xMidYMid slice"

        aria-hidden="true"
      >
        <defs>

          {/* =================================================
              LOGO -> BLACK MASK

              Black = transparent opening
          ================================================= */}

          <filter
            id={blackFilterId}

            x="-50%"
            y="-50%"

            width="200%"
            height="200%"

            colorInterpolationFilters="sRGB"
          >
            <feColorMatrix
              type="matrix"

              values="
                0 0 0 0 0
                0 0 0 0 0
                0 0 0 0 0
                0 0 0 1 0
              "
            />
          </filter>

          {/* =================================================
              MASK
          ================================================= */}

          <mask
            id={maskId}

            x="0"
            y="0"

            width={viewWidth}
            height={viewHeight}

            maskUnits="userSpaceOnUse"

            maskContentUnits="userSpaceOnUse"

            style={{
              maskType: "luminance",
            }}
          >
            <rect
              x="0"
              y="0"

              width={viewWidth}
              height={viewHeight}

              fill="#ffffff"
            />

            <g
              className="vidya-logo-opening"

              style={{
                transformOrigin:
                  `${zoomOriginX}px ${zoomOriginY}px`,
              }}

              onAnimationEnd={
                handleZoomEnd
              }
            >
              <image
                href={homeCopy.hero.introLogoImage}

                x={logoX}
                y={logoY}

                width={logoWidth}
                height={logoHeight}

                preserveAspectRatio="xMidYMid meet"

                filter={
                  `url(#${blackFilterId})`
                }
              />
            </g>

          </mask>

        </defs>

        {/* =================================================
              GREEN INTRO COVER
        ================================================= */}

        <rect
          className="vidya-green-cover"

          x="0"
          y="0"

          width={viewWidth}
          height={viewHeight}

          fill="#0e6b45"

          mask={
            `url(#${maskId})`
          }
        />

        {/* Corner semicircles echo the enquiry form while keeping the logo opening clear. */}
        <g className="vidya-intro-semicircles" aria-hidden="true">
          <circle
            className="vidya-intro-semicircles__ring vidya-intro-semicircles__ring--outer"
            cx={viewWidth * 0.815}
            cy={viewWidth * -0.175}
            r={viewWidth * 0.445}
          />
          <circle
            className="vidya-intro-semicircles__ring"
            cx={viewWidth * 0.815}
            cy={viewWidth * -0.175}
            r={viewWidth * 0.365}
          />
          <circle
            className="vidya-intro-semicircles__large"
            cx={viewWidth * 0.815}
            cy={viewWidth * -0.175}
            r={viewWidth * 0.285}
          />
        </g>

      </svg>
    </div>,

    document.body
  );
}

