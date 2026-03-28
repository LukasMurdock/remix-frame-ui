# FilterPanel

Maturity: experimental

## When to use

- Build reusable filter workflows with clear/apply actions in a side panel
- Standardize filter layout and dismissal behavior across data surfaces

## Import

```ts
import { FilterPanel } from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

## Example

```ts
import { FilterPanel } from "@lukasmurdock/remix-ui-components"

let open = true

<FilterPanel
  open={open}
  title="Filters"
  description="Refine results"
  onApply={() => {
    console.log("apply")
  }}
  onClear={() => {
    console.log("clear")
  }}
  onClose={() => {
    open = false
    handle.update()
  }}
>
  Filter controls
</FilterPanel>
```

## HTML parity

`FilterPanel` wraps drawer behavior with a structured filter form and apply/clear actions.

## Runtime notes

Built on `Drawer`; supports controlled open state, apply/clear callbacks, and configurable close behavior.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Dialog semantics | inherits modal dialog and focus management from `Drawer` |
| Grouped controls | filter fields are grouped with optional description and labels |
| Action behavior | clear/apply actions can run callbacks and optionally close the panel |

## Keymap spec

- `Tab`/`Shift+Tab`: moves through filter controls and action buttons
- `Escape`: closes the panel when escape dismissal is enabled
