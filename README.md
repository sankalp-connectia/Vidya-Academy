# Vidya Academy Website

This repository contains the source code for the **Vidya Academy** official website. It is built as a decoupled architecture consisting of a **React + Vite** Single Page Application (frontend) and a custom **WordPress Content Manager Plugin** (backend).

---

## 📁 Repository Structure

```text
├── frontend/             # React + Vite frontend application
│   ├── public/           # Static assets, local school images, mascots, videos
│   ├── src/              # React components, routing, animations, and API layers
│   ├── .env.example      # Example environment configuration
│   └── package.json      # Frontend dependencies and scripts
└── wordpress-plugin/     # Custom WordPress CMS plugin
    └── vidya-academy-cms # Exposes REST API endpoints and admin content manager
```

---

## 🚀 Getting Started (Frontend)

### Prerequisites
* **Node.js** (v18 or higher recommended)
* **npm** (or yarn / pnpm)

### Setup & Run
1. Navigate into the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
   Set your WordPress backend URL:
   ```env
   VITE_WORDPRESS_URL=https://admin.vidyaacademy.school.in
   ```
   *(Note: Do not append `/wp-json` and do not add a trailing slash).*

4. Start development server:
   ```bash
   npm run dev
   ```

5. Build for production:
   ```bash
   npm run build
   ```
   The compiled static files will be generated in `frontend/dist/`.

---

## 🔌 WordPress Backend (Plugin)

The `wordpress-plugin/vidya-academy-cms` folder contains the WordPress plugin that powers the headless content management:

* Exposes the public REST endpoints:
  * `GET /wp-json/vidya/v1/content` (CMS content)
  * `GET /wp-json/vidya/v1/blogs` (Published blog posts)
  * `POST /wp-json/vidya/v1/enquiry` (Enquiry form submissions)
* Provides custom admin tabs in WordPress to edit navbar, footer, sections, admissions, and events.

---

## 🌐 Production Deployment

* **Frontend:** Hosted on CloudPanel as a **Static HTML Site** serving `frontend/dist/`.
* **NGINX Vhost SPA Fallback:**
  ```nginx
  location / {
      try_files $uri $uri/ /index.html;
  }
  ```
