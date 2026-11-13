# VaxLink is now the journeys

The VaxLink walkthrough (the WHO Pre-GDHF workshop's cross-border
immunization journey between Thailand and Lao PDR) is now the journeys of
[litlfred/smart-trust-demo](https://github.com/litlfred/smart-trust-demo): its
journeys viewer, built from the same commit as the personas, BPMN processes and
FHIR examples it shows. The VaxLink app was retired there on 2026-11-11
(litlfred/smart-trust-demo#111).

**Journeys:** [https://litlfred.github.io/smart-trust-demo/en/smart-trust-demo/journeys/](https://litlfred.github.io/smart-trust-demo/en/smart-trust-demo/journeys/)

The old address, `https://litlfred.github.io/vaxlink/`, redirects there and
keeps the route: the old app's hash routes (`#/walkthrough/J2b`, `#/demo/S4`, `#/how/gdhcn`) become the journeys viewer's workshop paths (`…/workshops/dpi-h-policy-track/walkthrough/J2b/`). The redirect is all this
repository still publishes: [`site/`](site/) holds `index.html` and `404.html`,
and [`scripts/publish-gh-pages.sh`](scripts/publish-gh-pages.sh), run by the
deploy workflow on main, puts them at the root of `gh-pages`.

The history of the walkthrough up to the move is this repository's history
(last app commit `d42b216`). The original is
[fredhersch/vaxlink](https://github.com/fredhersch/vaxlink).
