# Design system — 179 Young Street

## Foundation

Source-owned **shadcn/ui**, Radix primitives and Tailwind CSS 4, customised for a warm residential-editorial proposal rather than a generic dashboard. UI primitives live in `src/components/ui`; features and pages compose them without duplicating commercial data.

## Tokens and typography

`src/index.css` maps semantic Tailwind/shadcn tokens. `src/style.css` owns editorial layouts and feature-specific refinements.

- Background/paper: `#f6f3ed`.
- Card/popover surfaces: `#fffefa`.
- Foreground/ink: `#24211c`.
- Supporting text: `#716b60`.
- Primary bronze: `#94703a`, white foreground.
- Borders: `#ded8cb`.
- Selected accent: `#eee4d2`.
- Charcoal framing: `#211f1b`; cream text and restrained gold accents.
- Spacing scale: `.5, 1, 1.5, 2, 3, 4rem`.
- Primitive radii: 6–14px; editorial hero: 20px.
- Playfair Display Variable headings, DM Sans Variable body/controls. Fonts are bundled locally, including italic display text; no runtime Google Fonts request.

Do not reuse semantic `--muted` (surface) as a text colour. Legacy layout tokens use `--text-muted` and `--bronze` to avoid collisions. Scope editorial link styles away from Button-as-link controls.

## Shared components

- Button: common actions, linked calls to action, print and independent light controls.
- Card and Badge: equal-height Silver/Gold/Platinum lighting and network packages; recommendation inside the Gold band.
- Tabs: Radix keyboard-managed finish ranges, Home/End and arrow keys; responsive wrapping, selected styling and live carousel captions.
- Sheet: mobile navigation with focus trap, Escape dismissal, labelled title and focus restoration.
- Slider: keyboard-accessible brightness, explicit accessible name on its thumb; independent of the instant-light demo.
- Table: shared comparison primitives with row headings, caption and contained horizontal scrolling.

Keep package quantities/prices in `src/data.ts`. Preserve the source comparison's expanded integration details rather than dropping Platinum Google Home/Apple HomeKit support. All pricing remains indicative; network is separately quoted and remote access requires the stated subscription.

## Responsive, accessibility and print

Centered maximum 1240px composition; narrow layouts collapse grids and replace desktop navigation with Sheet. Usable at 320px without document overflow. Decorative hero art is contained locally, not by clipping the document.

Use visible focus rings, semantic landmarks, a functional focus-moving skip link, labelled controls, meaningful image alternatives and live state outputs. Respect reduced-motion preferences. Print hides navigation/interaction chrome and retains proposal details. Embedded 3D viewer mounts only on its own route and is not printed.

## Verification

`npm test`, `npm run lint`, `npm run typecheck`, `npm run build`; `tests/browser-smoke.mjs` exercises the production hosting prefix, keyboard and mobile navigation, every finish image, independent demos, section scrolling, real viewer controls/GLB download, teardown and print.
