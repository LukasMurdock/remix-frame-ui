# Toast

Maturity: experimental

## HTML parity

`ToastViewport` renders semantic list markup with live-region announcements.

## Runtime notes

Supports declarative rendering and imperative store updates with auto-dismiss, plus pause/resume hooks for hover and focus.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Announcements | `aria-live="polite"` default, `assertive` for danger tone |
| Grouping | semantic list of toasts |
| Dismissal | imperative or declarative queue removal |

## Keymap spec

- `Escape`: dismiss focused toast when action provided
- `Tab`: navigate toast actions
