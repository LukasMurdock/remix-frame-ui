# Cascader

Maturity: experimental

## When to use

- Picks hierarchical values through stepwise option columns.
- Supports controlled or uncontrolled selected path, popup open state, and optional change-on-intermediate-select.

## Import

```ts
import { Cascader } from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

## Example

See demos for controlled and uncontrolled usage patterns.

## HTML parity

`Cascader` picks hierarchical values through stepwise option columns.

## Runtime notes

Supports controlled or uncontrolled selected path, popup open state, and optional change-on-intermediate-select.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Trigger semantics | button exposes popup state with `aria-expanded` |
| Hierarchy navigation | options are grouped into progressive columns |
| Selected feedback | selected path label appears in trigger |

## Keymap spec

- `Tab`: navigates trigger and option buttons
- `Enter`/`Space`/`ArrowDown` on trigger: opens panel
- `ArrowUp`/`ArrowDown` in panel: moves within the current column
- `ArrowRight`: opens next child column when focused option has children
- `ArrowLeft`: returns focus to the parent column
- `Enter`/`Space` in panel: commits focused option (leaf closes panel)
- `Escape`: closes panel and returns focus to trigger

