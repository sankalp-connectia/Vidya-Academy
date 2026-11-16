import "./ArticleGallery.css";

export default function ArticleGallery({ images, headingId, title = "Gallery" }) {
  const photos = Array.isArray(images) ? images.filter((photo) => photo?.image).slice(0, 2) : [];
  if (!photos.length) return null;

  return (
    <section className="article-gallery" aria-labelledby={headingId}>
      <h2 className="site-content-title" id={headingId}>{title}</h2>
      <div className="article-gallery__photos">
        {photos.map(({ image, imageAlt, heading, caption }, index) => (
          <figure key={`${image}-${index}`}>
            {heading && <h3>{heading}</h3>}
            <img src={image} alt={imageAlt || ""} width="1200" height="900" loading="lazy" decoding="async" />
            {caption && <figcaption>{caption}</figcaption>}
          </figure>
        ))}
      </div>
    </section>
  );
}
