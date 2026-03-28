# Contributing

Thanks for contributing to Remix Frame UI.

## Quick setup

```bash
pnpm install
pnpm exec playwright install --with-deps chromium
```

Run local docs:

```bash
pnpm run docs:dev
```

## Repository layout

- `packages/remix`: component package (`@lukasmurdock/remix-ui-components`)
- `packages/styles`: layered CSS package (`@lukasmurdock/remix-ui-styles`)
- `packages/core`: low-level helpers (`@lukasmurdock/remix-ui-core`)
- `apps/docs`: docs site and component demos
- `tests/e2e`: Playwright flows

## Command matrix

Use the smallest command set that matches your change:

| Change type           | Commands                                                              |
| --------------------- | --------------------------------------------------------------------- |
| Component logic/API   | `pnpm run typecheck`, `pnpm run test`, `pnpm run build`               |
| CSS/tokens            | `pnpm run tokens:build`, `pnpm run check:css-order`, `pnpm run build` |
| Docs content/demos    | `pnpm run docs:check`, `pnpm run docs:build`                          |
| Full pre-merge parity | `pnpm run ci`                                                         |

## Formatting and hooks

- `pnpm install` enables Husky hooks
- pre-commit runs `lint-staged` with Prettier
- run `pnpm run format` for manual formatting

## Maturity labels

- Every component must declare `experimental` or `stable` in `packages/remix/src/component-metadata.json`
- Docs derive component maturity labels from that metadata

## Adding or updating a component

When shipping a new component or public API change, update all relevant contracts:

1. Component code and exports in `packages/remix/src/components` and `packages/remix/src/index.ts`
2. Metadata entry in `packages/remix/src/component-metadata.json`
3. Component docs page in `apps/docs/content/components/<component>.md`
4. Demo wiring in:
   - `apps/docs/src/docs-runtime.js`
   - `apps/docs/src/dev-docs.js`
   - `apps/docs/src/build-docs.mjs`
5. Unit tests in `packages/remix/test`
6. E2E coverage in `tests/e2e` when interaction complexity justifies it

Component docs pages must include:

- `## When to use`
- `## Import`
- `## API`
- `## Example`
- `## HTML parity`
- `## Runtime notes`
- `## Accessibility matrix`
- `## Keymap spec`
- Keep `## API` body as: `Type definitions are generated from component source.`

Use `apps/docs/content/templates/component-reference-template.md` when authoring new or refreshed component docs.

## Docs for new users

- New-user guides live in `apps/docs/content/guides`
- Keep guides practical and copy-paste friendly
- Prefer stable components in guide examples unless a guide explicitly explains experimental APIs
- `pnpm run docs:check` runs all docs quality checks in one command
- API sections can be generated from source types with `pnpm run docs:api:build`
- `pnpm run docs:api:check` verifies generated API docs are in sync
- `pnpm run docs:check:sections` verifies required sections are present, non-empty, ordered, and include the generated API notice
- `pnpm run docs:check:maturity` verifies docs and metadata titles, slugs, and maturity labels stay aligned
- `pnpm run docs:check:imports` verifies component docs import real exports and include the documented component symbol
- `pnpm run docs:check:guides` verifies guide ordering, titles, Getting Started links, stable-first recommendations, and guide import entrypoints/symbols
- `pnpm run docs:check:demos` verifies build/dev demo maps match docs runtime registry
- Add `@default` tags to prop type fields when runtime defaults exist and are user-facing
- During docs render, generated API content replaces any existing `## API` section in component markdown

## Breaking changes in 0.x

- Any breaking public API change requires migration notes in `MIGRATIONS.md`
- Migration notes must land in the same pull request as the change

## Changesets and releases

- Add a changeset for any PR that changes public package behavior
- Create one with `pnpm changeset`
- Merges to `main` run one release workflow:
  - canary: publishes snapshot builds under the `canary` dist-tag
  - stable: opens or updates a version PR and publishes after merge
- Publishing uses npm trusted publishers (OIDC); no `NPM_TOKEN` is required
