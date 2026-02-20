# AGENTS.md

## Purpose
This repository is a personal website. Prioritize clean, maintainable code and safe, incremental changes.

## Core Priorities
1. Maintainability: prefer simple, explicit implementations over clever abstractions.
2. Modularity: isolate new behavior into focused components/utilities.
3. Readability: optimize for future editing by a single maintainer.

## Content Protection (High Priority)
1. Do not make significant changes to personal content in `content/` unless explicitly requested.
2. Avoid rewriting tone, structure, or wording of posts/projects/CV entries.
3. Limit content edits to the minimum required for the task (for example: fixing a broken link, frontmatter bug, or typo explicitly requested).
4. If a code change requires content migration, stop and ask before proceeding.

## Architecture Guidelines
1. Keep page-level composition in `src/pages` and reusable UI in `src/components`.
2. Keep shared logic in `src/lib` with small, focused functions.
3. Prefer extending existing layouts/components before creating parallel patterns.
4. Keep Astro components narrowly scoped; split files when responsibilities diverge.
5. Favor explicit props/types over implicit behavior.

## Refactoring Rules
1. Refactor in small, reviewable steps with no behavior change unless requested.
2. Preserve public routes, slugs, and existing content URLs.
3. Avoid broad renames or large file moves unless they clearly reduce complexity.
4. Remove dead code only when confidence is high and impact is verified.

## Style and Readability
1. Follow existing project conventions (Astro + TypeScript + current CSS patterns).
2. Use descriptive names and straightforward control flow.
3. Add brief comments only where intent is not obvious.
4. Avoid introducing new dependencies unless necessary and justified.

## Verification Checklist
1. Run relevant checks before finishing changes:
   - `npm run lint`
   - `npm run build`
2. For UI changes, confirm pages still render correctly and responsive layout remains intact.
3. Call out any risks, assumptions, or unverified areas in the final handoff.

## Change Scope Discipline
1. Keep diffs tightly scoped to the task.
2. Do not perform opportunistic rewrites.
3. If a requested change conflicts with these guidelines, ask for clarification and proceed only after confirmation.
