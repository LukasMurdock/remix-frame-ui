# FormFieldset

Maturity: experimental

## When to use

- Wraps related controls in native `<fieldset>` and `<legend>` semantics.
- Supports one- or two-column grouping for logically related inputs.

## Import

```ts
import { FormFieldset } from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

## HTML parity

`FormFieldset` wraps related controls in native `<fieldset>` and `<legend>` semantics.

## Runtime notes

Supports one- or two-column grouping for logically related inputs and collapses to one column on narrow viewports.

## Accessibility matrix

| Requirement        | Behavior                                                       |
| ------------------ | -------------------------------------------------------------- |
| Group semantics    | native `fieldset` and `legend` establish control relationships |
| Description wiring | optional description connects via `aria-describedby`           |
| Layout grouping    | grouped controls remain keyboard-linear                        |

## Keymap spec

- `Tab`: move through controls in grouped order
