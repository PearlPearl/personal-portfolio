# Personal Portfolio

A static portfolio homepage for a .NET software developer. It includes an original SVG digital core, a responsive bento layout, two color themes, and Orbit, a keyboard-accessible navigation companion.

Project concepts and example skills are labeled as placeholders. Career history, the résumé PDF, and contact details are pending verified content. Edit [src/content/portfolio.ts](src/content/portfolio.ts) to replace them.

## Local setup

Use Node 22.22.0 from [.nvmrc](.nvmrc) and npm.

```sh
nvm install
nvm use
npm ci
npm run dev
```

Open [localhost:4321](http://localhost:4321).

For an initial checkout that lacks `package-lock.json`, run `npm install` once to generate it. Commit the resulting lockfile before using `npm ci` in Codespaces or CI.

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server on port 4321. |
| `npm run check` | Check Astro templates and strict TypeScript. |
| `npm run build` | Build the static site into `dist/`. |
| `npm run preview` | Serve the production build locally. |
| `npm test` | Run Playwright against the production build. |
| `npm run test:ui` | Open the Playwright runner UI. |
| `npm run screenshots` | Build and capture full-page desktop and mobile PNGs in `artifacts/screenshots/`. |

## Browser testing

```sh
npx playwright install --with-deps chromium
npm run build
npm test
npm run screenshots
```

Playwright checks navigation and layout at 360, 390, 768, 1024, and 1440 pixels. The suite also covers theme persistence, Orbit state and focus behavior, reduced motion, destination anchors, horizontal overflow, console errors, and automated accessibility checks in both themes. On a machine with compatible Chromium already installed, set `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH` to use it.

## GitHub Codespaces and Android preview

1. Open the [GitHub repository](https://github.com/PearlPearl/personal-portfolio). Switch to the review branch while the work is under review, or use `main` after merge. Select **Code → Codespaces → Create codespace on this branch**.
2. In the Codespaces terminal, run `npm run dev`. The dev container runs `npm ci` on creation. If you opened a Codespace without the dev container, run `npm ci` first.
3. Open the **Ports** tab. If 4321 is missing, choose **Forward a Port**, enter `4321`, and keep the visibility **Private**.
4. Copy the **Forwarded Address** for port 4321. It looks like `https://<codespace-name>-4321.app.github.dev`.
5. Open that exact HTTPS address in Chrome on Android. Sign in to GitHub with the account that owns the Codespace when prompted. Keep both the Codespace and the dev server running.

## Cloudflare Pages

When ready to deploy, create a Pages project in Cloudflare and connect this GitHub repository. Use these build settings.

| Setting | Value |
| --- | --- |
| Framework preset | Astro |
| Production branch | `main` |
| Root directory | Repository root |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Environment variable | `NODE_VERSION=22.22.0` |

Astro emits static files. The site has no server runtime or Cloudflare adapter.

## Fonts

Inter and Space Grotesk are served locally from Fontsource packages. They are distributed under the SIL Open Font License 1.1. The dependency packages include their original license texts. See [Inter](https://github.com/rsms/inter/blob/master/LICENSE.txt) and [Space Grotesk](https://github.com/floriankarsten/space-grotesk/blob/master/OFL.txt).
