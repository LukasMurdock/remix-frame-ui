# Tree

Maturity: experimental

## When to use

- Display and navigate hierarchical data with nested branches
- Support independent selection and expansion state control

## Import

```ts
import { Tree } from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

## HTML parity

`Tree` renders nested hierarchical nodes with optional expand/collapse behavior.

## Runtime notes

Supports controlled or uncontrolled selection and expansion state, with callbacks for both.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Tree semantics | root uses `role="tree"`; nodes use `role="treeitem"` |
| Group semantics | nested children are wrapped in `role="group"` |
| Selection state | selected node is reflected with `aria-selected` |

## Keymap spec

- `Tab`: moves focus into tree controls
- `Enter`/`Space`: activates node toggle and selection controls
