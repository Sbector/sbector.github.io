import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const about = defineCollection({
  loader: glob({
    pattern: "about.md",
    base: "./src/data",
  }),
  schema: z.object({
    title: z.string(),
  }),
});

const obras = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/data/obras",
  }),
  schema: z.object({
    title: z.string(),
    year: z.coerce.number(),
    description: z.string().optional(),
    slug: z.string(),

    status: z
      .enum(["draft", "published", "archived"])
      .optional()
      .default("published"),

    cover: z.string().optional(),
    coverAlt: z.string().optional(),

    mediaType: z.enum(["image", "video", "iframe"]).optional(),
    mediaSrc: z.string().optional(),
    mediaAlt: z.string().optional(),

    bento: z
      .enum(["small", "wide", "tall", "large"])
      .optional()
      .default("small"),
  }),
});

export const collections = { about, obras };