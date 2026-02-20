import type { CollectionEntry } from "astro:content";
import type { BaseSchema } from "../content.config"

export type PostFrontmatter = CollectionEntry<"posts">["data"] & {
  url: string;
};

export type ProjectFrontmatter = CollectionEntry<"projects">["data"] & {
  url: string;
};

export type MarkdownCollectionName = 'posts' | 'projects';
export type MarkdownPost = BaseSchema & {  
  url: string,
  collectionRelativePath: string,
  filePath: string
};