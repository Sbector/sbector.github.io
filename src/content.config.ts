import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

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
      .default("published"),

    cover: z.string(),
    coverAlt: z.string(),

    mediaType: z.enum(["image", "video", "iframe"]),
    mediaSrc: z.string(),
    mediaAlt: z.string().optional(),

    bento: z
      .enum(["small", "wide", "tall", "large"])
      .default("small"),
  }),
});

export const collections = { obras };