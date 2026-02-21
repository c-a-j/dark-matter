import type { BaseSchema } from "../content.config";

export type ContentFrontmatter = BaseSchema & {
  url: string;
};

export type MarkdownCollectionName = 'posts' | 'projects';
export type MarkdownPost = BaseSchema & {  
  url: string,
  collectionRelativePath: string,
  filePath: string
};