# Vidya Academy website

This folder contains the React/Vite frontend and the matching WordPress content plugin. Bundled content and photos render first, so the website opens without WordPress. When WordPress is reachable, saved copy and media replace the local defaults. New or edited content remains manageable in WordPress.

## Run the frontend locally

1. Install Node.js and npm.
2. Run `npm install`.
3. Optionally copy `.env.example` to `.env.local` and set `VITE_WORDPRESS_URL` to the base URL of your WordPress site (do not add `/wp-json`).
4. Run `npm run dev`. The website renders from bundled content immediately. When WordPress is configured and reachable, its saved content replaces the defaults. Page viewing and bundled photos do not require WordPress; enquiries and CMS updates do.

## WordPress setup

Install the included **Vidya Academy Content Manager 1.9.18** plugin. It provides the public `/wp-json/vidya/v1/content` and `/wp-json/vidya/v1/blogs` APIs, image and video Media Library pickers, direct hosted URL fields, and the existing enquiry endpoint. The plugin upgrade keeps saved WordPress content and blog posts.

Blog title, URL, summary, date, featured image, and article body remain editable in WordPress. The article editor has Visual and Text modes. An uploaded WordPress featured image is used for that post; posts without one use a matching Vidya Academy photo bundled in `public/images/school`. Old Unsplash blog cover URLs are replaced by local school photos. Blog article text uses a wider responsive reading column.

In **Vidya Content**, edit each page and section, then upload/select media or paste its public URL. Existing images from the old project are included as defaults; a blank image field uses the matching bundled image, and known old stock-photo URLs are converted to local school images. A WordPress Media Library image or hosted URL replaces that default. Brand and mascot files are served directly by the plugin so previews work from both WordPress and the React site. Use the included `HOMEPAGE-IMAGE-GUIDE.md` for image export sizes and WordPress field names.

The homepage hero supports a desktop MP4 and optional portrait phone MP4. For the 1.1 GB video, upload it to a video host or object storage/CDN that supports direct MP4 playback and byte-range requests, then paste the public URL into **Home → Hero → Hero background video**. The video itself is not included in the site or plugin ZIP.

Allow the frontend origin in WordPress CORS settings if the hosting server blocks cross-origin requests.

## Build

Run `npm run build`. For Vercel, set `VITE_WORDPRESS_URL` in the project environment and redeploy.
