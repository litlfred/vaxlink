# AGENTS.md — vaxlink

Agent-generic: Claude Code, Gemini CLI, Cursor, Copilot and others read it.
[`README.md`](README.md) says what this repository is and how to run a
workshop with it; [`vaxlink.json`](vaxlink.json) declares it as a cat-harness
instance downstream of [smart-trust-demo](https://github.com/litlfred/smart-trust-demo),
whose `AGENTS.md` rules apply here too.

## Rules

- **What is copied from smart-trust-demo is edited there, never here.** That
  covers `src/data/ig/`, `src/data/upstream/actors/`, `public/archimate/` and
  `public/bpmn/`. `upstream.lock.json` pins the two commits they come from and
  each file's sha256. Refresh with `node scripts/sync-upstream.mjs`.
  `node scripts/sync-upstream.mjs --check` fails on a hand edit, and every
  publish runs it.
- **A persona's name, role, country, goal, needs and frustrations** are the
  `meta.persona` of its smart-trust-demo actor. Only the walkthrough's
  initials and colours are kept in `src/data/journeyData.ts`.
- **Publishing** is `scripts/publish-gh-pages.sh`. The deploy workflow runs
  it on every push: main goes to the root of gh-pages, any other branch to
  `STAGING/<branch-slug>/`. Nothing else pushes to gh-pages.
- **Dependencies are pinned**: GitHub Actions by commit SHA; npm by
  `package-lock.json`, installed with `npm ci --ignore-scripts`.
- **Every person is fictional**, and the signing key is a GDHCN DEV test key.
- No model identifiers in commits, PRs or code.
