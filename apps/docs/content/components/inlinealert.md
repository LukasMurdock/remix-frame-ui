# InlineAlert

Maturity: experimental

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
