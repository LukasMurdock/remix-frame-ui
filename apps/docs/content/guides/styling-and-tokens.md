# Styling and Tokens

`@lukasmurdock/remix-ui-styles` ships layered CSS.

## Layer order

The canonical order is:

1. `tokens`
2. `primitives`
3. `patterns`
4. `components`

Use the package entrypoint to keep import order correct:

```ts
import "@lukasmurdock/remix-ui-styles/src/index.css"
```

## Token generation

In the monorepo, token CSS is generated from JSON:

```bash
pnpm run tokens:build
```

Validate CSS import order:

```bash
pnpm run check:css-order
```
