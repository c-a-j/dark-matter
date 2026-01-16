import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const baseSchema = z.object({
  title: z.string(),
  slug: z.string().optional(),
  description: z.string().optional(),
  longDescription: z.string().optional(),
  cardImage: z.string().optional(),
  tags: z.array(z.string()).optional(),
  feature: z.boolean().default(false),
  hide: z.boolean().default(false),
  draft: z.boolean().default(true),
  hideTOC: z.boolean().default(false),
  isIndex: z.boolean().default(false),
  indexDirectory: z.string().optional(),
  isSubcollection: z.boolean().default(false),
  published: z.date().transform((val) => new Date(val)).optional(),
  updated: z.date().transform((val) => new Date(val)).optional(),
  numberH2: z.boolean().default(false),
  paginate: z.boolean().default(false),
});

type ContentType = {
  directory: string,
  schema: any,
}

class Content {
  public directory: string = ""
  public schema: z.ZodObject<any>
  public collection: ReturnType<typeof defineCollection>;

  constructor(c: ContentType) {
    this.directory = c.directory;
    this.schema = c.schema;
    this.collection = this.genContentCollection()
  }
  
  genContentCollection = (): ReturnType<typeof defineCollection> => {
    return defineCollection({
      loader: glob({ pattern: "**/*.md", base: this.directory }),
      schema: this.schema.transform((data) => {
        const slug =
          data.slug ?? data.title
            .toLowerCase()
            .replace(/\s+/g, "-")
            .replace(/[^\w-]/g, "");
        const newData = {
          ...data,
          slug,
        };
        return newData;
      }),
    })
  }
}

export const contentTypes = {
  posts: new Content({
    directory: "./content/posts",
    schema: baseSchema.extend({
      readTime: z.number().optional(),
    }),
  }),
  projects: new Content({
    directory: "./content/projects",
    schema: baseSchema.extend({
      repoUrl: z.string().url().optional(),
      demoUrl: z.string().url().optional(),
    }),
  })
} as const;

// CV Collection Schema
const cvSchema = z.object({
  hero: z.object({
    title: z.string(),
    subtitle: z.string(),
    image: z.string(),
  }).optional(),
  summary: z.string(),
  experience: z.object({
    sectionTitle: z.string(),
    positions: z.array(z.object({
      title: z.string(),
      employer: z.string(),
      startDate: z.string(),
      endDate: z.string(),
      bullets: z.array(z.string()),
    })),
  }).optional(),
  otherExperience: z.object({
    sectionTitle: z.string(),
    positions: z.array(z.object({
      title: z.string(),
      employer: z.string(),
      startDate: z.string(),
      endDate: z.string(),
      bullets: z.array(z.string()),
    })),
  }).optional(),
  education: z.object({
    degrees: z.array(z.object({
      title: z.string(),
      school: z.string(),
      dateObtained: z.string(),
      honors: z.string().optional(),
    })),
  }).optional(),
  strengths: z.object({
    sectionTitle: z.string(),
    strengths: z.array(z.any()),
  }).optional(),
});

const cvCollection = defineCollection({
  loader: glob({ pattern: "**/*.yaml", base: "./content/cv" }),
  schema: cvSchema,
});

export const collections = {
  posts: contentTypes.posts.collection,
  projects: contentTypes.projects.collection,
  cv: cvCollection,
}