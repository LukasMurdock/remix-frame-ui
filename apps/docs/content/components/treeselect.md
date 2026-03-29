# TreeSelect

Maturity: experimental

## When to use

- Let users choose one value from a hierarchical option tree
- Expose expandable grouped options behind a compact trigger

## Import

```ts
import { TreeSelect } from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

## HTML parity

`TreeSelect` combines a trigger field with a hierarchical tree options panel.

## Runtime notes

Supports controlled or uncontrolled selected value, open state, and expanded branches.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Trigger semantics | toggle button exposes expanded state |
| Tree semantics | popup content uses tree and treeitem roles |
| Selection feedback | selected node updates trigger label |

## Keymap spec

- `Tab`: moves through trigger and tree actions
- `Enter`/`Space`: toggles trigger and selects options
