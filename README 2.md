# Portfolio — smooth scroll & fresh preview edition

Ready-to-publish static website. No build step is required.

## Publish

Extract this ZIP and upload the contents of the portfolio folder to your repository, keeping index.html at its root. Keep .nojekyll and all subfolders. Use GitHub Desktop or Git for the complete package; uploading the ZIP itself does not publish its contents as a website. Enable GitHub Pages from the repository's main branch and root folder.

Both root domains and project paths are supported. All ten K12 lessons are included locally; the former Netlify site is no longer required.

## Quality

- Home retains the original globe.mp4 (1920×1080, 24 fps). Scrolling displays all 240 full-resolution frames extracted from it as lossless WebP. Every decoded RGB pixel was verified against the uncompressed frame export. Frames are decoded ahead in a bounded cache (up to 24 desktop / 12 mobile), avoiding repeated seeks through the original long video keyframe interval. The original video remains as a fallback. Edge colors are cached to avoid GPU pixel-readback stalls.
- All ten K12 thumbnail movies are byte-identical to BUILD copy/assets/thumbnail for k12. Original poster images are retained.
- Early Career uses the original thumbnail movies. Personal Branding includes its original 1080p video and original image/font files.
- All 100 PPT slides retain vector text/shapes and original-resolution lossless PNG/WebP image assets. Shared assets are stored once. The player loads individual slides and preloads the next slide after the current one loads, so visitors do not download all three decks before opening a preview.
- The three Other videos retain their original 1280×720 resolution, frame rates and full durations. High-quality AV1 encoding reduces size; these videos are not lossless. Playback was tested in Chrome. An AV1/Opus-capable browser is required for these three videos.
- Other thumbnail loops use seconds 5–10 of the original videos. PPT thumbnails use slide 2.

Source images cannot gain detail beyond their original resolution. No artificial upscaling is applied.

## Features

The confidentiality introduction resets on reload and page re-entry. Its three revealed cards display only thumbnails and have hover/focus animation. Private Bangkit materials are not included. All website UI is English; the three Other videos are labelled as Indonesian-language content. GPA 3.17 has been removed from Education. Every reopened preview starts fresh: videos at the beginning, decks at slide 1, and HTML courses in a new in-memory session. HTML progress persists only while that preview is open; unrelated browser storage is untouched. About portrait entrance and scroll effects no longer compete for the same transform, and event card hover transitions are independent of scroll animation.

PPT previews support Previous/Next and keyboard arrows, Home and End. They are vector slide previews, not a live PowerPoint engine: PowerPoint animations, slide hyperlinks and embedded slide videos are not reproduced. Editable original PPTX files are not duplicated in the web package.

## Local preview

Use a static HTTP server with byte-range support for MP4 seeking. Opening index.html directly as a file does not reliably support JavaScript modules. GitHub Pages can serve the finished static files.

## Editing

- assets/work-gallery.js — project descriptions, cards and preview players.
- assets/work-gallery.css — gallery and preview layout.
- assets/hero-source-video.js — full-resolution cached-frame scroll rendering.
- assets/preview-session.js — per-preview in-memory course progress.
- assets/site-paths.js — deployment-relative URLs.

Keep media/slides, media/slide-glyphs.svg and media/slide-images together. K12 lessons share their unchanged extracted binary assets under projects/k12/assets.
