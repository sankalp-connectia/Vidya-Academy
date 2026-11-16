import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import "./index.css";
import { loadWordPressContent } from "./cms/wordpressApi.js";

if (typeof window !== "undefined") {
  window.history.scrollRestoration = "manual";
  window.__VIDYA_HOME_INTRO_DONE__ ??= window.location.pathname !== "/" || Boolean(window.location.hash);
}

const root = ReactDOM.createRoot(document.getElementById("root"));

function renderApplication() {
  root.render(
    <React.StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </React.StrictMode>,
  );
}

async function startWebsite() {
  renderApplication();
  try {
    const loaded = await loadWordPressContent();
    if (loaded) renderApplication();
  } catch {
    // Keep the bundled pages and photos visible when WordPress is unavailable.
  }
}

void startWebsite();
