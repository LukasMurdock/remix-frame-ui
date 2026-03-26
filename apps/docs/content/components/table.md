# Table

Maturity: experimental

## HTML parity

`Table` uses native table semantics with `caption`, `thead`, and `tbody`.

## Runtime notes

`Table` is static by default and supports empty-state rows without hydration.

## Accessibility matrix

| Requirement | Behavior |
| --- | --- |
| Header semantics | column headers use `scope="col"` |
| Caption support | optional table caption |
| Empty rows | full-width empty row fallback |

## Keymap spec

- Keyboard behavior follows native table and child control semantics.
