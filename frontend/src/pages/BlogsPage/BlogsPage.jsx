import { useMemo } from "react";
import { ArrowUpRight } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { blogs, blogsPage } from "../../cms/siteContent.js";
import SEOHead from "../../components/SEO/SEOHead.jsx";
import scopeCss from "../SEOLandingPage/scopeCss.js";
import "./BlogsPage.css";

const POSTS_PER_PAGE = 12;

function orderedPosts(posts) {
  return posts
    .map((post, index) => ({ post, index, date: Date.parse(post.publishedAt || post.date || "") || 0 }))
    .sort((a, b) => (b.date - a.date) || (a.index - b.index))
    .map(({ post }) => post);
}

function formattedDate(value) {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(date);
}

function BlogCard({ post, index }) {
  return (
    <article className="blog-tile">
      <Link className="blog-tile__image" to={`/blogs/${post.slug}`} aria-label={`Read ${post.title}`}>
        <img src={post.image || post.fallbackImage} alt={post.imageAlt || post.title || "Vidya Academy story"} loading={index < 3 ? "eager" : "lazy"} decoding="async" onError={(event) => { const fallback = post.fallbackImage; if (fallback && event.currentTarget.src !== new URL(fallback, window.location.href).href) event.currentTarget.src = fallback; }} />
      </Link>
      <div className="blog-tile__body">
        <div className="blog-tile__meta">
          {post.category && <span>{post.category}</span>}
          {(post.publishedAt || post.date) && <time dateTime={post.publishedAt || post.date}>{formattedDate(post.publishedAt || post.date)}</time>}
        </div>
        <h2><Link to={`/blogs/${post.slug}`}>{post.title}</Link></h2>
        {(post.description || post.excerpt) && <p>{post.description || post.excerpt}</p>}
        <Link className="blog-tile__read" to={`/blogs/${post.slug}`}>{blogsPage.readMoreLabel || "Read story"}<ArrowUpRight size={16} aria-hidden="true" /></Link>
      </div>
    </article>
  );
}

export default function BlogsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedPage = Math.max(1, Number.parseInt(searchParams.get("page") || "1", 10) || 1);
  const sortedPosts = useMemo(() => orderedPosts(blogs), []);
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
      <div className="vidya-blogs__inner">
        <header className="blogs-heading">
          <h1 className="site-page-title">{blogsPage.title || "Stories from Vidya"}</h1>
          {blogsPage.description && <p>{blogsPage.description}</p>}
          {sortedPosts.length > 0 && <span>{String(sortedPosts.length).padStart(2, "0")} stories</span>}
        </header>
        {visiblePosts.length ? (
          <section className="blogs-grid" aria-label="Stories from Vidya Academy">
            {visiblePosts.map((post, index) => <BlogCard key={post.slug} post={post} index={index} />)}
          </section>
        ) : (
          <section className="blogs-empty" role="status">
            <span className="blogs-empty__mark" aria-hidden="true">V</span>
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
      )}
    </main>
  );
}
