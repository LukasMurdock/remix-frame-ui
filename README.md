# Remix Frame UI

`remix/component`-native UI primitives with layered CSS and strict HTML semantics.

## Project status

Remix Frame UI is pre-1.0 and moving quickly.

- Stable components today: `Form`, `Flex`, `Grid`, `Layout`, `Link`, `Space`, `Typography`
- All other components are currently marked `experimental`
- Breaking changes can happen between minor releases while the project is in `0.x`
- Migration notes are tracked in `MIGRATIONS.md`

## Install

```bash
pnpm add @lukasmurdock/remix-ui-components @lukasmurdock/remix-ui-styles
```

For low-level helpers, install `@lukasmurdock/remix-ui-core`.

## Quick start

```tsx
import "@lukasmurdock/remix-ui-styles/src/index.css"
import { Button } from "@lukasmurdock/remix-ui-components"

export function Example() {
  return <Button variant="solid">Save</Button>
}
```

## Stable-first starter example

```tsx
import "@lukasmurdock/remix-ui-styles/src/index.css"
import { Heading, Layout, LayoutContent, LayoutHeader, Link, Space, Text } from "@lukasmurdock/remix-ui-components"

export function HomePage() {
  return (
    <Layout>
      <LayoutHeader>
        <Heading level={1}>Remix Frame UI</Heading>
      </LayoutHeader>
      <LayoutContent>
        <Space>
          <Text>Start with stable primitives, then adopt experimental components as needed.</Text>
          <Link href="/docs">Open docs</Link>
        </Space>
      </LayoutContent>
    </Layout>
  )
}
```

## Package map

- `@lukasmurdock/remix-ui-components`: component API built on `remix/component`
- `@lukasmurdock/remix-ui-styles`: layered CSS (`tokens -> primitives -> patterns -> components`)
- `@lukasmurdock/remix-ui-core`: low-level a11y and field helpers
- `@lukasmurdock/docs`: local docs app used in this monorepo

## Docs for new users

Run the docs app locally:

```bash
pnpm install
pnpm run docs:dev
```

The docs include:

- `Start Here` guides with a 5-minute setup path
- component reference pages with HTML parity and accessibility notes
- live demos for component behavior
- a `Stable only` navigation toggle for filtering component pages

Build docs output:

```bash
pnpm run docs:build
```

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
pnpm run docs:check
pnpm run docs:build
```

See `CONTRIBUTING.md` for contributor workflow and quality gates.

## Docs deployment (Cloudflare Workers)

The docs app includes `apps/docs/wrangler.jsonc` for static asset deployment.

```bash
# one-time auth for your machine
pnpm dlx wrangler login

# deploy docs static assets to Workers
pnpm run docs:deploy
```

## Releases

This repo uses Changesets.

- Add a changeset in pull requests that change public behavior
- Merging to `main` runs one workflow with two tracks:
  - canary: publishes snapshot packages under the `canary` dist-tag
  - stable: creates or updates a release PR and publishes after merge
- Publishing uses npm trusted publishers (OIDC) in GitHub Actions

## Package Rename

The package scope was renamed. Update imports and installs as follows:

- `@lukasmurdock/core` -> `@lukasmurdock/remix-ui-core`
- `@lukasmurdock/styles` -> `@lukasmurdock/remix-ui-styles`
- `@lukasmurdock/remix` -> `@lukasmurdock/remix-ui-components`
