import { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { contactPage } from "../../cms/siteContent.js";
import { schoolDetails } from "../../cms/siteContent.js";
import { enquiryFieldKey, submitFormSubmitEnquiry } from "../../cms/wordpressApi.js";
import "./ContactPage.css";

export default function ContactPage() {
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(schoolDetails.location)}`;
  const [formStatus, setFormStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatusIsError, setFormStatusIsError] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    setIsSubmitting(true);
    setFormStatus("");
    setFormStatusIsError(false);
    try {
      const result = await submitFormSubmitEnquiry(form);
      setFormStatus(result.message || "Thank you. Your enquiry has been sent to the school.");
      form.reset();
    } catch (error) {
      setFormStatus(error.message || "We couldn’t send your enquiry. Please try again.");
      setFormStatusIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="contact-page">
      <section className="contact-page-hero page-hero" data-navbar-hero>
        <div className="contact-page-hero__content">
          <p className="contact-page-eyebrow">{contactPage.hero.eyebrow}</p>
          <h1 className="site-page-title">{contactPage.hero.title}</h1>
          <p>{contactPage.hero.description}</p>
          <a className="contact-page-hero__cta" href="#enquiry">{contactPage.form.submit}<span aria-hidden="true">↘</span></a>
        </div>
        <div className="contact-page-hero__visual" aria-hidden="true">
          <div className="contact-page-hero__visual-orbit">
            <div className="contact-page-hero__visual-core">
              <span>V</span>
              <small>MOODLAKATTE</small>
            </div>
            <i className="contact-page-hero__visual-dot contact-page-hero__visual-dot--one" />
            <i className="contact-page-hero__visual-dot contact-page-hero__visual-dot--two" />
          </div>
        </div>
        <div className="contact-page-hero__shape" aria-hidden="true" />
      </section>

      <section className="contact-page-details">
        <div className="contact-page-wrap">
          <p className="contact-page-eyebrow contact-page-eyebrow--green">{contactPage.details.title}</p>
          <div className="contact-page-details__grid">
            <article className="contact-info-card">
              <span className="contact-info-card__icon"><MapPin size={20} /></span>
              <p>{contactPage.details.addressLabel}</p>
              <strong>{schoolDetails.location}</strong>
              <a href={directionsUrl} target="_blank" rel="noreferrer">{contactPage.details.directions}</a>
            </article>
            <article className="contact-info-card">
              <span className="contact-info-card__icon"><Phone size={20} /></span>
              <p>{contactPage.details.phoneLabel}</p>
              <strong>{schoolDetails.phone}</strong>
              <a href={`tel:${schoolDetails.phone.replace(/[^+\d]/g, "")}`}>{contactPage.details.call}</a>
            </article>
            <article className="contact-info-card">
              <span className="contact-info-card__icon"><Mail size={20} /></span>
              <p>{contactPage.details.emailLabel}</p>
              <strong>{schoolDetails.email}</strong>
              <a href={`mailto:${schoolDetails.email}`}>{contactPage.details.emailAction}</a>
            </article>
          </div>
        </div>
      </section>

      <section className="contact-enquiry" id="enquiry">
        <div className="contact-enquiry__inner">
          <div className="contact-enquiry__intro">
            <p className="contact-page-eyebrow contact-page-eyebrow--green">{contactPage.form.eyebrow}</p>
            <h2 className="site-section-title">{contactPage.form.title}</h2>
            <p>{contactPage.hero.description}</p>
          </div>
          <form className="contact-enquiry-form" onSubmit={handleSubmit}>
            <div className="contact-enquiry-form__grid">
              {contactPage.form.fields.map((field, index) => (
                <label className="contact-enquiry-field" key={field.name}>
                  <span>{field.label}</span>
                  <input
                    id={`contact-field-${index}`}
                    name={enquiryFieldKey(field.name, field.label)}
                    type={enquiryFieldKey(field.name, field.label) === "phone" ? "tel" : enquiryFieldKey(field.name, field.label) === "email" ? "email" : field.type}
                    required={field.required}
                    maxLength={enquiryFieldKey(field.name, field.label) === "phone" ? 10 : undefined}
                    pattern={enquiryFieldKey(field.name, field.label) === "phone" ? "[6-9][0-9]{9}" : undefined}
                    inputMode={enquiryFieldKey(field.name, field.label) === "phone" ? "numeric" : undefined}
                    autoComplete={enquiryFieldKey(field.name, field.label) === "phone" ? "tel-national" : enquiryFieldKey(field.name, field.label) === "email" ? "email" : undefined}
                    onInput={enquiryFieldKey(field.name, field.label) === "phone" ? (event) => { event.currentTarget.value = event.currentTarget.value.replace(/\D/g, "").slice(0, 10); } : undefined}
                  />
                </label>
              ))}
              <label className="contact-enquiry-field">
                <span>{contactPage.form.classLabel}</span>
                <select name="class" defaultValue="" required>
                  <option value="" disabled>{contactPage.form.classPlaceholder}</option>
                  {contactPage.form.classOptions.map((className) => <option key={className}>{className}</option>)}
                </select>
              </label>
              <label className="contact-enquiry-field contact-enquiry-field--wide">
                <span>{contactPage.form.messageLabel}</span>
                <textarea name="message" rows="4" />
              </label>
            </div>
            <label className="vidya-enquiry-honeypot" aria-hidden="true">
              Leave this field empty
              <input name="website" type="text" tabIndex={-1} autoComplete="off" />
            </label>
            <button type="submit" className="contact-enquiry-form__submit" disabled={isSubmitting}>
              {isSubmitting ? "Sending…" : contactPage.form.submit}
            </button>
            {formStatus && <p className="contact-enquiry-form__status" data-error={formStatusIsError || undefined} role="status" aria-live="polite">{formStatus}</p>}
          </form>
        </div>
      </section>
    </main>
  );
}

