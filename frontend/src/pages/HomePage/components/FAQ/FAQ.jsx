import { admissionFormCopy, homeCopy } from "../../../../cms/siteContent.js";
import { faqItems } from "../../../../cms/siteContent.js";
import { enquiryFieldKey, submitWordPressEnquiry } from "../../../../cms/wordpressApi.js";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "./FAQ.css";

gsap.registerPlugin(ScrollTrigger);


/* =========================================================
   FAQ DATA
========================================================= */




/* =========================================================
   COMPONENT
========================================================= */

export default function FAQ() {

  const [activeIndex, setActiveIndex] =
    useState(-1);

  const [enquiryStatus, setEnquiryStatus] = useState("");

  const [enquiryStatusIsError, setEnquiryStatusIsError] = useState(false);

  const [enquirySubmitting, setEnquirySubmitting] = useState(false);


  const sectionRef =
    useRef(null);

  const listRef =
    useRef(null);

  const dialogRef = useRef(null);
  const openerRef = useRef(null);

  const panelRef =
    useRef(null);


  /* =========================================================
     FAQ ENTRANCE
  ========================================================= */

  useLayoutEffect(() => {

    const section =
      sectionRef.current;


    if (!section) {
      return;
    }


    const ctx =
      gsap.context(() => {

        gsap.fromTo(
          listRef.current,

          {
            opacity: 0,
          },

          {
            opacity: 1,

            duration: 0.75,

            ease:
              "power3.out",

            scrollTrigger: {
              trigger:
                listRef.current,

              start:
                "top 90%",

              once:
                true,
            },
          }
        );

      }, section);


    requestAnimationFrame(() => {

      ScrollTrigger.refresh();

    });


    return () => {

      ctx.revert();

    };

  }, []);


  /* =========================================================
     REFRESH FAQ
  ========================================================= */

  useEffect(() => {

    const timer =
      window.setTimeout(
        () => {

          ScrollTrigger.refresh();

        },
        520
      );


    return () => {

      clearTimeout(timer);

    };

  }, [activeIndex]);


  function openForm(event) {
    const dialog = dialogRef.current;
    if (dialog.open) return;
    openerRef.current = event.currentTarget;
    setEnquiryStatus("");
    setEnquiryStatusIsError(false);
    dialog.querySelector("form").reset();
    dialog.showModal();
    panelRef.current.scrollTop = 0;
    dialog.querySelector(".admission-panel-right").scrollTop = 0;
    dialog.querySelector(".admission-close").focus({ preventScroll: true });
  }

  function closeForm() {
    dialogRef.current.close();
  }

  useEffect(() => {
    const dialog = dialogRef.current;
    const viewport = window.visualViewport;
    if (!viewport) return;

    function fitViewport() {
      if (!dialog.open) return;
      dialog.style.setProperty("--enquiry-viewport-height", `${viewport.height}px`);
      dialog.style.setProperty("--enquiry-viewport-top", `${viewport.offsetTop}px`);
    }

    viewport.addEventListener("resize", fitViewport);
    viewport.addEventListener("scroll", fitViewport);
    return () => {
      viewport.removeEventListener("resize", fitViewport);
      viewport.removeEventListener("scroll", fitViewport);
    };
  }, []);

  /* =========================================================
     SUBMIT
  ========================================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    setEnquirySubmitting(true);
    setEnquiryStatus("");
    setEnquiryStatusIsError(false);
    try {
      const result = await submitWordPressEnquiry(form);
      setEnquiryStatus(result.message || "Thank you. Your enquiry has been sent to the school.");
      form.reset();
    } catch (error) {
      setEnquiryStatus(error.message || "We couldn’t send your enquiry. Please try again.");
      setEnquiryStatusIsError(true);
    } finally {
      setEnquirySubmitting(false);
    }
  };


  /* =========================================================
     JSX
  ========================================================= */

  return (

    <>

      {/* =====================================================
          FAQ
      ====================================================== */}

      <section
        ref={
          sectionRef
        }

        className="faq-section"

        id="faq"
        tabIndex={-1}
        aria-labelledby="faq-title"
      >

        <div
          className="faq-layout"
        >

          {/* LEFT */}

          <aside
            className="faq-left-column"
          >

            <div
              className="faq-sticky"
            >

              <h2
                className="site-section-title faq-title"
                id="faq-title"
              >

                {homeCopy.faq.title[0]}
                <span>{homeCopy.faq.title[1]}</span>

              </h2>


              <p
                className="faq-intro-copy"
              >

                {homeCopy.faq.introduction}

              </p>


              <button
                type="button"

                className="faq-admission-button"
                aria-haspopup="dialog"

                onClick={
                  openForm
                }
              >

                <span>
                  {homeCopy.faq.enquiryButton}
                </span>


                <span
                  className="faq-admission-arrow"
                >
                  ↗
                </span>

              </button>

            </div>

          </aside>


          {/* QUESTIONS */}

          <div
            ref={
              listRef
            }

            className="faq-list"
          >

            {faqItems.map(
              (
                item,
                index
              ) => {

                const isOpen =
                  activeIndex ===
                  index;


                return (

                  <article
                    key={
                      item.question
                    }

                    className={`
                      faq-item
                      ${
                        isOpen
                          ? "is-open"
                          : ""
                      }
                    `}
                  >

                    <button
                      type="button"

                      className="faq-question"

                      aria-expanded={
                        isOpen
                      }

                      onClick={
                        () =>
                          setActiveIndex(
                            isOpen
                              ? -1
                              : index
                          )
                      }
                    >

                      <span
                        className="faq-question-copy"
                      >

                        {item.question}

                      </span>


                      <span
                        className="faq-plus"

                        aria-hidden="true"
                      >

                        <span />

                        <span />

                      </span>

                    </button>


                    <div
                      className="faq-answer"
                    >

                      <div>

                        <p>
                          {item.answer}
                        </p>

                      </div>

                    </div>

                  </article>

                );

              }
            )}

          </div>

        </div>

      </section>


      {/* =====================================================
          ADMISSION FORM
      ====================================================== */}

      <dialog
        ref={dialogRef}
        className="admission-overlay"
        aria-labelledby="admission-title"
        onPointerDown={(event) => {
          if (event.target === event.currentTarget) closeForm();
        }}
        onClose={(event) => {
          event.currentTarget.style.removeProperty("--enquiry-viewport-height");
          event.currentTarget.style.removeProperty("--enquiry-viewport-top");
          openerRef.current?.focus({ preventScroll: true });
        }}
      >
        <div ref={panelRef} className="admission-panel">

            {/* CLOSE */}

            <button
              type="button"

              className="admission-close"

              onClick={
                closeForm
              }

              aria-label={admissionFormCopy.closeLabel}
            >

              <span />

              <span />

            </button>


            {/* =================================================
                LEFT SIDE
            ================================================= */}

            <div
              className="admission-panel-left"
            >

              <p className="admission-panel-eyebrow">
                {admissionFormCopy.eyebrow}
              </p>

              <h2
                id="admission-title"
                className="site-section-title"
              >

                {admissionFormCopy.title[0]}{" "}
                <span>{admissionFormCopy.title[1]}</span>

              </h2>

              {/* DESKTOP MASCOT */}

              <div
                className="admission-mascot-wrap"

                aria-hidden="true"
              >

                <div
                  className="admission-mascot-glow"
                />


                <img
                  src={homeCopy.faq.mascotImage || "/mascots/vidya-mascot.webp"}
                  loading="lazy"
                  decoding="async"

                  alt=""

                  className="admission-mascot"

                  draggable="false"
                />

              </div>

            </div>


            {/* =================================================
                RIGHT FORM
            ================================================= */}

            <div
              className="admission-panel-right"
            >

              <form
                className="admission-form"

                onSubmit={
                  handleSubmit
                }
              >

                {admissionFormCopy.fields.map((field, index) => {
                  const fieldId = `admission-field-${index}`;
                  const name = enquiryFieldKey(field.name, field.label);
                  const isPhone = name === "phone";
                  return (
                    <div className="admission-field" key={field.name}>
                      <label htmlFor={fieldId}>{field.label}</label>
                      <input
                        id={fieldId}
                        name={name}
                        type={isPhone ? "tel" : name === "email" ? "email" : field.type}
                        required={field.required}
                        maxLength={isPhone ? 10 : undefined}
                        pattern={isPhone ? "[6-9][0-9]{9}" : undefined}
                        inputMode={isPhone ? "numeric" : undefined}
                        autoComplete={isPhone ? "tel-national" : name === "email" ? "email" : undefined}
                        onInput={isPhone ? (event) => { event.currentTarget.value = event.currentTarget.value.replace(/\D/g, "").slice(0, 10); } : undefined}
                      />
                    </div>
                  );
                })}

                <div className="admission-field">
                  <label htmlFor="admission-class">{admissionFormCopy.classLabel}</label>
                  <select id="admission-class" name="class" defaultValue="" required>
                    <option value="" disabled>{admissionFormCopy.classPlaceholder}</option>
                    {admissionFormCopy.classOptions.map((className) => <option key={className}>{className}</option>)}
                  </select>
                </div>


                {/* MESSAGE */}

                <div
                  className="
                    admission-field
                    admission-field-full
                  "
                >

                  <label
                    htmlFor="message"
                  >
                    {admissionFormCopy.messageLabel}
                  </label>


                  <textarea
                    id="message"

                    name="message"

                    rows="3"

                  />

                </div>

                <label className="vidya-enquiry-honeypot" aria-hidden="true">
                  Leave this field empty
                  <input name="website" type="text" tabIndex={-1} autoComplete="off" />
                </label>


                {/* SUBMIT */}

                <div
                  className="
                    admission-field
                    admission-field-full
                  "
                >

                  <button
                    type="submit"

                    className="admission-submit"

                    disabled={enquirySubmitting}
                  >

                    <span>{enquirySubmitting ? "Sending…" : admissionFormCopy.submit}</span>



                  </button>

                </div>

                {enquiryStatus && (
                  <p className="vidya-enquiry-status" data-error={enquiryStatusIsError || undefined} role="status" aria-live="polite">
                    {enquiryStatus}
                  </p>
                )}

              </form>

            </div>

        </div>
      </dialog>

    </>

  );

}
