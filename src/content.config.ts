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

const mediaBlockSchema = z.discriminatedUnion("_block", [
  z.object({
    _block: z.literal("imagen"),
    src: z.string(),
    alt: z.string().optional(),
  }),
  z.object({
    _block: z.literal("video"),
    src: z.string(),
    alt: z.string().optional(),
  }),
  z.object({
    _block: z.literal("iframe"),
    url: z.string(),
  }),
  z.object({
    _block: z.literal("modelo_3d"),
    main_model: z.string(),
    lods: z
      .array(
        z.object({
          nivel: z.enum(["Bajo", "Medio", "Alto"]),
          file: z.string(),
        })
      )
      .optional(),
  }),
]);

const mediaContentSchema = z
  .array(mediaBlockSchema)
  .optional();

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

    // New unified media content block
    media_content: mediaContentSchema,

    // Legacy fields (kept for backward compat during migration)
    mediaType: z.enum(["image", "video", "iframe", "model3d"]).optional(),
    mediaSrc: z.string().optional(),
    mediaAlt: z.string().optional(),
    modelAutoRotate: z.boolean().optional().default(true),
    modelEnvironment: z.string().optional(),
    modelFiles: z.array(z.string()).optional(),

    bento: z
      .enum(["small", "wide", "tall", "large"])
      .optional()
      .default("small"),
  }),
});

export const collections = { about, obras };