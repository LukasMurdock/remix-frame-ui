# Drawer

Maturity: experimental

## HTML parity

`Drawer` is a modal side panel for app-shell tasks and secondary workflows.

## Runtime notes

Controlled-only API (`open` + `onClose`) with focus trap and escape/backdrop dismissal.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Modal semantics | uses `role="dialog"` with `aria-modal="true"` |
| Focus safety | traps tab focus while open and restores previous focus on close |
| Dismiss controls | supports escape key, backdrop click, and close button reasons |

## Keymap spec

- `Escape`: close when enabled
- `Tab` / `Shift+Tab`: cycle focus within drawer
