import { ArrowDown, ArrowUpRight, FileText, Play } from "lucide-react";
import { mandatoryDisclosure } from "../../cms/siteContent.js";
import SEOHead from "../../components/SEO/SEOHead";
import "./MandatoryDisclosurePage.css";

function isYouTubeUrl(value = "") {
  return /^https?:\/\/(?:www\.)?(?:youtube\.com|youtu\.be)\//i.test(value);
}

function isInspectionVideoRow(row) {
  return row?.type === "youtube" || /youtube.*inspection|inspection.*youtube/i.test(row?.label || "");
}

function DisclosureSection({ section, index, page }) {
  const columns = Array.isArray(section.columns) && section.columns.length
    ? section.columns
    : ["SL. NO.", "INFORMATION", "DETAILS"];
  const rows = Array.isArray(section.rows) ? section.rows : [];
  const hasLinks = rows.some((row) => row.href);

  return (
    <section className="mandatory-disclosure__section" aria-labelledby={`disclosure-section-${index}`}>
      <header className="mandatory-disclosure__section-head">
        <h2 id={`disclosure-section-${index}`}>{section.title}</h2>
      </header>
      <div className="mandatory-disclosure__table-wrap" role="region" aria-label={`${section.title} table`} tabIndex="0">
        <table className="mandatory-disclosure__table">
          <thead>
            <tr>{columns.map((column, columnIndex) => <th key={`${column}-${columnIndex}`} scope="col">{column}</th>)}</tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => {
              const inspectionVideo = isInspectionVideoRow(row);
              const href = row.href || "";
              const link = href && /^https?:\/\//i.test(href);
              const youtube = link && isYouTubeUrl(href);
              return (
                <tr key={`${row.no || "row"}-${rowIndex}`}>
                  <td data-label={columns[0]}>{row.no}</td>
                  <td data-label={columns[1]}>{row.label}</td>
                  {columns.length > 2 && (
                    <td data-label={columns[2]}>
                      {link ? (
                        <a className={youtube ? "mandatory-disclosure__video-link" : "mandatory-disclosure__pdf"} href={href} target="_blank" rel="noopener noreferrer">
                          {youtube ? <Play size={18} aria-hidden="true" /> : <FileText size={17} aria-hidden="true" />}
                          {youtube ? page.videoLinkLabel || "Watch inspection video" : row.linkLabel || page.pdfLinkLabel || "View PDF"}
                          <ArrowUpRight size={15} aria-hidden="true" />
                        </a>
                      ) : row.linkLabel ? (
                        <span className="mandatory-disclosure__pending" title={inspectionVideo ? "Add the YouTube video URL in the WordPress Mandatory Disclosure editor" : "Upload the document in the WordPress Mandatory Disclosure editor"}>
                          {inspectionVideo ? page.pendingVideoLabel || "Video link not added yet" : page.pendingPdfLabel || "PDF not uploaded yet"}
                        </span>
                      ) : row.value ? (
                        row.value
                      ) : null}
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {hasLinks && <p className="mandatory-disclosure__note">{page.linkNote || "Documents and video links open in a new tab."}</p>}
    </section>
  );
}

export default function MandatoryDisclosurePage() {
  const page = mandatoryDisclosure || {};
  const sections = Array.isArray(page.sections) ? page.sections : [];

  return (
    <main className="mandatory-disclosure">
      <SEOHead
        title={`${page.pageTitle || "Mandatory Public Disclosure"} | Vidya Academy`}
        description={page.description}
        canonicalPath="/mandatory-disclosure"
      />

      <header className="mandatory-disclosure__hero page-hero" data-navbar-hero>
        <div className="mandatory-disclosure__hero-inner">
          <p className="mandatory-disclosure__eyebrow">{page.eyebrow || "VIDYA ACADEMY · KUNDAPURA"}</p>
          <h1 className="site-page-title">{page.pageTitle || "Mandatory Public Disclosure"}</h1>
          <p>{page.description}</p>
          <a className="mandatory-disclosure__jump" href="#disclosure-content">
            {page.jumpLabel || "View disclosure"} <ArrowDown size={17} aria-hidden="true" />
          </a>
        </div>
        <div className="mandatory-disclosure__hero-mark" aria-hidden="true">VA</div>
      </header>

      <div className="mandatory-disclosure__body" id="disclosure-content">
        <div className="mandatory-disclosure__inner">
          <div className="mandatory-disclosure__intro">
            <span className="mandatory-disclosure__index">{page.introEyebrow || "SCHOOL INFORMATION"}</span>
            <h2>{page.introTitle || "Public documents and details"}</h2>
            <p>{page.introDescription || "School information and supporting documents are listed below."}</p>
          </div>
          <div className="mandatory-disclosure__sections">
            {sections.map((section, index) => <DisclosureSection key={`${section.title}-${index}`} section={section} index={index} page={page} />)}
          </div>
          <footer className="mandatory-disclosure__contact">
            <div>
              <span className="mandatory-disclosure__index">{page.contactEyebrow || "CONTACT THE SCHOOL"}</span>
              <h2>{page.contactTitle || "Need more information?"}</h2>
            </div>
            <div className="mandatory-disclosure__contact-links">
              {page.schoolDetails?.phone && <a href={`tel:${page.schoolDetails.phone.replace(/[^+\d]/g, "")}`}>{page.schoolDetails.phone}</a>}
              {page.schoolDetails?.email && <a href={`mailto:${page.schoolDetails.email}`}>{page.schoolDetails.email}</a>}
            </div>
          </footer>
        </div>
      </div>
    </main>
  );
}

