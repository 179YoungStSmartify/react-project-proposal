# Application architecture

## Ownership and scope
The parent agent owns architectural decisions, integration, QA and release. Delegate only small tasks with explicit file boundaries; do not hand off a full build or repository. The approved destination is the public `179YoungStSmartify/react-project-proposal` repository and its GitHub Pages site. No vault or internal notes are part of the client artifact.

## Layers
- `src/components/ui/`: shadcn/ui source components (Radix foundation). Shared Button, Badge, Card, Tabs, Sheet, Table and Slider primitives. Generated sources belong to the project; customise through semantic theme tokens first.
- `src/components/layout/`: application header, mobile navigation and common page shell.
- `src/features/proposal/`: service/network package cards, comparison and independent lighting demonstrations. The wall-plate gallery is removed.
- `src/pages/`: ProposalPage, ViewerPage and NetworkPage. Pages compose features; they do not duplicate prices or specification data.
- `src/lib/`: static-host-safe hash routing, BASE_URL asset resolution and class-name utility.
- `src/data.ts`: typed proposal content, consultation + installation + integration package tiers including each listed wall-screen quantity and one smart-home hub (HA Green or mini PC). Switches, relays and wall plates are excluded and client supplied; compatible hardware choice is tier constrained: relays with normal switches require Gold or Platinum; dimming requires Platinum and sample-stage compatibility testing. Separately priced network packages include their listed hardware but exclude cabling/installation. All prices are indicative, and compatibility/compliance remains gated.
- `public/viewer/index.html`: the actual self-contained upstream 3D viewer, isolated in an iframe and only mounted on the viewer route. Do not rewrite bundled geometry or invent a model.

## Routing and integrations
Routes use `#/`, `#/viewer`, `#/network`, and proposal section links `#/?section=packages` / `#/?section=network-gold`. A single route parser handles section scrolling after React commits. Unknown routes show a recoverable not-found state. Native browser history remains usable. All local asset paths are relative to Vite BASE_URL `/react-project-proposal/`.

The optional UniFi project URL is build-time configuration (`VITE_UNIFI_PROJECT_URL`); accept only HTTP(S), show an honest unconfigured state, and keep external navigation explicit. Do not embed login screens or credentials.

## Visual system
Use shadcn/ui + Tailwind 4 semantic tokens with a warm paper/charcoal/bronze theme. Keep editorial display typography and the independent lighting demonstrations; do not reinstate the removed wall-plate gallery. Use shadcn primitives for interactions rather than rebuilding ARIA/focus handling. Document custom variants and the token map in DESIGN.md. No separate design vocabulary for network and lighting pages.

## Verification and release gates
Write a failing behaviour regression before altering interactions. Exercise gallery-removal assertions, service-scope copy, menu focus/escape, section routes, independent lights, price preservation, safe integration states, BASE_URL assets, mobile overflow and actual viewer controls/GLB export. Run a clean npm install, lint, typecheck, tests, legacy tests and production build. Query npm latest/outdated and audit. Independently review the final staged diff. Publish only dist through Pages; verify both remote commit and live routes/assets after deployment. The original repositories remain untouched.
