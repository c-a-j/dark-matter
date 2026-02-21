import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const baseSchema = z.object({
  title: z.string(),
  slug: z.string().optional(),
  description: z.string().optional(),
  longDescription: z.string().optional(),
  cardImage: z.string().optional(),
  tags: z.array(z.string()).optional(),
  readTime: z.number().optional(),
  repoUrl: z.string().url().optional(),
  demoUrl: z.string().url().optional(),
  links: z.array(z.object({ label: z.string(), url: z.string().url() })).optional(),
  feature: z.boolean().default(false),
  hide: z.boolean().default(false),
  draft: z.boolean().default(true),
  hideTOC: z.boolean().default(false),
  isIndex: z.boolean().default(false),
  indexDirectory: z.string().optional(),
  isSubcollection: z.boolean().default(false),
  published: z
    .date()
    .transform(val => new Date(val))
    .optional(),
  updated: z
    .date()
    .transform(val => new Date(val))
    .optional(),
  numberH2: z.boolean().default(false),
  paginate: z.boolean().default(false),
});

export type BaseSchema = z.infer<typeof baseSchema>

/** Define a markdown content collection with auto-generated slugs. */
function defineMarkdownCollection(directory: string, schema: z.ZodObject<any>) {
  return defineCollection({
    loader: glob({ pattern: "**/*.md", base: directory }),
    schema: schema.transform(data => {
      const slug =
        data.slug ??
        data.title
          .toLowerCase()
          .replace(/\s+/g, "-")
          .replace(/[^\w-]/g, "");
      return { ...data, slug };
    }),
  });
}

const cvSchema = z.object({
  hero: z
    .object({
      title: z.string(),
      subtitle: z.string(),
      image: z.string(),
    })
    .optional(),
  summary: z.string(),
  experience: z
    .object({
      sectionTitle: z.string(),
      positions: z.array(
        z.object({
          title: z.string(),
          employer: z.string(),
          startDate: z.string(),
          endDate: z.string(),
          bullets: z.array(z.string()),
        })
      ),
    })
    .optional(),
  otherExperience: z
    .object({
      sectionTitle: z.string(),
      positions: z.array(
        z.object({
          title: z.string(),
          employer: z.string(),
          startDate: z.string(),
          endDate: z.string(),
          bullets: z.array(z.string()),
        })
      ),
    })
    .optional(),
  education: z
    .object({
      degrees: z.array(
        z.object({
          title: z.string(),
          school: z.string(),
          dateObtained: z.string(),
          honors: z.string().optional(),
        })
      ),
    })
    .optional(),
  strengths: z
    .object({
      sectionTitle: z.string(),
      strengths: z.array(z.any()),
    })
    .optional(),
});

export const collections = {
  posts: defineMarkdownCollection(
    "./content/posts",
    baseSchema
  ),
  projects: defineMarkdownCollection(
    "./content/projects",
    baseSchema
  ),
  cv: defineCollection({
    loader: glob({ pattern: "**/*.yaml", base: "./content/cv" }),
    schema: cvSchema,
  }),
};
