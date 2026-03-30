# @lukasmurdock/remix-ui-styles

Layered CSS tokens, primitives, patterns, and component styles.

## Install

```bash
pnpm add @lukasmurdock/remix-ui-styles
```

## Usage

```ts
import "@lukasmurdock/remix-ui-styles/src/index.css"
```

## Layers

- `tokens`
- `primitives`
- `patterns`
- `components`

## Stable DataTable contract

DataTable styling hooks are semver-stable in this package:

- `data-part` hooks: `wrapper`, `header`, `row`, `sort-indicator`, `footer`, and related table parts
- `--rf-data-table-*` CSS variables, including:
  - `--rf-data-table-header-bg`
  - `--rf-data-table-cell-padding-y`
  - `--rf-data-table-cell-padding-x`
  - `--rf-data-table-row-selected-bg`
  - `--rf-data-table-footer-border`

```css
.rf-data-table-wrap {
  --rf-data-table-header-bg: color-mix(in srgb, var(--rf-brand-default) 8%, var(--rf-surface-default));
  --rf-data-table-cell-padding-y: 0.625rem;
}

.rf-data-table-wrap [data-part="sort-indicator"] {
  opacity: 1;
}
```
