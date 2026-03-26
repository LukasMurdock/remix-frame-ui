# Avatar

Maturity: experimental

## HTML parity

`Avatar` renders an image or text fallback token for user identity surfaces.

## Runtime notes

When `src` is provided, avatar renders an `<img>`. Otherwise it falls back to generated initials from `name`.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Image alternative | supports explicit `alt` text and defaults to `name` |
| Fallback readability | initials generated from provided name |
| Status hinting | optional status data attribute for visual presence states |

## Keymap spec

- No component-level key bindings.
