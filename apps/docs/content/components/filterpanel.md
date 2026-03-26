# FilterPanel

Maturity: experimental

## HTML parity

`FilterPanel` wraps drawer behavior with a structured filter form and apply/clear actions.

## Runtime notes

Built on `Drawer`; supports controlled open state, apply/clear callbacks, and configurable close behavior.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Dialog semantics | inherits modal dialog and focus management from `Drawer` |
| Grouped controls | filter fields are grouped with optional description and labels |
| Action behavior | clear/apply actions can run callbacks and optionally close the panel |

## Keymap spec

- `Tab`/`Shift+Tab`: moves through filter controls and action buttons
- `Escape`: closes the panel when escape dismissal is enabled
