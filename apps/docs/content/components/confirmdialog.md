# ConfirmDialog

Maturity: experimental

## When to use

- Is a preset built on `Dialog` for confirmation and destructive actions.
- Controlled-only (`open` + `onClose`) with dedicated `confirm` and `cancel` close reasons.

## Import

```ts
import { ConfirmDialog } from "@lukasmurdock/remix-ui-components"
```

## API

Type definitions are generated from component source.

## Example

See demos for controlled and uncontrolled usage patterns.

## HTML parity

`ConfirmDialog` is a preset built on `Dialog` for confirmation and destructive actions.

## Runtime notes

Controlled-only (`open` + `onClose`) with dedicated `confirm` and `cancel` close reasons.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Modal semantics | inherits `Dialog` semantics and focus trapping |
| Action clarity | explicit cancel and confirm actions |
| Dismiss behavior | backdrop dismissal defaults to disabled |

## Keymap spec

- `Escape`: close when enabled
- `Tab` / `Shift+Tab`: move focus through actions
- `Enter`: activate focused action

