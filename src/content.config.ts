import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const obras = defineCollection({
  loader: glob({
    pattern: "**/*.md",
    base: "./src/data/obras",
  }),
  schema: z.object({
    // Identidad
    title: z.string(),
    year: z.coerce.number(),
    description: z.string(),
    slug: z.string(),

    // Publicación
    status: z.enum(["draft", "published", "archived"]).default("published"),

    // Imagen para el grid (bento)
    cover: z.object({
      src: z.string(),
      alt: z.string(),
    }),

    // Media principal
    media: z.object({
      type: z.enum(["image", "video", "iframe"]),
      src: z.string(),
      alt: z.string().optional(),
    }),

    // Comportamiento visual
    bento: z.enum(["small", "wide", "tall", "large"]).default("small"),
  }),
});

export const collections = { obras };