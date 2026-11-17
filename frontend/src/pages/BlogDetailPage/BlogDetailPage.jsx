import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import ArticleGallery from "../../components/ArticleGallery/ArticleGallery";
import SEOHead from "../../components/SEO/SEOHead.jsx";
import { blogs } from "../../cms/siteContent.js";
import NotFoundPage from "../NotFoundPage/NotFoundPage";
import "./BlogDetailPage.css";

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function RelatedStory({ post }) {
  const image = post.image || post.fallbackImage;

  return (
    <article className="story-related-card">
      <Link className="story-related-card__image" to={`/blogs/${post.slug}`} aria-label={`Read ${post.title}`}>
        {image && <img src={image} alt={post.imageAlt || post.title || "Vidya Academy story"} loading="lazy" />}
        <span aria-hidden="true"><ArrowUpRight size={18} /></span>
      </Link>
      <div className="story-related-card__body">
        {post.category && <p className="story-related-card__category">{post.category}</p>}
        <h3><Link to={`/blogs/${post.slug}`}>{post.title}</Link></h3>
        {(post.description || post.excerpt) && <p className="story-related-card__excerpt">{post.description || post.excerpt}</p>}
      </div>
    </article>
  );
}

export default function BlogDetailPage() {
  const { slug } = useParams();
  const post = blogs.find((entry) => entry.slug === slug);
  if (!post) return <NotFoundPage />;

  const sections = Array.isArray(post.content) ? post.content : [];
  const paragraphs = Array.isArray(post.details) ? post.details : [];
  const dateValue = post.publishedAt || post.date;
  const date = formatDate(dateValue);
  const summary = post.description || post.excerpt || "";
  const image = post.image || post.fallbackImage;
  const gallery = Array.isArray(post.gallery) ? post.gallery : [];
  const html = typeof post.contentHtml === "string" ? post.contentHtml.trim() : "";
  const hasBody = sections.length > 0 || paragraphs.length > 0 || html.length > 0;
  const related = blogs.filter((entry) => entry.slug !== post.slug && entry.slug && entry.title).slice(0, 3);

  return (
    <article className="story-detail">
      <SEOHead
        title={post.metaTitle || `${post.title} | Vidya Academy`}
        description={post.metaDescription || summary || "Stories and updates from Vidya Academy in Moodlakatte, Kundapura."}
        canonicalPath={`/blogs/${post.slug}`}
      />

      <div className="story-detail__topline">
        <Link to="/blogs"><ArrowLeft size={16} aria-hidden="true" /> All stories</Link>
        <span>Vidya Academy <i>·</i> Journal</span>
      </div>

      <header className={`story-hero${image ? " story-hero--image" : ""}`}>
        <div className="story-hero__copy">
          <p className="story-hero__eyebrow"><span /> {post.category || "From our community"}</p>
          <h1>{post.title}</h1>
          {summary && <p className="story-hero__summary">{summary}</p>}
          <div className="story-hero__byline">
            {date && <time dateTime={dateValue}>{date}</time>}
            {post.author && <><span aria-hidden="true">/</span><span>By {post.author}</span></>}
          </div>
        </div>
        {image && (
          <figure className="story-hero__visual">
            <img src={image} alt={post.imageAlt || post.title || "Vidya Academy story"} width="1600" height="1000" fetchPriority="high" />
            {(post.imageCaption || post.imageHeading) && (
              <figcaption>{post.imageCaption || post.imageHeading}</figcaption>
            )}
          </figure>
        )}
        <span className="story-hero__number" aria-hidden="true">VA</span>
      </header>

      <div className="story-reading">
        <aside className="story-reading__rail" aria-label="Story details">
          <span className="story-reading__label">Story details</span>
          {post.category && <span>{post.category}</span>}
          {date && <time dateTime={dateValue}>{date}</time>}
          <Link to="/blogs"><ArrowLeft size={14} aria-hidden="true" /> Browse all stories</Link>
        </aside>

        <div className="story-reading__content">
          {sections.length ? sections.map((section, index) => (
            <section key={`${section.heading || "section"}-${index}`}>
              {section.heading && <h2>{section.heading}</h2>}
              {(Array.isArray(section.paragraphs) ? section.paragraphs : []).map((paragraph, paragraphIndex) => (
                <p key={paragraphIndex}>{paragraph}</p>
              ))}
              {Array.isArray(section.bulletPoints) && section.bulletPoints.length > 0 && (
                <ul>{section.bulletPoints.map((point, pointIndex) => <li key={pointIndex}>{point}</li>)}</ul>
              )}
            </section>
          )) : paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
          {html && <div className="story-reading__html" dangerouslySetInnerHTML={{ __html: html }} />}
          {!hasBody && <p className="story-reading__empty">The full story will be added here soon.</p>}
        </div>
      </div>

      <div className="story-detail__lower">
        {gallery.length > 0 && <ArticleGallery images={gallery} headingId="blog-story-gallery" title="A few more moments" />}

        {related.length > 0 && (
          <section className="story-more" aria-labelledby="story-more-title">
            <div className="story-more__heading">
              <div><span>Continue exploring</span><h2 id="story-more-title">More stories</h2></div>
              <Link to="/blogs">See all stories <ArrowUpRight size={16} aria-hidden="true" /></Link>
            </div>
            <div className="story-more__grid">
              {related.map((entry) => <RelatedStory key={entry.slug} post={entry} />)}
            </div>
          </section>
        )}

        <footer className="story-detail__footer">
          <span>Vidya Academy · Moodlakatte, Kundapura</span>
          <Link to="/blogs"><ArrowLeft size={15} aria-hidden="true" /> Return to stories</Link>
        </footer>
      </div>
    </article>
  );
}
