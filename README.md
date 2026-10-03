# 179 Young Street — Smart Home Proposal

Client-facing React proposal site for 179 Young Street, prepared by Sam Lee and Angus Wong. The source proposal date is 25 September 2026; it is proposal-preparation metadata, not a build timestamp. Pricing and scope remain indicative and subject to the written confirmation described on the site.

This repository is public and the Pages workflow deploys the Vite-built client site. Do not place passwords, access tokens, internal notes, vault contents, personal client records, or non-public project documents here. GitHub Pages is public hosting, not authenticated/private hosting; assume every deployed asset and page is readable by anyone. The site includes a bundled interactive home model, so review its content before publication.

## Local development

Requirements: Node.js 22 and npm.

```sh
npm ci
npm run dev
npm test
npm run lint
npm run typecheck
npm run build
```

The production app is built with Vite at `/react-project-proposal/` for the GitHub Pages repository subpath. Run `npm run preview` after building to check the production output. The legacy proposal/source HTML and Python tests remain preserved; run `python3 -m unittest discover -s tests -p 'test_*.py'` to exercise those checks where dependencies are available.

## Structure

- `src/` — React and TypeScript proposal app, data and styling.
- `public/images/` — client-facing switch, finish and product images used in the app.
- `public/viewer/index.html` — bundled local interactive 3D viewer, loaded only on its viewer route.
- `client/proposal-tiers.html` — preserved historical source proposal; it is not rewritten by this app.
- `tests/` — React behavior tests and historical-source validation tests.

## Public site deployment

`.github/workflows/pages.yml` builds only the Vite application output (`dist/`) and publishes that artifact to GitHub Pages. `.github/workflows/quality.yml` runs install, tests, lint, typecheck and build checks. Configure the repository's Pages source to GitHub Actions in repository settings; the workflow does not publish source files or the repository tree as a Pages artifact. A public repository and public Pages site are intentional, authorised publication choices; there is no user authentication or access-control layer on the site.

## UniFi design URL

No project-specific UniFi design URL is configured. The network route honestly reports this state and links to `https://design.ui.com`. To configure a project design link at build time, set `VITE_UNIFI_PROJECT_URL` to a valid `http:` or `https:` URL in the build environment. Invalid or unsupported protocols are ignored. Do not supply a UniFi login URL or credentials.

## Provenance

The proposal originates from [`179YoungStSmartify/project-proposal`](https://github.com/179YoungStSmartify/project-proposal), source commit `fb4a566`, with its Git history retained in this derivative repository. The bundled viewer is from [`179YoungStSmartify/3d-viewer`](https://github.com/179YoungStSmartify/3d-viewer), immutable commit `1f1a699bcb61a03202e90bf65e3a9a83a8ad4adc`. It is included locally at `public/viewer/index.html`. Its geometry/runtime is retained; only local CSS is adapted for the shared palette, mobile controls and keyboard focus. It is not fetched from an external runtime host.

## Design and architecture

See `DESIGN.md` for the customised shadcn/ui + Radix + Tailwind design system and `ARCHITECTURE.md` for layer boundaries. Proposal, network and viewer pages share the application header; prices and quantities live in typed data. Section links use `#/?section=packages` rather than multiple hashes.

## Browser smoke test

After `npm run build`, start `npm run preview -- --host 127.0.0.1 --port 4174`. In another shell:

```sh
npx playwright install chromium
QA_URL=http://127.0.0.1:4174/react-project-proposal/ node tests/browser-smoke.mjs
```

Set `QA_OUTPUT` to a local evidence directory if desired. The test checks desktop/mobile layouts, all finish images, keyboard controls, routing, viewer rendering/controls/GLB export, teardown and print. QA output is ignored by Git and not deployed.

Live site: https://179youngstsmartify.github.io/react-project-proposal/
