import { learningPathwaysCopy } from "../../../cms/siteContent.js";
import ResponsiveImage from "../../../components/ResponsiveImage/ResponsiveImage";
import {
  useLayoutEffect,
  useRef,
} from "react";

import gsap from "gsap";

import "./LearningPathwaysHero.css";

export default function LearningPathwaysHero() {
  const sectionRef =
    useRef(null);

  const contentRef =
    useRef(null);


  useLayoutEffect(() => {
    const section =
      sectionRef.current;

    const content =
      contentRef.current;


    if (
      !section ||
      !content
    ) {
      return undefined;
    }


    const ctx =
      gsap.context(() => {

        /* =========================================
           INTRO
        ========================================= */

        gsap.fromTo(
          content.children,

          {
            y:
              28,

            opacity:
              0,
          },

          {
            y:
              0,

            opacity:
              1,

            duration:
              1,

            stagger:
              0.08,

            ease:
              "power4.out",

            delay:
              0.1,
          }
        );


      }, section);


    return () => {
      ctx.revert();
    };

  }, []);


  return (
    <section
      ref={sectionRef}
      className="pathways-hero"
      data-navbar-hero
    >

      {/* =========================================
          INDIAN SCHOOL CLASSROOM IMAGE
      ========================================= */}

      <ResponsiveImage
        pictureClassName="pathways-hero__picture"
        className="pathways-hero__media"
        src={learningPathwaysCopy.hero.image.src}
        mobileImage={learningPathwaysCopy.hero.image.mobileImage}
        alt={learningPathwaysCopy.hero.image.alt}
        loading="eager"
        fetchPriority="high"
        decoding="async"
        draggable="false"
      />


      {/* =========================================
          CONTENT
      ========================================= */}

      <div
        ref={contentRef}
        className="pathways-hero__content"
      >

        {/* =====================================
            TITLE
        ====================================== */}

        <h1 className="site-page-title pathways-hero__title">

          <span className="pathways-hero__line">
            {learningPathwaysCopy.hero.title[0]}
          </span>


          <span className="pathways-hero__line">
            {learningPathwaysCopy.hero.title[1]}
          </span>


          <span className="pathways-hero__line">

            {learningPathwaysCopy.hero.title[2]}{" "}

            <span className="pathways-hero__accent">
              {learningPathwaysCopy.hero.title[3]}
            </span>

          </span>

        </h1>


        {/* =====================================
            DESCRIPTION
        ====================================== */}

        <p className="pathways-hero__intro">
          {learningPathwaysCopy.hero.introduction}
        </p>

      </div>

    </section>
  );
}
