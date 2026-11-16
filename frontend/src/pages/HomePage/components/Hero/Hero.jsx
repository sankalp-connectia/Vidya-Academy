import { useEffect, useRef, useState } from "react";
import { ArrowRight, Pause, Play } from "lucide-react";
import { Link } from "react-router-dom";
import { homeCopy } from "../../../../cms/siteContent.js";
import "./Hero.css";

const phoneVideoQuery = "(max-width: 768px) and (orientation: portrait)";
const reducedMotionQuery = "(prefers-reduced-motion: reduce)";

export default function Hero({ introActive }) {
  const { hero } = homeCopy;
  const video = useRef(null);
  const pausedByVisitor = useRef(false);
  const [phoneLayout, setPhoneLayout] = useState(() => window.matchMedia(phoneVideoQuery).matches);
  const [playing, setPlaying] = useState(false);
  const [failedSource, setFailedSource] = useState(null);
  const desktopVideo = hero.video || "";
  const phoneVideo = hero.mobileVideo || desktopVideo;
  const source = phoneLayout ? phoneVideo : desktopVideo;
  const poster = phoneLayout
    ? hero.mobilePosterImage || hero.posterImage || undefined
    : hero.posterImage || hero.mobilePosterImage || undefined;

  useEffect(() => {
    const query = window.matchMedia(phoneVideoQuery);
    const updateLayout = () => setPhoneLayout(query.matches);
    query.addEventListener("change", updateLayout);
    return () => query.removeEventListener("change", updateLayout);
  }, []);

  useEffect(() => {
    const media = video.current;
    if (!media) return undefined;
    const motion = window.matchMedia(reducedMotionQuery);
    let visible = true;

    function updatePlayback() {
      if (!visible || document.hidden || pausedByVisitor.current || motion.matches) {
        media.pause();
        return;
      }
      media.play().catch(() => {});
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      updatePlayback();
    }, { threshold: 0.15 });

    observer.observe(media);
    motion.addEventListener("change", updatePlayback);
    document.addEventListener("visibilitychange", updatePlayback);
    return () => {
      observer.disconnect();
      motion.removeEventListener("change", updatePlayback);
      document.removeEventListener("visibilitychange", updatePlayback);
      media.pause();
    };
  }, [source]);

  function togglePlayback() {
    const media = video.current;
    pausedByVisitor.current = !media.paused;
    if (media.paused) {
      media.play().catch(() => {});
    } else {
      media.pause();
    }
  }

  return (
    <section className="raya-hero" id="home" data-navbar-hero>
      <div className="raya-hero-media" aria-hidden="true">
        {source && <video
          key={source}
          ref={video}
          className="raya-hero-video"
          src={source}
          poster={poster}
          preload="metadata"
          loop
          muted
          playsInline
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onError={() => {
            setFailedSource(source);
            setPlaying(false);
          }}
        />}
      </div>

      <div className="raya-hero-container" inert={introActive}>
        <div className="raya-hero-content">
          <h1 className="site-page-title raya-hero-title">
            <span>{hero.title[0]}</span>
            <span>{hero.title[1]} <em>{hero.title[2]}</em></span>
          </h1>
          <p className="raya-hero-description">{hero.description}</p>
          <div className="raya-hero-actions">
            <Link to="/admissions" className="raya-hero-button raya-hero-apply">{hero.apply}</Link>
            <a href="#about" className="raya-hero-button raya-hero-secondary">
              {hero.explore} <ArrowRight size={16} aria-hidden="true" />
            </a>
          </div>
        </div>
        {source && failedSource !== source && (
          <button
            className="raya-hero-playback"
            type="button"
            onClick={togglePlayback}
            aria-label={playing ? "Pause background video" : "Play background video"}
            title={playing ? "Pause background video" : "Play background video"}
          >
            {playing ? <Pause size={19} aria-hidden="true" /> : <Play size={19} aria-hidden="true" />}
          </button>
        )}
      </div>
    </section>
  );
}
