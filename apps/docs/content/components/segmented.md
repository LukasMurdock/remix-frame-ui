# Segmented

Maturity: experimental

## When to use

- Renders mutually exclusive options in a compact segmented control.
- Supports controlled and uncontrolled selection, compact density, full-width layout, and disabled options.

## Import

```ts
import { Segmented } from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

## Example

See demos for controlled and uncontrolled usage patterns.

## HTML parity

`Segmented` renders mutually exclusive options in a compact segmented control.

## Runtime notes

Supports controlled and uncontrolled selection, compact density, full-width layout, and disabled options.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Group semantics | root uses `role="radiogroup"` |
| Option semantics | each segment uses `role="radio"` and `aria-checked` |
| Disabled options | disabled segments are non-interactive |

## Keymap spec

- `Tab`: moves focus to each segment button
- `Enter`/`Space`: selects focused segment

