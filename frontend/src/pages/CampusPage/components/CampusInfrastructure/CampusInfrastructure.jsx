import { campusFallbackImage, buildingImages, groundsImages, introText } from "../../../../cms/siteContent.js";
import "./CampusInfrastructure.css";

export default function CampusInfrastructure() {
  const photos = [...groundsImages, ...buildingImages].filter(
    (photo) => photo && typeof photo.src === "string" && photo.src,
  );

  const handleImageError = (event) => {
    const image = event.currentTarget;
    if (image.dataset.fallbackApplied === "true") {
      image.removeAttribute("src");
      image.hidden = true;
      return;
    }

    image.dataset.fallbackApplied = "true";
    if (campusFallbackImage && image.src !== campusFallbackImage) {
      image.src = campusFallbackImage;
    } else {
      image.removeAttribute("src");
      image.hidden = true;
    }
  };

  return (
    <section className="campus-infrastructure" aria-labelledby="campus-infrastructure-title">
      <div className="campus-infrastructure__inner">
        <header className="campus-infrastructure__header">
          <h2 id="campus-infrastructure-title">Infrastructure</h2>
          <p>{introText}</p>
        </header>

        <div className="campus-infrastructure__gallery">
          {photos.map((photo, index) => (
            <figure className="campus-infrastructure__photo" key={`${photo.src}-${index}`}>
              <img
                src={photo.src}
                alt={photo.alt || "A learning space at Vidya Academy"}
                loading={index < 4 ? "eager" : "lazy"}
                fetchPriority={index === 0 ? "high" : "auto"}
                decoding="async"
                draggable="false"
                onError={handleImageError}
              />
              <figcaption>{photo.alt}</figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
