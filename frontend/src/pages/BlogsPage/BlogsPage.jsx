import { useMemo } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { blogs, blogsPage } from "../../cms/siteContent.js";
import SEOHead from "../../components/SEO/SEOHead.jsx";
import scopeCss from "../SEOLandingPage/scopeCss.js";
import "./BlogsPage.css";

const POSTS_PER_PAGE = 12;
const BLOG_HERO_IMAGE = "/images/school/school-community.webp";

function orderedPosts(posts) {
  return posts
    .map((post, index) => ({ post, index, date: Date.parse(post.publishedAt || post.date || "") || 0 }))
    .sort((a, b) => (b.date - a.date) || (a.index - b.index))
    .map(({ post }) => post);
}

function formattedDate(value) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ""
    : new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(date);
}

function BlogCard({ post, index }) {
  const postUrl = `/blogs/${post.slug}`;
  const image = post.image || post.fallbackImage;

  return (
    <article className="blog-tile">
      <Link className="blog-tile__image" to={postUrl} aria-label={`Read ${post.title}`}>
        {image && (
          <img
            src={image}
            alt={post.imageAlt || post.title || "Vidya Academy story"}
            loading={index < 3 ? "eager" : "lazy"}
            decoding="async"
            onError={(event) => {
              const fallback = post.fallbackImage;
              if (fallback && event.currentTarget.src !== new URL(fallback, window.location.href).href) {
                event.currentTarget.src = fallback;
              }
            }}
          />
        )}
      </Link>
      <div className="blog-tile__body">
        <div className="blog-tile__meta">
          {post.category && <span>{post.category}</span>}
          {(post.publishedAt || post.date) && (
            <time dateTime={post.publishedAt || post.date}>{formattedDate(post.publishedAt || post.date)}</time>
          )}
        </div>
        <h2><Link to={postUrl}>{post.title}</Link></h2>
        {(post.description || post.excerpt) && <p>{post.description || post.excerpt}</p>}
        <Link className="blog-tile__read" to={postUrl}>
          {blogsPage.readMoreLabel || "Read story"}
          <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </article>
  );
}

export default function BlogsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedPage = Math.max(1, Number.parseInt(searchParams.get("page") || "1", 10) || 1);
  // WordPress blog posts load asynchronously; recalculate when the live CMS
  // array changes so the first empty render does not get cached permanently.
  const sortedPosts = useMemo(() => orderedPosts(blogs), [blogs]);
  const pageCount = Math.max(1, Math.ceil(sortedPosts.length / POSTS_PER_PAGE));
  const currentPage = Math.min(requestedPage, pageCount);
  const visiblePosts = sortedPosts.slice((currentPage - 1) * POSTS_PER_PAGE, currentPage * POSTS_PER_PAGE);
  const customHtml = typeof blogsPage.contentHtml === "string" ? blogsPage.contentHtml.trim() : "";
  const customCss = typeof blogsPage.customCss === "string" ? blogsPage.customCss : "";
  const goToPage = (page) => {
    const params = new URLSearchParams(searchParams);
    if (page <= 1) params.delete("page");
    else params.set("page", String(page));
    setSearchParams(params);
  };

  return (
    <main className="vidya-blogs">
      <SEOHead
        title={blogsPage.metaTitle || `${blogsPage.title || "Stories from Vidya"} | Vidya Academy`}
        description={blogsPage.metaDescription || blogsPage.description || "News, activities and stories from Vidya Academy in Moodlakatte, Kundapura."}
        canonicalPath="/blogs"
      />
      {customHtml ? (
        <>
          {customCss && <style>{scopeCss(customCss, "blogs-index")}</style>}
          <div id="seo-custom-page" className="blogs-custom-page" dangerouslySetInnerHTML={{ __html: customHtml }} />
        </>
      ) : (
        <>
          <header className="blogs-hero">
            <img className="blogs-hero__image" src={blogsPage.heroImage || BLOG_HERO_IMAGE} alt="" fetchPriority="high" />
            <div className="blogs-hero__content">
              <div className="blogs-hero__inner">
                <p className="blogs-hero__eyebrow">{blogsPage.eyebrow || "Vidya Academy Journal"}</p>
                <h1 className="site-page-title">{blogsPage.title || "Stories from Vidya"}</h1>
                {blogsPage.description && <p className="blogs-hero__description">{blogsPage.description}</p>}
                {sortedPosts.length > 0 && (
                  <p className="blogs-hero__count">
                    <span aria-hidden="true" />
                    {String(sortedPosts.length).padStart(2, "0")} stories from our learning community
                  </p>
                )}
              </div>
            </div>
          </header>

          <div className="vidya-blogs__inner">
            {visiblePosts.length ? (
              <section className="blogs-grid" aria-label="Stories from Vidya Academy">
                {visiblePosts.map((post, index) => <BlogCard key={post.slug} post={post} index={index} />)}
              </section>
            ) : (
              <section className="blogs-empty" role="status">
                <span className="blogs-empty__eyebrow">Coming soon</span>
                <h2>{blogsPage.emptyTitle || "Stories are on their way"}</h2>
                <p>{blogsPage.emptyDescription || "Please check back soon for stories from Vidya Academy."}</p>
              </section>
            )}
            {pageCount > 1 && (
              <nav className="blogs-pagination" aria-label="Blog pages">
                <button type="button" onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>Previous</button>
                <span>{currentPage} <i>/</i> {pageCount}</span>
                <button type="button" onClick={() => goToPage(currentPage + 1)} disabled={currentPage === pageCount}>Next</button>
              </nav>
            )}
          </div>
        </>
      )}
    </main>
  );
}
