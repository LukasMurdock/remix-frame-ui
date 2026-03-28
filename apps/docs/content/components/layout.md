# Layout

Maturity: stable

## When to use

- Provides semantic shell regions with `LayoutHeader`, `LayoutSider`, `LayoutContent`, and `LayoutFooter`.
- Use `direction` and `hasSider` to define high-level page scaffolding.

## Import

```ts
import { Layout } from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

## Example

See demos on this page for complete `Layout` usage patterns.

## HTML parity

`Layout` provides semantic shell regions with `LayoutHeader`, `LayoutSider`, `LayoutContent`, and `LayoutFooter`.

## Runtime notes

Use `direction` and `hasSider` to define high-level page scaffolding. `LayoutSider` supports width customization and collapsed state.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Landmark semantics | uses native `header`, `aside`, `main`, and `footer` elements |
| Sidebar state | collapsed sider maps to `hidden` behavior |
| Keyboard | no component-level key handling |

## Keymap spec

- No component-level key bindings.

