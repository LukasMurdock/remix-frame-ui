# Tabs

Maturity: experimental

## HTML parity

`Tabs` uses WAI-ARIA tab roles with button triggers and tabpanel containers.

## Runtime notes

Default activation is manual; automatic activation can be enabled. In uncontrolled mode, tab clicks update local component state via `handle.update()`.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Roles | tablist/tab/tabpanel |
| Selection | `aria-selected` + `aria-controls` |
| Focus management | active tab is tabbable |

## Keymap spec

- Arrow keys: move focus across tabs
- `Enter`/`Space`: activate focused tab in manual mode
