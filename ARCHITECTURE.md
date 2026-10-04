# Application architecture

## Ownership and scope
The parent agent owns architectural decisions, integration, QA and release. Delegate only small tasks with explicit file boundaries; do not hand off a full build or repository. The approved destination is the public `179YoungStSmartify/react-project-proposal` repository and its GitHub Pages site. No vault or internal notes are part of the client artifact.

## Layers
- `src/components/ui/`: shadcn/ui source components (Radix foundation). Shared Button, Badge, Card, Tabs, Sheet, Table and Slider primitives. Generated sources belong to the project; customise through semantic theme tokens first.
- `src/components/layout/`: application header, mobile navigation and common page shell.
- `src/features/proposal/`: service/network package cards, comparison and independent lighting demonstrations. The wall-plate gallery is removed.
- `src/pages/`: ProposalPage, ViewerPage, NetworkPage and PrintableProposalPage. Pages compose features; they do not duplicate prices or specification data.
- `src/lib/`: static-host-safe hash routing, BASE_URL asset resolution and class-name utility.
- `src/data.ts`: typed proposal content, consultation + installation + integration package tiers including each listed wall-screen quantity and one smart-home hub: HA Green for Silver and Gold, mini PC for Platinum. Switches, relays and wall plates are excluded and client supplied; compatible hardware choice is tier constrained: relays with normal switches require Gold or Platinum; dimming requires Platinum and sample-stage compatibility testing. Separately priced network packages include their listed hardware but exclude cabling/installation. All prices are indicative, and compatibility/compliance remains gated.
- `public/viewer/index.html`: the actual self-contained upstream 3D viewer, isolated in an iframe and only mounted on the viewer route. Do not rewrite bundled geometry or invent a model.

## Routing and integrations
Routes use `#/`, `#/viewer`, `#/network`, `#/print`, and proposal section links `#/?section=packages` / `#/?section=network-gold`. `#/print` composes a dedicated print-ready document from the shared proposal data and tier components; it omits interactive web content such as the lighting demo and 3D viewer. Print controls open this route, where the client can inspect the document and explicitly open the browser print dialog. Native print from other routes hides the website and displays guidance. A single route parser handles section scrolling after React commits. Unknown routes show a recoverable not-found state. Native browser history remains usable. All local asset paths are relative to Vite BASE_URL `/react-project-proposal/`.

Each network tier carries its owner-supplied UniFi Design Center share URL in typed tier data and renders an explicit new-tab external link. The share response's `frame-ancestors` policy excludes the GitHub Pages origin, so the interactive design cannot be embedded in an iframe. Keep the links external; do not embed login screens or credentials.

## Visual system
Use shadcn/ui + Tailwind 4 semantic tokens with a warm paper/charcoal/bronze theme. `TierCards` supplies specification/track counts as typed CSS custom properties; nested row subgrids share intrinsic track sizing across each three-card group on wide screens and in print. Corresponding rows, summaries and prices align to the tallest content. Main service cards omit the repeated scope paragraph and use specification-count + 5 tracks; network cards retain their hardware/cabling note and use specification-count + 6 tracks. Main service and hardware scope remains in the section heading and footer. Stacked mobile cards revert to natural independent rows, with no JS measurement or retained desktop heights. Keep editorial display typography and the independent lighting demonstrations; do not reinstate the removed wall-plate gallery. Use shadcn primitives for interactions rather than rebuilding ARIA/focus handling. Document custom variants and the token map in DESIGN.md. No separate design vocabulary for network and lighting pages.

## Verification and release gates
Write a failing behaviour regression before altering interactions. Exercise gallery-removal assertions, service-scope copy, menu focus/escape, section routes, independent lights, price preservation, per-tier external design links, BASE_URL assets, mobile overflow and actual viewer controls/GLB export. Run a clean npm install, lint, typecheck, tests, legacy tests and production build. Query npm latest/outdated and audit. Independently review the final staged diff. Publish only dist through Pages; verify both remote commit and live routes/assets after deployment. The original repositories remain untouched.
