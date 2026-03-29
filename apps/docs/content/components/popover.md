# Popover

Maturity: experimental

## When to use

- Show contextual controls or content anchored to a trigger
- Keep interactions lightweight without opening a full modal dialog

## Import

```ts
import { Popover } from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

## HTML parity

`Popover` composes a trigger button with an anchored panel using semantic dialog-like content.

## Runtime notes

Supports controlled and uncontrolled open state with Escape dismissal, outside click handling, and focus-leave close behavior.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Trigger relationship | `aria-expanded` and `aria-controls` wiring |
| Panel role | rendered as labeled dialog surface |
| Dismiss behavior | Escape and Tab close panel |

## Keymap spec

- `Enter`/`Space`: toggle from trigger
- `Escape`: close panel
- `Tab`: closes panel and returns flow control
