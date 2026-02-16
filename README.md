# DarkMatter

DarkMatter is a minimal, responsive, and accessible Astro blog theme. This
theme's features will generally follow [my personal blog](https://var-log.dev).

## Features

### Implemented

- type-safe markdown (content collections with Zod schemas)
- super fast performance (static generation, minimal JS)
- accessible (keyboard navigation, VoiceOver-friendly)
- responsive (mobile through desktop)
- SEO-friendly (meta tags, canonical URLs, Open Graph)
- light & dark mode with theme toggle
- full-text search (Pagefind, build-time index)
- draft posts & pagination
- posts, projects, and CV content types
- highly customizable (`site.config.ts`, content collections)

### Planned

- sitemap & RSS feed
- dynamic OG image generation for blog posts

## Lighthouse Score

[Working on it](https://pagespeed.web.dev/report?url=https%3A%2F%2Fc-a-j.github.io%2Fdark-matter%2Fform_factor=desktop")

## 🚀 Project Structure

```text
.
├── astro.config.mjs
├── content
│   ├── cv
│   ├── posts
│   └── projects
├── LICENSE.md
├── new-post.sh
├── package.json
├── pagefind.json
├── pnpm-lock.yaml
├── public
├── README.md
├── src
│   ├── components
│   │   ├── about
│   │   ├── common
│   │   ├── cv
│   │   ├── home
│   │   └── tags
│   ├── content.config.ts
│   ├── layouts
│   ├── lib
│   ├── pages
│   ├── plugins
│   ├── site.config.ts
│   └── styles
└── tsconfig.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page
is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put
any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 📖 Documentation

## 💻 Tech Stack

- Main Framework - Astro
- Type Checking - TypeScript
- Styling - TailwindCSS
- UI/UX - Figma Design File
- Static Search - FuseJS
- Icons - Tablers
- Code Formatting - Prettier
- Deployment - Cloudflare Pages
- Illustration in About Page - https://freesvgillustration.com
- Linting - ESLint

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

https://scripter.co/
https://chriswilliams.dev/
https://github.com/RATIU5/zaggonaut

## ✨ Feedback & Suggestions

If you have any suggestions/feedback, you can contact me via my
[email](clint@var-log.dev). Alternatively, feel free to open an issue if you
find bugs or want to request new features.

## 📜 License

Licensed under the MIT License, Copyright © 2025
