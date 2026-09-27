// Defines the text content the site reads.
//  - artworks: OPTIONAL extra info for a piece (title, medium, featured...).
//    Art shows up without one of these; they just add details.
//    Anything written below the closing --- is the artist's notes ("The story behind it").
//  - pages: editable page text (currently just the About page).
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const artworks = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/artworks' }),
  schema: z.object({
    // Path or filename of the image in src/art, e.g. "blue-heron.jpg" or "/src/art/blue-heron.jpg"
    image: z.string(),
    title: z.string().optional(),
    date: z.coerce.date().optional(),
    medium: z.string().optional(),
    size: z.string().optional(),
    description: z.string().optional(),
    // Short quote for the featured carousel. If empty, the start of the notes is used.
    excerpt: z.string().optional(),
    // Lower numbers come first. Optional.
    order: z.number().optional(),
    featured: z.boolean().optional().default(false),
    hidden: z.boolean().optional().default(false),
    sold: z.boolean().optional().default(false),
  }),
});

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
  }),
});

export const collections = { artworks, pages };
