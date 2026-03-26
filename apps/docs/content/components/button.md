# Button

Maturity: experimental

## HTML parity

`Button` renders a native `<button>` and preserves `type`, `name`, `value`, and `disabled` semantics.

## Runtime notes

Non-interactive on its own. Hydration is only needed when custom event handlers are attached with `remix/component`.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Role | native button role |
| Keyboard Enter | activates |
| Keyboard Space | activates |
| Disabled | native disabled behavior |

## Keymap spec

- `Enter`: click activation
- `Space`: click activation
