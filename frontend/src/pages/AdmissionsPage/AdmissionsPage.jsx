import { ClipboardCheck, ClipboardList, Compass, Download, MessageCircle, School } from "lucide-react";
import { Link } from "react-router-dom";
import { admissionsPage } from "../../cms/siteContent.js";
import "./AdmissionsPage.css";

const stepIcons = [MessageCircle, Compass, School, ClipboardList, ClipboardCheck];

function BrochureDownload({ brochure, showPlaceholder = false }) {
  const href = brochure?.href?.trim();
  const label = brochure?.label?.trim() || "Download brochure";
  const className = "admissions-button admissions-button--brochure";
  const content = <><span>{label}</span><Download size={17} aria-hidden="true" /></>;

  if (!href) {
    return showPlaceholder ? <button className={className} type="button" disabled>{content}</button> : null;
  }

  return <a className={className} href={href} download target="_blank" rel="noopener noreferrer">{content}</a>;
}

export default function AdmissionsPage() {
  const { hero, sections, steps, stages, contact, brochure } = admissionsPage;

  return (
    <main className="admissions-page">
      <section className="admissions-hero page-hero" data-navbar-hero>
        <div className="admissions-hero__copy">
          <p className="admissions-eyebrow">{hero.eyebrow}</p>
          <h1 className="site-page-title">{hero.title}</h1>
          <p className="admissions-hero__description">{hero.description}</p>
          <div className="admissions-hero__actions">
            <BrochureDownload brochure={brochure} showPlaceholder />
            <a className="admissions-scroll" href="#process">{sections.heroScroll}</a>
          </div>
        </div>
        <div className="admissions-hero__art" aria-hidden="true">
          <div className="admissions-hero__orb" />
          <img src={hero.image || "/mascots/vidya-admission-mascot.png"} alt={hero.imageAlt} />
        </div>
      </section>

      <section className="admissions-steps-section" id="process">
        <div className="admissions-wrap">
          <div className="admissions-section-heading">
            <div><p className="admissions-eyebrow admissions-eyebrow--green">{sections.processEyebrow}</p><h2 className="site-section-title">{sections.processTitle}</h2></div>
            <p>{sections.processDescription}</p>
          </div>
          <div className="admissions-steps">
            {steps.map((step, index) => {
              const Icon = stepIcons[index];
              return <article className="admissions-step" key={step.title}>
                <div className="admissions-step__top"><Icon size={21} strokeWidth={1.6} /></div>
                <h3>{step.title}</h3><p>{step.description}</p>
              </article>;
            })}
          </div>
        </div>
      </section>

      <section className="admissions-stages admissions-wrap">
        <div className="admissions-section-heading">
          <div><p className="admissions-eyebrow admissions-eyebrow--green">{sections.stagesEyebrow}</p><h2 className="site-section-title">{sections.stagesTitle}</h2></div>
          <Link className="admissions-text-link" to="/learning-pathways">{sections.stagesLink}</Link>
        </div>
        <div className="admissions-stage-grid">
          {stages.map((stage) => <article className={`admissions-stage admissions-stage--${stage.tone}`} key={stage.short}>
            <div className="admissions-stage__top"><span>{stage.short}</span></div>
            <div><h3>{stage.name}</h3><p>{stage.description}</p></div>
            <Link to={stage.href}>{sections.programmeLink}</Link>
          </article>)}
        </div>
      </section>

      <section className="admissions-contact admissions-wrap" id="contact">
        <div className="admissions-contact__copy"><p className="admissions-eyebrow admissions-eyebrow--light">{sections.contactEyebrow}</p><h2 className="site-section-title">{contact.title}</h2><p>{contact.description}</p></div>
        <div className="admissions-contact__actions">
          <Link className="admissions-button admissions-button--light" to="/contact#enquiry"><span>{sections.enquireButton}</span></Link>
          <BrochureDownload brochure={brochure} />
          <Link className="admissions-contact__detail" to="/contact#enquiry">{sections.visitButton}</Link>
          <a className="admissions-contact__detail" href={`tel:${contact.phone.replaceAll(" ", "")}`}>{contact.phone}</a>
          <a className="admissions-contact__detail" href={`mailto:${contact.email}`}>{contact.email}</a>
        </div>
      </section>
    </main>
  );
}

