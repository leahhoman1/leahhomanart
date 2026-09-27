# Leah Homan Art

This is the code for Leah Homan's art portfolio website. You don't need to know how to code to keep it updated.

- **Built with:** [Astro](https://astro.build) and [Tailwind CSS](https://tailwindcss.com)
- **Hosted on:** [Netlify](https://netlify.com), which rebuilds the site automatically about a minute after any change
- **Web editor:** [Pages CMS](https://app.pagescms.org), for uploading art and editing text from any browser or phone
- **Getting help:** share [docs/SITE-GUIDE.md](docs/SITE-GUIDE.md) with whoever is helping, then ask your question

---

## Contents

1. [Adding art (the easy way: Pages CMS)](#1-adding-art-the-easy-way-pages-cms)
2. [Adding art (GitHub website, no editor)](#2-adding-art-without-the-editor-github-website)
3. [Naming, sizes, featuring and hiding](#3-naming-image-sizes-featuring-and-hiding)
4. [Editing the About page, your name and contact links](#4-editing-the-about-page-your-name-and-contact-links)
5. [Things to fill in before launch](#5-things-to-fill-in-before-launch)
6. [Getting help with changes](#6-getting-help-with-changes)
7. [Checking and undoing changes](#7-checking-and-undoing-changes)
8. [One-time setup: GitHub, Netlify, Pages CMS](#8-one-time-setup)
9. [Connecting your own domain](#9-connecting-your-own-domain)
10. [Keeping the site up to date](#10-keeping-the-site-up-to-date)
11. [Working on your computer (optional)](#11-working-on-your-computer-optional)
12. [Where things live](#12-where-things-live)

---

## 1. Adding art (the easy way: Pages CMS)

1. Go to **https://app.pagescms.org** and sign in with GitHub.
2. Open the **leahhomanart** project.
3. **To just add a picture:** click **Media**, then **Upload**, and choose your image or images.
   You're done. It appears on the site in about a minute, with a title made from the file name.
4. **To add details** (title, medium, size, description), click **Artwork details**, then **Add an entry**.
   Choose the image (upload it here or pick one already in Media), fill in what you like, and click **Save**.

Every save is recorded on GitHub, and Netlify updates the live site automatically.

## 2. Adding art without the editor (GitHub website)

1. Go to your repository on github.com and open the folder **`src/art`**.
2. Click **Add file**, then **Upload files**, and drag your images in.
3. Click **Commit changes**.

That's all. Every image in `src/art` (including subfolders) appears on the site automatically.

## 3. Naming, image sizes, featuring and hiding

**File names become titles.** Words are separated by dashes:

| File name | Title shown | Date used for ordering |
|---|---|---|
| `blue-heron.jpg` | Blue Heron | none (listed after dated work) |
| `2026-08-blue-heron.jpg` | Blue Heron | August 2026 |
| `2026-08-14-blue-heron.jpg` | Blue Heron | 14 Aug 2026 |

- **Order:** featured pieces come first, then newest to oldest, then undated pieces A to Z.
- **Image size:** export at about **3000 pixels on the longest side**, as JPG (quality around 85) or WebP.
  Keep each file **under 20 MB**. GitHub refuses files over 100 MB. The site makes small, fast versions automatically, so you never need to resize for the web yourself.
- **Formats:** jpg, jpeg, png, webp, avif, gif
- **Feature a piece:** in Pages CMS open its *Artwork details* and tick **Featured**.
  It gets a big slide in the carousel at the top of the home page and comes first in the gallery.
  Use **Order** (1, 2, 3…) to choose the slide order.
- **Share your thoughts on a piece:** write in **Artist's notes** in its *Artwork details*. The piece's page gets a
  "The story behind it" section, and its gallery card shows an "✎ Artist's notes" badge. Pieces without notes
  just show the art. The carousel shows the first sentence or two of your notes, or whatever you put in **Carousel quote**.
  (In the files, the notes are the text below the second `---` line of `src/content/artworks/<name>.md`.)
- **Hide a piece** without deleting it: tick **Hidden**.
- **Mark as sold:** tick **Sold**.
- **Delete a piece:** delete the image in Pages CMS *Media* (or on GitHub in `src/art`), and delete its *Artwork details* entry if it has one.

### How your art is protected

No website can stop someone taking a screenshot, but this one makes copying harder and keeps your name on the work:

- **Signed web copies:** before every build, `scripts/prepare-art.mjs` makes a copy of each image with a small
  "© Leah Homan" signature in the corner, shrunk to at most **1600px**. Visitors only ever get these copies, which are
  fine on screen and poor for printing. **Your originals in `src/art` are never changed.**
  (To change the size or how visible the signature is, edit the numbers at the top of that script.)
- Right-click "Save image", dragging images out, and the long-press save menu on phones are turned off.
- Each artwork page shows "© Leah Homan. All rights reserved…", and so does the lightbox caption.
- AI companies are asked not to train on your work (`public/robots.txt`, page tags, and headers in `netlify.toml`).
  The big companies say they respect this. Not everyone does.
- **Important:** make the GitHub repository **Private** (GitHub, then **Settings**, then **Danger Zone**, then **Change visibility**).
  Otherwise anyone can download your full-size originals straight from GitHub. Netlify and Pages CMS keep working.

## 4. Editing the About page, your name and contact links

In Pages CMS:
- **About page** holds your bio text.
- **Site settings** holds your name, the tagline under it, your contact email, Instagram link and any other links.
  Links left empty are simply not shown.

## 5. Things to fill in before launch

- **Artist's notes placeholders:** five featured pieces (Lady Winter, Bloom and Bone, The Queen of Hearts,
  Hearth Witch, Crystal Falls) have placeholder text that starts with *"Placeholder: write your thoughts…"*.
  Replace it with your own words, or tick off **Featured** and clear the notes.
- **Titles:** most titles were made up from what's in each picture. Rename any in *Artwork details*
  (or rename the file in `src/art`).
- **Mediums and dates:** only a few are filled in. Add them in *Artwork details*.
- **About page, email and Instagram:** in *About page* and *Site settings*.

## 6. Getting help with changes

Whoever is helping you (in a chat, by email…) probably can't see your website files, so give them the context first:

1. Open [docs/SITE-GUIDE.md](docs/SITE-GUIDE.md) on GitHub, click the **copy** icon (top right of the file), and paste it at the start of the conversation.
2. Then ask for what you want, e.g. *"I want the gallery to show 4 columns on big screens."*
3. They'll ask you for the file they need. Open that file on GitHub and copy its contents across.
4. You get back the **whole updated file**. On GitHub, open the file, click the **pencil icon** (Edit), select everything, paste, and click **Commit changes**.
5. Wait about a minute, then check the site. If something looks wrong, see *Undoing a mistake* below.

**Tip:** for bigger changes, commit on a new branch (GitHub offers this when you commit: choose *Create a new branch*). Netlify then builds a private preview you can check before it goes live. See section 7.

## 7. Checking and undoing changes

- **Is my change live?** In Netlify, open your site, then **Deploys**. The top entry says *Published* when it's done.
  On GitHub, a green ✓ next to your change means it built fine and a red ✗ means something broke. The live site keeps showing the last working version until it's fixed, so nothing breaks for visitors.
- **Preview before publishing:** when you commit on GitHub, choose **Create a new branch and start a pull request**. Netlify posts a *Deploy Preview* link on that pull request. If it looks good, click **Merge pull request** to make it live.
- **Undoing a mistake:**
  - *Easiest:* in Netlify, go to **Deploys**, click an older deploy that looked right, then **Publish deploy**. The site is back instantly. Then fix or undo the change on GitHub so the next update doesn't bring the problem back.
  - *On GitHub:* open **Commits**, find the change, and use **Revert** (available on pull requests). Or edit the file back by hand.
- **If something breaks:** click the red ✗, then **Details**, copy the error text, and share it along with docs/SITE-GUIDE.md.

## 8. One-time setup

**GitHub** (stores the site's files)
1. Create a free account at github.com.
2. Create a new repository named `leahhomanart` (Public or Private, both work).
3. Upload this project to it. See section 11.

**Netlify** (puts the site online)
1. Sign up at netlify.com **with your GitHub account**.
2. Click **Add new site**, then **Import an existing project**, choose GitHub, and pick `leahhomanart`.
3. Netlify reads the settings from `netlify.toml`, so just click **Deploy**.
4. You get an address like `something.netlify.app`. Change it under **Site configuration**, then **Change site name** (e.g. `leahhomanart`, giving `leahhomanart.netlify.app`).

**Pages CMS** (the web editor)
1. Go to app.pagescms.org and sign in with GitHub.
2. Install the Pages CMS GitHub app when asked, and give it access to the `leahhomanart` repository.
3. Open the project. The menu (Media, Artwork details, About page, Site settings) comes from `.pages.yml`.

## 9. Connecting your own domain

1. Buy a domain from any registrar (Netlify, Cloudflare, Namecheap, Porkbun...).
2. In Netlify go to **Domain management**, click **Add a domain**, and follow the steps. It either gives you nameservers to set at your registrar or a couple of DNS records to add. HTTPS (the padlock) is set up for free automatically.
3. In this project, open `astro.config.mjs` and change `site: 'https://leahhomanart.netlify.app'` to your new address, e.g. `site: 'https://leahhomanart.com'`. This makes share links and previews use the right address.

## 10. Keeping the site up to date

- Once a month GitHub (Dependabot) opens a pull request titled something like *"Bump the all-dependencies group"*.
- Wait for the green ✓ and open Netlify's **Deploy Preview** link on it. If the site looks normal, click **Merge pull request**.
- If it shows a red ✗, you can leave it alone. The live site is unaffected. Share the error with whoever helps you, or close the pull request and try the next month's.
- Everything here is standard and portable: your art is plain image files and your text is plain Markdown/JSON. The site could move to another host (Cloudflare Pages, GitHub Pages, etc.) without changing your content.

## 11. Working on your computer (optional)

Only needed for bigger changes. Requires [Node.js](https://nodejs.org) (LTS) and [Git](https://git-scm.com).

```bash
npm install        # first time only
npm run dev        # preview at http://localhost:4321 (updates as you edit)
npm run build      # build the final site into dist/
npm run check      # check for mistakes
```

Upload changes: `git add -A`, then `git commit -m "Describe the change"`, then `git push`.

## 12. Where things live

```
src/art/                    ← YOUR ART. Every image here is shown on the site.
src/content/artworks/       ← Optional details per piece (title, medium, description…)
src/content/pages/about.md  ← About page text
src/data/site.json          ← Name, tagline, email, Instagram, other links
src/styles/global.css       ← Colours and fonts
src/layouts/Base.astro      ← Header, menu and footer on every page
src/pages/                  ← The pages: index (gallery), about, art/[slug] (one per artwork)
src/components/             ← Building blocks: artwork card, lightbox, decorations
src/lib/artworks.ts         ← Finds all the art and works out titles, dates and order
.pages.yml                  ← Web editor (Pages CMS) setup
netlify.toml                ← Hosting setup
docs/SITE-GUIDE.md          ← Share with anyone helping with the site
```
