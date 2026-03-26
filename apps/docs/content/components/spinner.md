# Spinner

Maturity: experimental

## HTML parity

`Spinner` provides a compact loading indicator with status semantics.

## Runtime notes

Supports size variants and optional custom loading label.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Live status | uses `role="status"` and polite announcements |
| Visual indicator | animated dot remains hidden from assistive tech |
| Size control | `sm`, `md`, and `lg` variants supported |

## Keymap spec

- No key handling; status indicator only
