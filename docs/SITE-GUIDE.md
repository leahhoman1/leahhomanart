# Site guide (share this whole file with anyone helping with the site)

You are helping me, a non-programmer artist, maintain my portfolio website. You may not be able to see my files.
**Ask me to paste any file you need to see**, and always reply with the **complete updated file**
(not a partial snippet or diff) so I can replace the whole file in GitHub's web editor. Tell me
the exact file path to edit. Keep changes small and explain them in plain language. If a change
would need a new npm package or touch several files, say so first and list every file.

## The project

- **Framework:** Astro 7 (static site), Tailwind CSS v4 (via `@tailwindcss/vite`, configured in CSS, with no `tailwind.config.js`)
- **Language:** TypeScript and `.astro` components. No React or Vue.
- **Hosting:** Netlify builds `npm run build` into `dist/` on every push to `main` (see `netlify.toml`).
- **Editor:** Pages CMS (`.pages.yml`) commits to the GitHub repo.
- **Other packages:** `photoswipe` (lightbox), `@fontsource-variable/fraunces` (headings), `@fontsource-variable/inter` (body text)
- **Checks:** a GitHub Action runs `npm run check` (astro check) and `npm run build` on each push and PR.

## How art gets on the site (important)

- Every image in `src/art/**` (jpg, jpeg, png, webp, avif, gif) is found automatically by
  `import.meta.glob` in `src/lib/artworks.ts`. **There is no list of artworks to update.**
- Optional details live in `src/content/artworks/*.md` (content collection `artworks`, schema in
  `src/content.config.ts`). Frontmatter fields: `image` (string, the path or filename in src/art, e.g. `/src/art/x.jpg`),
  `title`, `date`, `medium`, `size`, `description`, `excerpt` (carousel quote), `order` (number),
  `featured`, `sold`, `hidden`. A details file is matched to its image by path, falling back to the file name.
- **Artist's notes** are the Markdown body of the details file (below the closing `---`). When present, the artwork
  page shows a "The story behind it" section (`#story`) and the gallery card gets an "Artist's notes" badge.
- **Featured carousel** (`src/components/FeaturedCarousel.astro`) at the top of the home page shows every
  `featured: true` piece: image, title, `excerpt` (or the first ~180 characters of the notes), and a link.
  It uses CSS scroll-snap plus a small script for arrows, dots and gentle auto-advance.
- Without a details file, the title comes from the filename (`the-queen-of-hearts.webp` becomes "The Queen of Hearts",
  with small words kept lowercase) and an optional `YYYY`, `YYYY-MM` or `YYYY-MM-DD` prefix sets the date.
- Order: featured first, then by `order` (lowest first), then newest first, then undated pieces A to Z. `hidden: true` is skipped.
- `getArtworks()` returns `Artwork` objects: `{ slug, title, image (ImageMetadata), file, date?, medium?, size?,
  description?, excerpt?, order?, featured, sold, hasNotes, entry? }`. Render the notes with
  `const { Content } = await render(art.entry)` from `astro:content`.
- **Protection:** `scripts/prepare-art.mjs` runs automatically before `dev` and `build` (npm `predev`/`prebuild`).
  It copies every image from `src/art` to `src/generated/art` (git-ignored), shrinking it to 1600px max and adding
  a "© name" corner signature (sharp, Fraunces TTF in `scripts/fonts/`). **`getArtworks()` globs
  `src/generated/art`, never the originals.** Don't import from `src/art` directly, or unsigned full-size originals
  would be published. Also: right-click/drag blocking script in `Base.astro`, `img` no-drag CSS, a copyright
  notice on artwork pages and in the lightbox caption, and AI opt-out in `public/robots.txt`, a `noai` meta tag and `netlify.toml` headers.
- Images are optimised with `astro:assets` (`<Image>`, `getImage`) to WebP at several widths.

## Files

```
astro.config.mjs              site URL (change `site` when the domain is bought)
src/content.config.ts         content schemas (artworks, pages)
src/lib/artworks.ts           getArtworks(): finds images, merges details, sorts
src/data/site.json            name, tagline, description, email, instagram, otherLinks[{label,url}]
src/styles/global.css         Tailwind import, colour tokens (@theme), dark mode, .prose-art, .arch
src/layouts/Base.astro        <html>, SEO/share tags, header + nav, footer
src/pages/index.astro         home: <FeaturedCarousel>, then gallery (CSS columns masonry of <ArtCard>), plus <Lightbox>
src/components/FeaturedCarousel.astro  featured slideshow with quotes
src/pages/art/[slug].astro    one page per artwork: image, details, artist's notes ("The story behind it"), prev/next links
src/pages/about.astro         renders src/content/pages/about.md, plus email/Instagram buttons
src/pages/404.astro           not-found page
src/components/ArtCard.astro  arch-shaped card, links to /art/<slug>/, data-pswp-* for lightbox
src/components/Lightbox.astro PhotoSwipe setup + caption
src/components/Ornament.astro folk-art flower SVG
src/components/PapelPicado.astro  coloured bunting strip at the top
src/components/Wave.astro     wavy desert-hill divider above the footer
.pages.yml                    Pages CMS config (media → src/art)
netlify.toml, .nvmrc          build settings (Node 24)
```

## Design

Inspired by Georgia O'Keeffe (desert palette, soft organic curves, negative space) and Frida Kahlo
(bold folk-art accents, flowers, papel picado). Only the mood is borrowed, never their artwork.

Tailwind colour names (use as `bg-…`, `text-…`, `border-…`):
- Fixed: `bone` #f4ede2, `sand` #e6d3b3, `terracotta` #b5543a, `sage` #8a9a7b, `cobalt` #1f4fa3,
  `magenta` #c2185b, `marigold` #e8a317, `emerald` #1e7a4f, `ink` #1c1714
- Automatic light/dark: `page` (background), `surface` (cards), `text`, `muted`, `accent` (cobalt), `accent-2` (magenta)
- Fonts: `font-display` (Fraunces serif, often italic for titles), `font-sans` (Inter)
- `.arch` class: arch-topped shape. Elements using it need at least `pt-16` top padding.
- `.reveal` class: gentle fade-up on scroll (pure CSS, only in supporting browsers, off for reduced motion).
- `.notes` adds a magenta drop-cap to the first paragraph of the artist's notes.
- Dark mode follows the visitor's system setting through `prefers-color-scheme`. Prefer the automatic colours over fixed ones for text and backgrounds.

## Rules

- Art goes in `src/art/`. Text goes in `src/content/` or `src/data/site.json`. Don't hard-code artwork lists.
- Never crop the artwork. Images use `h-auto w-full` or `object-contain`.
- Keep it simple: no new frameworks. Only add npm packages if truly needed.
- After a change, I'll check the Netlify deploy. If the build fails I'll paste the error.

## How I apply your changes

On github.com I open the file, click the pencil (Edit), select all, paste your full file, and click
"Commit changes" (sometimes on a new branch, so Netlify gives me a preview first). To add a new file
I use "Add file", then "Create new file", and type the full path.

---
My request:
