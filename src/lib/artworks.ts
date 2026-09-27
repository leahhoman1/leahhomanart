// Collects every artwork for the site.
//
// HOW IT WORKS
// 1. Every image inside src/art (including subfolders) is picked up automatically.
//    The site actually uses the signed, size-limited web copies in src/generated/art,
//    made by scripts/prepare-art.mjs before every dev/build run.
// 2. If a matching file exists in src/content/artworks/*.md, its details
//    (title, medium, notes...) are used. Otherwise sensible defaults
//    are made from the file name:
//      "2026-08-blue-heron.jpg"  ->  title "Blue Heron", dated August 2026
// 3. Order: featured pieces first (by their "order" number), then any other
//    pieces with an "order" number, then newest first, then undated pieces A-Z.
import type { ImageMetadata } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';

export interface Artwork {
  slug: string;
  title: string;
  image: ImageMetadata;
  /** Path inside src/art, e.g. "paintings/blue-heron.jpg" */
  file: string;
  date?: Date;
  medium?: string;
  size?: string;
  description?: string;
  /** Short quote shown in the featured carousel */
  excerpt?: string;
  order?: number;
  featured: boolean;
  sold: boolean;
  /** True when the details file has artist's notes written below the --- lines */
  hasNotes: boolean;
  /** The details file, if there is one (used to show the artist's notes) */
  entry?: CollectionEntry<'artworks'>;
}

const files = import.meta.glob<{ default: ImageMetadata }>(
  '/src/generated/art/**/*.{jpg,jpeg,png,webp,avif,gif,JPG,JPEG,PNG,WEBP,AVIF,GIF}',
  { eager: true },
);

const DATE_PREFIX = /^(\d{4})(?:-(\d{1,2}))?(?:-(\d{1,2}))?[-_ ]+/;
const SMALL_WORDS = new Set(['a', 'an', 'and', 'at', 'by', 'for', 'in', 'of', 'on', 'or', 'the', 'to', 'with']);

/** "src/art/sub/x.jpg", "/src/art/x.jpg", "../../art/x.jpg", "x.jpg" -> "sub/x.jpg" / "x.jpg" */
function normalizePath(p: string): string {
  return p
    .replaceAll('\\', '/')
    .replace(/^(\.\.?\/)*\/?(src\/)?(generated\/)?art\//, '')
    .replace(/^\//, '');
}

function baseName(p: string): string {
  return p.split('/').pop() ?? p;
}

function stripExt(name: string): string {
  return name.replace(/\.[^.]+$/, '');
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFKD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** "the-queen-of-hearts" -> "The Queen of Hearts" */
function titleFromFile(name: string): string {
  const words = stripExt(name).replace(DATE_PREFIX, '').split(/[-_ ]+/).filter(Boolean);
  const title = words
    .map((w, i) => (i > 0 && SMALL_WORDS.has(w.toLowerCase()) ? w.toLowerCase() : w[0].toUpperCase() + w.slice(1)))
    .join(' ');
  return title || 'Untitled';
}

function dateFromFile(name: string): Date | undefined {
  const m = name.match(DATE_PREFIX);
  if (!m) return undefined;
  return new Date(Date.UTC(Number(m[1]), Number(m[2] ?? 1) - 1, Number(m[3] ?? 1)));
}

/** First couple of sentences of the notes, without Markdown symbols. */
function autoExcerpt(body: string, max = 180): string {
  const text = body
    .replace(/^#+\s.*$/gm, '')
    .replace(/!?\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[*_>`#]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return cut.slice(0, cut.lastIndexOf(' ')) + '…';
}

let cache: Artwork[] | undefined;

export async function getArtworks(): Promise<Artwork[]> {
  // Only reuse the list in real builds; in `npm run dev` new art should show on reload.
  if (cache && import.meta.env.PROD) return cache;

  // Index the details files by the image they point to.
  const entries = await getCollection('artworks');
  const byPath = new Map<string, CollectionEntry<'artworks'>>();
  const byName = new Map<string, CollectionEntry<'artworks'>>();
  for (const entry of entries) {
    const p = normalizePath(entry.data.image);
    byPath.set(p.toLowerCase(), entry);
    byName.set(baseName(p).toLowerCase(), entry);
  }

  const usedSlugs = new Set<string>();
  const artworks: Artwork[] = [];

  for (const [fullPath, mod] of Object.entries(files)) {
    const file = normalizePath(fullPath);
    const name = baseName(file);
    const entry = byPath.get(file.toLowerCase()) ?? byName.get(name.toLowerCase());
    const data = entry?.data;
    if (data?.hidden) continue;

    const title = data?.title?.trim() || titleFromFile(name);
    const baseSlug = slugify(stripExt(name).replace(DATE_PREFIX, '')) || slugify(title) || 'artwork';
    let slug = baseSlug;
    for (let n = 2; usedSlugs.has(slug); n++) slug = `${baseSlug}-${n}`;
    usedSlugs.add(slug);

    const body = entry?.body?.trim() ?? '';
    artworks.push({
      slug,
      title,
      image: mod.default,
      file,
      date: data?.date ?? dateFromFile(name),
      medium: data?.medium,
      size: data?.size,
      description: data?.description,
      excerpt: data?.excerpt?.trim() || (body ? autoExcerpt(body) : undefined),
      order: data?.order,
      featured: data?.featured ?? false,
      sold: data?.sold ?? false,
      hasNotes: body.length > 0,
      entry,
    });
  }

  artworks.sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    if (a.order !== undefined || b.order !== undefined) {
      if (a.order === undefined) return 1;
      if (b.order === undefined) return -1;
      if (a.order !== b.order) return a.order - b.order;
    }
    if (a.date && b.date) return b.date.getTime() - a.date.getTime();
    if (a.date) return -1;
    if (b.date) return 1;
    return a.title.localeCompare(b.title);
  });

  cache = artworks;
  return artworks;
}

export function formatYear(date?: Date): string | undefined {
  return date ? String(date.getUTCFullYear()) : undefined;
}
