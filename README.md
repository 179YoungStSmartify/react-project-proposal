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

## Commercial scope

Silver, Gold and Platinum prices are indicative package prices covering consultation + installation + integration plus the listed wall-screen hardware and one smart-home hub.
Clients choose compatible hardware within their selected tier. Relays with normal light switches require Gold or Platinum. Dimming requires Platinum and compatible lights, confirmed through sample-stage testing.
Listed wall-screen hardware and one smart-home hub are included: HA Green for Silver and Gold; mini PC for Platinum. Switches, relays and wall plates are excluded and purchased separately.
Network packages include the listed hardware. Cabling and installation are excluded and quoted separately.
Service-tier and network-hardware prices remain distinct. Switch/wall-plate examples have been removed; clients choose compatible hardware within their tier's constraints. All electrical work requires appropriately licensed electricians, and compatibility/compliance must be verified before installation.

## Structure

- `src/` — React and TypeScript proposal app, data and styling.
- `public/images/` — retained source image assets; the wall-plate examples are no longer rendered in the proposal.
- `public/viewer/index.html` — bundled local interactive 3D viewer, loaded only on its viewer route.
- `client/proposal-tiers.html` — retained source proposal, with client-authorised wording corrections applied in this derivative. The original upstream repository is unchanged.
- `tests/` — React behavior tests and historical-source validation tests.

## Dependency and CSS provenance

The app's generated UI components use the Radix/Tailwind runtime directly; `shadcn` is a development-only CLI and is not imported by the deployed app. Its upstream `shadcn@4.21.1` `dist/tailwind.css` is retained as source-owned static CSS at `src/shadcn-tailwind.css` without CSS edits, with its MIT attribution and license in `src/SHADCN-CSS-LICENSE.md`. The CLI dependency chain has known development-tool advisories (including denial-of-service exposure); these do not represent runtime exposure in the static deployed page. Inspect full findings with `npm audit --json` and deployment dependencies with `npm audit --omit=dev --audit-level=low`; production audit is the blocking gate. The MIT notice also ships with the deployed site at `licenses/shadcn-css.txt`.

## Public site deployment

`.github/workflows/pages.yml` builds only the Vite application output (`dist/`) and publishes that artifact to GitHub Pages. `.github/workflows/quality.yml` runs install, React and historical-source tests, lint, typecheck, build and the production Playwright suite. Browser reports and failure screenshots, videos and traces are retained as Actions artifacts for 14 days. Configure the repository's Pages source to GitHub Actions in repository settings; the workflow does not publish source files or the repository tree as a Pages artifact. A public repository and public Pages site are intentional, authorised publication choices; there is no user authentication or access-control layer on the site.

## UniFi Design Center shares

Each network tier links to its matching owner-supplied UniFi Design Center share from the tier card. The links open in a new tab. The Design Center response policy restricts framing to Ubiquiti origins, so GitHub Pages cannot embed the interactive projects; do not replace the external links with iframes or add login credentials. The linked projects provide the interactive layouts and bills of materials; typed package data records the concise client-facing tier summaries.

## Provenance

The proposal originates from [`179YoungStSmartify/project-proposal`](https://github.com/179YoungStSmartify/project-proposal), source commit `fb4a566`, with its Git history retained in this derivative repository. The bundled viewer is from [`179YoungStSmartify/3d-viewer`](https://github.com/179YoungStSmartify/3d-viewer), immutable commit `1f1a699bcb61a03202e90bf65e3a9a83a8ad4adc`. It is included locally at `public/viewer/index.html`. Its geometry/runtime is retained; only local CSS is adapted for the shared palette, mobile controls and keyboard focus. It is not fetched from an external runtime host.

## Design and architecture

See `DESIGN.md` for the customised shadcn/ui + Radix + Tailwind design system and `ARCHITECTURE.md` for layer boundaries. Proposal, network and viewer pages share the application header; prices and quantities live in typed data. Section links use `#/?section=packages` rather than multiple hashes.

## Playwright regression tests

```sh
npx playwright install chromium
npm run test:e2e
npm run test:e2e:report
```

The runner builds and starts its own production preview under the real repository subpath. Tests run in Chromium at desktop and mobile widths with both normal and reduced motion; mobile is emulation, not a real handset. Tests assert actual section position (not just URL changes), repeated anchor clicks, cross-page links, deep-link reloads, history, back-to-top, skip-link focus, mobile focus trapping, gallery removal, brightness keys, responsive overflow and the generated print-only proposal route (including prices, scope, and omission of interactive page content). Each test uses a fresh browser context and fails on browser console or uncaught errors. No fixed sleeps or automatic retries hide failures.

- Interactive runner: `npm run test:e2e:ui`
- A focused regression: `npm run test:e2e -- --grep "deep links"`
- Existing deployed site: `QA_URL=https://179youngstsmartify.github.io/react-project-proposal/ npm run test:e2e` (skips the local build/server)

Reports, JUnit results and failure evidence stay in ignored `playwright-report/` and `test-results/` directories; they are not part of the Pages artifact. The separate smoke test below retains the heavier WebGL viewer/GLB and print-action coverage.

## Browser smoke test

After `npm run build`, start `npm run preview -- --host 127.0.0.1 --port 4174`. In another shell:

```sh
npx playwright install chromium
QA_URL=http://127.0.0.1:4174/react-project-proposal/ node tests/browser-smoke.mjs
```

Set `QA_OUTPUT` to a local evidence directory if desired. The test checks desktop/mobile layouts, wall-plate gallery removal, proposal and network-page structure, per-tier external design links, keyboard controls, routing, viewer rendering/controls/GLB export, teardown and generated print output. QA output is ignored by Git and not deployed.

Live site: https://179youngstsmartify.github.io/react-project-proposal/
