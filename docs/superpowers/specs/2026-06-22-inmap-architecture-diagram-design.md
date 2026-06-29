# InMap System Architecture Diagram — Design

## Goal
Show an interactive (pan/zoom/fullscreen) architecture diagram at the top of the "System Architecture" tab in the InMap docs hub, above the existing 5 text cards.

## Source
`microservices-architecture-clean-fixed (1).drawio`, page "Container Overview" only. The second page ("Payment Flow") is a near-empty stub and is excluded.

## Approach
Use draw.io's official static embed script (`https://viewer.diagrams.net/js/viewer-static.min.js`), not a CORS-dependent iframe `url=` embed.

1. `public/projects/inmap/architecture-diagram.xml` — trimmed drawio XML containing only the "Container Overview" diagram.
2. `src/app/projects/inmap/ArchitectureDiagram.tsx` — client component:
   - Fetches the XML (same-origin, no CORS issue).
   - Renders `<div class="mxgraph" data-mxgraph="{...}">` with `toolbar: "zoom lightbox"`, `nav: true`, `resize: true`.
   - Loads the viewer script once, calls `window.GraphViewer.processElements()` after the XML is set (handles both first load and remount when the tab is revisited).
   - Wrapped in a white rounded card (diagram has a light background) inside the dark page shell.
3. `page.tsx` — render `<ArchitectureDiagram />` above `DOC_CONTENT.architecture.map(...)` inside the `techSub === "architecture"` branch.

## Out of scope
No new API route, no npm dependency, no changes to `ErCanvas`/`PaymentCanvas`, no edit/save capability (read-only viewer).
