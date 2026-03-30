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

## DataTable stable contract

`@lukasmurdock/remix-ui-styles` treats DataTable part names and `--rf-data-table-*` variables as semver-stable.

Stable DataTable `data-part` values:

- `wrapper`
- `table`
- `header`
- `header-row`
- `header-cell`
- `sort-button`
- `sort-indicator`
- `body`
- `row`
- `cell`
- `selection-cell`
- `empty-cell`
- `footer`
- `pagination-status`
- `pagination-actions`
- `loading`
- `error`

Common stable DataTable CSS variables:

- `--rf-data-table-header-bg`
- `--rf-data-table-cell-padding-y`
- `--rf-data-table-cell-padding-x`
- `--rf-data-table-row-selected-bg`
- `--rf-data-table-footer-border`
- `--rf-data-table-sort-indicator-size`

Example override:

```css
.rf-data-table-wrap {
  --rf-data-table-header-bg: color-mix(in srgb, var(--rf-brand-default) 8%, var(--rf-surface-default));
  --rf-data-table-cell-padding-y: 0.625rem;
  --rf-data-table-row-selected-bg: color-mix(in srgb, var(--rf-brand-default) 14%, var(--rf-surface-default));
}

.rf-data-table-wrap [data-part="sort-indicator"] {
  opacity: 1;
}
```
