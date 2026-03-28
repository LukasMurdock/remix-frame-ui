# InlineAlert

Maturity: experimental

## When to use

- Is a compact in-flow status surface for forms and sections.
- Supports optional trailing action for recovery without modal interruption.

## Import

```ts
import { InlineAlert } from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

## Example

See demos on this page for complete `InlineAlert` usage patterns.

## HTML parity

`InlineAlert` is a compact in-flow status surface for forms and sections.

## Runtime notes

Supports optional trailing action for recovery without modal interruption.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Role mapping | `status` for info/success, `alert` for warning/danger |
| In-flow layout | remains inline with surrounding content and controls |
| Optional action | action slot supports quick remediation controls |

## Keymap spec

- `Tab`: navigate to inline action when present
- `Enter`/`Space`: activate focused action

