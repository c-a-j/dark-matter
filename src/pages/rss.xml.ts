import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getVisiblePosts } from "../lib/utils";
import { siteConfig } from "../site.config";

export async function GET(context: APIContext) {
  const posts = await getVisiblePosts("posts");

  return rss({
    title: siteConfig.global.title,
    description: siteConfig.global.description,
    site: context.site!.toString(),
    items: posts.map(post => ({
      title: post.title,
      description: post.description ?? "",
      pubDate: post.published ?? post.updated,
      link: post.url,
    })),
  });
}
