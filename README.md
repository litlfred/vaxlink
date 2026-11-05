# VaxLink has moved

The VaxLink walkthrough (the WHO Pre-GDHF workshop's cross-border
immunization journey between Thailand and Lao PDR) now lives in
[litlfred/smart-trust-demo](https://github.com/litlfred/smart-trust-demo), under
[`web/`](https://github.com/litlfred/smart-trust-demo/tree/main/web), so it is
built from the same commit as the journeys, personas, BPMN processes and FHIR
examples it shows.

**Live site:** [https://litlfred.github.io/smart-trust-demo/vaxlink/](https://litlfred.github.io/smart-trust-demo/vaxlink/)

The old address, `https://litlfred.github.io/vaxlink/`, redirects there and
keeps the route (`#/walkthrough/J2b` and the like). The redirect is all this
repository still publishes: [`site/`](site/) holds `index.html` and `404.html`,
and [`scripts/publish-gh-pages.sh`](scripts/publish-gh-pages.sh), run by the
deploy workflow on main, puts them at the root of `gh-pages`.

The history of the walkthrough up to the move is this repository's history
(last app commit `d42b216`). The original is
[fredhersch/vaxlink](https://github.com/fredhersch/vaxlink).
