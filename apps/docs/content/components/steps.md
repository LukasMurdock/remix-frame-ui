# Steps

Maturity: experimental

## When to use

- Communicates multi-step progress with current, complete, and upcoming states.
- Progress is controlled with `currentId`; unknown values fall back to the first step.

## Import

```ts
import { Steps } from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

## Example

See demos for controlled and uncontrolled usage patterns.

## HTML parity

`Steps` communicates multi-step progress with current, complete, and upcoming states.

## Runtime notes

Progress is controlled with `currentId`; unknown values fall back to the first step.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Landmark semantics | uses labeled `nav` with ordered list |
| Current step | marks active item with `aria-current="step"` |
| Status clarity | exposes complete/current/upcoming through data attributes |

## Keymap spec

- No custom key handling; informational component only

