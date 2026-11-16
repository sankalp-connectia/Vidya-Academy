import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import ArticleGallery from "../../components/ArticleGallery/ArticleGallery";
import ResponsiveImage from "../../components/ResponsiveImage/ResponsiveImage";
import { blogs, blogsPage } from "../../cms/siteContent.js";
import SEOHead from "../../components/SEO/SEOHead.jsx";
import NotFoundPage from "../NotFoundPage/NotFoundPage";
import scopeCss from "../SEOLandingPage/scopeCss.js";
import "./BlogDetailPage.css";

function formattedDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric" }).format(date);
}

export default function BlogDetailPage() {
  const { slug } = useParams();
  const post = blogs.find((entry) => entry.slug === slug);
  if (!post) return <NotFoundPage />;

  const sections = Array.isArray(post.content) ? post.content : [];
  const paragraphs = Array.isArray(post.details) ? post.details : [];
  const dateValue = post.publishedAt || post.date;
  const date = formattedDate(dateValue);
  const summary = post.description || post.excerpt;
  const pageTitle = post.metaTitle || post.seoTitle || `${post.title} | Vidya Academy`;
  const customHtml = typeof post.customHtml === "string" ? post.customHtml.trim() : "";

  return (
    <article className="journal-story">
      <SEOHead
        title={pageTitle}
        description={post.metaDescription || summary || `Read ${post.title} from Vidya Academy.`}
        canonicalPath={`/blogs/${post.slug}`}
        image={post.image}
        schema={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.metaDescription || summary || "",
          image: post.image ? [post.image] : undefined,
          datePublished: dateValue || undefined,
          author: post.author ? { "@type": "Person", name: post.author } : { "@type": "Organization", name: "Vidya Academy" },
          publisher: { "@type": "Organization", name: "Vidya Academy" },
        }}
      />
      <div className="journal-story__shell">
        <nav className="journal-story__back" aria-label="Blog navigation">
          <Link to="/blogs"><ArrowLeft size={15} aria-hidden="true" /> All stories</Link>
          <span>Vidya Academy Journal</span>
        </nav>

        <header className={`journal-story__hero${post.image ? " has-image" : ""}`}>
          <div className="journal-story__hero-copy">
            <div className="journal-story__meta">
              <span>{post.category || "Vidya Journal"}</span>
              {date && <time dateTime={dateValue}>{date}</time>}
            </div>
            <h1 className="site-page-title">{post.title}</h1>
            {summary && <p className="journal-story__summary">{summary}</p>}
            {post.author && <p className="journal-story__author">Words by {post.author}</p>}
          </div>
          {post.image && (
          <figure className="journal-story__cover">
            <ResponsiveImage
              pictureClassName="journal-story__cover-picture"
              className="journal-story__cover-image"
              src={post.image}
              mobileImage={post.mobileImage}
              alt={post.imageAlt || post.title || "Vidya Academy blog photo"}
              width="1600"
              height="1200"
              fetchPriority="high"
              onError={(event) => {
                const fallback = post.fallbackImage;
                if (fallback && event.currentTarget.src !== new URL(fallback, window.location.href).href) {
                  event.currentTarget.src = fallback;
                }
              }}
            />
            {post.imageHeading && <h2 className="journal-story__image-heading">{post.imageHeading}</h2>}
            {post.imageCaption && <figcaption>{post.imageCaption}</figcaption>}
          </figure>
          )}
        </header>

        {customHtml ? (
          <div className="journal-story__custom-shell">
            {post.customCss && <style>{scopeCss(post.customCss, `blog-${post.slug}`)}</style>}
            <div id="seo-custom-page" className="journal-story__custom" dangerouslySetInnerHTML={{ __html: customHtml }} />
          </div>
        ) : (
        <div className="journal-story__reading">
          <aside className="journal-story__side-note" aria-label="Story details">
            <span>Vidya Academy</span>
            {post.category && <span>{post.category}</span>}
            {date && <time dateTime={dateValue}>{date}</time>}
            <Link to="/blogs">More stories <ArrowUpRight size={14} aria-hidden="true" /></Link>
          </aside>

          <div className="journal-story__article">
            {sections.length ? sections.map((section, index) => (
              <section key={`${section.heading || "section"}-${index}`}>
                {section.heading && <h2>{section.heading}</h2>}
                {(section.paragraphs || []).filter(Boolean).map((paragraph, paragraphIndex) => <p key={paragraphIndex}>{paragraph}</p>)}
                {section.bulletPoints?.filter(Boolean).length > 0 && <ul>{section.bulletPoints.filter(Boolean).map((point, pointIndex) => <li key={pointIndex}>{point}</li>)}</ul>}
              </section>
            )) : paragraphs.filter(Boolean).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
            {post.contentHtml && <div className="journal-story__html" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />}
          </div>
        </div>
        )}

        <div className="journal-story__afterword">
          <ArticleGallery images={post.gallery} headingId="blog-story-gallery" title={post.galleryTitle || "A closer look"} />
          <footer>
            <span>Vidya Academy · Moodlakatte</span>
            <Link to="/blogs"><ArrowLeft size={15} aria-hidden="true" /> Back to all stories</Link>
          </footer>
        </div>
      </div>
    </article>
  );
}
