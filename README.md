# Remix Frame UI

`remix/component`-native UI primitives with layered CSS and strict HTML semantics.

## Install

```bash
pnpm add @remix-frame-ui/remix @remix-frame-ui/styles
```

## Quick start

```tsx
import "@remix-frame-ui/styles/src/index.css"
import { Button } from "@remix-frame-ui/remix"

export function Example() {
  return <Button variant="primary">Save</Button>
}
```

For low-level helpers, install `@remix-frame-ui/core`.

## Packages

- `@remix-frame-ui/core`
- `@remix-frame-ui/styles`
- `@remix-frame-ui/remix`
- `@remix-frame-ui/docs`

## Browser baseline

- Chrome: latest 2 stable
- Firefox: latest 2 stable
- Safari: latest 2 stable
- Edge: latest 2 stable

## Development

```bash
pnpm install
pnpm run format:check
pnpm run tokens:build
pnpm run check:css-order
pnpm run typecheck
pnpm run test
pnpm run test:e2e
pnpm run build
pnpm run docs:build
```

## Docs Deployment (Cloudflare Workers)

The docs app includes `apps/docs/wrangler.jsonc` for static asset deployment.

```bash
# One-time auth for your machine
pnpm dlx wrangler login

# Deploy docs static assets to Workers
pnpm run docs:deploy
```

## Releases

This repo uses Changesets.

- Add a changeset in pull requests that change public behavior.
- Merging to `main` runs release workflows:
  - stable: creates/updates a release PR and publishes after merge
  - canary: publishes snapshot packages under the `canary` dist-tag
- Publishing uses npm trusted publishers (OIDC) with GitHub Actions.
