import { aboutCopy } from "../../../../cms/siteContent.js";
import "./AboutChairmanVoice.css";

export default function AboutChairmanVoice() {
  const voice = aboutCopy.chairmanVoice;

  return (
    <section className="about-chairman-voice" aria-labelledby="about-chairman-title">
      <div className="about-chairman-voice__artwork-wrap">
        <h2 className="about-chairman-voice__artwork-title">
          {voice.artworkTitle ?? "A Legacy That Lives On"}
        </h2>
        <figure className="about-chairman-voice__artwork">
          <img
            src={voice.image ?? "/media/about/vision-generations-1200x800.jpeg"}
            alt={voice.imageAlt ?? "A vision that continues to inspire generations"}
            loading="lazy"
          />
        </figure>
      </div>
      <div className="about-chairman-voice__inner">
        <div className="about-chairman-voice__heading">
          <p className="about-chairman-voice__eyebrow">{voice.eyebrow}</p>
          <h2 id="about-chairman-title" className="site-section-title">{voice.title}</h2>
          <p className="about-chairman-voice__byline">{voice.name}<span>{voice.role}</span></p>
        </div>
        <div className="about-chairman-voice__message">
          <span className="about-chairman-voice__quote-mark" aria-hidden="true">“</span>
          <blockquote>{voice.quote}</blockquote>
          <p>{voice.continuation}</p>
          <p className="about-chairman-voice__closing">{voice.closing}</p>
        </div>
      </div>
    </section>
  );
}
