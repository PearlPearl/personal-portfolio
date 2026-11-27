# Portfolio development guide

## Architecture

- Astro renders static HTML to `dist/`. The homepage entry point is `src/pages/index.astro`.
- Compose the document in `src/layouts`, page sections in `src/sections`, and reusable markup in `src/components`.
- Keep typed profile data, project concepts, expertise, career roles, and contact and résumé availability in `src/content/portfolio.ts`. Verify personal facts and real destinations before publishing them.
- Put client interactions in `src/scripts`. Prefer native events and HTML semantics. Keep core and companion artwork in SVG and use CSS for motion.
- Use strict TypeScript and descriptive identifiers. Prefer direct code and reuse existing components and tokens where they fit.

## Design system

- Preserve the dark palette of `#080B11` background, `#151C28` surface, `#648CFF` primary accent, `#49D9B0` secondary accent, and `#F4F6FC` primary text.
- Keep both themes in sync through semantic tokens in `src/styles/global.css`. Use Inter for body text and Space Grotesk for headings. Both fonts are self-hosted.
- Start styles at narrow widths. Keep the bento layout responsive and use Tailwind utilities for simple layout and native CSS for component styles and motion.

## Performance and accessibility

- Targets on mobile are Lighthouse performance ≥95, LCP <2.5 s, INP <200 ms, and CLS <0.1. Measure before reporting results. Identify lab measurements and field data separately.
- Minimize client JavaScript and requests. Avoid layout shifts and animate transforms or opacity. Give future media dimensions and lazy-load below-the-fold assets where appropriate.
- Aim for WCAG 2.2 AA. Preserve semantic landmarks, logical heading order, visible focus, readable contrast, keyboard support, and reduced-motion behavior. Keep floating controls clear of page navigation and other interactive targets.

## Verification and dependencies

- Run `npm run check`, `npm run build`, and `npm test` before review. Check at widths of 360, 390, 768, 1024, and 1440 pixels.
- Keep the package lockfile current and use `npm ci` for reproducible installs. Prefer Astro, TypeScript, Tailwind, native browser APIs, and Playwright.
- React, Three.js, WebGL, backend services, databases, external AI APIs, and paid services require explicit approval.
