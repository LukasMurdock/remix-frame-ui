# Card

Maturity: experimental

## HTML parity

`Card` provides semantic section structure with optional header and footer regions.

## Runtime notes

`Card` is presentational and requires no hydration by default.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Landmark semantics | uses `<section>` wrapper |
| Heading support | optional title rendered as heading |
| Content grouping | header/body/footer separation |

## Keymap spec

- No component-specific keyboard behavior; delegates to child controls.
