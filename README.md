# Remix Frame UI

`remix/component`-native UI primitives with layered CSS and strict HTML semantics.

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
