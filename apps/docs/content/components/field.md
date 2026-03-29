# Field

Maturity: experimental

## When to use

- Compose labels, descriptions, and error messaging around form controls
- Keep ARIA wiring consistent across custom field layouts

## Import

```ts
import { Description, Error, Field, Label } from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

## HTML parity

`Field` composes native inputs with `Label`, `Description`, and `Error` elements.

## Runtime notes

Field ARIA wiring is computed in setup and passed into children render function.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Label | wired via `htmlFor` to input id |
| Description | appended to `aria-describedby` |
| Error | appended to `aria-describedby` and sets `aria-invalid` |

## Keymap spec

- Delegates keyboard behavior to wrapped control.
