// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import { siteConfig } from "./src/site.config";
import remarkGitHubAlerts from "remark-github-markdown-alerts";
import rehypeExternalLinks from "rehype-external-links";
import remarkCollapsible from "./src/plugins/remark-collapsible.mjs";
import remarkNowrap from "./src/plugins/remark-nowrap.mjs";

// https://astro.build/config
export default defineConfig({
  site: siteConfig.site.site,
  base: siteConfig.site.base,

  server: {
    port: siteConfig.site.devPort || 4321,
    host: true,
  },
  vite: {
    plugins: [tailwindcss()],
  },
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true
    },
    gfm: true,
    smartypants: true,
    remarkPlugins: [remarkGitHubAlerts, remarkCollapsible, remarkNowrap],
        rehypePlugins: [
          [rehypeExternalLinks, { target: '_blank', rel: ['noopener', 'noreferrer'] }]
        ],
  }
});
