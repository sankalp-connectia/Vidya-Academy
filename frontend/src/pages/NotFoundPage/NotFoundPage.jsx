import { Link } from "react-router-dom";
import { notFoundPage } from "../../cms/siteContent.js";
import "./NotFoundPage.css";

export default function NotFoundPage() {
  return (
    <section className="not-found-page" aria-labelledby="not-found-title">
      <div className="not-found-page__art" aria-hidden="true">
        <span>404</span>
        <i />
      </div>
      <div className="not-found-page__content">
        <p className="not-found-page__eyebrow">{notFoundPage.eyebrow}</p>
        <h1 id="not-found-title" className="site-page-title">{notFoundPage.title}</h1>
        <p className="not-found-page__description">{notFoundPage.description}</p>
        <Link className="not-found-page__link" to="/">
          {notFoundPage.homeLink}<span aria-hidden="true">↗</span>
        </Link>
      </div>
      <div className="not-found-page__semicircle" aria-hidden="true" />
    </section>
  );
}
